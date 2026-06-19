
'use strict';
/* ================================================================
   PROMESSE WOOD DESIGN — main.js  (Premium Edition)
   ================================================================ */

/* ─── PRELOADER ───────────────────────────────────────────────── */
function initPreloader() {
  const loader = document.getElementById('preloader');
  if (!loader) return;

  // Show once per browser session
  if (sessionStorage.getItem('pwd_loaded')) {
    loader.remove();
    document.body.classList.add('loaded');
    return;
  }

  const name = loader.querySelector('.preloader__name');
  const sub = loader.querySelector('.preloader__sub');
  const fill = loader.querySelector('.preloader__fill');

  // Sequence: text in → bar fills → curtain wipes up
  requestAnimationFrame(() => {
    if (name) name.classList.add('visible');
    setTimeout(() => { if (sub) sub.classList.add('visible'); }, 180);
    setTimeout(() => { if (fill) fill.style.width = '100%'; }, 280);
  });

  setTimeout(() => {
    loader.classList.add('done');
    document.body.classList.add('loaded');
    sessionStorage.setItem('pwd_loaded', '1');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 1900);
}

/* ─── SCROLL PROGRESS BAR ─────────────────────────────────────── */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─── CUSTOM CURSOR ───────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(hover: none)').matches) {
    dot.style.display = ring.style.display = 'none';
    return;
  }

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });

  (function lerpRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(lerpRing);
  })();

  // States
  const triggers = 'a, button, .product-card, .collection-item, .filter-btn, .value-item, label, input, select, textarea, .material-swatch';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(triggers)) { dot.classList.add('active'); ring.classList.add('active'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(triggers)) { dot.classList.remove('active'); ring.classList.remove('active'); }
  });
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

  // Click pulse
  document.addEventListener('mousedown', () => ring.classList.add('clicking'));
  document.addEventListener('mouseup', () => ring.classList.remove('clicking'));
}

/* ─── NAV ─────────────────────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ─── MOBILE MENU ─────────────────────────────────────────────── */
function initMobileMenu() {
  const toggle = document.querySelector('.nav__toggle');
  const overlay = document.querySelector('.nav__overlay');
  if (!toggle || !overlay) return;

  const open = () => {
    toggle.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => toggle.classList.contains('open') ? close() : open());
  overlay.querySelectorAll('a').forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ─── SCROLL REVEAL ───────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-clip');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => io.observe(el));
}

