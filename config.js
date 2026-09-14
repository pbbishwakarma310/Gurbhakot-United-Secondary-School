/**
 * Gurbhakot United Secondary School
 * Central Configuration File
 *
 * Use this file to update school details, contact numbers, email,
 * social media links, and Google Map embed URL in one place.
 */

const SCHOOL_CONFIG = {
    // School Identity
    nameEnglish: "Gurbhakot United Secondary School",
    nameNepali: "गुर्भाकोट युनाइटेड माध्यमिक विद्यालय",
    locationEnglish: "Gurbhakot Municipality-9, Botechaur, Surkhet, Karnali Province, Nepal",
    locationNepali: "गुर्भाकोट नगरपालिका–९, बोटेचौर, सुर्खेत, कर्णाली प्रदेश, नेपाल",
    shortLocationEnglish: "Botechaur, Surkhet",
    shortLocationNepali: "बोटेचौर, सुर्खेत",

    // Contact Information (Placeholders as per official requirement)
    phone: "[School Phone / विद्यालय फोन नम्बर]",
    phoneDisplay: "[School Phone]",
    email: "[School Email / विद्यालय इमेल]",
    
    // Principal / Contact Person
    principalName: "[प्रधानाध्यापकको नाम / Principal's Name]",
    principalPhone: "[Principal Mobile / मोबाइल नम्बर]",
    contactPerson: "[सम्पर्क व्यक्ति / Contact Person]",

    // Social Media
    // Replace with official Facebook Page URL when available (e.g. "https://facebook.com/your-page")
    facebookUrl: "[OFFICIAL FACEBOOK URL / आधिकारिक फेसबुक पेज लिङ्क]",

    // Google Maps Embed Iframe URL
    // Insert school's exact Google Maps embed URL inside the quotes below
    mapEmbedUrl: "https://maps.google.com/maps?q=Botechaur,+Surkhet,+Nepal&t=&z=14&ie=UTF8&iwloc=&output=embed",

    // Academic Details
    gradesOffered: "Grades 11 & 12 (कक्षा ११ र १२)",
    academicYear: "2081/2082 (2025/2026)",

    // Online Admission Form Backend Configuration
    // When a backend/Google Form/API endpoint is ready, set admissionApiEndpoint:
    admissionApiEndpoint: null // e.g. "https://your-api-domain.com/api/admission"
};

// Expose globally
if (typeof window !== 'undefined') {
    window.SCHOOL_CONFIG = SCHOOL_CONFIG;
}
