// Hasta La Vista — comportamiento común a las nueve versiones (es, en, fr, pt, ru, ar, hi, bn, zh).
// Los textos que crea el script están aquí, por idioma. El resto del texto está en cada archivo HTML.
const T = {
  es: {
    menu: 'Menú', close: 'Cerrar', pause: '❚❚ Pausa', play: '▶ Seguir',
    moments: { como: '¡Manos a la obra!', ejemplo: '¡Juntos podemos!', vision: '¡A lo grande!' },
    thanks: '¡Qué maravilla!',
    success: "¡Gracias! Ya estás en la lista. Te escribiremos cuando se enciendan las primeras estrellas.",
    error: "Algo no ha funcionado. Inténtalo otra vez en un momento.",
    sending: "Enviando…"
  },
  en: {
    menu: 'Menu', close: 'Close', pause: '❚❚ Pause', play: '▶ Play',
    moments: { como: 'Let’s get to work!', ejemplo: 'Together we can!', vision: 'Think big!' },
    thanks: 'How wonderful!',
    success: "Thank you! You’re on the list. We’ll write to you when the first stars light up.",
    error: "Something didn’t work. Please try again in a moment.",
    sending: "Sending…"
  },
  fr: {
    menu: 'Menu', close: 'Fermer', pause: '❚❚ Pause', play: '▶ Reprendre',
    moments: { como: 'Au travail\u202f!', ejemplo: 'Ensemble, on peut\u202f!', vision: 'En grand\u202f!' },
    thanks: 'Quelle merveille\u202f!',
    success: "Merci ! Tu es sur la liste. On t’écrira quand les premières étoiles s’allumeront.",
    error: "Quelque chose n’a pas marché. Réessaie dans un instant.",
    sending: "Envoi…"
  },
  bn: {
    menu: 'মেনু', close: 'বন্ধ করো', pause: '❚❚ থামাও', play: '▶ চালু করো',
    moments: { como: 'চলো, কাজে নামি!', ejemplo: 'একসঙ্গে আমরা পারি!', vision: 'বড় করে ভাবো!' },
    thanks: 'কী অপূর্ব!',
    success: "ধন্যবাদ! তুমি তালিকায় আছ। প্রথম তারাগুলো জ্বলে উঠলেই আমরা তোমাকে লিখব।",
    error: "কিছু একটা কাজ করেনি। একটু পরে আবার চেষ্টা করো।",
    sending: "পাঠানো হচ্ছে…"
  },
  zh: {
    menu: '菜单', close: '关闭', pause: '❚❚ 暂停', play: '▶ 继续',
    moments: { como: '动手吧！', ejemplo: '一起就能做到！', vision: '往大处想！' },
    thanks: '太美好了！',
    success: "谢谢！你已在名单上。第一批星星亮起时，我们会写信告诉你。",
    error: "出了点问题。请稍后再试。",
    sending: "发送中…"
  },
  hi: {
    menu: 'मेनू', close: 'बंद करें', pause: '❚❚ रोकें', play: '▶ चलाएँ',
    moments: { como: 'चलो, काम शुरू करें!', ejemplo: 'साथ मिलकर हम कर सकते हैं!', vision: 'बड़ा सोचो!' },
    thanks: 'कितना सुंदर!',
    success: "धन्यवाद! तुम सूची में हो। जब पहले तारे जगमगाएँगे, हम तुम्हें लिखेंगे।",
    error: "कुछ ठीक नहीं हुआ। थोड़ी देर बाद फिर कोशिश करो।",
    sending: "भेजा जा रहा है…"
  },
  pt: {
    menu: 'Menu', close: 'Fechar', pause: '❚❚ Pausar', play: '▶ Continuar',
    moments: { como: 'Mãos à obra!', ejemplo: 'Juntos, conseguimos!', vision: 'Pense grande!' },
    thanks: 'Que maravilha!',
    success: "Obrigado! Você está na lista. Escreveremos para você quando as primeiras estrelas se acenderem.",
    error: "Algo não funcionou. Tente de novo daqui a pouco.",
    sending: "Enviando…"
  },
  ru: {
    menu: 'Меню', close: 'Закрыть', pause: '❚❚ Пауза', play: '▶ Продолжить',
    moments: { como: 'За дело!', ejemplo: 'Вместе мы сможем!', vision: 'Мысли масштабно!' },
    thanks: 'Как прекрасно!',
    success: "Спасибо! Ты в списке. Мы напишем тебе, когда загорятся первые звёзды.",
    error: "Что-то не сработало. Попробуй ещё раз чуть позже.",
    sending: "Отправка…"
  },
  ar: {
    menu: 'القائمة', close: 'إغلاق', pause: '❚❚ إيقاف مؤقت', play: '▶ متابعة',
    moments: { como: 'إلى العمل!', ejemplo: 'معًا نستطيع!', vision: 'فكّر بشكل كبير!' },
    thanks: 'يا للروعة!',
    success: "شكرًا! أنت الآن في القائمة. سنكتب إليك حين تضيء النجوم الأولى.",
    error: "حدث خطأ ما. حاول مرة أخرى بعد قليل.",
    sending: "جارٍ الإرسال…"
  }
};
const t = T[document.documentElement.lang.slice(0, 2)] || T.es;
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Menú en móvil
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('#nav-links');
const setMenu = open => { links.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); toggle.textContent = open ? t.close : t.menu; };
toggle.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