/* ─── HERO PARALLAX ───────────────────────────────────────────── */
function initParallax() {
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero__bg');
  if (!hero || !heroBg) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY < hero.offsetHeight)
          heroBg.style.transform = `translateY(${window.scrollY * 0.28}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ─── 3D CARD TILT ────────────────────────────────────────────── */
function initCardTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.product-card, .collection-item, .value-item').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 10;
      card.style.cssText += `transform:perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale3d(1.02,1.02,1.02); transition:transform 0.06s linear;`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)';
      card.style.transform = '';
    });
  });
}

/* ─── MAGNETIC BUTTONS ────────────────────────────────────────── */
function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('.btn--primary, .btn--outline, .nav__cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.3;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ─── STAT COUNTERS ───────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const ease = t => 1 - Math.pow(1 - t, 4);

  const run = (el, target, suffix) => {
    const start = performance.now();
    const dur = 1800;
    const tick = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      run(e.target, +e.target.dataset.count, e.target.dataset.suffix || '');
      io.unobserve(e.target);
    });
  }, { threshold: 0.6 });

  counters.forEach(el => io.observe(el));
}

/* ─── WORD-SPLIT TEXT REVEAL ──────────────────────────────────── */
function initTextSplit() {
  document.querySelectorAll('[data-split]').forEach(el => {
    // Preserve <br> by splitting on it first
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map(line =>
      line.trim().split(/\s+/).map(word =>
        `<span class="w-wrap"><span class="w">${word}</span></span>`
      ).join(' ')
    ).join('<br>');

    // Stagger each word
    el.querySelectorAll('.w').forEach((w, i) => {
      w.style.transitionDelay = `${i * 0.07}s`;
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('split-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  });
}

/* ─── MARQUEE DUPLICATION ─────────────────────────────────────── */
function initMarquee() {
  document.querySelectorAll('.marquee__track').forEach(track => {
    // Clone inner content for seamless infinite loop
    track.innerHTML += track.innerHTML;
  });
}

/* ─── HOVER SHIMMER on hero CTA ───────────────────────────────── */
function initButtonShimmer() {
  document.querySelectorAll('.btn--primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      btn.style.setProperty('--shine-x', `${x}%`);
      btn.style.setProperty('--shine-y', `${y}%`);
    });
  });
}

/* ─── COLLECTIONS + SHOP FILTER ──────────────────────────────── */
function initFilter() {
  // Collections page filter
  const bar = document.querySelector('.filter-bar');
  const grid = document.querySelector('.collections-grid');
  if (bar && grid) {
    const btns = bar.querySelectorAll('.filter-btn');
    const items = grid.querySelectorAll('.collection-item');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        items.forEach(item => item.classList.toggle('hidden', f !== 'all' && item.dataset.category !== f));
      });
    });
  }

  // Shop page filter
  const shopFilters = document.querySelector('.shop-filters');
  const shopGrid = document.getElementById('shopGrid');
  const shopCount = document.getElementById('shop-count');
  if (shopFilters && shopGrid) {
    const btns = shopFilters.querySelectorAll('.filter-btn');
    const cards = shopGrid.querySelectorAll('.shop-card');
    const updateCount = visible => { if (shopCount) shopCount.textContent = `${visible} piece${visible !== 1 ? 's' : ''}`; };
    updateCount(cards.length);
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        let visible = 0;
        cards.forEach(card => {
          const hide = f !== 'all' && card.dataset.category !== f;
          card.style.display = hide ? 'none' : '';
          if (!hide) visible++;
        });
        updateCount(visible);
      });
    });
  }
}

/* ─── ACTIVE NAV LINK ─────────────────────────────────────────── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link[href]').forEach(l => {
    if (l.getAttribute('href').split('/').pop() === page) l.classList.add('active');
  });
}

/* ─── SMOOTH ANCHORS ──────────────────────────────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(l => {
    l.addEventListener('click', e => {
      const t = document.querySelector(l.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ─── NEWSLETTER ──────────────────────────────────────────────── */
function initNewsletter() {
  document.querySelectorAll('.footer__newsletter-input-wrap').forEach(wrap => {
    const btn = wrap.querySelector('button');
    const inp = wrap.querySelector('input');
    if (!btn || !inp) return;
    btn.addEventListener('click', () => {
      if (!inp.value.trim()) { inp.focus(); return; }
      inp.value = '';
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = '→'; }, 2500);
    });
  });
}

/* ─── CONTACT FORM ────────────────────────────────────────────── */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent — We\'ll be in touch';
    btn.disabled = true;
    form.reset();
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 5000);
  });
}

/* ─── PROGRESSIVE IMAGE LOADING ──────────────────────────────── */
function initImageLoading() {
  document.body.classList.add('js-img-ready');

  const handle = img => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add('img-loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
      img.addEventListener('error', () => img.classList.add('img-loaded'), { once: true });
    }
  };

  document.querySelectorAll('img').forEach(handle);

  // Also catch dynamically inserted images
  new MutationObserver(mutations => {
    mutations.forEach(m => m.addedNodes.forEach(n => {
      if (n.nodeType === 1) n.querySelectorAll('img').forEach(handle);
    }));
  }).observe(document.body, { childList: true, subtree: true });
}

/* ─── CART HTML TEMPLATES ─────────────────────────────────────── */
const CART_HTML = `
<div id="cart-overlay"></div>
<aside id="cart-drawer" role="dialog" aria-label="Shopping cart" aria-modal="true">
  <div class="cart__header">
    <div>
      <p class="t-label" style="font-size:0.65rem;letter-spacing:0.15em;">Your Selection</p>
      <h2 class="cart__title">Cart <span id="cart-item-count"></span></h2>
    </div>
    <button class="cart__close" aria-label="Close cart">&#10005;</button>
  </div>
  <div class="cart__body" id="cart-body"></div>
  <div class="cart__footer" id="cart-footer">
    <div class="cart__subtotal-row">
      <span>Subtotal</span>
      <span class="cart__subtotal-val" id="cart-subtotal-val">$0</span>
    </div>
    <p class="cart__note">Pricing confirmed upon review. Custom pieces subject to final quote.</p>
    <button class="btn btn--primary cart__checkout-btn" id="cartCheckoutBtn">Proceed to Enquiry &#8594;</button>
    <a href="collections.html" class="cart__continue">Continue Shopping</a>
  </div>
