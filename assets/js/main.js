/**
 * Gazipur Agricultural University High School (GAUHS)
 * গাজীপুর কৃষি বিশ্ববিদ্যালয় হাই স্কুল
 * Multi-Page Dynamic Engine & Modular Component Controller
 * 
 * Supports:
 * - index.html (Front Page with Crisp Hero Photo Showcase, Main Topics & Google Map)
 * - about.html (আমাদের পরিচিতি ও ইতিহাস)
 * - administration.html (প্রশাসন, প্রধান শিক্ষক, সভাপতি ও সকল শিক্ষক তালিকা)
 * - academics.html (শিক্ষাকার্যক্রম, শ্রেণি তথ্য ও পাঠ্যক্রম)
 * - admission.html (ভর্তি তথ্য, ফি চার্ট ও আবেদন ফরম)
 * - notices.html (পূর্ণাঙ্গ নোটিশ বোর্ড ও লাইভ ফিল্টার)
 * - gallery.html (সম্পূর্ণ ফটোগ্যালারি ও লাইটবক্স)
 * - contact.html (যোগাযোগ, গুগল ম্যাপ ও অনুসন্ধান)
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Resolve Data Store (from assets/js/data.js or data/school_data.json)
  let schoolData = window.SCHOOL_DATA;

  if (!schoolData) {
    try {
      const response = await fetch('data/school_data.json');
      if (response.ok) {
        schoolData = await response.json();
        window.SCHOOL_DATA = schoolData;
      }
    } catch (e) {
      console.warn('Network fetch error for JSON data, checking fallback:', e);
    }
  }

  if (!schoolData) {
    console.error('Fatal: School data could not be loaded.');
    return;
  }

  // 2. Initialize Shared Shell (Top Bar, Header with Active Navigation, Footer, Modals)
  initTopBar(schoolData);
  initHeader(schoolData);
  initFooter(schoolData);
  initModals(schoolData);
  initMobileMenu();

  // 3. Initialize Page-Specific Components (Only if corresponding DOM containers exist)
  // --- Front Page (index.html) ---
  initHeroShowcase(schoolData);
  initTicker(schoolData);
  initStats(schoolData);
  initHomeWelcome(schoolData);
  initHomeNotices(schoolData);
  initAhoroniBanner(schoolData);
  initHomeGallery(schoolData);
  initCampusMap(schoolData);

  // --- Dedicated Pages ---
  initAboutPage(schoolData);
  initAdministrationPage(schoolData);
  initAcademicsPage(schoolData);
  initAdmissionPage(schoolData);
  initNoticesPage(schoolData);
  initGalleryPage(schoolData);
  initContactPage(schoolData);
});

/* ==========================================================================
   MODULE: Top Utility Bar (শীর্ষ বার)
   ========================================================================== */
function initTopBar(data) {
  const container = document.getElementById('top-bar-content');
  if (!container) return;

  const info = data.school_info;
  const branding = data.branding;

  container.innerHTML = `
    <div class="flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
      <!-- Left Meta: EIIN, MPO & Contacts -->
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-emerald-100">
        <span class="inline-flex items-center gap-1.5 font-medium">
          <i class="fa-solid fa-id-card text-amber-400"></i>
          <span>EIIN: <strong class="text-white font-mono">${escapeHtml(info.eiin)}</strong></span>
        </span>
        <span class="hidden sm:inline-block text-emerald-300">•</span>
        <span class="inline-flex items-center gap-1.5 font-medium">
          <i class="fa-solid fa-hashtag text-amber-400"></i>
          <span>MPO: <strong class="text-white font-mono">${escapeHtml(info.mpo_code)}</strong></span>
        </span>
        <span class="hidden md:inline-block text-emerald-300">•</span>
        <span class="hidden md:inline-flex items-center gap-1.5">
          <i class="fa-solid fa-phone-volume text-amber-400"></i>
          <a href="tel:${escapeHtml(info.contact_primary)}" class="hover:text-amber-300 transition-colors font-mono">${escapeHtml(info.contact_primary)}</a>
        </span>
        <span class="hidden lg:inline-block text-emerald-300">•</span>
        <span class="hidden lg:inline-flex items-center gap-1.5">
          <i class="fa-solid fa-envelope text-amber-400"></i>
          <a href="mailto:${escapeHtml(info.official_email)}" class="hover:text-amber-300 transition-colors">${escapeHtml(info.official_email)}</a>
        </span>
      </div>

      <!-- Right Actions: Quick Ahoroni Pay CTA -->
      <div class="flex items-center gap-3">
        <a href="${escapeHtml(branding.ahoroni.payment_portal_url)}" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 text-xs">
          <i class="fa-solid fa-credit-card"></i>
          <span>অনলাইনে ফি পরিশোধ</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px] ml-0.5 opacity-80"></i>
        </a>
      </div>
    </div>
  `;
}

/* ==========================================================================
   MODULE: Main Navigation Header with Active Link State (মূল নেভিগেশন)
   ========================================================================== */
function initHeader(data) {
  const brandingContainer = document.getElementById('header-branding');
  const info = data.school_info;
  const branding = data.branding;

  if (brandingContainer) {
    brandingContainer.innerHTML = `
      <a href="index.html" class="flex items-center gap-3 group">
        <img src="${escapeHtml(branding.school_logo)}" alt="GAUHS Emblem" class="w-12 h-12 md:w-14 md:h-14 object-contain filter drop-shadow group-hover:scale-105 transition-transform" />
        <div class="flex flex-col">
          <span class="text-base sm:text-lg md:text-xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors leading-tight">
            ${escapeHtml(info.name_bn)}
          </span>
          <span class="text-xs sm:text-sm font-semibold text-emerald-700 leading-none mt-0.5">
            ${escapeHtml(info.name_en)}
          </span>
          <span class="text-[11px] text-slate-500 font-medium hidden sm:inline-block mt-1">
            স্থাপিত: ${escapeHtml(info.established_year)} • সালনা, গাজীপুর • ঢাকা শিক্ষা বোর্ড
          </span>
        </div>
      </a>
    `;
  }

  // Active Menu Detection
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active', 'text-amber-500', 'border-b-2', 'border-amber-500');
      link.classList.remove('text-slate-700');
    }
  });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('hidden');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.add('hidden');
    });
  }
}

