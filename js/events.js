/**
 * Gurbhakot United Secondary School
 * Events Module
 * 
 * Loads event records from data/events.json, filters by category,
 * renders on both events.html and the homepage upcoming events preview.
 */

const EventsModule = (function() {
    let allEvents = [];
    let currentCategory = 'all';

    async function init() {
        const fullListEl = document.getElementById('eventsListGrid');
        const homeListEl = document.getElementById('homepageEventsList');

        if (!fullListEl && !homeListEl) return;

        showLoading();

        try {
            allEvents = await window.fetchJSON('data/events.json');
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
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        const msg = lang === 'np' ? 'कार्यक्रमहरू लोड हुँदैछ...' : 'Loading events...';
        const fullListEl = document.getElementById('eventsListGrid');
        const homeListEl = document.getElementById('homepageEventsList');

        const html = `<div class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-muted);">
            <p>${msg}</p>
        </div>`;

        if (fullListEl) fullListEl.innerHTML = html;
        if (homeListEl) homeListEl.innerHTML = html;
    }

    function showError() {
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        const msg = lang === 'np' 
            ? 'कार्यक्रम विवरण लोड गर्न सकिएन।' 
            : 'Unable to load school events. Please try again later.';

        const html = `<div class="result-not-found" style="grid-column: 1/-1; margin: 20px auto;">
            <p><strong>${msg}</strong></p>
        </div>`;

        const fullListEl = document.getElementById('eventsListGrid');
        const homeListEl = document.getElementById('homepageEventsList');

        if (fullListEl) fullListEl.innerHTML = html;
        if (homeListEl) homeListEl.innerHTML = html;
    }

    function setupFilters() {
        const filterBtns = document.querySelectorAll('.event-filter-btn');
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
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';

        // Homepage Events Preview (Top 3)
        const homeListEl = document.getElementById('homepageEventsList');
        if (homeListEl) {
            const top3 = allEvents.slice(0, 3);
            homeListEl.innerHTML = top3.map(ev => buildEventCard(ev, lang)).join('');
        }

        // Full Events Grid
        const fullListEl = document.getElementById('eventsListGrid');
        if (fullListEl) {
            const filtered = allEvents.filter(ev => {
                if (currentCategory === 'all') return true;
                return ev.category === currentCategory;
            });

            if (filtered.length === 0) {
                fullListEl.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                    <p style="color: var(--text-muted);">${lang === 'np' ? 'कुनै कार्यक्रम फेला परेन।' : 'No events found.'}</p>
                </div>`;
            } else {
                fullListEl.innerHTML = filtered.map(ev => buildEventCard(ev, lang)).join('');
            }
        }
    }

    function buildEventCard(ev, lang) {
        const title = lang === 'np' ? ev.titleNepali : ev.titleEnglish;
        const desc = lang === 'np' ? ev.shortDescNepali : ev.shortDescEnglish;
        const category = lang === 'np' ? ev.categoryNepali : ev.categoryEnglish;
        const location = lang === 'np' ? ev.locationNepali : ev.locationEnglish;

        return `
            <div class="event-card">
                <div class="event-image-box">
                    <img src="${ev.image || 'images/gallery/gallery-events.svg'}" alt="${escapeHTML(title)}" class="event-image" />
                    <span class="event-date-chip">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline; margin-right:4px;">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        ${escapeHTML(ev.date)}
                    </span>
                </div>
                <div class="event-body">
                    <span class="event-category-badge">${escapeHTML(category)}</span>
                    <h4 class="event-title">${escapeHTML(title)}</h4>
                    <p class="event-description">${escapeHTML(desc)}</p>
                    <div class="event-footer">
                        <span>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline; vertical-align:middle;">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            ${escapeHTML(location)}
                        </span>
                        <span>${escapeHTML(ev.time || '')}</span>
                    </div>
                </div>
            </div>
        `;
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', EventsModule.init);
