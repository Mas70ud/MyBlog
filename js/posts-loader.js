l// posts-loader.js - خواندن فایل‌ها از پوشه "post"
const postCount = 4;
let postsContainer = null;

async function fetchPost(index, lang) {
  const fileName = `post/${index}-${lang}.txt`;  // ← تغییر مسیر به پوشه post
  try {
    const response = await fetch(fileName);
    if (!response.ok) {
      console.warn(`File not found: ${fileName}`);
      return null;
    }
    const text = await response.text();
    const lines = text.split(/\r?\n/);
    if (lines.length < 2) return null;
    let icon = lines[0].trim() || 'fas fa-file-alt';
    let title = lines[1].trim() || 'No Title';
    let content = lines.slice(2).join('\n').trim();
    if (!content) content = '(Empty post)';
    content = content.replace(/\n/g, '<br>');
    return { icon, title, content };
  } catch (err) {
    console.warn(`Error loading ${fileName}:`, err);
    return null;
  }
}

async function loadAllPosts() {
  if (!postsContainer) {
    postsContainer = document.getElementById('postsContainer');
    if (!postsContainer) {
      console.error("postsContainer not found!");
      return;
    }
  }
  
  const lang = localStorage.getItem('language') || 'en';
  postsContainer.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-pulse"></i> Loading posts (${lang})...</div>`;
  
  const promises = [];
  for (let i = 1; i <= postCount; i++) {
    promises.push(fetchPost(i, lang));
  }
  const results = await Promise.all(promises);
  const validPosts = results.filter(p => p !== null);
  
  if (validPosts.length === 0) {
    postsContainer.innerHTML = `<div class="loading">⚠️ No posts found for language "${lang}".<br>Create files: 1-${lang}.txt, 2-${lang}.txt, ... in the "post" folder.</div>`;
    return;
  }
  
  postsContainer.innerHTML = '';
  validPosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
      <div class="post-icon"><i class="${escapeHtml(post.icon)}"></i></div>
      <div class="post-title">${escapeHtml(post.title)}</div>
      <div class="post-text">${post.content}</div>
    `;
    postsContainer.appendChild(card);
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

window.reloadPosts = loadAllPosts;
loadAllPosts();