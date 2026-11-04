// Hasta La Vista — comportamiento común a las ocho versiones (es, en, fr, pt, ru, ar, hi, zh).
// Los textos que crea el script están aquí, por idioma. El resto del texto está en cada archivo HTML.
const T = {
  es: {
    menu: 'Menú', close: 'Cerrar', pause: '❚❚ Pausa', play: '▶ Seguir',
    moments: { como: '¡Manos a la obra!', ejemplo: '¡Juntos podemos!', vision: '¡A lo grande!' },
    thanks: '¡Qué maravilla!',
    success: '¡Gracias! En esta maqueta no se guarda ni se envía nada. La primera comunidad empieza con una conversación.'
  },
  en: {
    menu: 'Menu', close: 'Close', pause: '❚❚ Pause', play: '▶ Play',
    moments: { como: 'Let’s get to work!', ejemplo: 'Together we can!', vision: 'Think big!' },
    thanks: 'How wonderful!',
    success: 'Thank you! Nothing is saved or sent in this mock-up. The first community begins with a conversation.'
  },
  fr: {
    menu: 'Menu', close: 'Fermer', pause: '❚❚ Pause', play: '▶ Reprendre',
    moments: { como: 'Au travail\u202f!', ejemplo: 'Ensemble, on peut\u202f!', vision: 'En grand\u202f!' },
    thanks: 'Quelle merveille\u202f!',
    success: 'Merci\u202f! Dans cette maquette, rien n’est enregistré ni envoyé. La première communauté commence par une conversation.'
  },
  zh: {
    menu: '菜单', close: '关闭', pause: '❚❚ 暂停', play: '▶ 继续',
    moments: { como: '动手吧！', ejemplo: '一起就能做到！', vision: '往大处想！' },
    thanks: '太美好了！',
    success: '谢谢！在这个原型里，不会保存或发送任何内容。第一个社区，从一次对话开始。'
  },
  hi: {
    menu: 'मेनू', close: 'बंद करें', pause: '❚❚ रोकें', play: '▶ चलाएँ',
    moments: { como: 'चलो, काम शुरू करें!', ejemplo: 'साथ मिलकर हम कर सकते हैं!', vision: 'बड़ा सोचो!' },
    thanks: 'कितना सुंदर!',
    success: 'धन्यवाद! इस प्रोटोटाइप में कुछ भी सहेजा या भेजा नहीं जाता। पहला समुदाय एक बातचीत से शुरू होता है।'
  },
  pt: {
    menu: 'Menu', close: 'Fechar', pause: '❚❚ Pausar', play: '▶ Continuar',
    moments: { como: 'Mãos à obra!', ejemplo: 'Juntos, conseguimos!', vision: 'Pense grande!' },
    thanks: 'Que maravilha!',
    success: 'Obrigado! Nesta maquete nada é salvo nem enviado. A primeira comunidade começa com uma conversa.'
  },
  ru: {
    menu: 'Меню', close: 'Закрыть', pause: '❚❚ Пауза', play: '▶ Продолжить',
    moments: { como: 'За дело!', ejemplo: 'Вместе мы сможем!', vision: 'Мысли масштабно!' },
    thanks: 'Как прекрасно!',
    success: 'Спасибо! В этом прототипе ничего не сохраняется и не отправляется. Первое сообщество начинается с разговора.'
  },
  ar: {
    menu: 'القائمة', close: 'إغلاق', pause: '❚❚ إيقاف مؤقت', play: '▶ متابعة',
    moments: { como: 'إلى العمل!', ejemplo: 'معًا نستطيع!', vision: 'فكّر بشكل كبير!' },
    thanks: 'يا للروعة!',
    success: 'شكرًا! في هذا النموذج لا يُحفظ أي شيء ولا يُرسل. يبدأ المجتمع الأول بمحادثة.'
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
document.querySelector('#interest-form').addEventListener('submit', e => {
  e.preventDefault();
  const ok = document.querySelector('#success');
  ok.textContent = t.success;
  ok.classList.add('show');
  celebrate(t.thanks, 50, 18);
});
