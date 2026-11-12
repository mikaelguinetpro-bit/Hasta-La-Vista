// Hasta La Vista — mix-ia : l'IA de The Mix (Claude, d'Anthropic)
//
// Un « Database Webhook » de Supabase appelle cette fonction à chaque nouvelle ligne de la table mix_eventos.
// Ces lignes sont écrites par la base elle-même (supabase/mix.sql) quand :
//   • une chispa est accueillie par la Tríada        → on traduit ses besoins et on cherche qui peut aider ;
//   • un besoin est ajouté à une chispa accueillie    → pareil pour ce besoin ;
//   • un besoin se rouvre (« Je ne pourrai pas venir ») → l'IA cherche aussitôt quelqu'un d'autre ;
//   • quelqu'un dit ce qu'il peut apporter           → on cherche les projets qui en ont besoin.
// L'IA PROPOSE seulement (table sugerencias, publique, avec son « pourquoi » dans les 9 langues).
// Elle ne décide jamais : c'est la personne qui choisit d'aider, et le créateur qui accepte.
//
// Réglages (Supabase → Edge Functions → Secrets) :
//   ANTHROPIC_API_KEY  clé de console.anthropic.com — jamais dans GitHub
//   WEBHOOK_SECRET     le même mot de passe que pour traducir-chispa (en-tête « x-webhook-secret »)
//   ANTHROPIC_MODEL    (facultatif) par défaut claude-haiku-5-5 : le plus petit modèle, pour les petites tâches
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournis automatiquement par Supabase.

import { createClient } from "jsr:@supabase/supabase-js@2";

const LANGS: Record<string, string> = {
  es: "Spanish (Spain)", en: "English", fr: "French", pt: "Portuguese (Brazil)", ru: "Russian",
  ar: "Arabic", hi: "Hindi", bn: "Bengali", zh: "Simplified Chinese",
};
const LANG_LIST = Object.entries(LANGS).map(([k, v]) => `${k} = ${v}`).join(", ");
const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, max) : "";

type Need = { id: number; texto: string; tipo: string; chispa_id: number; traducciones: unknown; idea?: string; lugar?: string | null; owner?: string };
type Offer = { id: number; nombre: string; texto: string; tipo: string; lugar: string | null; user_id: string };

