// posts-loader.js - خواندن فایل‌های JSON از پوشه "post"
const postCount = 4;
let postsContainer = null;

async function fetchPost(index, lang) {
  const fileName = `post/${index}.json`;
  try {
    const response = await fetch(fileName);
    if (!response.ok) {
      console.warn(`File not found: ${fileName}`);
      return null;
    }
    const data = await response.json();
    const post = data[lang];
    // اگر برای این زبان پستی وجود ندارد یا عنوان خالی است → پست را نمایش نده
    if (!post || !post.title || post.title.trim() === '') {
      console.warn(`Post ${index} has no valid title in ${lang}`);
      return null;
    }
    let content = post.content || '';
    content = content.replace(/\n/g, '<br>');
    return {
      icon: post.icon || 'fas fa-file-alt',
      title: post.title,
      content: content
    };
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
    postsContainer.innerHTML = `<div class="loading">⚠️ No posts found for language "${lang}".<br>Create files: post/1.json, post/2.json, ...</div>`;
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