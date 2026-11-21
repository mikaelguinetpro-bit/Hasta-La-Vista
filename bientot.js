// Page « Bientôt » de Hasta La Vista : décompte jusqu'au mardi 1er décembre 2026, 00:00 à Paris (30 nov. 23:00 UTC).
// Derrière, un ciel qui se remplit d'étoiles à mesure que minuit approche.
(function () {
  var OPEN_AT = Date.UTC(2026, 10, 30, 23, 0, 0);
  var START = Date.UTC(2026, 10, 21, 17, 0, 0); // le jour où le rideau est tombé
  var T = {
    es: { kicker: "Hasta La Vista · El Agua", title: "La primera estrella se enciende pronto", date: "Martes 1 de diciembre a medianoche, hora de París.", days: "días", hours: "horas", minutes: "minutos", seconds: "segundos", line: "«Adiós» no quiere decir «nunca». A medianoche, cada creador se vuelve una estrella.", sub: "Cada noche, el cielo se llena un poco más." },
    fr: { kicker: "Hasta La Vista · L'Eau", title: "La première étoile s'allume bientôt", date: "Mardi 1er décembre à minuit, heure de Paris.", days: "jours", hours: "heures", minutes: "minutes", seconds: "secondes", line: "« Adieu » ne veut pas dire « jamais ». À minuit, chaque créateur devient une étoile.", sub: "Chaque nuit, le ciel se remplit un peu plus." },
    en: { kicker: "Hasta La Vista · Water", title: "The first star lights up soon", date: "Tuesday 1 December at midnight, Paris time.", days: "days", hours: "hours", minutes: "minutes", seconds: "seconds", line: "“Goodbye” doesn't mean “never”. At midnight, every creator becomes a star.", sub: "Every night, the sky fills up a little more." },
    pt: { kicker: "Hasta La Vista · A Água", title: "A primeira estrela se acende em breve", date: "Terça-feira, 1º de dezembro, à meia-noite, horário de Paris.", days: "dias", hours: "horas", minutes: "minutos", seconds: "segundos", line: "«Adeus» não quer dizer «nunca». À meia-noite, cada criador vira uma estrela.", sub: "A cada noite, o céu se enche um pouco mais." },
    ru: { kicker: "Hasta La Vista · Вода", title: "Первая звезда скоро загорится", date: "Вторник, 1 декабря, в полночь по парижскому времени.", days: "дней", hours: "часов", minutes: "минут", seconds: "секунд", line: "«Прощай» не значит «никогда». В полночь каждый создатель станет звездой.", sub: "Каждую ночь небо наполняется чуть больше." },
    ar: { kicker: "Hasta La Vista · الماء", title: "النجمة الأولى تضيء قريبًا", date: "الثلاثاء 1 ديسمبر عند منتصف الليل بتوقيت باريس.", days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثوانٍ", line: "«وداعًا» لا تعني «أبدًا». عند منتصف الليل، يصير كل مبدع نجمة.", sub: "كل ليلة، تمتلئ السماء أكثر قليلًا." },
    hi: { kicker: "Hasta La Vista · जल", title: "पहला तारा जल्द जगमगाएगा", date: "मंगलवार 1 दिसंबर, आधी रात, पेरिस समय।", days: "दिन", hours: "घंटे", minutes: "मिनट", seconds: "सेकंड", line: "«अलविदा» का मतलब «कभी नहीं» नहीं है। आधी रात को हर सर्जक एक तारा बन जाएगा।", sub: "हर रात आसमान थोड़ा और भर जाता है।" },
    bn: { kicker: "Hasta La Vista · জল", title: "প্রথম তারাটি শিগগিরই জ্বলবে", date: "মঙ্গলবার ১ ডিসেম্বর মধ্যরাতে, প্যারিস সময়।", days: "দিন", hours: "ঘণ্টা", minutes: "মিনিট", seconds: "সেকেন্ড", line: "«বিদায়» মানে «কখনো না» নয়। মধ্যরাতে প্রত্যেক স্রষ্টা একটি তারা হয়ে উঠবে।", sub: "প্রতি রাতে আকাশ আরেকটু ভরে ওঠে।" },
    zh: { kicker: "Hasta La Vista · 水", title: "第一颗星即将点亮", date: "12 月 1 日星期二午夜（巴黎时间）。", days: "天", hours: "小时", minutes: "分钟", seconds: "秒", line: "“再见”并不意味着“永不”。午夜时分，每位创造者都会成为一颗星。", sub: "每一夜，天空都会更满一点。" }
  };
  var lang = (navigator.languages || [navigator.language || "es"]).map(function (l) { return String(l).slice(0, 2).toLowerCase(); }).filter(function (l) { return T[l]; })[0] || "es";
  var dict = T[lang];
  document.documentElement.lang = lang;
  if (lang === "ar") document.documentElement.dir = "rtl";
  document.title = "Hasta La Vista — " + dict.title;
  [].forEach.call(document.querySelectorAll("[data-t]"), function (el) { el.textContent = dict[el.getAttribute("data-t")]; });

  // Décompte
  var pad = function (n) { return n < 10 ? "0" + n : String(n); };
  var ids = ["d", "h", "m", "s"].map(function (id) { return document.getElementById(id); });
  function tick() {
    var left = Math.max(0, OPEN_AT - Date.now());
    if (left === 0) { setTimeout(function () { location.reload(); }, 5000); return; } // le rideau se lève : on recharge la page demandée
    var s = Math.floor(left / 1000);
    var parts = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
    parts.forEach(function (v, i) { ids[i].textContent = pad(v); });
    setTimeout(tick, 1000 - (Date.now() % 1000));
  }
  tick();

  // Le ciel : plus minuit approche, plus il y a d'étoiles
  var cv = document.getElementById("cielo"), cx = cv.getContext("2d"), calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var stars = [], W = 0, H = 0;
  function seed(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
  for (var i = 0; i < 420; i++) stars.push({ x: seed(i), y: seed(i + 1000), r: 0.4 + seed(i + 2000) * 1.3, p: seed(i + 3000) * 6.28, gold: seed(i + 4000) < 0.12 });
  function size() { var d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); }
  function draw(t) {
    var progress = Math.min(1, Math.max(0, (Date.now() - START) / (OPEN_AT - START)));
    var n = Math.round(60 + progress * 360);
    cx.clearRect(0, 0, W, H);
    for (var i = 0; i < n; i++) {
      var s = stars[i], a = calm ? 0.8 : 0.45 + 0.45 * Math.sin(t / 900 + s.p);
      cx.globalAlpha = a; cx.fillStyle = s.gold ? "#ebaf12" : "#f4efe5";
      cx.beginPath(); cx.arc(s.x * W, s.y * H, s.r, 0, 6.283); cx.fill();
    }
    cx.globalAlpha = 1;
    if (!calm) requestAnimationFrame(draw);
  }
  size(); addEventListener("resize", function () { size(); if (calm) draw(0); });
  requestAnimationFrame(draw);
})();
