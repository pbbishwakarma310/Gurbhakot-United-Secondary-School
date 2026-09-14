/**
 * Gurbhakot United Secondary School
 * Download Center Module
 * 
 * Fetches downloadable documents from data/downloads.json,
 * filters by category, and provides direct download triggers.
 */

const DownloadsModule = (function() {
    let allDownloads = [];
    let currentCategory = 'all';

    async function init() {
        const tableBody = document.getElementById('downloadsTableBody');
        if (!tableBody) return;

        showLoading();

        try {
            allDownloads = await window.fetchJSON('data/downloads.json');
            render();
            setupFilters();
        } catch (err) {
            showError();
        }

        window.addEventListener('languageChanged', function() {
            render();
        });
    }

    function showLoading() {
        const tableBody = document.getElementById('downloadsTableBody');
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        if (tableBody) {
            tableBody.innerHTML = `<tr>
                <td colspan="5" class="text-center" style="padding: 40px; color: var(--text-muted);">
                    ${lang === 'np' ? 'डाउनलोड सामग्री लोड हुँदैछ...' : 'Loading downloadable documents...'}
                </td>
            </tr>`;
        }
    }

    function showError() {
        const tableBody = document.getElementById('downloadsTableBody');
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        if (tableBody) {
            tableBody.innerHTML = `<tr>
                <td colspan="5" class="text-center" style="padding: 30px; color: var(--accent-red);">
                    ${lang === 'np' ? 'डाउनलोड सूची लोड गर्न सकिएन।' : 'Unable to load downloads list.'}
                </td>
            </tr>`;
        }
    }

    function setupFilters() {
        const filterBtns = document.querySelectorAll('.download-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentCategory = this.getAttribute('data-category') || 'all';
                render();
            });
        });
    }

    function render() {
        const tableBody = document.getElementById('downloadsTableBody');
        if (!tableBody) return;

        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';

        const filtered = allDownloads.filter(d => {
            if (currentCategory === 'all') return true;
            return d.category === currentCategory;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr>
                <td colspan="5" class="text-center" style="padding: 40px; color: var(--text-muted);">
                    ${lang === 'np' ? 'कुनै फाइल फेला परेन।' : 'No files found in this category.'}
                </td>
            </tr>`;
            return;
        }

        const downloadBtnText = lang === 'np' ? 'डाउनलोड' : 'Download';

        tableBody.innerHTML = filtered.map((item, idx) => {
            const title = lang === 'np' ? item.titleNepali : item.titleEnglish;
            const category = lang === 'np' ? item.categoryNepali : item.categoryEnglish;

            return `
                <tr>
                    <td style="text-align:center; font-weight:700;">${idx + 1}</td>
                    <td>
                        <div style="font-weight: 700; color: var(--primary-blue); font-size: 0.95rem;">
                            ${escapeHTML(title)}
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">
                            PDF Document • ${item.fileSize || '200 KB'}
                        </div>
                    </td>
                    <td>
                        <span class="category-badge cat-general" style="font-size: 0.8rem;">
                            ${escapeHTML(category)}
                        </span>
                    </td>
                    <td style="color: var(--text-muted); font-size: 0.88rem;">${escapeHTML(item.date)}</td>
                    <td style="text-align: right;">
                        <a href="${item.file}" download class="btn btn-outline-primary btn-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            ${downloadBtnText}
                        </a>
                    </td>
                </tr>
            `;
        }).join('');
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', DownloadsModule.init);
