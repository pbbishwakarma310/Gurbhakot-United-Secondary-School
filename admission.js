/**
 * Gurbhakot United Secondary School
 * Online Admission Form & Validation Module
 * 
 * Validates student admission inputs, manages client-side submission feedback,
 * and provides a clear configuration point for future backend/API integration.
 */

const AdmissionModule = (function() {

    /* =========================================================================
       BACKEND INTEGRATION CONFIGURATION
       To connect a real backend/API/Google Apps Script/Email endpoint later:
       1. Change API_ENDPOINT to your backend URL.
       2. Change USE_REAL_BACKEND to true.
       ========================================================================= */
    const ADMISSION_CONFIG = {
        USE_REAL_BACKEND: false,
        API_ENDPOINT: (typeof SCHOOL_CONFIG !== 'undefined' && SCHOOL_CONFIG.admissionApiEndpoint) 
                        ? SCHOOL_CONFIG.admissionApiEndpoint 
                        : "https://your-api-endpoint.com/api/admissions",
        LOCAL_STORAGE_KEY: "guss_admission_submissions"
    };

    function init() {
        const form = document.getElementById('admissionForm');
        if (!form) return;

        form.addEventListener('submit', handleFormSubmit);

        // Clear error on input
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';

        // Extract form values
        const studentName = form.studentName.value.trim();
        const dob = form.dob.value.trim();
        const studentClass = form.studentClass.value.trim();
        const parentName = form.parentName.value.trim();
        const phone = form.phone.value.trim();
        const address = form.address.value.trim();
        const stream = form.stream ? form.stream.value.trim() : '';

        // Validation
        let isValid = true;

        if (!studentName) {
            setFieldError(form.studentName, lang === 'np' ? 'कृपया विद्यार्थीको नाम प्रविष्ट गर्नुहोस्।' : 'Please enter student full name.');
            isValid = false;
        }

        if (!dob) {
            setFieldError(form.dob, lang === 'np' ? 'कृपया जन्म मिति छनोट गर्नुहोस्।' : 'Please select date of birth.');
            isValid = false;
        }

        if (!studentClass) {
            setFieldError(form.studentClass, lang === 'np' ? 'कृपया कक्षा छनोट गर्नुहोस्।' : 'Please select class.');
            isValid = false;
        }

        if (!parentName) {
            setFieldError(form.parentName, lang === 'np' ? 'कृपया अभिभावकको नाम प्रविष्ट गर्नुहोस्।' : 'Please enter parent/guardian name.');
            isValid = false;
        }

        // Phone validation (Must be at least 10 digits)
        const cleanPhone = phone.replace(/[\s-]/g, '');
        const phoneRegex = /^[0-9]{10}$/;
        if (!phone) {
            setFieldError(form.phone, lang === 'np' ? 'कृपया फोन नम्बर प्रविष्ट गर्नुहोस्।' : 'Please enter phone number.');
            isValid = false;
        } else if (!phoneRegex.test(cleanPhone)) {
            setFieldError(form.phone, lang === 'np' ? 'कृपया सही १० अङ्कको मोबाइल नम्बर राख्नुहोस्।' : 'Please enter a valid 10-digit phone number.');
            isValid = false;
        }

        if (!address) {
            setFieldError(form.address, lang === 'np' ? 'कृपया ठेगाना प्रविष्ट गर्नुहोस्।' : 'Please enter residential address.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Submission Data Payload
        const applicationData = {
            id: 'GUSS-' + Date.now().toString().slice(-6),
            studentName: escapeHTML(studentName),
            dob: escapeHTML(dob),
            studentClass: escapeHTML(studentClass),
            parentName: escapeHTML(parentName),
            phone: escapeHTML(cleanPhone),
            address: escapeHTML(address),
            stream: escapeHTML(stream),
            submittedAt: new Date().toISOString()
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin" style="animation: spin 1s linear infinite; margin-right: 8px;">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            ${lang === 'np' ? 'पेश गरिँदैछ...' : 'Submitting...'}
        `;

        try {
            if (ADMISSION_CONFIG.USE_REAL_BACKEND && ADMISSION_CONFIG.API_ENDPOINT) {
                // Real backend API call
                await fetch(ADMISSION_CONFIG.API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(applicationData)
                });
            } else {
                // Simulated submission delay for realistic experience
                await new Promise(resolve => setTimeout(resolve, 800));

                // Save locally to localStorage so records can be inspected
                saveToLocalStorage(applicationData);
            }

            // Show Confirmation
            showSuccessModal(applicationData, lang);
            form.reset();
        } catch (err) {
            console.error('Admission submission error:', err);
            const errMsg = lang === 'np' 
                ? 'आवेदन पेश गर्न प्राविधिक समस्या आयो। कृपया पुनः प्रयास गर्नुहोस्।' 
                : 'Error submitting application. Please try again.';
            alert(errMsg);
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    }

    function saveToLocalStorage(record) {
        try {
            const existing = JSON.parse(localStorage.getItem(ADMISSION_CONFIG.LOCAL_STORAGE_KEY) || '[]');
            existing.push(record);
            localStorage.setItem(ADMISSION_CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(existing));
        } catch (e) {
            console.warn('Could not save admission to localStorage', e);
        }
    }

    function setFieldError(field, message) {
        field.classList.add('error');
        const group = field.closest('.form-group');
        if (group) {
            let errorEl = group.querySelector('.error-message');
            if (!errorEl) {
                errorEl = document.createElement('span');
                errorEl.className = 'error-message';
                group.appendChild(errorEl);
            }
            errorEl.textContent = message;
        }
    }

    function clearFieldError(field) {
        field.classList.remove('error');
        const group = field.closest('.form-group');
        if (group) {
            const errorEl = group.querySelector('.error-message');
            if (errorEl) errorEl.remove();
        }
    }

    function showSuccessModal(data, lang) {
        const title = lang === 'np' ? 'आवेदन सफलतापूर्वक प्राप्त भयो!' : 'Application Submitted Successfully!';
        const refLabel = lang === 'np' ? 'आवेदन दर्ता नम्बर (Application ID):' : 'Application ID:';
        const msg = lang === 'np'
            ? `हार्दिक धन्यवाद! <strong>${data.studentName}</strong> को लागि कक्षा ${data.studentClass} को भर्ना आवेदन विद्यालय प्रशासनमा दर्ता भएको छ। कृपया यो दर्ता नम्बर सुरक्षित राख्नुहोला। विद्यालय प्रशासनले तपाईंको फोन नम्बर <strong>${data.phone}</strong> मा छिट्टै सम्पर्क गर्नेछ।`
            : `Thank you! Admission application for <strong>${data.studentName}</strong> (Grade ${data.studentClass}) has been received. Please keep this registration ID for reference. Our office will contact you at <strong>${data.phone}</strong>.`;

        const modalHtml = `
            <div class="lightbox-modal active" id="admissionSuccessModal" style="z-index: 3500;">
                <div class="lightbox-content" style="max-width: 580px; padding: 35px; text-align: center;">
                    <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--accent-green-soft); color: var(--accent-green); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h3 style="color: var(--primary-blue); font-size: 1.5rem; margin-bottom: 12px;">${title}</h3>
                    <div style="background: var(--bg-subtle); padding: 10px 16px; border-radius: var(--radius-md); margin-bottom: 18px; display: inline-block;">
                        <span style="font-size: 0.85rem; color: var(--text-muted);">${refLabel}</span>
                        <strong style="display: block; font-size: 1.25rem; color: var(--accent-gold-hover);">${data.id}</strong>
                    </div>
                    <p style="font-size: 0.98rem; color: var(--text-main); line-height: 1.65; margin-bottom: 25px;">${msg}</p>
                    <button class="btn btn-primary" onclick="document.getElementById('admissionSuccessModal').remove(); document.body.style.overflow = '';">
                        ${lang === 'np' ? 'धन्यवाद / बन्द गर्नुहोस्' : 'Close Confirmation'}
                    </button>
                </div>
            </div>
        `;

        const wrapper = document.createElement('div');
        wrapper.innerHTML = modalHtml;
        document.body.appendChild(wrapper.firstElementChild);
        document.body.style.overflow = 'hidden';
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', AdmissionModule.init);
