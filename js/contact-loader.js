// contact-loader.js - پشتیبانی از دو زبان در فایل‌های JSON
let contactsContainer = null;

const contactOrder = [
  "github",
  "telegram" ,
  "email",
  "playstation",
  "chess"
];

async function fetchContactItem(fileName) {
  const url = `contact/${fileName}.json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (err) {
    console.warn(`Error loading ${url}:`, err);
    return null;
  }
}

// گرفتن مقدار متنی بر اساس زبان (اگر شیء بود زبان مناسب، وگرنه خود متن)
function getLocalizedValue(value, lang) {
  if (typeof value === 'object' && value !== null) {
    return value[lang] || value.en || '';
  }
  return value || '';
}

async function loadAllContacts() {
  if (!contactsContainer) {
    contactsContainer = document.getElementById('contactsContainer');
    if (!contactsContainer) {
      console.error("contactsContainer not found!");
      return;
    }
  }
  
  const lang = localStorage.getItem('language') || 'en';
  const promises = contactOrder.map(name => fetchContactItem(name));
  const items = await Promise.all(promises);
  const validItems = items.filter(item => item !== null);
  
  if (validItems.length === 0) {
    contactsContainer.innerHTML = `<div class="loading">No contacts found.</div>`;
    return;
  }
  
  contactsContainer.innerHTML = '';
  validItems.forEach(item => {
    const name = getLocalizedValue(item.name, lang);
    const buttonText = getLocalizedValue(item.buttonText, lang);
    const icon = item.icon || '';
    const buttonLink = item.buttonLink || '#';
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item-row';
    itemDiv.innerHTML = `
      <i class="${escapeHtml(icon)} item-icon"></i>
      <span class="item-name">${escapeHtml(name)}</span>
      <span class="spacer"></span>
      <a href="${escapeHtml(buttonLink)}" target="_blank" class="action-btn">${escapeHtml(buttonText)}</a>
    `;
    contactsContainer.appendChild(itemDiv);
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

window.reloadContacts = loadAllContacts;