/* ==========================================================================
   MODULE: Crystal-Clear Modern Hero Photo Showcase (ক্লিয়ার ফটো হিরো শোকেস)
   - Zero muddy color tint over photos!
   - 100% natural, crisp, bright campus images.
   - Auto-play with smooth cross-fade, indicators, and manual controls.
   - Click-to-enlarge full-resolution lightbox.
   ========================================================================== */
let showcaseActiveIndex = 0;
let showcaseTimer = null;

function initHeroShowcase(data) {
  const container = document.getElementById('hero-showcase-container');
  if (!container || !data.hero_slides || data.hero_slides.length === 0) return;

  const slides = data.hero_slides;

  container.innerHTML = `
    <div class="relative w-full h-[360px] sm:h-[420px] md:h-[460px] lg:h-[480px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border-4 border-white/20 group">
      <!-- Photo Slides (100% Clear & Natural) -->
      ${slides.map((slide, idx) => `
        <div class="showcase-slide absolute inset-0 w-full h-full ${idx === 0 ? 'active' : ''}" data-index="${idx}">
          <!-- Crisp Full Photo -->
          <img src="${escapeHtml(slide.image)}" alt="${escapeHtml(slide.title_bn)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          
          <!-- Subtle Bottom Gradient ONLY for text readability -->
          <div class="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-5 sm:p-7">
            <div class="space-y-1.5">
              <span class="inline-block bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                ${escapeHtml(slide.badge_bn)}
              </span>
              <h3 class="text-lg sm:text-xl md:text-2xl font-bold text-white leading-snug drop-shadow-md">
                ${escapeHtml(slide.title_bn)}
              </h3>
              <p class="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed">
                ${escapeHtml(slide.subtitle_bn)}
              </p>
            </div>
          </div>
        </div>
      `).join('')}

      <!-- Top Badge: Campus Photo Indicator -->
      <div class="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow">
        <i class="fa-solid fa-camera text-amber-400"></i>
        <span>ক্যাম্পাস ফটোগ্যালারি</span>
      </div>

      <!-- Top Right: Lightbox Zoom Button -->
      <button onclick="openShowcaseLightbox()" class="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-emerald-700 backdrop-blur-md text-white flex items-center justify-center border border-white/20 shadow transition-colors" title="বড় আকারে ছবি দেখুন">
        <i class="fa-solid fa-expand text-xs"></i>
      </button>

      <!-- Navigation Arrows -->
      <button onclick="prevShowcaseSlide()" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow transition-all opacity-80 hover:opacity-100 hover:scale-110" aria-label="আগের ছবি">
        <i class="fa-solid fa-chevron-left text-sm"></i>
      </button>

      <button onclick="nextShowcaseSlide()" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow transition-all opacity-80 hover:opacity-100 hover:scale-110" aria-label="পরের ছবি">
        <i class="fa-solid fa-chevron-right text-sm"></i>
      </button>

      <!-- Slide Indicator Dots -->
      <div id="showcase-indicators" class="absolute bottom-3 right-5 z-20 flex items-center gap-1.5">
        ${slides.map((_, idx) => `
          <button class="h-2 rounded-full transition-all ${idx === 0 ? 'bg-amber-400 w-6' : 'bg-white/60 hover:bg-white w-2'}" onclick="jumpShowcaseSlide(${idx})" aria-label="ছবি ${idx + 1}"></button>
        `).join('')}
      </div>
    </div>
  `;

  startShowcaseAutoPlay(slides.length);

  // Pause on hover
  container.addEventListener('mouseenter', () => clearInterval(showcaseTimer));
  container.addEventListener('mouseleave', () => startShowcaseAutoPlay(slides.length));
}

function startShowcaseAutoPlay(totalSlides) {
  if (showcaseTimer) clearInterval(showcaseTimer);
  showcaseTimer = setInterval(() => {
    showcaseActiveIndex = (showcaseActiveIndex + 1) % totalSlides;
    updateShowcaseSlideDOM();
  }, 5000);
}

window.jumpShowcaseSlide = function(index) {
  showcaseActiveIndex = index;
  updateShowcaseSlideDOM();
};

window.prevShowcaseSlide = function() {
  const slides = document.querySelectorAll('.showcase-slide');
  if (slides.length === 0) return;
  showcaseActiveIndex = (showcaseActiveIndex - 1 + slides.length) % slides.length;
  updateShowcaseSlideDOM();
};

window.nextShowcaseSlide = function() {
  const slides = document.querySelectorAll('.showcase-slide');
  if (slides.length === 0) return;
  showcaseActiveIndex = (showcaseActiveIndex + 1) % slides.length;
  updateShowcaseSlideDOM();
};

function updateShowcaseSlideDOM() {
  const slides = document.querySelectorAll('.showcase-slide');
  const indicators = document.querySelectorAll('#showcase-indicators button');

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === showcaseActiveIndex);
  });

  indicators.forEach((dot, idx) => {
    if (idx === showcaseActiveIndex) {
      dot.className = 'h-2 rounded-full transition-all bg-amber-400 w-6';
    } else {
      dot.className = 'h-2 rounded-full transition-all bg-white/60 hover:bg-white w-2';
    }
  });
}

window.openShowcaseLightbox = function() {
  const activeSlide = document.querySelector('.showcase-slide.active img');
  if (activeSlide && window.openGalleryLightboxByUrl) {
    window.openGalleryLightboxByUrl(activeSlide.getAttribute('src'), activeSlide.getAttribute('alt'));
  }
};

/* ==========================================================================
   MODULE: Dynamic Announcements Ticker (জরুরি নোটিশ স্ক্রল)
   ========================================================================== */
function initTicker(data) {
  const tickerContainer = document.getElementById('announcement-ticker-track');
  if (!tickerContainer || !data.announcements) return;

  const items = data.announcements;
  tickerContainer.innerHTML = items.map(item => `
    <span class="inline-flex items-center gap-2 px-6">
      ${item.urgent ? '<span class="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm animate-pulse">জরুরি</span>' : '<i class="fa-solid fa-bell text-amber-300 text-xs"></i>'}
      <a href="${escapeHtml(item.link)}" class="text-white hover:text-amber-300 transition-colors font-medium">
        ${escapeHtml(item.text_bn)}
      </a>
      <span class="text-emerald-300/50 ml-6 font-normal">|</span>
    </span>
  `).join('');
}