async function claude(prompt: string, maxTokens = 3000): Promise<any> {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": Deno.env.get("ANTHROPIC_API_KEY") ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("ANTHROPIC_MODEL") || "claude-haiku-5-5",
      max_tokens: maxTokens,
      temperature: 0.2,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!r.ok) throw new Error(`anthropic ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const text: string = (data.content ?? []).map((c: any) => c.text ?? "").join("");
  const start = text.indexOf("{"), end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("no JSON in answer");
  return JSON.parse(text.slice(start, end + 1));
}

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }
  const payload = await req.json().catch(() => null);
  const ev = payload?.record;
  if (!ev || !ev.tipo || !ev.ref) return new Response("nothing to do", { status: 200 });

  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const done = (msg: string, status = 200) => {
    // Le fil d'événements ne garde rien : une fois traité, l'événement est effacé.
    return db.from("mix_eventos").delete().eq("id", ev.id).then(() => new Response(msg, { status }));
  };

  try {
    // ───── 1. Rassembler les besoins et les offres concernés
    let needs: Need[] = [];
    let offers: Offer[] = [];
    const needCols = "id,texto,tipo,chispa_id,traducciones,estado,chispas!inner(idea,lugar,estado,user_id)";
    const flat = (rows: any[]): Need[] => rows
      .filter((n) => n.estado === "abierta" && n.chispas?.estado === "aceptada")
      .map((n) => ({ id: n.id, texto: n.texto, tipo: n.tipo, chispa_id: n.chispa_id, traducciones: n.traducciones,
        idea: n.chispas.idea, lugar: n.chispas.lugar, owner: n.chispas.user_id }));

    if (ev.tipo === "chispa" || ev.tipo === "necesidad") {
      const q = db.from("necesidades").select(needCols);
      const { data } = ev.tipo === "chispa" ? await q.eq("chispa_id", ev.ref) : await q.eq("id", ev.ref);
      needs = flat(data ?? []);
      if (!needs.length) return done("no open need");
      let oq = db.from("ofertas").select("id,nombre,texto,tipo,lugar,user_id");
      if (needs[0].owner) oq = oq.neq("user_id", needs[0].owner);
      const { data: o } = await oq.order("creado", { ascending: false }).limit(60);
      offers = o ?? [];
    } else if (ev.tipo === "oferta") {
      const { data: o } = await db.from("ofertas").select("id,nombre,texto,tipo,lugar,user_id").eq("id", ev.ref);
      offers = o ?? [];
      if (!offers.length) return done("no offer");
      const { data } = await db.from("necesidades").select(needCols)
        .eq("estado", "abierta").eq("chispas.estado", "aceptada").order("creado", { ascending: false }).limit(80);
      needs = flat(data ?? []).filter((n) => n.owner !== offers[0].user_id);
    }

    // ───── 2. Traduire les besoins qui ne le sont pas encore (pour que chaque visiteur les lise dans sa langue)
    const toTranslate = needs.filter((n) => !n.traducciones);
    if (toTranslate.length) {
      const src = Object.fromEntries(toTranslate.map((n) => [String(n.id), n.texto]));
      const out = await claude(
        `You translate very short need cards for Hasta La Vista, a kind community where everyone is a creator.\n` +
        `Translate each value of the JSON object below into each of these languages: ${LANG_LIST}.\n` +
        `Keep the meaning, the tone and the brevity (80 characters at most). Keep names unchanged. Add nothing.\n` +
        `Answer ONLY with a JSON object: the same keys, each value being an object whose keys are the language codes.\n\n` +
        JSON.stringify(src),
      );
      for (const n of toTranslate) {
        const t = out?.[String(n.id)];
        if (!t) continue;
        const tr: Record<string, string> = {};
        for (const code of Object.keys(LANGS)) { const v = clean(t[code], 120); if (v) tr[code] = v; }
        if (Object.keys(tr).length) { n.traducciones = tr; await db.from("necesidades").update({ traducciones: tr }).eq("id", n.id); }
      }
    }
    if (!needs.length || !offers.length) return done("nothing to match yet");

    // ───── 3. La fiabilité : seules les absences répétées, sans explication, comptent (jamais affiché en public)
    const absences: Record<string, number> = {};
    const users = [...new Set(offers.map((o) => o.user_id))];
    const { data: abs } = await db.from("aportes").select("user_id").in("user_id", users).eq("estado", "ausente").eq("explicado", false);
    for (const a of abs ?? []) absences[a.user_id] = (absences[a.user_id] ?? 0) + 1;

    // ───── 4. Demander à Claude de rapprocher
    const needList = needs.map((n) => ({ id: n.id, need: n.texto, kind: n.tipo, project: n.idea, city: n.lugar || "" }));
    const offerList = offers.map((o) => ({ id: o.id, name: o.nombre, offer: o.texto, kind: o.tipo, city: o.lugar || "",
      unexplained_absences: absences[o.user_id] ?? 0 }));
    const out = await claude(
      `You are the matching assistant of Hasta La Vista, a kind community where everyone is a creator.\n` +
      `Creators describe what their project needs ("needs"). Other creators say what they can bring ("offers").\n` +
      `Find the offers that could really help with a need. Rules:\n` +
      `- Only clear, useful matches. It is fine to return none. At most 8 matches, at most 3 per need.\n` +
      `- Needs of kind "manos" (hands) or "objeto" (object) usually need someone nearby: if both cities are given and clearly far apart, skip it, unless the offer says it works remotely.\n` +
      `- Prefer people without unexplained absences. Only suggest someone with 2 or more if nobody else fits. NEVER mention absences in your reason.\n` +
      `- For each match, write a short, warm, concrete reason (at most 140 characters) explaining why, in each of these languages: ${LANG_LIST}. Use the person's name as given.\n` +
      `Answer ONLY with JSON: {"matches":[{"need":<need id>,"offer":<offer id>,"why":{"es":"...","en":"...", ...}}]}\n\n` +
      `NEEDS:\n${JSON.stringify(needList)}\n\nOFFERS:\n${JSON.stringify(offerList)}`,
      4000,
    );

    // ───── 5. Ranger les propositions (seulement des paires qui existent vraiment)
    const needIds = new Set(needs.map((n) => n.id));
    const offerById = new Map(offers.map((o) => [o.id, o]));
    const rows = [];
    for (const m of (out?.matches ?? []).slice(0, 8)) {
      const o = offerById.get(Number(m?.offer));
      if (!o || !needIds.has(Number(m?.need))) continue;
      const porque: Record<string, string> = {};
      for (const code of Object.keys(LANGS)) { const v = clean(m?.why?.[code], 200); if (v) porque[code] = v; }
      rows.push({ necesidad_id: Number(m.need), oferta_id: o.id, nombre: o.nombre, texto: o.texto, porque });
    }
    if (rows.length) {
      const { error } = await db.from("sugerencias").upsert(rows, { onConflict: "necesidad_id,oferta_id", ignoreDuplicates: true });
      if (error) return done(`db error: ${error.message}`, 500);
    }
    return done(`${rows.length} suggestion(s)`);
  } catch (e) {
    return new Response(`error: ${(e as Error).message}`, { status: 502 });
  }
});
