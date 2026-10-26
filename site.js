/* Buildless progressive enhancement. Only the language preference is stored locally. */
(() => {
  'use strict';
  const dictionaries = window.ARCEO_TRANSLATIONS;
  if (!dictionaries) return;
  const supported = value => value === 'sv' || value === 'en';
  const query = new URLSearchParams(location.search);
  let saved;
  try { saved = localStorage.getItem('arceo_lang'); } catch (_) { /* Storage can be blocked. */ }
  let language = supported(query.get('lang')) ? query.get('lang') : supported(saved) ? saved : (navigator.language || '').toLowerCase().startsWith('sv') ? 'sv' : 'en';
  let statusKey = '';
  let busy = false;
  let formCompleted = false;
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const menu = document.getElementById('mobile-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const t = key => dictionaries[language][key] || dictionaries.en[key] || key;

  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', t('menu.open'));
    if (returnFocus) menuButton.focus();
  }
  function applyLanguage(next, remember = false) {
    language = next;
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll('[data-i18n-aria]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAria)); });
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    const page = document.body.dataset.page;
    document.title = t(page + '.title');
    document.querySelector('meta[name="description"]').content = t(page + '.description');
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = t(page + '.description');
    document.querySelector('meta[property="og:locale"]').content = language === 'sv' ? 'sv_SE' : 'en_GB';
    menuButton.setAttribute('aria-label', t(menu.hidden ? 'menu.open' : 'menu.close'));
    // Carry language across pages even if localStorage is unavailable.
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      const target = new URL(href, location.href);
      if (target.origin === location.origin && /\/(?:index|1on1-consulting|privacy-policy)\.html$/.test(target.pathname)) {
        target.searchParams.set('lang', language);
        link.setAttribute('href', target.pathname.split('/').pop() + target.search + target.hash);
      }
    });
    if (form) {
      form.elements._language.value = language;
      form.elements._subject.value = language === 'sv' ? 'ArceoConsult – webbplatsförfrågan' : 'ArceoConsult – website enquiry';
      form.querySelector('.form-submit [data-i18n]').textContent = t(busy ? 'form.sending' : 'form.submit');
      if (statusKey) status.textContent = t(statusKey);
      [...form.elements].forEach(field => field.setCustomValidity?.(''));
    }
    if (remember) {
      try { localStorage.setItem('arceo_lang', language); } catch (_) { /* A preference is optional. */ }
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url);
    }
  }
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.language, true)));
  menuButton.addEventListener('click', () => {
    if (!menu.hidden) return closeMenu();
    menu.hidden = false;
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', t('menu.close'));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !menu.hidden) closeMenu(true); });
  window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  applyLanguage(language);

  if (!form) return;
  form.noValidate = true;
  if (query.get('service') === 'individual') form.elements.service.value = 'individual';
  form.addEventListener('input', event => {
    event.target.setCustomValidity?.('');
    event.target.removeAttribute('aria-invalid');
  });
  function validate() {
    let valid = true;
    for (const field of form.querySelectorAll('[required]')) {
      field.setCustomValidity('');
      let error = '';
      if (field.type === 'checkbox' && !field.checked) error = 'validation.privacy';
      else if (field.type !== 'checkbox' && !field.value.trim()) error = 'validation.required';
      else if (field.type === 'email' && field.validity.typeMismatch) error = 'validation.email';
      else if (field.name === 'message' && field.value.trim().length < 10) error = 'validation.message';
      if (error) field.setCustomValidity(t(error));
      const isValid = field.checkValidity();
      field.setAttribute('aria-invalid', String(!isValid));
      if (!isValid) valid = false;
    }
    if (!valid) form.reportValidity();
    return valid;
  }
  function showStatus(key, kind) {
    statusKey = key;
    status.textContent = t(key);
    status.dataset.kind = kind;
    status.hidden = false;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy || formCompleted || !validate()) return;
    if (form.elements._gotcha.value) return;
    busy = true;
    status.hidden = true;
    statusKey = '';
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    button.querySelector('[data-i18n]').textContent = t('form.sending');
    form.setAttribute('aria-busy', 'true');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal });
      if (response.ok) {
        formCompleted = true;
        showStatus('form.success', 'success');
        // Lock successful submissions against accidental duplicates.
        for (const field of form.querySelectorAll('input,select,textarea')) field.disabled = true;
      } else {
        showStatus('form.error', 'error');
      }
    } catch (_) {
      // A dropped connection cannot establish whether the service received the POST.
      showStatus('form.uncertain', 'error');
    } finally {
      clearTimeout(timeout);
      busy = false;
      form.removeAttribute('aria-busy');
      button.disabled = formCompleted;
      button.querySelector('[data-i18n]').textContent = t('form.submit');
    }
  });
})();
