/**
 * Gurbhakot United Secondary School
 * Teachers & Staff Directory Module
 * 
 * Fetches staff data from data/teachers.json and displays cards with
 * photo, name, position, and mobile placeholders.
 */

const TeacherModule = (function() {
    let allTeachers = [];
    let currentDepartment = 'all';

    async function init() {
        const gridEl = document.getElementById('teachersGrid');
        if (!gridEl) return;

        showLoading();

        try {
            allTeachers = await window.fetchJSON('data/teachers.json');
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
        const gridEl = document.getElementById('teachersGrid');
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        if (gridEl) {
            gridEl.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px; color: var(--text-muted);">
                <p>${lang === 'np' ? 'शिक्षक तथा कर्मचारी विवरण लोड हुँदैछ...' : 'Loading teachers and staff directory...'}</p>
            </div>`;
        }
    }

    function showError() {
        const gridEl = document.getElementById('teachersGrid');
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        if (gridEl) {
            gridEl.innerHTML = `<div class="result-not-found" style="grid-column: 1/-1; margin: 20px auto;">
                <p><strong>${lang === 'np' ? 'विवरण लोड गर्न सकिएन। कृपया पुनः प्रयास गर्नुहोस्।' : 'Unable to load staff directory. Please try again later.'}</strong></p>
            </div>`;
        }
    }

    function setupFilters() {
        const filterBtns = document.querySelectorAll('.teacher-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentDepartment = this.getAttribute('data-dept') || 'all';
                render();
            });
        });
    }

    function render() {
        const gridEl = document.getElementById('teachersGrid');
        if (!gridEl) return;

        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        
        const filtered = allTeachers.filter(t => {
            if (currentDepartment === 'all') return true;
            return t.department === currentDepartment;
        });

        if (filtered.length === 0) {
            gridEl.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                <p style="color: var(--text-muted);">${lang === 'np' ? 'कुनै विवरण फेला परेन।' : 'No records found.'}</p>
            </div>`;
            return;
        }

        gridEl.innerHTML = filtered.map(t => {
            const name = lang === 'np' ? t.nameNepali : t.nameEnglish;
            const role = lang === 'np' ? t.roleNepali : t.roleEnglish;
            const dept = lang === 'np' ? t.departmentNepali : t.departmentEnglish;
            const qual = lang === 'np' ? t.qualificationNepali : t.qualificationEnglish;
            const mobileLabel = lang === 'np' ? 'मोबाइल:' : 'Mobile:';
            const emailLabel = lang === 'np' ? 'इमेल:' : 'Email:';
            const deptLabel = lang === 'np' ? 'विभाग:' : 'Department:';

            return `
                <div class="teacher-card">
                    <div class="teacher-photo-box">
                        <img src="${t.photo || 'images/teachers/teacher-placeholder.svg'}" alt="${escapeHTML(name)}" class="teacher-photo" />
                    </div>
                    <div class="teacher-details">
                        <h4 class="teacher-name">${escapeHTML(name)}</h4>
                        <div class="teacher-role">${escapeHTML(role)}</div>
                        
                        <div class="teacher-meta-list">
                            <div class="teacher-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                </svg>
                                <span><strong>${deptLabel}</strong> ${escapeHTML(dept)}</span>
                            </div>
                            ${t.subjectNepali ? `
                            <div class="teacher-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                <span><strong>${lang === 'np' ? 'विषय:' : 'Subject:'}</strong> ${escapeHTML(lang === 'np' ? t.subjectNepali : t.subjectEnglish)}</span>
                            </div>
                            ` : ''}
                            <div class="teacher-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span><strong>${mobileLabel}</strong> ${escapeHTML(t.mobile)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', TeacherModule.init);
