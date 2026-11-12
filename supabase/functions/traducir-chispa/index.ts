// Hasta La Vista — traducir-chispa
//
// Quand Ritukah accueille une chispa (estado = 'aceptada'), un « Database Webhook » de Supabase
// appelle cette fonction. Elle demande à Gemini de traduire l'idée, le pourquoi et le besoin
// dans les 9 langues du site, puis les range dans la colonne « traducciones ».
//
// Réglages (Supabase → Edge Functions → Secrets) :
//   GEMINI_API_KEY   clé gratuite de Google AI Studio (aistudio.google.com) — jamais dans GitHub
//   WEBHOOK_SECRET   un mot de passe inventé, recopié dans l'en-tête « x-webhook-secret » du webhook
//   GEMINI_MODEL     (facultatif) modèle Gemini, par défaut gemini-2.5-flash
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.

import { createClient } from "jsr:@supabase/supabase-js@2";

const LANGS: Record<string, string> = {
  es: "Spanish (Spain)", en: "English", fr: "French", pt: "Portuguese (Brazil)", ru: "Russian",
  ar: "Arabic", hi: "Hindi", bn: "Bengali", zh: "Simplified Chinese",
};
const MAX = { idea: 200, porque: 200, necesita: 120 };
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "";

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }
  const payload = await req.json().catch(() => null);
  const rec = payload?.record;
  // Seulement une chispa accueillie, pas encore traduite (ça évite aussi de tourner en boucle).
  if (!rec || rec.estado !== "aceptada" || rec.traducciones) {
    return new Response("nothing to do", { status: 200 });
  }

  const source = { idea: rec.idea ?? "", porque: rec.porque ?? "", necesita: rec.necesita ?? "" };
  const prompt =
    `You translate short, warm messages for Hasta La Vista, a kind community where everyone is a creator.\n` +
    `Translate the JSON object below into each of these languages: ${Object.entries(LANGS).map(([k, v]) => `${k} = ${v}`).join(", ")}.\n` +
    `Keep the meaning, the tone and the brevity. Keep names unchanged. Do not add anything. Empty strings stay empty.\n` +
    `Answer ONLY with a JSON object whose keys are the language codes, each value having the keys "idea", "porque", "necesita".\n\n` +
    JSON.stringify(source);

  const model = Deno.env.get("GEMINI_MODEL") || "gemini-2.5-flash";
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": Deno.env.get("GEMINI_API_KEY") ?? "" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });
  if (!r.ok) return new Response(`gemini error ${r.status}: ${await r.text()}`, { status: 502 });

  let out: Record<string, Record<string, unknown>> = {};
  try {
    const data = await r.json();
    out = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}");
  } catch (_) {
    return new Response("could not read the translation", { status: 502 });
  }

  // On ne garde que ce qui est propre : les 9 langues, trois textes courts, sans HTML.
  const traducciones: Record<string, Record<string, string>> = {};
  for (const code of Object.keys(LANGS)) {
    const t = out?.[code];
    if (!t || !clean(t.idea, MAX.idea)) continue;
    traducciones[code] = {
      idea: clean(t.idea, MAX.idea),
      porque: source.porque ? clean(t.porque, MAX.porque) : "",
      necesita: source.necesita ? clean(t.necesita, MAX.necesita) : "",
    };
  }
  if (!Object.keys(traducciones).length) return new Response("empty translation", { status: 502 });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { error } = await db.from("chispas").update({ traducciones }).eq("id", rec.id);
  if (error) return new Response(`db error: ${error.message}`, { status: 500 });
  return new Response(`translated into ${Object.keys(traducciones).length} languages`, { status: 200 });
});