/* ==========================================================================
   MODULE: Key Institutional Stats (মূল পরিসংখ্যান)
   ========================================================================== */
function initStats(data) {
  const statsContainer = document.getElementById('stats-grid');
  if (!statsContainer || !data.school_info.stats) return;

  statsContainer.innerHTML = data.school_info.stats.map(stat => `
    <div class="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover-card-elevate flex items-center justify-between group">
      <div>
        <span class="block text-2xl sm:text-3xl md:text-4xl font-black text-emerald-900 tracking-tight">
          ${escapeHtml(stat.value_bn)}
        </span>
        <span class="block text-xs sm:text-sm font-bold text-slate-700 mt-1">
          ${escapeHtml(stat.label_bn)}
        </span>
      </div>
      <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shadow-inner group-hover:bg-emerald-700 group-hover:text-white transition-colors">
        <i class="fa-solid ${escapeHtml(stat.icon)}"></i>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   MODULE: Home Welcome & Administration Preview (হোমপেজ পরিচিতি ও বাণী)
   ========================================================================== */
function initHomeWelcome(data) {
  const historyEl = document.getElementById('home-history-preview');
  const hmCardEl = document.getElementById('home-headmaster-card');
  const chCardEl = document.getElementById('home-chairman-card');

  if (historyEl && data.about) {
    historyEl.textContent = data.about.history_bn;
  }

  if (hmCardEl && data.administration && data.administration.headmaster) {
    const hm = data.administration.headmaster;
    hmCardEl.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${escapeHtml(hm.photo)}" alt="${escapeHtml(hm.name_bn)}" class="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 shadow-md flex-shrink-0" />
        <div class="min-w-0">
          <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">প্রধান শিক্ষকের বার্তা</span>
          <h4 class="font-bold text-slate-900 text-base mt-1 truncate">${escapeHtml(hm.name_bn)}</h4>
          <p class="text-xs text-slate-500 truncate">${escapeHtml(hm.qualification_bn)}</p>
        </div>
      </div>
      <p class="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed italic bg-slate-50 p-3 rounded-lg border-l-2 border-emerald-600">
        "${escapeHtml(hm.message_bn)}"
      </p>
      <div class="mt-3 text-right">
        <a href="administration.html" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900">
          <span>সম্পূর্ণ বাণী ও পরিচালনা পর্ষদ</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </div>
    `;
  }

  if (chCardEl && data.administration && data.administration.chairman) {
    const ch = data.administration.chairman;
    chCardEl.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${escapeHtml(ch.photo)}" alt="${escapeHtml(ch.name_bn)}" class="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-md flex-shrink-0" />
        <div class="min-w-0">
          <span class="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">সভাপতির বার্তা (SMC)</span>
          <h4 class="font-bold text-slate-900 text-base mt-1 truncate">${escapeHtml(ch.name_bn)}</h4>
          <p class="text-xs text-slate-500 truncate">${escapeHtml(ch.qualification_bn)}</p>
        </div>
      </div>
      <p class="text-xs text-slate-600 mt-3 line-clamp-3 leading-relaxed italic bg-slate-50 p-3 rounded-lg border-l-2 border-amber-500">
        "${escapeHtml(ch.message_bn)}"
      </p>
      <div class="mt-3 text-right">
        <a href="administration.html" class="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900">
          <span>সম্পূর্ণ বাণী ও পরিচালনা পর্ষদ</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </a>
      </div>
    `;
  }
}

/* ==========================================================================
   MODULE: Recent Notices Preview on Front Page (হোমপেজে সর্বশেষ নোটিশ)
   ========================================================================== */
function initHomeNotices(data) {
  const container = document.getElementById('home-notices-container');
  if (!container || !data.notices) return;

  // Show top 4 notices on home page
  const recent = data.notices.slice(0, 4);

  container.innerHTML = recent.map(notice => `
    <div class="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-start gap-3.5 flex-1 min-w-0">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0 text-center text-emerald-900">
          <span class="text-[10px] font-bold text-slate-500">${formatNoticeMonthBn(notice.date_iso)}</span>
          <span class="text-base font-black leading-none">${formatNoticeDayBn(notice.date_iso)}</span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${getCategoryBadgeClass(notice.category)}">
              ${escapeHtml(notice.category_label_bn || notice.category)}
            </span>
            ${notice.pinned ? '<span class="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1"><i class="fa-solid fa-thumbtack"></i> পিনযুক্ত</span>' : ''}
          </div>
          <h4 class="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors cursor-pointer truncate" onclick="openNoticeModal('${escapeHtml(notice.id)}')">
            ${escapeHtml(notice.title_bn)}
          </h4>
          <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">${escapeHtml(notice.summary_bn)}</p>
        </div>
      </div>
      <button onclick="openNoticeModal('${escapeHtml(notice.id)}')" class="flex-shrink-0 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
        <span>বিস্তারিত</span>
        <i class="fa-solid fa-angle-right text-[10px]"></i>
      </button>
    </div>
  `).join('');
}

/* ==========================================================================
   MODULE: Ahoroni Digital Fee Feature Banner (আহরণী ফি পেমেন্ট ব্যানার)
   ========================================================================== */
function initAhoroniBanner(data) {
  const container = document.getElementById('ahoroni-banner-section');
  if (!container || !data.branding || !data.branding.ahoroni) return;

  const ah = data.branding.ahoroni;
  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-8 space-y-4">
            <div class="inline-flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <i class="fa-solid fa-bolt"></i>
              <span>ডিজিটাল স্মার্ট পেমেন্ট সুবিধা</span>
            </div>
            <h2 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              ${escapeHtml(ah.headline_bn)}
            </h2>
            <p class="text-sm sm:text-base text-emerald-100 max-w-2xl leading-relaxed">
              ${escapeHtml(ah.subheadline_bn)}
            </p>
            <div class="flex flex-wrap items-center gap-2 pt-1 text-xs text-emerald-200">
              <span class="font-bold text-white">সাপোর্টেড মাধ্যম:</span>
              ${ah.supported_methods.map(m => `
                <span class="bg-white/10 px-2.5 py-1 rounded-md border border-white/15">${escapeHtml(m)}</span>
              `).join('')}
            </div>
          </div>
          <div class="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
            <img src="${escapeHtml(ah.logo)}" alt="Ahoroni Logo" class="h-12 w-auto object-contain filter brightness-110 drop-shadow" />
            <a href="${escapeHtml(ah.payment_portal_url)}" target="_blank" rel="noopener noreferrer"
               class="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base flex items-center justify-center gap-2">
              <i class="fa-solid fa-credit-card"></i>
              <span>ফি পরিশোধ করুন</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-xs ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   MODULE: Home Gallery Highlights (হোমপেজ ফটোগ্যালারি প্রিভিউ - ৪টি সেরা ছবি)
   ========================================================================== */
function initHomeGallery(data) {
  const container = document.getElementById('home-gallery-preview');
  if (!container || !data.gallery) return;

  // Show top 4 pictures with clean hover zoom
  const previewItems = data.gallery.slice(0, 4);

  container.innerHTML = previewItems.map(item => `
    <div class="group relative rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200 aspect-[4/3] cursor-pointer" onclick="openGalleryLightboxByUrl('${escapeHtml(item.image)}', '${escapeHtml(item.title_bn)}')">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title_bn)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <span class="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded w-max mb-1">${escapeHtml(item.category_bn)}</span>
        <h5 class="text-white text-xs sm:text-sm font-bold line-clamp-2">${escapeHtml(item.title_bn)}</h5>
      </div>
      <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <i class="fa-solid fa-expand text-xs"></i>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   MODULE: Campus Location & Interactive Google Map (ক্যাম্পাস অবস্থান ও গুগল ম্যাপ)
   ========================================================================== */
function initCampusMap(data) {
  const mapSection = document.getElementById('campus-map-section');
  if (!mapSection || !data.school_info) return;

  const info = data.school_info;

  mapSection.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-emerald-700 font-bold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">ক্যাম্পাস অবস্থান ও যোগাযোগ</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 mt-2">আমাদের অবস্থান ও দিকনির্দেশনা</h2>
        <p class="text-slate-600 text-xs sm:text-sm mt-2">সালনায় ঢাকা-ময়মনসিংহ মহাসড়কের পূর্ব পাশে অবস্থিত মনোরম গাজীপুর কৃষি বিশ্ববিদ্যালয় ক্যাম্পাসে আমাদের বিদ্যাপীঠ।</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <!-- Interactive Google Map Frame -->
        <div class="lg:col-span-7 bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 min-h-[350px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14578.432657386057!2d90.40776075!3d24.01890885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755da54f3b7d14d%3A0x6b6311684c379a5b!2sSalna%2C%20Gazipur!5e0!3m2!1sen!2sbd!4v1710000000000!5m2!1sen!2sbd" 
            width="100%" 
            height="100%" 
            style="border:0; min-height: 380px;" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            title="গাজীপুর কৃষি বিশ্ববিদ্যালয় হাই স্কুল গুগল ম্যাপ">
          </iframe>
        </div>

        <!-- Location Cards & Quick Contact -->
        <div class="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-location-dot text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">ঠিকানা</h4>
                <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">${escapeHtml(info.address_bn)}</p>
                <p class="text-xs text-emerald-700 font-semibold mt-1">ল্যান্ডমার্ক: ${escapeHtml(info.landmark_bn)}</p>
              </div>
            </div>

            <div class="flex items-start gap-3.5 pt-3 border-t border-slate-100">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-clock text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">অফিস সময়</h4>
                <p class="text-xs text-slate-600 mt-0.5 leading-relaxed">${escapeHtml(info.office_hours_bn)}</p>
              </div>
            </div>

            <div class="flex items-start gap-3.5 pt-3 border-t border-slate-100">
              <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i class="fa-solid fa-headset text-lg"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 text-sm">হেল্পলাইন ও ইমেইল</h4>
                <p class="text-xs text-slate-600 mt-0.5 font-mono"><a href="tel:${escapeHtml(info.contact_primary)}" class="hover:text-emerald-700">${escapeHtml(info.contact_primary)}</a></p>
                <p class="text-xs text-slate-600 mt-0.5"><a href="mailto:${escapeHtml(info.official_email)}" class="hover:text-emerald-700">${escapeHtml(info.official_email)}</a></p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-2xl p-5 shadow flex items-center justify-between">
            <div>
              <h5 class="font-bold text-sm">কোনো প্রশ্ন বা পরামর্শ আছে?</h5>
              <p class="text-xs text-emerald-200 mt-0.5">আমাদের সাথে সরাসরি বার্তা পাঠাতে পারেন।</p>
            </div>
            <a href="contact.html" class="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
              বার্তা পাঠান
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   MODULE: Dedicated About Page (about.html)
   ========================================================================== */
function initAboutPage(data) {
  const historyEl = document.getElementById('about-history');
  const missionEl = document.getElementById('about-mission');
  const visionEl = document.getElementById('about-vision');
  const valuesEl = document.getElementById('about-values');
  const facilitiesEl = document.getElementById('about-facilities');
  const profileTableEl = document.getElementById('about-profile-table');

  if (historyEl && data.about) historyEl.textContent = data.about.history_bn;
  if (missionEl && data.about) missionEl.textContent = data.about.mission_bn;
  if (visionEl && data.about) visionEl.textContent = data.about.vision_bn;

  if (valuesEl && data.about && data.about.core_values) {
    valuesEl.innerHTML = data.about.core_values.map(v => `
      <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover-card-elevate">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg mb-3">
          <i class="fa-solid ${escapeHtml(v.icon)}"></i>
        </div>
        <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(v.title_bn)}</h4>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(v.description_bn)}</p>
      </div>
    `).join('');
  }

  if (facilitiesEl && data.about && data.about.campus_facilities) {
    facilitiesEl.innerHTML = data.about.campus_facilities.map(f => `
      <div class="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover-card-elevate">
        <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg mb-3">
          <i class="fa-solid ${escapeHtml(f.icon)}"></i>
        </div>
        <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(f.title_bn)}</h4>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(f.description_bn)}</p>
      </div>
    `).join('');
  }

  if (profileTableEl && data.school_info) {
    const info = data.school_info;
    profileTableEl.innerHTML = `
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50 w-1/3">প্রতিষ্ঠানের পূর্ণ নাম</td><td class="py-2.5 px-4 text-slate-900 font-semibold">${escapeHtml(info.name_bn)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">ইংরেজি নাম</td><td class="py-2.5 px-4 text-slate-900">${escapeHtml(info.name_en)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">EIIN নম্বর</td><td class="py-2.5 px-4 text-slate-900 font-mono font-bold text-emerald-700">${escapeHtml(info.eiin)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">MPO কোড</td><td class="py-2.5 px-4 text-slate-900 font-mono font-bold">${escapeHtml(info.mpo_code)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">শিক্ষা বোর্ড</td><td class="py-2.5 px-4 text-slate-900">${escapeHtml(info.board_bn)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">প্রতিষ্ঠার তারিখ</td><td class="py-2.5 px-4 text-slate-900">${escapeHtml(info.established_date)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">ব্যবস্থাপনা</td><td class="py-2.5 px-4 text-slate-900">${escapeHtml(info.management_bn)}</td></tr>
      <tr class="border-b border-slate-100"><td class="py-2.5 px-4 font-bold text-slate-700 bg-slate-50">ক্যাম্পাস অবস্থান</td><td class="py-2.5 px-4 text-slate-900">${escapeHtml(info.address_bn)}</td></tr>
    `;
  }
}

/* ==========================================================================
   MODULE: Dedicated Administration Page (administration.html)
   ========================================================================== */
let currentFacultyFilter = 'all';

function initAdministrationPage(data) {
  const hmContainer = document.getElementById('headmaster-full-message');
  const chContainer = document.getElementById('chairman-full-message');
  const gbContainer = document.getElementById('governing-body-grid');
  const facultyGrid = document.getElementById('faculty-grid');

  if (!data.administration) return;
  const admin = data.administration;

  if (hmContainer && admin.headmaster) {
    const hm = admin.headmaster;
    hmContainer.innerHTML = `
      <div class="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-quote-left text-amber-400 text-xl"></i>
            <h3 class="font-bold text-lg">প্রধান শিক্ষকের বাণী</h3>
          </div>
        </div>
        <div class="p-6 sm:p-10">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="flex-shrink-0 text-center">
              <img src="${escapeHtml(hm.photo)}" alt="${escapeHtml(hm.name_bn)}" class="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover border-4 border-emerald-100 shadow-md mx-auto" />
              <div class="mt-4">
                <span class="block font-bold text-slate-900 text-lg">${escapeHtml(hm.name_bn)}</span>
                <span class="block text-xs font-bold text-emerald-700 mt-0.5">${escapeHtml(hm.title_bn)}</span>
                <span class="block text-xs text-slate-500 mt-1">${escapeHtml(hm.qualification_bn)}</span>
              </div>
            </div>
            <div class="flex-1 space-y-4">
              <p class="text-sm md:text-base text-slate-700 leading-relaxed italic border-l-4 border-emerald-600 pl-5 bg-emerald-50/40 py-4 rounded-r-xl">
                "${escapeHtml(hm.message_bn)}"
              </p>
              <div class="flex flex-wrap items-center gap-5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-envelope text-emerald-600"></i> ${escapeHtml(hm.email)}</span>
                <span class="inline-flex items-center gap-1.5 font-mono"><i class="fa-solid fa-phone text-emerald-600"></i> ${escapeHtml(hm.phone)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (chContainer && admin.chairman) {
    const ch = admin.chairman;
    chContainer.innerHTML = `
      <div class="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-landmark text-amber-400 text-xl"></i>
            <h3 class="font-bold text-lg">ম্যানেজিং কমিটির সভাপতির বাণী</h3>
          </div>
        </div>
        <div class="p-6 sm:p-10">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div class="flex-shrink-0 text-center">
              <img src="${escapeHtml(ch.photo)}" alt="${escapeHtml(ch.name_bn)}" class="w-36 h-36 md:w-44 md:h-44 rounded-2xl object-cover border-4 border-amber-100 shadow-md mx-auto" />
              <div class="mt-4">
                <span class="block font-bold text-slate-900 text-lg">${escapeHtml(ch.name_bn)}</span>
                <span class="block text-xs font-bold text-amber-700 mt-0.5">${escapeHtml(ch.title_bn)}</span>
                <span class="block text-xs text-slate-500 mt-1">${escapeHtml(ch.qualification_bn)}</span>
              </div>
            </div>
            <div class="flex-1 space-y-4">
              <p class="text-sm md:text-base text-slate-700 leading-relaxed italic border-l-4 border-amber-500 pl-5 bg-amber-50/40 py-4 rounded-r-xl">
                "${escapeHtml(ch.message_bn)}"
              </p>
              <div class="flex flex-wrap items-center gap-5 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <span class="inline-flex items-center gap-1.5"><i class="fa-solid fa-envelope text-amber-600"></i> ${escapeHtml(ch.email)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  if (gbContainer && admin.governing_body) {
    gbContainer.innerHTML = admin.governing_body.map(mem => `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover-card-elevate">
        <span class="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">${escapeHtml(mem.role_bn)}</span>
        <h5 class="font-bold text-slate-900 text-base mt-3">${escapeHtml(mem.name_bn)}</h5>
        <p class="text-xs text-slate-600 mt-1">${escapeHtml(mem.designation_bn)}</p>
      </div>
    `).join('');
  }

  if (facultyGrid && admin.faculty) {
    renderFacultyCards(admin.faculty, 'all');
    initFacultyFilterButtons(admin.faculty);
  }
}

function initFacultyFilterButtons(facultyList) {
  const filterBtns = document.querySelectorAll('.faculty-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-emerald-700', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });

      btn.classList.add('active', 'bg-emerald-700', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      currentFacultyFilter = btn.getAttribute('data-filter') || 'all';
      renderFacultyCards(facultyList, currentFacultyFilter);
    });
  });
}

