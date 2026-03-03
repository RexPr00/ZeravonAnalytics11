const body = document.body;

function lockScroll(on) {
  body.style.overflow = on ? 'hidden' : '';
}

function trapFocus(container, event) {
  const focusables = container.querySelectorAll('a,button,input,[tabindex]:not([tabindex="-1"])');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

const langWrap = document.querySelector('.lang-wrap');
if (langWrap) {
  const btn = langWrap.querySelector('.lang-btn');
  btn.addEventListener('click', () => langWrap.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!langWrap.contains(e.target)) langWrap.classList.remove('open');
  });
}

const drawer = document.querySelector('.drawer');
const burger = document.querySelector('.burger');
const closeDrawer = document.querySelector('.close-drawer');
let drawerPrev = null;

function setDrawer(open) {
  if (!drawer) return;
  drawer.classList.toggle('open', open);
  lockScroll(open);
  if (open) {
    drawerPrev = document.activeElement;
    const first = drawer.querySelector('button, a');
    if (first) first.focus();
  } else if (drawerPrev) drawerPrev.focus();
}

burger?.addEventListener('click', () => setDrawer(true));
closeDrawer?.addEventListener('click', () => setDrawer(false));
drawer?.addEventListener('click', (e) => {
  if (e.target === drawer) setDrawer(false);
});

const drawerLangBtn = document.querySelector('.drawer .lang-btn');
drawerLangBtn?.addEventListener('click', () => {
  const wrap = drawerLangBtn.closest('.lang-wrap');
  wrap?.classList.toggle('open');
});

document.addEventListener('keydown', (e) => {
  const modal = document.querySelector('.policy-modal');
  if (e.key === 'Escape') {
    setDrawer(false);
    closePolicy();
  }
  if (e.key === 'Tab') {
    if (drawer?.classList.contains('open')) trapFocus(drawer.querySelector('.drawer-panel'), e);
    if (modal?.classList.contains('open')) trapFocus(modal.querySelector('.modal-box'), e);
  }
});

const faqItems = [...document.querySelectorAll('.faq-item')];
faqItems.forEach((item) => {
  const q = item.querySelector('.faq-q');
  const wrap = item.querySelector('.faq-a-wrap');
  q?.addEventListener('click', () => {
    faqItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-a-wrap').style.maxHeight = null;
      }
    });
    const open = item.classList.toggle('open');
    wrap.style.maxHeight = open ? `${wrap.scrollHeight}px` : null;
  });
});

const policyModal = document.querySelector('.policy-modal');
let modalPrev = null;
function openPolicy() {
  if (!policyModal) return;
  modalPrev = document.activeElement;
  policyModal.classList.add('open');
  lockScroll(true);
  policyModal.querySelector('.close-x')?.focus();
}
function closePolicy() {
  if (!policyModal) return;
  policyModal.classList.remove('open');
  lockScroll(false);
  if (modalPrev) modalPrev.focus();
}

document.querySelectorAll('[data-open-policy]').forEach((el) => el.addEventListener('click', (e) => {
  e.preventDefault();
  openPolicy();
}));
document.querySelectorAll('[data-close-policy]').forEach((el) => el.addEventListener('click', closePolicy));
policyModal?.addEventListener('click', (e) => {
  if (e.target === policyModal) closePolicy();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
