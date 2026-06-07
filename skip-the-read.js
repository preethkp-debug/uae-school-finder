/*! Skip The Read 1.1 — schoolscompared.org site-wide variant (MIT)
 * Injects an "ask an AI about this page" block directly after the page
 * headline (<h1> plus its meta/badge row) on every page.
 * Works on static pages and on client-rendered school profiles
 * (waits for the <h1> to appear before injecting).
 */
(function () {
  'use strict';

  var PROVIDERS = {
    gemini: {
      label: 'Gemini',
      url: 'https://www.google.com/search?udm=50&aep=11&q={prompt}',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs><linearGradient id="str-gemini-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4285F4"/><stop offset="50%" stop-color="#9B72CB"/><stop offset="100%" stop-color="#D96570"/></linearGradient></defs><path fill="url(#str-gemini-g)" d="M12 2c.4 4.6 3.4 7.6 8 8-4.6.4-7.6 3.4-8 8-.4-4.6-3.4-7.6-8-8 4.6-.4 7.6-3.4 8-8z"/></svg>'
    },
    chatgpt: {
      label: 'ChatGPT',
      url: 'https://chatgpt.com/?prompt={prompt}',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="#10a37f" d="M22.28 9.82a5.93 5.93 0 0 0-.5-4.86 6 6 0 0 0-6.46-2.87A6 6 0 0 0 4.98 4.18a5.93 5.93 0 0 0-3.96 2.88 6 6 0 0 0 .74 7.04 5.93 5.93 0 0 0 .5 4.86 6 6 0 0 0 6.46 2.87 5.94 5.94 0 0 0 4.48 2 6 6 0 0 0 5.86-4.75 5.93 5.93 0 0 0 3.96-2.88 6 6 0 0 0-.74-7.4zM13.2 21.3a4.42 4.42 0 0 1-2.85-1.03l.14-.08 4.74-2.74a.78.78 0 0 0 .39-.68v-6.7l2 1.16v5.55a4.46 4.46 0 0 1-4.42 4.52zM3.7 17.27a4.43 4.43 0 0 1-.53-2.99l.14.08 4.74 2.74a.78.78 0 0 0 .79 0l5.79-3.34v2.31a.07.07 0 0 1-.03.06l-4.8 2.77a4.46 4.46 0 0 1-6.1-1.63zM2.46 8.6a4.43 4.43 0 0 1 2.32-1.95v5.65a.78.78 0 0 0 .39.67l5.77 3.33-2 1.16-4.79-2.77A4.46 4.46 0 0 1 2.46 8.6zm16.45 3.83-5.78-3.36 2-1.15 4.79 2.77a4.46 4.46 0 0 1-.69 8.05V13.1a.78.78 0 0 0-.32-.67zm1.99-3-.14-.09-4.73-2.76a.78.78 0 0 0-.79 0L9.45 9.92V7.6a.07.07 0 0 1 .03-.06l4.79-2.76a4.46 4.46 0 0 1 6.63 4.62zM8.36 13.5l-2-1.16V6.79a4.46 4.46 0 0 1 7.32-3.42l-.14.08-4.74 2.74a.78.78 0 0 0-.39.68zm1.09-2.35L12.03 9.66l2.58 1.49v2.98l-2.58 1.49-2.58-1.49z"/></svg>'
    },
    perplexity: {
      label: 'Perplexity',
      url: 'https://www.perplexity.ai/search?q={prompt}',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="#20808d" d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.7 3.7v8L12 19.7 5.3 16V8L12 4.3zm-1 3.2v9l-3-1.7v-5.6l3-1.7zm2 0 3 1.7v5.6l-3 1.7v-9z"/></svg>'
    },
    claude: {
      label: 'Claude',
      url: 'https://claude.ai/new?q={prompt}',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="#d97757" d="M5.6 18.4 9.9 6.3h2.4l4.3 12.1h-2.3L13.4 15H8.9L8 18.4H5.6zm3.9-5.3h3.3L11.3 8.7h-.1l-1.7 4.4zM16.8 18.4l4.3-12.1h-2.4L14.4 18.4h2.4z"/></svg>'
    },
    grok: {
      label: 'Grok',
      url: 'https://grok.com/?q={prompt}',
      svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="currentColor" d="M3.5 3.5h3.6l5.1 6.7 5-6.7H21l-7 9.1 7.5 8h-3.6l-5.6-6.3-4.7 6.3H3.6l6.8-8.5L3.5 3.5z"/></svg>'
    }
  };

  var SHARE_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M18 8a3 3 0 1 0-2.83-4M15 4 8.83 7.17M6 12a3 3 0 1 0 0-4 3 3 0 0 0 0 4Zm0 0a3 3 0 0 0 2.83-2M9 10l6.17 3.17M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 0a3 3 0 0 0-2.83-2M15 20 8.83 16.83"/></svg>';

  var CSS = '.str-llm-block{margin:18px 0 6px;padding:14px 16px;border:1px solid rgba(127,127,127,.3);border-radius:12px;background:rgba(127,127,127,.06);color:inherit;font-family:inherit}' +
    '.str-llm-block__heading{margin:0 0 10px;font-size:.92rem;font-weight:600;letter-spacing:-.01em;color:inherit;opacity:.85}' +
    '.str-llm-block__buttons{display:flex;flex-wrap:wrap;gap:8px}' +
    '.str-llm-btn{position:relative;display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:1px solid rgba(127,127,127,.45);border-radius:999px;background:rgba(255,255,255,.65);color:inherit;font-size:.85rem;font-weight:500;line-height:1;text-decoration:none!important;cursor:pointer;transition:transform .15s ease,background-color .15s ease,border-color .15s ease;-webkit-appearance:none;appearance:none;font-family:inherit}' +
    '.str-llm-btn:hover,.str-llm-btn:focus-visible{transform:translateY(-1px);background:rgba(127,127,127,.15);border-color:rgba(127,127,127,.7);text-decoration:none!important}' +
    '.str-llm-btn:focus-visible{outline:2px solid currentColor;outline-offset:2px}' +
    '.str-llm-btn__logo{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;flex-shrink:0}' +
    '.str-llm-btn__logo svg{width:100%;height:100%;display:block}' +
    '.str-llm-btn__label{white-space:nowrap;color:inherit}' +
    '@media (max-width:480px){.str-llm-block{padding:12px}.str-llm-btn{padding:7px 11px;font-size:.8rem}}';

  function injectCss() {
    if (document.getElementById('str-llm-styles')) return;
    var s = document.createElement('style');
    s.id = 'str-llm-styles';
    s.appendChild(document.createTextNode(CSS));
    document.head.appendChild(s);
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pageUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href) return canonical.href;
    return window.location.origin + window.location.pathname;
  }

  function pageHeading() {
    var p = window.location.pathname;
    if (/^\/blog\/.+/.test(p)) return 'Skip the read. Chat with this article.';
    if (/^\/school\/.+/.test(p)) return 'Skip the read. Chat with this school profile.';
    return 'Skip the read. Chat with this page.';
  }

  function buildPrompt(url) {
    return 'Summarize and analyze the key insights from "' + url + '"';
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }

  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t);
    return new Promise(function (res, rej) {
      try {
        var ta = document.createElement('textarea');
        ta.value = t; ta.setAttribute('readonly', '');
        ta.style.position = 'fixed'; ta.style.top = '-9999px';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); res();
      } catch (e) { rej(e); }
    });
  }

  function buildBlock() {
    var url = pageUrl();
    var prompt = buildPrompt(url);
    var enc = encodeURIComponent(prompt);

    var aside = el('aside', {
      id: 'skip-the-read-block',
      'class': 'str-llm-block',
      role: 'complementary',
      'aria-label': 'Chat with this page'
    });
    aside.appendChild(el('p', { 'class': 'str-llm-block__heading' }, esc(pageHeading())));

    var buttons = el('div', { 'class': 'str-llm-block__buttons' });
    ['gemini', 'chatgpt', 'perplexity', 'claude', 'grok'].forEach(function (key) {
      var p = PROVIDERS[key];
      var a = el('a', {
        'class': 'str-llm-btn str-llm-btn--' + key,
        href: p.url.replace('{prompt}', enc),
        target: '_blank',
        rel: 'noopener noreferrer nofollow',
        'aria-label': 'Open this page in ' + p.label
      }, '<span class="str-llm-btn__logo" aria-hidden="true">' + p.svg + '</span><span class="str-llm-btn__label">' + esc(p.label) + '</span>');
      buttons.appendChild(a);
    });

    var share = el('button', {
      type: 'button',
      'class': 'str-llm-btn str-llm-btn--share',
      'aria-label': 'Copy a shareable prompt for any other LLM',
      title: 'Click to copy the prompt to your clipboard'
    }, '<span class="str-llm-btn__logo" aria-hidden="true">' + SHARE_SVG + '</span><span class="str-llm-btn__label">Share</span>');
    share.addEventListener('click', function (e) {
      e.preventDefault();
      copyText(prompt).then(function () {
        var label = share.querySelector('.str-llm-btn__label');
        var old = label.textContent;
        label.textContent = 'Copied!';
        setTimeout(function () { label.textContent = old; }, 1500);
      }).catch(function () { window.prompt('Copy this prompt:', prompt); });
    });
    buttons.appendChild(share);

    aside.appendChild(buttons);
    return aside;
  }

  // Insert after the headline cluster: the <h1> plus any immediately
  // following meta rows (.meta, .school-meta, .badge-row, chips, crumbs).
  function anchorAfterHeadline(h1) {
    var anchor = h1;
    var next = h1.nextElementSibling;
    while (next && /(^|[\s-])(meta|badge|chip|crumb)/i.test(next.className || '')) {
      anchor = next;
      next = next.nextElementSibling;
    }
    return anchor;
  }

  function injectOnce() {
    if (document.getElementById('skip-the-read-block')) return true;
    var h1 = document.querySelector('h1');
    if (!h1) return false;
    injectCss();
    var anchor = anchorAfterHeadline(h1);
    anchor.parentNode.insertBefore(buildBlock(), anchor.nextSibling);
    return true;
  }

  function start() {
    if (injectOnce()) return;
    // Client-rendered pages (school profiles): wait for the h1 to appear.
    var mo = new MutationObserver(function () {
      if (injectOnce()) mo.disconnect();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { mo.disconnect(); injectOnce(); }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}());