</aside>`;

const CHECKOUT_HTML = `
<div id="checkout-overlay"></div>
<div id="checkout-modal" role="dialog" aria-label="Complete your enquiry" aria-modal="true">
  <div class="checkout__inner">
    <button class="checkout__close" id="checkoutCloseBtn" aria-label="Close">&#10005;</button>
    <div class="checkout__left">
      <p class="t-label" style="font-size:0.65rem;letter-spacing:0.15em;">Order Summary</p>
      <div class="divider" style="margin:0.8rem 0 1.2rem;"></div>
      <div id="checkout-items"></div>
      <div class="checkout__total-row">
        <span class="checkout__total-label">Estimated Total</span>
        <span class="checkout__total-val" id="checkout-total-val">$0</span>
      </div>
    </div>
    <div class="checkout__right">
      <p class="t-label" style="font-size:0.65rem;letter-spacing:0.15em;">Your Details</p>
      <div class="divider" style="margin:0.8rem 0 1.5rem;"></div>
      <form id="checkout-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="co-name">Full Name</label>
          <input class="form-input" type="text" id="co-name" placeholder="Your full name" autocomplete="name"/>
        </div>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label" for="co-email">Email</label>
          <input class="form-input" type="email" id="co-email" placeholder="you@example.com" autocomplete="email"/>
        </div>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label" for="co-phone">Phone / WhatsApp</label>
          <input class="form-input" type="tel" id="co-phone" placeholder="+250 7XX XXX XXX" autocomplete="tel"/>
        </div>
        <div class="form-group" style="margin-top:1rem;">
          <label class="form-label" for="co-notes">Notes (optional)</label>
          <textarea class="form-textarea" id="co-notes" rows="3" placeholder="Wood preference, delivery, timeline&#8230;" style="min-height:80px;resize:vertical;"></textarea>
        </div>
        <div class="checkout__actions">
          <a id="checkoutWhatsApp" class="btn btn--primary checkout__wa-btn" href="#" target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.851L.057 23.882a.5.5 0 0 0 .615.612l6.153-1.538A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.524-5.17-1.432l-.37-.22-3.833.958.975-3.763-.243-.385A9.958 9.958 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
            Order via WhatsApp
          </a>
          <a id="checkoutEmail" class="btn btn--outline" href="#">Order via Email</a>
        </div>
        <p class="checkout__disclaimer">We confirm availability &amp; pricing within 24 hours.</p>
      </form>
    </div>
  </div>