function renderFacultyCards(facultyList, filter) {
  const container = document.getElementById('faculty-grid');
  if (!container || !facultyList) return;

  const filtered = filter === 'all'
    ? facultyList
    : facultyList.filter(f => f.department_code.toLowerCase() === filter.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-500">
        <i class="fa-solid fa-users-slash text-4xl mb-3 text-slate-300"></i>
        <p class="text-sm">এই বিভাগে কোনো শিক্ষকের তথ্য পাওয়া যায়নি।</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(teacher => `
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover-card-elevate flex flex-col justify-between">
      <div class="p-5">
        <div class="flex items-center gap-4">
          <img src="${escapeHtml(teacher.photo)}" alt="${escapeHtml(teacher.name_bn)}" class="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 flex-shrink-0" />
          <div class="min-w-0 flex-1">
            <span class="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mb-1">
              ${escapeHtml(teacher.department_bn)}
            </span>
            <h4 class="font-bold text-slate-900 text-sm leading-snug truncate" title="${escapeHtml(teacher.name_bn)}">
              ${escapeHtml(teacher.name_bn)}
            </h4>
            <p class="text-xs text-emerald-700 font-semibold truncate">${escapeHtml(teacher.designation_bn)}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-book-bookmark text-slate-400 w-3.5"></i>
            <span class="truncate"><strong>বিষয়:</strong> ${escapeHtml(teacher.subject_bn)}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-certificate text-slate-400 w-3.5"></i>
            <span class="truncate"><strong>যোগ্যতা:</strong> ${escapeHtml(teacher.qualification_bn)}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-envelope text-slate-400 w-3.5"></i>
            <span class="truncate">${escapeHtml(teacher.email)}</span>
          </div>
        </div>
      </div>

      <div class="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span class="text-slate-500 font-mono">আইডি: ${escapeHtml(teacher.id)}</span>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   MODULE: Dedicated Academics Page (academics.html)
   ========================================================================== */
function initAcademicsPage(data) {
  const classesContainer = document.getElementById('academics-classes-grid');
  const downloadsContainer = document.getElementById('academics-downloads-list');

  if (!data.academics) return;

  if (classesContainer && data.academics.class_levels) {
    classesContainer.innerHTML = data.academics.class_levels.map(cl => `
      <div class="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover-card-elevate">
        <span class="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">${escapeHtml(cl.medium_bn)}</span>
        <h4 class="font-bold text-slate-900 text-base mt-2">${escapeHtml(cl.title_bn)}</h4>
        <p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(cl.description_bn)}</p>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>মোট শাখা: ${escapeHtml(cl.sections_bn)}</span>
          <span>শিক্ষার্থী: ${escapeHtml(cl.students_approx_bn)}</span>
        </div>
      </div>
    `).join('');
  }

  if (downloadsContainer && data.academics.downloadable_resources) {
    downloadsContainer.innerHTML = data.academics.downloadable_resources.map(res => `
      <div class="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4 shadow-sm hover:border-emerald-500 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg">
            <i class="fa-solid fa-file-pdf"></i>
          </div>
          <div>
            <h5 class="font-bold text-slate-900 text-sm">${escapeHtml(res.title_bn)}</h5>
            <span class="text-[11px] text-slate-500">সাইজ: ${escapeHtml(res.file_size)} • ফাইল ফরম্যাট: PDF</span>
          </div>
        </div>
        <button onclick="downloadResourceMock('${escapeHtml(res.title_bn)}')" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
          <i class="fa-solid fa-download"></i>
          <span>ডাউনলোড</span>
        </button>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   MODULE: Dedicated Admission Page (admission.html)
   ========================================================================== */
function initAdmissionPage(data) {
  const stepsContainer = document.getElementById('admission-steps-grid');
  const feesTableEl = document.getElementById('admission-fees-table');

  if (!data.admission) return;

  if (stepsContainer && data.admission.procedure_steps) {
    stepsContainer.innerHTML = data.admission.procedure_steps.map(st => `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
        <div class="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
          ${escapeHtml(st.step_num_bn)}
        </div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm">${escapeHtml(st.title_bn)}</h4>
          <p class="text-xs text-slate-600 mt-1 leading-relaxed">${escapeHtml(st.description_bn)}</p>
        </div>
      </div>
    `).join('');
  }

  if (feesTableEl && data.admission.fee_structures) {
    feesTableEl.innerHTML = data.admission.fee_structures.map(fee => `
      <tr class="hover:bg-slate-50 transition-colors border-b border-slate-100 text-xs sm:text-sm">
        <td class="py-3.5 px-4 font-bold text-slate-900">${escapeHtml(fee.class_level_bn)}</td>
        <td class="py-3.5 px-4 font-bold text-emerald-800">${escapeHtml(fee.admission_fee_bn)}</td>
        <td class="py-3.5 px-4 font-medium text-slate-800">${escapeHtml(fee.monthly_tuition_bn)}</td>
        <td class="py-3.5 px-4 font-medium text-slate-700">${escapeHtml(fee.session_charge_bn)}</td>
        <td class="py-3.5 px-4 font-medium text-slate-700">${escapeHtml(fee.exam_fee_bn)}</td>
      </tr>
    `).join('');
  }
}

/* ==========================================================================
   MODULE: Dedicated Notices Page (notices.html)
   ========================================================================== */
let activeNoticeFilter = 'all';
let noticeSearchQuery = '';

function initNoticesPage(data) {
  const listContainer = document.getElementById('notices-list');
  const searchInput = document.getElementById('notice-search-input');
  if (!listContainer || !data.notices) return;

  renderNoticesList(data.notices);

  // Tab Filtering
  const tabs = document.querySelectorAll('.notice-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active', 'bg-emerald-700', 'text-white'));
      tab.classList.add('active', 'bg-emerald-700', 'text-white');
      activeNoticeFilter = tab.getAttribute('data-category') || 'all';
      renderNoticesList(data.notices);
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      noticeSearchQuery = e.target.value.trim().toLowerCase();
      renderNoticesList(data.notices);
    });
  }
}

