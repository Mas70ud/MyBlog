// js/main.js (بروز شده)
let currentLang = localStorage.getItem('language') || 'en';

async function loadComponent(id, url) {
  const response = await fetch(url);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

async function loadAllComponents() {
  await Promise.all([
    loadComponent('sidebar-container', 'components/sidebar.html'),
    loadComponent('main-container', 'components/posts-section.html'),
    loadComponent('bottom-bar-container', 'components/bottom-bar.html')
  ]);
  
  attachEventListeners();
  updateLanguage();
  if (window.reloadPosts) window.reloadPosts();
  if (window.reloadContacts) window.reloadContacts();
}

function attachEventListeners() {
  const toggleBtn = document.getElementById('darkModeToggle');
  const langToggleBtn = document.getElementById('langToggle');
  
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    }
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const iconEl = toggleBtn.querySelector('i');
      if (document.body.classList.contains('dark')) {
        localStorage.setItem('darkMode', 'enabled');
        iconEl.classList.remove('fa-moon');
        iconEl.classList.add('fa-sun');
      } else {
        localStorage.setItem('darkMode', 'disabled');
        iconEl.classList.remove('fa-sun');
        iconEl.classList.add('fa-moon');
      }
    });
  }
  
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'fa' : 'en';
      localStorage.setItem('language', currentLang);
      updateLanguage();
      if (window.reloadPosts) window.reloadPosts();
      if (window.reloadContacts) window.reloadContacts();
    });
  }
}

function updateLanguage() {
  const t = translations[currentLang];
  if (!t) return;
  
  const nameEl = document.getElementById('name');
  const bioEl = document.getElementById('bio');
  const locationEl = document.getElementById('location');
  const latestPostsEl = document.getElementById('latestPostsTitle');
  const servicesEl = document.getElementById('servicesTitle');
  const footerEl = document.getElementById('footerText');
  
  if (nameEl) nameEl.innerText = t.name;
  if (bioEl) bioEl.innerText = t.bio;
  if (locationEl) locationEl.innerText = t.location;
  if (latestPostsEl) latestPostsEl.innerText = t.latestPosts;
  if (servicesEl) servicesEl.innerText = t.services;
  if (footerEl) footerEl.innerText = t.footer;
  
  if (currentLang === 'fa') {
    document.body.classList.add('rtl');
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
  } else {
    document.body.classList.remove('rtl');
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }
}

loadAllComponents();