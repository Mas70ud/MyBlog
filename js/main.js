let currentLang = localStorage.getItem('language') || 'en';

// بارگذاری کامپوننت‌های HTML
async function loadComponent(id, url) {
  const response = await fetch(url);
  const html = await response.text();
  document.getElementById(id).innerHTML = html;
}

// بارگذاری همه کامپوننت‌ها
async function loadAllComponents() {
  await loadComponent('sidebar-container', 'components/sidebar.html');
  await loadComponent('main-container', 'components/posts-section.html');
  await loadComponent('bottom-bar-container', 'components/bottom-bar.html');
  
  attachEventListeners();
  updateLanguage();
  if (window.reloadPosts) window.reloadPosts(); // بارگذاری اولیه پست‌ها
}

// اتصال رویدادها به دکمه‌ها
function attachEventListeners() {
  const toggleBtn = document.getElementById('darkModeToggle');
  const langToggleBtn = document.getElementById('langToggle');
  
  // Dark mode
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
  
  // تغییر زبان
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'fa' : 'en';
      localStorage.setItem('language', currentLang);
      updateLanguage();
      // بارگذاری مجدد پست‌ها با زبان جدید
      if (window.reloadPosts) window.reloadPosts();
    });
  }
}

// به‌روزرسانی متن‌های ثابت بر اساس زبان
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
  
  document.querySelectorAll('.visitText').forEach(el => el.innerText = t.visit);
  document.querySelectorAll('.sendMsgText').forEach(el => el.innerText = t.sendMsg);
  document.querySelectorAll('.chatText').forEach(el => el.innerText = t.chat);
  document.querySelectorAll('.followText').forEach(el => el.innerText = t.follow);
  document.querySelectorAll('.sendEmailText').forEach(el => el.innerText = t.sendEmail);
  document.querySelectorAll('.viewProfileText').forEach(el => el.innerText = t.viewProfile);
  
  for (let i = 1; i <= 6; i++) {
    const el = document.getElementById(`service${i}`);
    if (el) el.innerText = t.serviceNames[i-1];
  }
  for (let i = 1; i <= 5; i++) {
    const el = document.getElementById(`social${i}`);
    if (el) el.innerText = t.socialNames[i-1];
  }
  
  // جهت صفحه
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

// شروع برنامه
loadAllComponents();