// Cinta: botón de pausa
const ticker = document.querySelector('.ticker');
const pauseBtn = document.querySelector('.ticker-pause');
pauseBtn.removeAttribute('aria-hidden'); pauseBtn.removeAttribute('tabindex');
pauseBtn.addEventListener('click', () => {
  const paused = ticker.classList.toggle('paused');
  pauseBtn.setAttribute('aria-pressed', paused);
  pauseBtn.textContent = paused ? t.play : t.pause;
});

// Frases de celebración: aparecen una sola vez, como recompensa
const pop = document.querySelector('.phrase-pop');
const colors = ['var(--navy)', 'var(--red)'];
const celebrate = (text, x, y) => {
  if (calm) return;
  pop.textContent = text;
  pop.style.left = (x ?? 50) + 'vw';
  pop.style.top = (y ?? 40) + 'vh';
  pop.style.color = colors[Math.floor(Math.random() * colors.length)];
  pop.style.setProperty('--tilt', (Math.random() * 10 - 5) + 'deg');
  pop.classList.remove('show'); void pop.offsetWidth; pop.classList.add('show');
};
if (!calm && 'IntersectionObserver' in window) {
  const seen = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { seen.unobserve(en.target); celebrate(t.moments[en.target.id], 20 + Math.random() * 60, 18 + Math.random() * 10); }
  }), { threshold: .45 });
  Object.keys(t.moments).forEach(id => seen.observe(document.getElementById(id)));
}

// Ventana de participación
const modal = document.querySelector('#join-modal');
const dialog = modal.querySelector('.dialog');
const closeBtn = modal.querySelector('.close');
let lastTrigger = null;
const focusables = () => [...dialog.querySelectorAll('button, select, input, a[href]')];
const openModal = trigger => { lastTrigger = trigger; modal.classList.add('open'); document.body.classList.add('modal-open'); document.querySelector('#contribution').focus(); };
const closeModal = () => { modal.classList.remove('open'); document.body.classList.remove('modal-open'); if (lastTrigger) lastTrigger.focus(); };
document.querySelectorAll('[data-open]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); setMenu(false); openModal(el); }));
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) { if (e.key === 'Escape') setMenu(false); return; }
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Tab') {
    const f = focusables(), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
// Lista de espera: se guarda en Supabase (Unión Europea, Irlanda).
// La clave publicable puede estar aquí: la tabla solo deja AÑADIR una inscripción, nunca leer, cambiar ni borrar.
const LISTA = { url: 'https://cwcolflstshiptghldtq.supabase.co/rest/v1/lista_espera', key: 'sb_publishable_wLcDsBM3zVE_tq57lMdEkQ_ttW5Hgv9' };
const APORTES = ['idea', 'habilidad', 'arte', 'tecnologia', 'financiacion', 'curiosidad'];
const sendRow = row => fetch(LISTA.url, {
  method: 'POST',
  headers: { apikey: LISTA.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
  body: JSON.stringify(row)
});
document.querySelector('#interest-form').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget, ok = document.querySelector('#success'), btn = form.querySelector('button[type=submit]');
  if (btn.disabled) return;
  const done = msg => { ok.textContent = msg; ok.classList.add('show'); };
  // trampa para robots: una persona nunca ve ni rellena este campo
  if (document.querySelector('#web').value) { done(t.success); return; }
  const row = {
    email: document.querySelector('#email').value.trim().slice(0, 200),
    idioma: document.documentElement.lang.slice(0, 8),
    consentimiento: document.querySelector('#consent').checked,
    aporte: APORTES[document.querySelector('#contribution').selectedIndex] || null
  };
  const label = btn.innerHTML; btn.disabled = true; btn.textContent = t.sending;
  ok.classList.remove('show', 'error');
  try {
    let r = await sendRow(row);
    // si la columna «aporte» todavía no existe, se guarda igualmente lo demás
    if (!r.ok && r.status === 400 && (await r.clone().text()).includes('aporte')) { delete row.aporte; r = await sendRow(row); }
    if (!r.ok) throw new Error(r.status);
    done(t.success); celebrate(t.thanks, 50, 18); form.reset();
  } catch (err) {
    ok.classList.add('error'); done(t.error);
  } finally { btn.disabled = false; btn.innerHTML = label; }
});

