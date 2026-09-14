# Gurbhakot United Secondary School Official Website
### गुर्भाकोट युनाइटेड माध्यमिक विद्यालय, गुर्भाकोट–९, बोटेचौर, सुर्खेत, नेपाल

A complete, modern, responsive, and bilingual (नेपाली & English) official school website built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript** (no external frontend frameworks, no Bootstrap, no Tailwind, no jQuery).

---

## 📁 Project Directory Structure

```text
Gurbhakot United Secondary School/
│
├── index.html              # Homepage (Hero, Welcome, Quick Links, Notices, Principal Msg, Events, Gallery, Map)
├── about.html              # Complete About Us (History, Vision, Mission, Facilities, SMC)
├── message.html            # Dedicated Messages (Principal & SMC Chairperson)
├── academic.html           # Academic Section (Grades 11-12, Curriculum, Exams, Calendar)
├── classes.html            # Classes Page (Class 11 & Class 12 details, subjects, resources)
├── teachers.html           # Teachers & Staff Directory (Dynamic from JSON)
├── admission.html          # Online Admission Page & Validated Form
├── notices.html            # Notice Board with category filter & search (Dynamic from JSON)
├── results.html            # Student Result Search by Roll Number (Dynamic from JSON)
├── events.html             # School Events & Activities (Dynamic from JSON)
├── gallery.html            # Modern Photo Gallery with Lightbox modal
├── downloads.html          # Downloads Center with categorized tables (Dynamic from JSON)
├── contact.html            # Contact Information, inquiry form & business hours
├── location.html           # Dedicated Location Page with configurable Google Map
│
├── css/
│   └── style.css           # Full responsive design system (Blue + White theme)
│
├── js/
│   ├── config.js           # Central configuration (Phone, Email, Facebook, Google Map URL)
│   ├── language.js         # Bilingual engine & localStorage persistence
│   ├── script.js           # Navigation, mobile drawer, scroll effects, helpers
│   ├── notices.js          # Notice filtering, searching & homepage widget
│   ├── results.js          # Roll number result search & marksheet renderer
│   ├── teachers.js         # Teachers directory renderer & role filters
│   ├── events.js           # Events renderer & homepage preview
│   ├── gallery.js          # Gallery renderer & interactive lightbox modal
│   ├── downloads.js        # Download center renderer & filters
│   └── admission.js        # Form validation, feedback & backend endpoint config
│
├── data/
│   ├── teachers.json       # Teachers & Staff dataset
│   ├── notices.json        # Categorized school notices
│   ├── results.json        # Student examination results (with marked demo data)
│   ├── events.json         # School events dataset
│   └── downloads.json      # Downloadable files dataset
│
├── images/
│   ├── logo/
│   │   └── logo.svg        # Official vector school emblem
│   ├── school/
│   │   └── hero-school.svg # School campus illustration
│   ├── principal/
│   │   └── principal-placeholder.svg
│   ├── teachers/
│   │   └── teacher-placeholder.svg
│   └── gallery/
│       ├── gallery-school.svg
│       ├── gallery-classroom.svg
│       ├── gallery-sports.svg
│       ├── gallery-cultural.svg
│       ├── gallery-events.svg
│       ├── gallery-students.svg
│       └── gallery-teachers.svg
│
├── downloads/              # Downloadable PDF documents & forms
│   ├── admission-form-sample.pdf
│   ├── exam-routine-sample.pdf
│   ├── result-summary-sample.pdf
│   ├── sample-admission-form.pdf
│   ├── sample-exam-routine.pdf
│   ├── student-code-of-conduct.pdf
│   ├── syllabus-sample.pdf
│   └── transfer-certificate-form.pdf
│
├── start-server.bat        # One-click Windows local server launcher
├── start-server.ps1        # PowerShell local HTTP server (Zero external dependencies)
└── README.md               # User & Admin Guide
```

---

## 1. How to Run the Website Locally

Browsers restrict reading local JSON files using `fetch()` when opening files directly using `file://`. You should run the site using a local web server:

### Method A: One-Click Launcher (Windows - Easiest)
- Simply **double-click** `start-server.bat` in this project folder.
- It will automatically launch a built-in local server and open `http://localhost:8080/` in your default browser.

### Method B: VS Code Live Server
1. Open this folder in **VS Code**.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and choose **"Open with Live Server"**.

### Method C: Upload to Web Hosting
- You can upload all files directly to any standard cPanel web host, Apache, Nginx, GitHub Pages, Netlify, or Vercel.

---

## 2. How to Change School Information in One Place

Open `js/config.js`. This central configuration file contains the main details used across the website:

```javascript
const SCHOOL_CONFIG = {
    phone: "087-XXXXXX",                   // Enter school phone
    email: "info@gurbhakotunited.edu.np",   // Enter school email
    principalName: "तपाईंको नाम",           // Principal Name
    principalPhone: "98XXXXXXXX",           // Principal Mobile
    facebookUrl: "https://facebook.com/your-official-page", // Facebook link
    mapEmbedUrl: "https://maps.google.com/..."              // Google Maps iframe URL
};
```

---

## 3. How to Add / Edit Teachers & Staff

Open `data/teachers.json`. To add a new staff member, simply copy and paste an object:

```json
{
  "id": 7,
  "nameNepali": "शिक्षकको नाम",
  "nameEnglish": "Teacher Full Name",
  "roleNepali": "माध्यमिक तह शिक्षक (कक्षा ११-१२)",
  "roleEnglish": "Secondary Teacher",
  "department": "teaching",
  "departmentNepali": "शिक्षण विभाग",
  "departmentEnglish": "Teaching Faculty",
  "subjectNepali": "अंग्रेजी",
  "subjectEnglish": "English",
  "qualificationNepali": "एम.एड. (M.Ed.)",
  "qualificationEnglish": "M.Ed.",
  "mobile": "98XXXXXXXX",
  "photo": "images/teachers/teacher-photo.jpg"
}
```

Place their photo in `images/teachers/` (e.g. `teacher-photo.jpg`).

---

## 4. How to Add / Edit School Notices

Open `data/notices.json`. Each notice has the following structure:

```json
{
  "id": 7,
  "titleNepali": "नयाँ परीक्षा सम्बन्धी सूचना",
  "titleEnglish": "Notice Regarding Upcoming Examination",
  "date": "2026-09-20",
  "category": "exam",
  "categoryNepali": "परीक्षा तालिका",
  "categoryEnglish": "Exam Routine",
  "descriptionNepali": "सूचनाको विस्तृत विवरण यहाँ लेख्नुहोस्।",
  "descriptionEnglish": "Write detailed notice description here.",
  "attachment": "downloads/your-exam-routine.pdf"
}
```

### Available Categories:
- `"exam"` - परीक्षा तालिका / Exam Routine
- `"result"` - नतिजा / Result
- `"admission"` - भर्ना सूचना / Admission Notice
- `"holiday"` - बिदा सूचना / Holiday Notice
- `"general"` - सामान्य सूचना / General Notice

---

## 5. How to Add / Edit Student Results

Open `data/results.json`. Each student result is looked up **strictly by Roll Number**:

```json
{
  "rollNumber": "105",
  "studentNameNepali": "विद्यार्थीको नाम",
  "studentNameEnglish": "Student Name",
  "class": "11",
  "section": "A",
  "examTitleNepali": "प्रथम त्रैमासिक परीक्षा २०८१",
  "examTitleEnglish": "First Terminal Examination 2025",
  "academicYear": "2081/2082",
  "isDemo": false,
  "subjects": [
    {
      "subjectNepali": "अनिवार्य नेपाली",
      "subjectEnglish": "Compulsory Nepali",
      "fullMarks": 100,
      "passMarks": 35,
      "marks": 78,
      "grade": "A"
    }
  ],
  "totalMarksObtained": 390,
  "totalFullMarks": 500,
  "percentage": 78.0,
  "gpa": "3.55",
  "grade": "A",
  "statusNepali": "उत्तीर्ण (प्रथम श्रेणी)",
  "statusEnglish": "Passed (First Division)"
}
```

