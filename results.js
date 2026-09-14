/**
 * Gurbhakot United Secondary School
 * Student Result Search System
 * 
 * Searches student marksheet from data/results.json by Roll Number only.
 * Protects student privacy by never rendering the entire dataset at once.
 */

const ResultModule = (function() {
    let resultsData = [];
    let currentFoundResult = null;

    async function init() {
        const searchBtn = document.getElementById('searchResultBtn');
        const rollInput = document.getElementById('rollNumberInput');
        const resultOutput = document.getElementById('resultDisplayArea');

        if (!searchBtn || !rollInput) return;

        // Load data silently in background
        try {
            resultsData = await window.fetchJSON('data/results.json');
        } catch (err) {
            console.warn('Could not load results.json via fetch:', err);
        }

        // Search trigger on button click
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });

        // Search trigger on Enter key
        rollInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        // Re-render current result if language changes
        window.addEventListener('languageChanged', function() {
            if (currentFoundResult) {
                renderMarksheet(currentFoundResult);
            }
        });
    }

    async function performSearch() {
        const rollInput = document.getElementById('rollNumberInput');
        const resultOutput = document.getElementById('resultDisplayArea');
        if (!rollInput || !resultOutput) return;

        const rollNumber = rollInput.value.trim();
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';

        if (!rollNumber) {
            const emptyNotice = lang === 'np' 
                ? 'कृपया आफ्नो रोल नम्बर प्रविष्ट गर्नुहोस्।' 
                : 'Please enter your roll number.';
            resultOutput.innerHTML = `
                <div class="result-not-found">
                    <h4>${emptyNotice}</h4>
                    <p style="font-size: 0.9rem;">(उदा: 101, 102, 201)</p>
                </div>
            `;
            return;
        }

        // If resultsData wasn't loaded initially (e.g. offline/file protocol retry), try fetching again
        if (!resultsData || resultsData.length === 0) {
            try {
                resultsData = await window.fetchJSON('data/results.json');
            } catch (err) {
                console.error(err);
            }
        }

        // Match roll number case-insensitively
        const match = (resultsData || []).find(r => String(r.rollNumber).toLowerCase() === rollNumber.toLowerCase());

        if (match) {
            currentFoundResult = match;
            renderMarksheet(match);
        } else {
            currentFoundResult = null;
            renderNotFound();
        }
    }

    function renderNotFound() {
        const resultOutput = document.getElementById('resultDisplayArea');
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';

        const msgTitle = lang === 'np' 
            ? 'Result भेटिएन। कृपया रोल नम्बर जाँच गर्नुहोस्।' 
            : 'Result not found. Please check the roll number.';
        
        const msgSub = lang === 'np'
            ? 'तपाईंले प्रविष्ट गर्नुभएको रोल नम्बरको नतिजा फेला परेन। कृपया सही रोल नम्बर (उदा: 101, 102, 201) प्रविष्ट गर्नुहोस् वा विद्यालय प्रशासनमा सम्पर्क गर्नुहोस्।'
            : 'No examination record was found matching this roll number. Please verify your roll number (e.g. 101, 102, 201) or contact the school office.';

        resultOutput.innerHTML = `
            <div class="result-not-found">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 12px; color: #dc2626;">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <h4>${msgTitle}</h4>
                <p style="font-size: 0.9rem; max-width: 500px; margin: 0 auto;">${msgSub}</p>
            </div>
        `;
    }

    function renderMarksheet(res) {
        const resultOutput = document.getElementById('resultDisplayArea');
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';

        const studentName = lang === 'np' ? (res.studentNameNepali || res.studentNameEnglish) : res.studentNameEnglish;
        const examTitle = lang === 'np' ? (res.examTitleNepali || res.examTitleEnglish) : res.examTitleEnglish;
        const status = lang === 'np' ? (res.statusNepali || 'उत्तीर्ण') : (res.statusEnglish || 'Passed');
        
        // Subject rows
        const subjectRows = (res.subjects || []).map((sub, idx) => {
            const subTitle = lang === 'np' ? (sub.subjectNepali || sub.subjectEnglish) : sub.subjectEnglish;
            return `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${escapeHTML(subTitle)}</td>
                    <td>${sub.fullMarks || 100}</td>
                    <td>${sub.passMarks || 35}</td>
                    <td><strong>${sub.marks}</strong></td>
                    <td><span class="status-badge-pass" style="font-size: 0.8rem; padding: 2px 8px;">${sub.grade || 'A'}</span></td>
                </tr>
            `;
        }).join('');

        const demoBadge = res.isDemo ? `
            <div style="text-align: center; margin-bottom: 12px;">
                <span class="demo-watermark">
                    ${lang === 'np' ? '★ नमुना नतिजा (DEMO RESULT) ★' : '★ DEMO RESULT RECORD ★'}
                </span>
            </div>
        ` : '';

        const printBtnText = lang === 'np' ? 'प्रिन्ट गर्नुहोस् / डाउनलोड' : 'Print Marksheet';

        resultOutput.innerHTML = `
            <div class="marksheet-card" id="printableMarksheet">
                ${demoBadge}
                
                <div class="marksheet-header">
                    <img src="images/logo/logo.svg" alt="School Emblem" class="marksheet-logo" />
                    <h3 class="marksheet-school-title">
                        ${lang === 'np' ? 'गुर्भाकोट युनाइटेड माध्यमिक विद्यालय' : 'Gurbhakot United Secondary School'}
                    </h3>
                    <p class="marksheet-sub">
                        ${lang === 'np' ? 'गुर्भाकोट नगरपालिका–९, बोटेचौर, सुर्खेत, नेपाल' : 'Gurbhakot Municipality-9, Botechaur, Surkhet, Nepal'}
                    </p>
                    <h4 class="marksheet-exam-name">${escapeHTML(examTitle)}</h4>
                </div>

                <div class="student-meta-grid">
                    <div class="student-meta-item">
                        <strong>${lang === 'np' ? 'विद्यार्थीको नाम:' : 'Student Name:'}</strong>
                        <span>${escapeHTML(studentName)}</span>
                    </div>
                    <div class="student-meta-item">
                        <strong>${lang === 'np' ? 'रोल नम्बर:' : 'Roll Number:'}</strong>
                        <span>${escapeHTML(res.rollNumber)}</span>
                    </div>
                    <div class="student-meta-item">
                        <strong>${lang === 'np' ? 'कक्षा:' : 'Class:'}</strong>
                        <span>Grade ${escapeHTML(res.class)} ${res.section ? '(' + res.section + ')' : ''}</span>
                    </div>
                    <div class="student-meta-item">
                        <strong>${lang === 'np' ? 'शैक्षिक सत्र:' : 'Academic Year:'}</strong>
                        <span>${escapeHTML(res.academicYear || '2081/2082')}</span>
                    </div>
                </div>

                <div style="overflow-x: auto;">
                    <table class="marksheet-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>${lang === 'np' ? 'विषय' : 'Subject'}</th>
                                <th>${lang === 'np' ? 'पूर्णाङ्क' : 'Full Marks'}</th>
                                <th>${lang === 'np' ? 'उत्तीर्णाङ्क' : 'Pass Marks'}</th>
                                <th>${lang === 'np' ? 'प्राप्ताङ्क' : 'Marks Obtained'}</th>
                                <th>${lang === 'np' ? 'ग्रेड' : 'Grade'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjectRows}
                        </tbody>
                    </table>
                </div>

                <div class="marksheet-summary">
                    <div>
                        <div class="summary-box-val">${res.totalMarksObtained} / ${res.totalFullMarks || 500}</div>
                        <div class="summary-box-lbl">${lang === 'np' ? 'कुल प्राप्ताङ्क' : 'Total Marks'}</div>
                    </div>
                    <div>
                        <div class="summary-box-val">${res.percentage}%</div>
                        <div class="summary-box-lbl">${lang === 'np' ? 'प्रतिशत' : 'Percentage'}</div>
                    </div>
                    <div>
                        <div class="summary-box-val">${res.gpa || res.grade}</div>
                        <div class="summary-box-lbl">${lang === 'np' ? 'जिपिए / ग्रेड' : 'GPA / Grade'}</div>
                    </div>
                    <div>
                        <div class="summary-box-val" style="font-size: 1rem; padding-top: 4px;">
                            <span class="status-badge-pass">${escapeHTML(status)}</span>
                        </div>
                        <div class="summary-box-lbl">${lang === 'np' ? 'नतिजा स्थिति' : 'Result Status'}</div>
                    </div>
                </div>

                <div style="text-align: right; margin-top: 20px;">
                    <button class="btn btn-outline-primary btn-sm" onclick="window.print()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                        </svg>
                        ${printBtnText}
                    </button>
                </div>
            </div>
        `;

        // Smooth scroll to marksheet
        resultOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', ResultModule.init);