</div>`;

/* ─── CART ────────────────────────────────────────────────────── */
function initCart() {
  // State loaded from localStorage
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('pwd_cart') || '[]'); } catch (e) { cart = []; }

  const save = () => localStorage.setItem('pwd_cart', JSON.stringify(cart));

  const fmt = n => '$' + Number(n).toLocaleString('en-US');

  const total = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = () => cart.reduce((s, i) => s + i.qty, 0);

  // Inject cart drawer + checkout modal HTML
  document.body.insertAdjacentHTML('beforeend', CART_HTML + CHECKOUT_HTML);

  const drawer = document.getElementById('cart-drawer');
  const cartOvl = document.getElementById('cart-overlay');
  const modal = document.getElementById('checkout-modal');
  const coOvl = document.getElementById('checkout-overlay');
  const cartBody = document.getElementById('cart-body');
  const footer = document.getElementById('cart-footer');

  const openDrawer = () => {
    renderCart();
    drawer.classList.add('open');
    cartOvl.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    cartOvl.classList.remove('open');
    document.body.style.overflow = '';
  };

  const openCheckout = () => {
    closeDrawer();
    renderCheckout();
    modal.classList.add('open');
    coOvl.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeCheckout = () => {
    modal.classList.remove('open');
    coOvl.classList.remove('open');
    document.body.style.overflow = '';
  };

  const updateBadges = () => {
    const n = count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = n;
      el.classList.toggle('visible', n > 0);
    });
    const countEl = document.getElementById('cart-item-count');
    if (countEl) countEl.textContent = n > 0 ? `(${n})` : '';
  };

  const renderCart = () => {
    if (cart.length === 0) {
      cartBody.innerHTML = `<div class="cart__empty">
        <p class="cart__empty-icon">&#9675;</p>
        <p style="font-family:var(--serif);font-size:1.05rem;color:var(--cream);margin-bottom:0.4rem;">Your selection is empty</p>
        <p style="font-size:0.8rem;color:var(--text-muted);">Browse our collections to discover your piece.</p>
      </div>`;
      footer.style.display = 'none';
      return;
    }
    footer.style.display = 'block';
    cartBody.innerHTML = cart.map(it => `
      <div class="cart__item">
        <img class="cart__item-img img-loaded" src="${it.img}" alt="${it.name}" loading="lazy"/>
        <div>
          <p class="cart__item-cat">${it.cat}</p>
          <p class="cart__item-name">${it.name}</p>
          <p class="cart__item-price">${fmt(it.price)} per piece</p>
          <div class="cart__item-qty">
            <button class="cart__qty-btn" data-id="${it.id}" data-delta="-1">&#8722;</button>
            <span class="cart__qty-num">${it.qty}</span>
            <button class="cart__qty-btn" data-id="${it.id}" data-delta="1">+</button>
          </div>
        </div>
        <button class="cart__item-remove" data-id="${it.id}" aria-label="Remove ${it.name}">&#10005;</button>
      </div>`).join('');
    document.getElementById('cart-subtotal-val').textContent = fmt(total());
    updateBadges();
  };

  const renderCheckout = () => {
    document.getElementById('checkout-items').innerHTML = cart.map(it => `
      <div class="checkout__item">
        <img class="checkout__item-img img-loaded" src="${it.img}" alt="${it.name}" loading="lazy"/>
        <div class="checkout__item-info">
          <p class="checkout__item-name">${it.name}</p>
          <p class="checkout__item-qty">Qty ${it.qty} &times; ${fmt(it.price)}</p>
        </div>
        <span class="checkout__item-subtotal">${fmt(it.price * it.qty)}</span>
      </div>`).join('');
    document.getElementById('checkout-total-val').textContent = fmt(total());
  };

  const addItem = (id, name, price, img, cat) => {
    const ex = cart.find(i => i.id === id);
    if (ex) { ex.qty++; } else { cart.push({ id, name, price: +price, img, cat, qty: 1 }); }
    save();
    updateBadges();
    openDrawer();
  };

  // Event delegation — single listener handles all cart interactions
  document.addEventListener('click', e => {
    // Cart trigger
    if (e.target.closest('.cart-trigger')) { openDrawer(); return; }
    // Close drawer
    if (e.target === cartOvl || e.target.closest('.cart__close')) { closeDrawer(); return; }
    // Open checkout
    if (e.target.closest('#cartCheckoutBtn')) { openCheckout(); return; }
    // Close checkout
    if (e.target === coOvl || e.target.closest('#checkoutCloseBtn')) { closeCheckout(); return; }
    // Qty buttons
    const qtyBtn = e.target.closest('.cart__qty-btn');
    if (qtyBtn) {
      const id = qtyBtn.dataset.id, delta = +qtyBtn.dataset.delta;
      const it = cart.find(i => i.id === id);
      if (it) { it.qty += delta; if (it.qty <= 0) { cart = cart.filter(i => i.id !== id); } }
      save(); renderCart(); return;
    }
    // Remove button
    const rmBtn = e.target.closest('.cart__item-remove');
    if (rmBtn) { cart = cart.filter(i => i.id !== rmBtn.dataset.id); save(); renderCart(); return; }
    // Add to cart buttons
    const addBtn = e.target.closest('.btn--add-cart');
    if (addBtn) {
      const card = addBtn.closest('[data-product-id]');
      if (!card) return;
      const id = card.dataset.productId;
      const name = card.dataset.productName;
      const price = card.dataset.productPrice;
      const cat = card.dataset.productCat || '';
      const img = (card.querySelector('img')?.src || '').replace(/w=\d+/, 'w=300');
      const orig = addBtn.textContent;

      // Animated feedback
      addBtn.textContent = '✓ Added';
      addBtn.classList.add('added');
      addBtn.style.pointerEvents = 'none';

      // Show mini notification
      showAddToCartNotification(name);

      setTimeout(() => {
        addBtn.textContent = orig;
        addBtn.classList.remove('added');
        addBtn.style.pointerEvents = '';
      }, 1500);

      addItem(id, name, price, img, cat);
    }
  });

  // Mini notification for add to cart
  function showAddToCartNotification(productName) {
    const existing = document.querySelector('.cart-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>Added to cart</span>
    `;
    document.body.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add('show'));

    setTimeout(() => {
      notif.classList.remove('show');
      setTimeout(() => notif.remove(), 300);
    }, 2500);
  }

  // WhatsApp order link — builds message from cart contents + form fields
  document.getElementById('checkoutWhatsApp').addEventListener('click', function () {
    const name = document.getElementById('co-name')?.value.trim() || '';
    const phone = document.getElementById('co-phone')?.value.trim() || '';
    const notes = document.getElementById('co-notes')?.value.trim() || '';
    let msg = `Hello Promesse Wood Design! I'd like to order:\n\n`;
    cart.forEach(it => { msg += `• ${it.name} × ${it.qty} = ${fmt(it.price * it.qty)}\n`; });
    msg += `\nEstimated Total: ${fmt(total())}`;
    if (name) msg += `\nName: ${name}`;
    if (phone) msg += `\nPhone: ${phone}`;
    if (notes) msg += `\nNotes: ${notes}`;
    this.href = `https://wa.me/250786666111?text=${encodeURIComponent(msg)}`;
  });

  // Email order link — builds mailto from cart contents + form fields
  document.getElementById('checkoutEmail').addEventListener('click', function () {
    const name = document.getElementById('co-name')?.value.trim() || '';
    const email = document.getElementById('co-email')?.value.trim() || '';
    const notes = document.getElementById('co-notes')?.value.trim() || '';
    let body = `Hello,\n\nI would like to order:\n\n`;
    cart.forEach(it => { body += `• ${it.name} × ${it.qty} = ${fmt(it.price * it.qty)}\n`; });
    body += `\nEstimated Total: ${fmt(total())}`;
    if (name) body += `\nName: ${name}`;
    if (email) body += `\nReply-to: ${email}`;
    if (notes) body += `\nNotes: ${notes}`;
    const sub = encodeURIComponent('Order Enquiry — Promesse Wood Design');
    this.href = `mailto:info@promessewooddesign.rw?subject=${sub}&body=${encodeURIComponent(body)}`;
  });

  // Escape key closes whichever panel is open
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('open')) closeCheckout();
    else if (drawer.classList.contains('open')) closeDrawer();
  });

  // Initialise badges and render empty state on load
  updateBadges();
  renderCart();
}

/* ─── INIT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initImageLoading();
  initPreloader();
  initScrollProgress();
  initCursor();
  initNav();
  initMobileMenu();
  initReveal();
  initParallax();
  initCardTilt();
  initMagneticButtons();
  initCounters();
  initTextSplit();
  initMarquee();
  initButtonShimmer();
  initFilter();
  setActiveNav();
  initSmoothLinks();
  initNewsletter();
  initContactForm();
  initCart();
});