---

## 6. How to Add School Events

Open `data/events.json`. Add a new event:

```json
{
  "id": 5,
  "titleNepali": "वार्षिक अभिभावक दिवस",
  "titleEnglish": "Annual Parents Day",
  "date": "2026-11-20",
  "time": "11:00 AM - 3:00 PM",
  "locationNepali": "विद्यालय सभाहल",
  "locationEnglish": "School Auditorium",
  "category": "parents-meeting",
  "categoryNepali": "अभिभावक भेला",
  "categoryEnglish": "Parents Meeting",
  "image": "images/gallery/gallery-events.svg",
  "shortDescNepali": "अभिभावक दिवस तथा पुरस्कार वितरण समारोह।",
  "shortDescEnglish": "Annual parents day celebration and prize distribution ceremony."
}
```

---

## 7. How to Add Gallery Photos

1. Place your JPG or PNG image inside `images/gallery/` (e.g. `campus-photo.jpg`).
2. Open `js/gallery.js` and add an item to `galleryItems`:

```javascript
{
    id: 9,
    titleNepali: "विद्यालयको नयाँ विज्ञान प्रयोगशाला",
    titleEnglish: "New Science Laboratory",
    category: "classroom",
    categoryNepali: "कक्षाकोठा",
    categoryEnglish: "Classroom",
    src: "images/gallery/campus-photo.jpg"
}
```

The gallery automatically includes category filtering and an interactive lightbox popup.

---

## 8. How to Add Downloadable Files

1. Put your PDF, Word, or Excel document in the `downloads/` folder (e.g. `downloads/model-questions.pdf`).
2. Open `data/downloads.json` and add an entry:

```json
{
  "id": 7,
  "titleNepali": "कक्षा ११ नमुना प्रश्नपत्र २०८१",
  "titleEnglish": "Class 11 Model Question Papers",
  "category": "syllabus",
  "categoryNepali": "पाठ्यक्रम",
  "categoryEnglish": "Syllabus",
  "date": "2026-09-15",
  "fileSize": "350 KB",
  "file": "downloads/model-questions.pdf"
}
```

---

## 9. How to Connect the Official Facebook Page

Open `js/config.js` and replace the placeholder:

```javascript
facebookUrl: "https://www.facebook.com/your-official-school-page"
```

All Facebook links on the top bar, contact page, and footer will update automatically.

---

## 10. How to Add the Exact Google Map Location

1. Go to [Google Maps](https://maps.google.com).
2. Search for your school or location.
3. Click **Share** > **Embed a map**.
4. Copy the URL inside the `src="..."` attribute.
5. Open `js/config.js` and paste it inside `mapEmbedUrl`:

```javascript
mapEmbedUrl: "https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
```

---

## 11. How to Connect the Online Admission Form to a Real Backend Later

Open `js/admission.js`. Inside the configuration block:

```javascript
const ADMISSION_CONFIG = {
    USE_REAL_BACKEND: true, // Change from false to true
    API_ENDPOINT: "https://your-api-domain.com/api/admissions" // Your backend or Google Apps Script URL
};
```

When `USE_REAL_BACKEND` is set to `true`, the form submits a JSON `POST` payload containing:
- `studentName`
- `dob`
- `studentClass`
- `parentName`
- `phone`
- `address`
- `stream`
- `submittedAt`

While `USE_REAL_BACKEND` is `false`, the form validates all fields, generates an official registration reference ID, displays a confirmation modal, and stores records safely in browser `localStorage`.

---

## 12. Language Switching

The website includes a bilingual switch (**नेपाली | English**) in the top bar and mobile drawer.
- The user's preference is saved in `localStorage` (`guss_language_pref`).
- Pages will remember the selected language even when navigating across different pages or refreshing.