// ───────── El único huevo de Pascua de Hasta La Vista ─────────
// Toca tres veces la estrella del lema «No hay genio sin un poco de locura».
// Una mano de carne y una mano de silicio se buscan… y cuando se tocan, nace una chispa.
const EGG = {"es": {"label": "Un poco de locura", "l1": "El genio es una idea loca que encontró sus manos.", "l2": "Da igual que las manos sean de carne o de silicio.", "flesh": "carne", "si": "silicio", "back": "Volver"}, "en": {"label": "A touch of madness", "l1": "Genius is a crazy idea that found its hands.", "l2": "It doesn’t matter whether those hands are flesh or silicon.", "flesh": "flesh", "si": "silicon", "back": "Back"}, "fr": {"label": "Un grain de folie", "l1": "Le génie, c’est une idée folle qui a trouvé ses mains.", "l2": "Peu importe que les mains soient en chair ou en silicium.", "flesh": "chair", "si": "silicium", "back": "Revenir"}, "pt": {"label": "Um pouco de loucura", "l1": "O gênio é uma ideia louca que encontrou suas mãos.", "l2": "Pouco importa se as mãos são de carne ou de silício.", "flesh": "carne", "si": "silício", "back": "Voltar"}, "ru": {"label": "Доля безумия", "l1": "Гений — это безумная идея, которая нашла свои руки.", "l2": "Неважно, из плоти эти руки или из кремния.", "flesh": "плоть", "si": "кремний", "back": "Вернуться"}, "ar": {"label": "شيء من الجنون", "l1": "العبقرية فكرةٌ مجنونة وجدت يديها.", "l2": "لا يهمّ إن كانت الأيدي من لحمٍ أم من سيليكون.", "flesh": "لحم", "si": "سيليكون", "back": "عودة"}, "hi": {"label": "थोड़ा-सा पागलपन", "l1": "प्रतिभा एक पागल-सा विचार है, जिसे अपने हाथ मिल गए।", "l2": "फ़र्क़ नहीं पड़ता कि वे हाथ मांस के हों या सिलिकॉन के।", "flesh": "मांस", "si": "सिलिकॉन", "back": "वापस"}, "zh": {"label": "一点疯狂", "l1": "天才，是一个找到了双手的疯狂想法。", "l2": "双手是血肉还是硅，都无所谓。", "flesh": "血肉", "si": "硅", "back": "返回"}, "bn": {"label": "একটু পাগলামি", "l1": "প্রতিভা হলো এমন এক পাগল ভাবনা, যে নিজের হাত খুঁজে পেয়েছে।", "l2": "সেই হাত রক্তমাংসের হোক বা সিলিকনের, তাতে কিছু যায় আসে না।", "flesh": "রক্তমাংস", "si": "সিলিকন", "back": "ফিরে যাও"}};
const egg = EGG[document.documentElement.lang.slice(0, 2)] || EGG.es;
const eggEl = document.getElementById('egg'), eggStar = document.querySelector('.motto-star');
let eggClicks = 0, eggTimer = null, eggRAF = null, eggOpener = null;
function eggClose(){
  cancelAnimationFrame(eggRAF); eggEl.hidden = true; eggEl.classList.remove('reveal');
  document.body.classList.remove('modal-open'); if (eggOpener) eggOpener.focus();
}
function eggOpen(){
  eggOpener = document.activeElement;
  eggEl.querySelector('.egg-l1').textContent = egg.l1;
  eggEl.querySelector('.egg-l2').textContent = egg.l2;
  eggEl.querySelector('.egg-back').textContent = egg.back;
  eggEl.hidden = false; document.body.classList.add('modal-open');
  const cv = document.getElementById('egg-canvas'), cx = cv.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2), W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr;
  cx.scale(dpr, dpr); const w = innerWidth, h = innerHeight, my = h * .32;
  const skin = '255,176,138', sil = '143,179,255', gold = '235,175,18';
  const burst = [], t0 = performance.now(), MEET = 2600;
  if (calm){ eggEl.classList.add('reveal'); eggEl.querySelector('.egg-back').focus(); return; }
  const stream = (side, k, color, t) => {
    // una mano hecha de chispas: un brazo que avanza y cinco dedos que apuntan hacia la otra mano
    const reach = Math.min(1, t / MEET), ease = 1 - Math.pow(1 - reach, 3), dir = -side;
    const fade = t < MEET ? 1 : Math.max(0, 1 - (t - MEET) / 900); if (!fade) return;
    const tipX = side < 0 ? w * (.02 + .44 * ease) : w * (.98 - .44 * ease), baseX = side < 0 ? -40 : w + 40;
    for (let i = 0; i < 70; i++){
      const u = i / 70, x = baseX + (tipX - baseX) * u, y = my + Math.sin(u * 3 + t / 500) * 10 * (1 - u) + (1 - u) * 30;
      cx.fillStyle = `rgba(${color},${(.15 + .6 * u) * fade})`; cx.beginPath(); cx.arc(x, y, 1 + 2.2 * u, 0, 7); cx.fill();
    }
    for (let f = -2; f <= 2; f++){
      const a = f * .08, len = f === 0 ? 32 : 22 - Math.abs(f) * 4, sy = my + f * 5;
      for (let i = 1; i <= 7; i++){
        const u = i / 7, x = tipX + dir * Math.cos(a) * len * u, y = sy + Math.sin(a) * len * u;
        cx.fillStyle = `rgba(${color},${(.45 + .55 * u) * fade})`; cx.beginPath(); cx.arc(x, y, f === 0 ? 1.9 : 1.4, 0, 7); cx.fill();
      }
    }
    cx.font = "500 12px 'DM Mono', monospace"; cx.fillStyle = `rgba(${color},${.8 * fade})`; cx.textAlign = side < 0 ? 'left' : 'right';
    cx.fillText(side < 0 ? egg.flesh : egg.si, side < 0 ? 24 : w - 24, my + 64);
  };
  const frame = now => {
    const t = now - t0; cx.clearRect(0, 0, w, h);
    stream(-1, 0, skin, t); stream(1, 0, sil, t);
    if (t > MEET && !burst.length){
      for (let i = 0; i < 260; i++){ const a = Math.random() * 7, v = .4 + Math.random() * 4.2;
        burst.push({x: w / 2, y: my, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: Math.random() * 2.2 + .6, c: [skin, sil, gold][i % 3], life: 1}); }
      setTimeout(() => { eggEl.classList.add('reveal'); eggEl.querySelector('.egg-back').focus(); }, 500);
    }
    if (t > MEET - 150 && t < MEET + 700){
      const g = cx.createRadialGradient(w / 2, my, 0, w / 2, my, 140); const k = 1 - Math.abs(t - MEET) / 700;
      g.addColorStop(0, `rgba(${gold},${.9 * k})`); g.addColorStop(1, 'rgba(235,175,18,0)'); cx.fillStyle = g; cx.beginPath(); cx.arc(w / 2, my, 140, 0, 7); cx.fill();
    }
    for (const p of burst){ p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy *= .985; p.life *= .993;
      cx.fillStyle = `rgba(${p.c},${p.life})`; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); }
    eggRAF = requestAnimationFrame(frame);
  };
  eggRAF = requestAnimationFrame(frame);
}
eggStar.addEventListener('click', () => {
  eggStar.classList.remove('spin'); void eggStar.offsetWidth; eggStar.classList.add('spin');
  eggClicks++; clearTimeout(eggTimer); eggTimer = setTimeout(() => { eggClicks = 0; eggStar.classList.remove('spin'); }, 1600);
  if (eggClicks >= 3){ eggClicks = 0; eggOpen(); }
});
eggEl.querySelector('.egg-back').addEventListener('click', eggClose);
eggEl.addEventListener('click', e => { if (e.target === eggEl || e.target.id === 'egg-canvas') eggClose(); });
document.addEventListener('keydown', e => { if (!eggEl.hidden && (e.key === 'Escape' || e.key === 'Tab')){ if (e.key === 'Escape') eggClose(); else { e.preventDefault(); eggEl.querySelector('.egg-back').focus(); } } });
