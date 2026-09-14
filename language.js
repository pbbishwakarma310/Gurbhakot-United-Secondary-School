/**
 * Gurbhakot United Secondary School
 * Bilingual Language Engine (नेपाली / English)
 * 
 * Manages language switching, localStorage persistence, and DOM updates.
 */

const LanguageManager = (function() {
    const STORAGE_KEY = 'guss_language_pref';
    const DEFAULT_LANG = 'np'; // 'np' for Nepali, 'en' for English
    let currentLang = DEFAULT_LANG;

    // Common translation strings for dynamic JS modules
    const translations = {
        np: {
            loading: "लोड हुँदैछ...",
            loadError: "डाटा लोड गर्न सकिएन। कृपया केही समयपछि पुनः प्रयास गर्नुहोस्।",
            noDataFound: "कुनै विवरण फेला परेन।",
            viewAll: "सबै हेर्नुहोस्",
            download: "डाउनलोड गर्नुहोस्",
            viewDetails: "विवरण हेर्नुहोस्",
            resultNotFound: "Result भेटिएन। कृपया रोल नम्बर जाँच गर्नुहोस्।",
            searchResultBtn: "Result खोज्नुहोस्",
            enterRollPlaceholder: "रोल नम्बर प्रविष्ट गर्नुहोस् (उदा: 101, 102, 201)",
            submitApplication: "आवेदन पेश गर्नुहोस्",
            submitting: "पेश गरिँदैछ...",
            successAdmissionTitle: "आवेदन सफलतापूर्वक प्राप्त भयो!",
            successAdmissionMsg: "तपाईंको भर्ना आवेदन फाराम सुरक्षित गरिएको छ। विद्यालय प्रशासनले चाँडै सम्पर्क गर्नेछ।",
            phoneRequired: "कृपया सही १० अङ्कको मोबाइल नम्बर राख्नुहोस्।",
            requiredField: "यो विवरण अनिवार्य छ।",
            all: "सबै",
            exam: "परीक्षा तालिका",
            result: "नतिजा",
            holiday: "बिदा सूचना",
            admission: "भर्ना सूचना",
            general: "सामान्य सूचना",
            sports: "खेलकुद",
            cultural: "सांस्कृतिक",
            parentsMeeting: "अभिभावक भेला",
            educational: "शैक्षिक",
            schoolCategory: "विद्यालय",
            classroomCategory: "कक्षाकोठा",
            studentsCategory: "विद्यार्थीहरू",
            teachersCategory: "शिक्षकहरू"
        },
        en: {
            loading: "Loading...",
            loadError: "Unable to load data. Please try again later.",
            noDataFound: "No records found.",
            viewAll: "View All",
            download: "Download",
            viewDetails: "View Details",
            resultNotFound: "Result not found. Please check the roll number.",
            searchResultBtn: "Search Result",
            enterRollPlaceholder: "Enter Roll Number (e.g. 101, 102, 201)",
            submitApplication: "Submit Application",
            submitting: "Submitting...",
            successAdmissionTitle: "Application Submitted Successfully!",
            successAdmissionMsg: "Your online admission application has been recorded. The school administration will contact you soon.",
            phoneRequired: "Please enter a valid 10-digit mobile number.",
            requiredField: "This field is required.",
            all: "All",
            exam: "Exam Routine",
            result: "Result",
            holiday: "Holiday Notice",
            admission: "Admission Notice",
            general: "General Notice",
            sports: "Sports",
            cultural: "Cultural",
            parentsMeeting: "Parents Meeting",
            educational: "Educational",
            schoolCategory: "School Campus",
            classroomCategory: "Classroom",
            studentsCategory: "Students",
            teachersCategory: "Teachers"
        }
    };

    function init() {
        // Retrieve saved language or default to Nepali
        const savedLang = localStorage.getItem(STORAGE_KEY);
        if (savedLang === 'en' || savedLang === 'np') {
            currentLang = savedLang;
        } else {
            currentLang = DEFAULT_LANG;
        }

        applyLanguage(currentLang);
        setupButtons();
    }

    function setLanguage(lang) {
        if (lang !== 'np' && lang !== 'en') return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyLanguage(lang);

        // Notify other modules that language changed
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: currentLang } }));
    }

    function applyLanguage(lang) {
        document.documentElement.lang = lang === 'np' ? 'ne' : 'en';

        // Update elements with data-np and data-en attributes
        const translatableElements = document.querySelectorAll('[data-np][data-en]');
        translatableElements.forEach(el => {
            const text = lang === 'np' ? el.getAttribute('data-np') : el.getAttribute('data-en');
            if (text !== null) {
                // If the element has child nodes (like icons), we can target a span or replace innerHTML if simple
                if (el.dataset.targetProp === 'placeholder') {
                    el.placeholder = text;
                } else if (el.dataset.targetProp === 'title') {
                    el.title = text;
                } else if (el.dataset.keepChildren === 'true') {
                    // Update only direct text nodes
                    const textSpan = el.querySelector('.lang-text');
                    if (textSpan) {
                        textSpan.textContent = text;
                    } else {
                        el.textContent = text;
                    }
                } else {
                    el.textContent = text;
                }
            }
        });

        // Update placeholders
        const placeholderElements = document.querySelectorAll('[data-np-placeholder][data-en-placeholder]');
        placeholderElements.forEach(el => {
            el.placeholder = lang === 'np' 
                ? el.getAttribute('data-np-placeholder') 
                : el.getAttribute('data-en-placeholder');
        });

        // Update language toggle buttons active state
        const npBtns = document.querySelectorAll('.lang-btn-np');
        const enBtns = document.querySelectorAll('.lang-btn-en');
        npBtns.forEach(b => b.classList.toggle('active', lang === 'np'));
        enBtns.forEach(b => b.classList.toggle('active', lang === 'en'));
    }

    function setupButtons() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('.lang-btn');
            if (!target) return;
            const chosenLang = target.getAttribute('data-lang');
            if (chosenLang) {
                setLanguage(chosenLang);
            }
        });
    }

    function getLang() {
        return currentLang;
    }

    function getText(key) {
        return (translations[currentLang] && translations[currentLang][key]) || key;
    }

    return {
        init: init,
        setLanguage: setLanguage,
        getLang: getLang,
        getText: getText
    };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    LanguageManager.init();
});
