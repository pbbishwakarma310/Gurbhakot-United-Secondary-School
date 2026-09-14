/**
 * Gurbhakot United Secondary School
 * Notice Board Module
 * 
 * Fetches notices from data/notices.json, sorts newest first,
 * filters by category, provides text search, and renders bilingual notices.
 */

const NoticeModule = (function() {
    let allNotices = [];
    let currentCategory = 'all';
    let searchQuery = '';

    async function init() {
        const fullNoticeListEl = document.getElementById('fullNoticeList');
        const homeNoticeListEl = document.getElementById('homepageNoticesList');

        if (!fullNoticeListEl && !homeNoticeListEl) return;

        showLoading();

        try {
            const data = await window.fetchJSON('data/notices.json');
            // Sort newest first by date string
            allNotices = data.sort((a, b) => new Date(b.date) - new Date(a.date));
            render();
            setupEvents();
        } catch (err) {
            showError();
        }

        // Listen for language switch
        window.addEventListener('languageChanged', function() {
            render();
        });
    }

    function showLoading() {
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        const msg = lang === 'np' ? 'सूचना लोड हुँदैछ...' : 'Loading notices...';
        const fullNoticeListEl = document.getElementById('fullNoticeList');
        const homeNoticeListEl = document.getElementById('homepageNoticesList');

        const loadingHtml = `<div class="text-center" style="padding: 40px; color: var(--text-muted);">
            <p>${msg}</p>
        </div>`;

        if (fullNoticeListEl) fullNoticeListEl.innerHTML = loadingHtml;
        if (homeNoticeListEl) homeNoticeListEl.innerHTML = loadingHtml;
    }

    function showError() {
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        const msg = lang === 'np' 
            ? 'सूचना लोड गर्न सकिएन। कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।' 
            : 'Unable to load notices. Please try again later.';

        const errorHtml = `<div class="result-not-found" style="margin: 20px auto;">
            <p><strong>${msg}</strong></p>
            <p style="font-size: 0.85rem; margin-top: 8px; color: var(--text-muted);">
                (Local browser tip: When viewing locally, please use a local server like VS Code Live Server so JSON files can be read).
            </p>
        </div>`;

        const fullNoticeListEl = document.getElementById('fullNoticeList');
        const homeNoticeListEl = document.getElementById('homepageNoticesList');

        if (fullNoticeListEl) fullNoticeListEl.innerHTML = errorHtml;
        if (homeNoticeListEl) homeNoticeListEl.innerHTML = errorHtml;
    }

    function setupEvents() {
        // Category Filter Buttons
        const filterBtns = document.querySelectorAll('.notice-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.getAttribute('data-category') || 'all';
                render();
            });
        });

        // Search Input
        const searchInput = document.getElementById('noticeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                searchQuery = e.target.value.toLowerCase().trim();
                render();
            });
        }
    }

    function getFilteredNotices() {
        return allNotices.filter(notice => {
            const matchesCat = currentCategory === 'all' || notice.category === currentCategory;
            if (!matchesCat) return false;

            if (!searchQuery) return true;

            const tNp = (notice.titleNepali || '').toLowerCase();
            const tEn = (notice.titleEnglish || '').toLowerCase();
            const dNp = (notice.descriptionNepali || '').toLowerCase();
            const dEn = (notice.descriptionEnglish || '').toLowerCase();

            return tNp.includes(searchQuery) || tEn.includes(searchQuery) ||
                   dNp.includes(searchQuery) || dEn.includes(searchQuery);
        });
    }

    function render() {
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        const filtered = getFilteredNotices();

        // Render Homepage Notices (Top 5)
        const homeList = document.getElementById('homepageNoticesList');
        if (homeList) {
            const top5 = allNotices.slice(0, 5);
            if (top5.length === 0) {
                homeList.innerHTML = `<p class="text-center" style="padding: 20px;">${lang === 'np' ? 'कुनै सूचना उपलब्ध छैन।' : 'No notices available.'}</p>`;
            } else {
                homeList.innerHTML = top5.map(notice => buildNoticeCardHTML(notice, lang)).join('');
            }
        }

        // Render Full Notice Page List
        const fullList = document.getElementById('fullNoticeList');
        if (fullList) {
            if (filtered.length === 0) {
                const emptyMsg = lang === 'np' ? 'कुनै सूचना फेला परेन।' : 'No notices match your criteria.';
                fullList.innerHTML = `<div class="text-center" style="padding: 40px; background: var(--white); border-radius: var(--radius-md); border: 1px solid var(--border-light);">
                    <p style="color: var(--text-muted); font-size: 1.05rem;">${emptyMsg}</p>
                </div>`;
            } else {
                fullList.innerHTML = filtered.map(notice => buildNoticeCardHTML(notice, lang)).join('');
            }
        }
    }

    function buildNoticeCardHTML(notice, lang) {
        const title = lang === 'np' ? notice.titleNepali : notice.titleEnglish;
        const desc = lang === 'np' ? notice.descriptionNepali : notice.descriptionEnglish;
        const categoryName = lang === 'np' ? (notice.categoryNepali || notice.category) : (notice.categoryEnglish || notice.category);
        const downloadText = lang === 'np' ? 'संलग्न फाइल डाउनलोड' : 'Download Attachment';

        // Parse Date
        const dateObj = new Date(notice.date);
        const day = dateObj.getDate() || '—';
        const monthNamesEn = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const monthNamesNp = ["वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुस", "माघ", "फागुन", "चैत"];
        
        const month = lang === 'np' ? (monthNamesNp[dateObj.getMonth()] || 'मिति') : (monthNamesEn[dateObj.getMonth()] || 'DATE');
        const year = dateObj.getFullYear() || '';

        // Category Class
        let catClass = 'cat-general';
        if (notice.category === 'exam') catClass = 'cat-exam';
        else if (notice.category === 'result') catClass = 'cat-result';
        else if (notice.category === 'holiday') catClass = 'cat-holiday';
        else if (notice.category === 'admission') catClass = 'cat-admission';

        const attachmentBtn = notice.attachment ? `
            <a href="${notice.attachment}" target="_blank" download class="btn btn-outline-primary btn-sm" style="margin-top: 10px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                ${downloadText}
            </a>
        ` : '';

        return `
            <div class="notice-card">
                <div class="notice-date-badge">
                    <span class="ndb-day">${day}</span>
                    <span class="ndb-month">${month}</span>
                    <span style="font-size: 0.7rem; opacity: 0.8;">${year}</span>
                </div>
                <div class="notice-body">
                    <div class="notice-meta">
                        <span class="category-badge ${catClass}">${categoryName}</span>
                    </div>
                    <h4>${escapeHTML(title)}</h4>
                    <p class="notice-desc">${escapeHTML(desc)}</p>
                    ${attachmentBtn}
                </div>
            </div>
        `;
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', NoticeModule.init);