function renderNoticesList(notices) {
  const container = document.getElementById('notices-list');
  if (!container) return;

  let filtered = notices;

  if (activeNoticeFilter !== 'all') {
    filtered = filtered.filter(n => n.category.toLowerCase() === activeNoticeFilter.toLowerCase());
  }

  if (noticeSearchQuery) {
    filtered = filtered.filter(n => 
      n.title_bn.toLowerCase().includes(noticeSearchQuery) ||
      n.summary_bn.toLowerCase().includes(noticeSearchQuery)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-slate-400">
        <i class="fa-solid fa-folder-open text-4xl mb-3"></i>
        <p class="text-sm">কোনো নোটিশ পাওয়া যায়নি।</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(notice => `
    <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-start gap-4 flex-1">
        <div class="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center flex-shrink-0 text-center">
          <span class="text-xs font-bold text-slate-500">${formatNoticeMonthBn(notice.date_iso)}</span>
          <span class="text-lg font-black text-emerald-800 leading-none">${formatNoticeDayBn(notice.date_iso)}</span>
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full ${getCategoryBadgeClass(notice.category)}">
              ${escapeHtml(notice.category_label_bn || notice.category)}
            </span>
            ${notice.pinned ? '<span class="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1"><i class="fa-solid fa-thumbtack text-[9px]"></i> পিনযুক্ত</span>' : ''}
          </div>
          <h4 class="font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors cursor-pointer" onclick="openNoticeModal('${escapeHtml(notice.id)}')">
            ${escapeHtml(notice.title_bn)}
          </h4>
          <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            ${escapeHtml(notice.summary_bn)}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
        <button onclick="openNoticeModal('${escapeHtml(notice.id)}')" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-eye"></i>
          <span>বিস্তারিত</span>
        </button>
        <button onclick="downloadNoticePdf('${escapeHtml(notice.id)}')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1.5">
          <i class="fa-solid fa-file-pdf"></i>
          <span>পিডিএফ</span>
        </button>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   MODULE: Dedicated Gallery Page (gallery.html)
   ========================================================================== */
let activeGalleryFilter = 'all';

function initGalleryPage(data) {
  const container = document.getElementById('gallery-grid');
  if (!container || !data.gallery) return;

  renderGalleryItems(data.gallery, 'all');

  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-emerald-700', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });

      btn.classList.add('active', 'bg-emerald-700', 'text-white');
      btn.classList.remove('bg-slate-100', 'text-slate-700');

      activeGalleryFilter = btn.getAttribute('data-filter') || 'all';
      renderGalleryItems(data.gallery, activeGalleryFilter);
    });
  });
}

function renderGalleryItems(galleryList, filter) {
  const container = document.getElementById('gallery-grid');
  if (!container) return;

  const filtered = filter === 'all'
    ? galleryList
    : galleryList.filter(g => g.category_code.toLowerCase() === filter.toLowerCase());

  container.innerHTML = filtered.map(item => `
    <div class="group relative rounded-2xl overflow-hidden shadow-md bg-slate-900 border border-slate-200 aspect-[4/3] cursor-pointer" onclick="openGalleryLightboxByUrl('${escapeHtml(item.image)}', '${escapeHtml(item.title_bn)}')">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title_bn)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent flex flex-col justify-end p-4">
        <span class="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded w-max mb-1">${escapeHtml(item.category_bn)}</span>
        <h5 class="text-white text-xs sm:text-sm font-bold line-clamp-2">${escapeHtml(item.title_bn)}</h5>
      </div>
      <div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <i class="fa-solid fa-expand text-xs"></i>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   MODULE: Dedicated Contact Page (contact.html)
   ========================================================================== */
function initContactPage(data) {
  const form = document.getElementById('contact-inquiry-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('আপনার বার্তাটি সফলভাবে গৃহীত হয়েছে! শীঘ্রই বিদ্যালয় প্রশাসন আপনার সাথে যোগাযোগ করবে। ধন্যবাদ।');
      form.reset();
    });
  }
}

/* ==========================================================================
   MODULE: Unified Footer Section (সকল পৃষ্ঠার ফুটার)
   ========================================================================== */
function initFooter(data) {
  const footerContainer = document.getElementById('main-footer');
  if (!footerContainer) return;

  const info = data.school_info;
  const branding = data.branding;

  footerContainer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-slate-300">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
        <!-- Col 1: School Identity -->
        <div class="lg:col-span-4 space-y-4">
          <div class="flex items-center gap-3">
            <img src="${escapeHtml(branding.school_logo)}" alt="GAUHS Emblem" class="w-12 h-12 object-contain" />
            <div>
              <h4 class="font-black text-white text-base leading-snug">${escapeHtml(info.name_bn)}</h4>
              <p class="text-xs text-emerald-400 font-semibold">${escapeHtml(info.name_en)}</p>
            </div>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">
            ${escapeHtml(info.motto_bn)}। সালনার মনোরম বিশ্ববিদ্যালয় ক্যাম্পাসে প্রতিষ্ঠিত আদর্শ মাধ্যমিক শিক্ষাপ্রতিষ্ঠান।
          </p>
          <div class="pt-2 text-xs space-y-1 text-slate-400">
            <p><strong class="text-slate-200">EIIN:</strong> <span class="font-mono">${escapeHtml(info.eiin)}</span> | <strong class="text-slate-200">MPO:</strong> <span class="font-mono">${escapeHtml(info.mpo_code)}</span></p>
            <p><strong class="text-slate-200">শিক্ষা বোর্ড:</strong> ${escapeHtml(info.board_bn)}</p>
          </div>
        </div>

        <!-- Col 2: Quick Links -->
        <div class="lg:col-span-2 space-y-3">
          <h5 class="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-700 pb-2">গুরুত্বপূর্ণ মেনু</h5>
          <ul class="space-y-2 text-xs">
            <li><a href="index.html" class="hover:text-emerald-400 transition-colors">মূল পাতা (প্রচ্ছদ)</a></li>
            <li><a href="about.html" class="hover:text-emerald-400 transition-colors">আমাদের পরিচিতি</a></li>
            <li><a href="administration.html" class="hover:text-emerald-400 transition-colors">প্রশাসন ও শিক্ষকবৃন্দ</a></li>
            <li><a href="academics.html" class="hover:text-emerald-400 transition-colors">শিক্ষাকার্যক্রম</a></li>
            <li><a href="admission.html" class="hover:text-emerald-400 transition-colors">ভর্তি তথ্য ও ফি চার্ট</a></li>
            <li><a href="notices.html" class="hover:text-emerald-400 transition-colors">নোটিশ বোর্ড</a></li>
            <li><a href="gallery.html" class="hover:text-emerald-400 transition-colors">ফটোগ্যালারি</a></li>
            <li><a href="contact.html" class="hover:text-emerald-400 transition-colors">যোগাযোগ ও ম্যাপ</a></li>
          </ul>
        </div>

        <!-- Col 3: Fee Payment with Ahoroni -->
        <div class="lg:col-span-3 space-y-3">
          <h5 class="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-700 pb-2">অনলাইন ফি পোর্টাল</h5>
          <p class="text-xs text-slate-400 leading-relaxed">
            বিদ্যালয়ের সকল মাসিক বেতন ও পরীক্ষার ফি আহরণী পোর্টালে বিকাশ, নগদ ও কার্ডের মাধ্যমে নিরাপদে পরিশোধ করা যায়।
          </p>
          <a href="${escapeHtml(branding.ahoroni.payment_portal_url)}" target="_blank" rel="noopener noreferrer" 
             class="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow">
            <img src="${escapeHtml(branding.ahoroni.logo)}" alt="Ahoroni" class="h-4 w-auto filter brightness-95" />
            <span>ফি পরিশোধ করুন</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>

        <!-- Col 4: Contact & Social -->
        <div class="lg:col-span-3 space-y-3">
          <h5 class="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-700 pb-2">যোগাযোগের ঠিকানা</h5>
          <div class="text-xs text-slate-400 space-y-2">
            <p><i class="fa-solid fa-location-dot text-emerald-400 mr-1.5"></i> ${escapeHtml(info.address_bn)}</p>
            <p><i class="fa-solid fa-phone text-emerald-400 mr-1.5"></i> <a href="tel:${escapeHtml(info.contact_primary)}" class="hover:text-white font-mono">${escapeHtml(info.contact_primary)}</a></p>
            <p><i class="fa-solid fa-envelope text-emerald-400 mr-1.5"></i> <a href="mailto:${escapeHtml(info.official_email)}" class="hover:text-white">${escapeHtml(info.official_email)}</a></p>
            <div class="pt-2">
              <a href="${escapeHtml(info.social_facebook)}" target="_blank" rel="noopener noreferrer" 
                 class="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300">
                <i class="fa-brands fa-facebook text-base"></i>
                <span>অফিসিয়াল ফেসবুক পেজ</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Credits: Powered by Celloscope & Copyright -->
      <div class="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>© ${escapeHtml(info.established_year)}–২০২৬ ${escapeHtml(info.name_bn)}। সর্বস্বত্ব সংরক্ষিত।</p>
        <div class="flex items-center gap-2 text-slate-400">
          <span>কারিগরি সহযোগিতায়</span>
          <a href="${escapeHtml(branding.celloscope.website_url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <img src="${escapeHtml(branding.celloscope.logo)}" alt="Celloscope" class="h-5 w-auto object-contain filter brightness-125" />
            <strong class="text-slate-300">Celloscope</strong>
          </a>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   MODULE: Modals & Lightbox (নোটিশ পপআপ ও ফুল-স্ক্রিন ফটো লাইটবক্স)
   ========================================================================== */
function initModals(data) {
  // Global Notice Modal
  window.openNoticeModal = function(noticeId) {
    if (!data.notices) return;
    const notice = data.notices.find(n => n.id === noticeId);
    if (!notice) return;

    const modal = document.getElementById('notice-detail-modal');
    const content = document.getElementById('notice-modal-content');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <span class="text-xs font-bold px-3 py-1 rounded-full ${getCategoryBadgeClass(notice.category)}">
            ${escapeHtml(notice.category_label_bn || notice.category)}
          </span>
          <span class="text-xs text-slate-500 font-medium">তারিখ: ${formatNoticeDateFullBn(notice.date_iso)}</span>
        </div>
        <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-snug">
          ${escapeHtml(notice.title_bn)}
        </h3>
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          ${escapeHtml(notice.content_bn || notice.summary_bn)}
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <span class="text-slate-500">স্মারক নং: GAUHS/NOT/${escapeHtml(notice.id)}</span>
          <button onclick="downloadNoticePdf('${escapeHtml(notice.id)}')" class="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2">
            <i class="fa-solid fa-file-pdf"></i>
            <span>অফিসিয়াল কপি ডাউনলোড</span>
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeNoticeModal = function() {
    const modal = document.getElementById('notice-detail-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // Global Gallery Lightbox
  window.openGalleryLightboxByUrl = function(imageUrl, caption) {
    const modal = document.getElementById('gallery-lightbox-modal');
    const imgEl = document.getElementById('lightbox-image');
    const capEl = document.getElementById('lightbox-caption');

    if (!modal || !imgEl) return;

    imgEl.src = imageUrl;
    if (capEl) capEl.textContent = caption || '';

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeGalleryLightbox = function() {
    const modal = document.getElementById('gallery-lightbox-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };
}

/* ==========================================================================
   HELPER UTILITIES (তারিখ ফরম্যাটিং ও সিকিউর এস্কেপ)
   ========================================================================== */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
function toBnDigits(numStr) {
  return String(numStr).replace(/\d/g, d => bnDigits[Number(d)]);
}

const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const bnMonthsShort = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

function formatNoticeDayBn(isoStr) {
  if (!isoStr) return '০১';
  const parts = isoStr.split('-');
  return toBnDigits(parts[2] || '01');
}

function formatNoticeMonthBn(isoStr) {
  if (!isoStr) return 'জানু';
  const parts = isoStr.split('-');
  const monthIdx = parseInt(parts[1], 10) - 1;
  return bnMonthsShort[monthIdx] || 'জানু';
}

function formatNoticeDateFullBn(isoStr) {
  if (!isoStr) return '০১ জানুয়ারি ২০২৬';
  const parts = isoStr.split('-');
  const year = toBnDigits(parts[0]);
  const month = bnMonths[parseInt(parts[1], 10) - 1] || 'জানুয়ারি';
  const day = toBnDigits(parts[2]);
  return `${day} ${month} ${year}`;
}

function getCategoryBadgeClass(category) {
  switch ((category || '').toLowerCase()) {
    case 'academic': return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'exam': return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'events': return 'bg-purple-100 text-purple-800 border border-purple-200';
    case 'admission': return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default: return 'bg-slate-100 text-slate-800 border border-slate-200';
  }
}

window.downloadNoticePdf = function(noticeId) {
  alert(`নোটিশ আইডি: ${noticeId}\nঅফিসিয়াল পিডিএফ কপি ডাউনলোড প্রক্রিয়া সম্পন্ন হয়েছে।`);
};

window.downloadResourceMock = function(title) {
  alert(`"${title}" ফাইলটি ডাউনলোড হচ্ছে। অনুগ্রহ করে অপেক্ষা করুন।`);
};
