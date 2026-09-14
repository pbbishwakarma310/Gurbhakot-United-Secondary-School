/**
 * Gurbhakot United Secondary School
 * Photo Gallery & Lightbox Module
 * 
 * Manages gallery filtering and interactive full-screen image lightbox modal.
 */

const GalleryModule = (function() {
    // Gallery dataset
    const galleryItems = [
        {
            id: 1,
            titleNepali: "विद्यालयको मुख्य भवन तथा परिसर",
            titleEnglish: "Main School Building & Campus",
            category: "school",
            categoryNepali: "विद्यालय",
            categoryEnglish: "School",
            src: "images/gallery/gallery-school.svg"
        },
        {
            id: 2,
            titleNepali: "कक्षा ११ र १२ को आधुनिक कक्षाकोठा",
            titleEnglish: "Grade 11 & 12 Modern Classrooms",
            category: "classroom",
            categoryNepali: "कक्षाकोठा",
            categoryEnglish: "Classroom",
            src: "images/gallery/gallery-classroom.svg"
        },
        {
            id: 3,
            titleNepali: "वार्षिक भलिबल तथा एथलेटिक्स प्रतियोगिता",
            titleEnglish: "Annual Volleyball & Sports Tournament",
            category: "sports",
            categoryNepali: "खेलकुद",
            categoryEnglish: "Sports",
            src: "images/gallery/gallery-sports.svg"
        },
        {
            id: 4,
            titleNepali: "विद्यार्थी सांस्कृतिक नृत्य तथा प्रस्तुति",
            titleEnglish: "Student Folk Dance & Cultural Performance",
            category: "cultural",
            categoryNepali: "सांस्कृतिक",
            categoryEnglish: "Cultural Program",
            src: "images/gallery/gallery-cultural.svg"
        },
        {
            id: 5,
            titleNepali: "विद्यालयको औपचारिक सभा तथा पुरस्कार वितरण",
            titleEnglish: "Formal School Assembly & Prize Distribution",
            category: "events",
            categoryNepali: "कार्यक्रम",
            categoryEnglish: "Events",
            src: "images/gallery/gallery-events.svg"
        },
        {
            id: 6,
            titleNepali: "पुस्तकालय तथा स्वाध्ययन कक्षमा विद्यार्थीहरू",
            titleEnglish: "Students in Library & Self-Study Hall",
            category: "students",
            categoryNepali: "विद्यार्थीहरू",
            categoryEnglish: "Students",
            src: "images/gallery/gallery-students.svg"
        },
        {
            id: 7,
            titleNepali: "शिक्षक तथा कर्मचारी शैक्षिक अभिमुखीकरण",
            titleEnglish: "Faculty Orientation & Academic Workshop",
            category: "teachers",
            categoryNepali: "शिक्षकहरू",
            categoryEnglish: "Teachers",
            src: "images/gallery/gallery-teachers.svg"
        },
        {
            id: 8,
            titleNepali: "विद्यालयको हरियाली बगैंचा तथा खेल मैदान",
            titleEnglish: "Lush Green School Gardens & Playground",
            category: "school",
            categoryNepali: "विद्यालय",
            categoryEnglish: "School",
            src: "images/school/hero-school.svg"
        }
    ];

    let currentCategory = 'all';
    let activeIndex = 0;
    let currentRenderedList = [];

    function init() {
        const fullGrid = document.getElementById('fullGalleryGrid');
        const homeGrid = document.getElementById('homepageGalleryGrid');

        if (!fullGrid && !homeGrid) return;

        render();
        setupFilters();
        setupLightbox();

        window.addEventListener('languageChanged', function() {
            render();
            updateLightboxCaption();
        });
    }

    function setupFilters() {
        const filterBtns = document.querySelectorAll('.gallery-filter-btn');
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

        // Homepage preview (first 6)
        const homeGrid = document.getElementById('homepageGalleryGrid');
        if (homeGrid) {
            const previewItems = galleryItems.slice(0, 6);
            homeGrid.innerHTML = previewItems.map((item, idx) => buildItemHTML(item, idx, lang)).join('');
            bindClickEvents(homeGrid, previewItems);
        }

        // Full page grid
        const fullGrid = document.getElementById('fullGalleryGrid');
        if (fullGrid) {
            currentRenderedList = galleryItems.filter(item => {
                if (currentCategory === 'all') return true;
                return item.category === currentCategory;
            });

            if (currentRenderedList.length === 0) {
                fullGrid.innerHTML = `<div class="text-center" style="grid-column: 1/-1; padding: 40px;">
                    <p style="color: var(--text-muted);">${lang === 'np' ? 'यस समूहमा कुनै फोटो फेला परेन।' : 'No photos found in this category.'}</p>
                </div>`;
            } else {
                fullGrid.innerHTML = currentRenderedList.map((item, idx) => buildItemHTML(item, idx, lang)).join('');
                bindClickEvents(fullGrid, currentRenderedList);
            }
        }
    }

    function buildItemHTML(item, idx, lang) {
        const title = lang === 'np' ? item.titleNepali : item.titleEnglish;
        const cat = lang === 'np' ? item.categoryNepali : item.categoryEnglish;

        return `
            <div class="gallery-item" data-index="${idx}">
                <img src="${item.src}" alt="${escapeHTML(title)}" loading="lazy" />
                <div class="gallery-overlay">
                    <span class="gallery-overlay-cat">${escapeHTML(cat)}</span>
                    <span class="gallery-overlay-title">${escapeHTML(title)}</span>
                </div>
            </div>
        `;
    }

    function bindClickEvents(container, itemsArray) {
        container.querySelectorAll('.gallery-item').forEach(el => {
            el.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'), 10);
                openLightbox(itemsArray, index);
            });
        });
    }

    // Lightbox modal functionality
    let lightboxList = [];

    function setupLightbox() {
        // Create modal if not already in HTML
        let modal = document.getElementById('lightboxModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'lightboxModal';
            modal.className = 'lightbox-modal';
            modal.innerHTML = `
                <div class="lightbox-content">
                    <button class="lightbox-close-btn" aria-label="Close lightbox">&times;</button>
                    <button class="lightbox-nav-btn lightbox-prev" aria-label="Previous photo">&#10094;</button>
                    <img class="lightbox-image" src="" alt="Full view photo" />
                    <button class="lightbox-nav-btn lightbox-next" aria-label="Next photo">&#10095;</button>
                    <div class="lightbox-caption">
                        <div>
                            <h4 id="lightboxTitle" style="color: var(--primary-blue); font-size: 1.1rem; margin-bottom: 2px;"></h4>
                            <span id="lightboxCategory" style="font-size: 0.8rem; color: var(--text-muted);"></span>
                        </div>
                        <span id="lightboxCounter" style="font-size: 0.85rem; font-weight: 700; color: var(--primary-blue);"></span>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        modal.querySelector('.lightbox-close-btn').addEventListener('click', closeLightbox);
        modal.querySelector('.lightbox-prev').addEventListener('click', prevPhoto);
        modal.querySelector('.lightbox-next').addEventListener('click', nextPhoto);

        // Click outside image closes
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeLightbox();
            }
        });

        // Keyboard arrows & escape
        document.addEventListener('keydown', function(e) {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        });
    }

    function openLightbox(list, index) {
        lightboxList = list;
        activeIndex = index;
        const modal = document.getElementById('lightboxModal');
        if (!modal) return;

        updateLightboxContent();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const modal = document.getElementById('lightboxModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function prevPhoto() {
        if (lightboxList.length <= 1) return;
        activeIndex = (activeIndex - 1 + lightboxList.length) % lightboxList.length;
        updateLightboxContent();
    }

    function nextPhoto() {
        if (lightboxList.length <= 1) return;
        activeIndex = (activeIndex + 1) % lightboxList.length;
        updateLightboxContent();
    }

    function updateLightboxContent() {
        if (!lightboxList || lightboxList.length === 0) return;
        const item = lightboxList[activeIndex];
        const modal = document.getElementById('lightboxModal');
        if (!modal || !item) return;

        const lang = window.LanguageManager ? window.LanguageManager.getLang() : 'np';
        const title = lang === 'np' ? item.titleNepali : item.titleEnglish;
        const cat = lang === 'np' ? item.categoryNepali : item.categoryEnglish;

        modal.querySelector('.lightbox-image').src = item.src;
        modal.querySelector('#lightboxTitle').textContent = title;
        modal.querySelector('#lightboxCategory').textContent = cat;
        modal.querySelector('#lightboxCounter').textContent = `${activeIndex + 1} / ${lightboxList.length}`;
    }

    function updateLightboxCaption() {
        const modal = document.getElementById('lightboxModal');
        if (modal && modal.classList.contains('active')) {
            updateLightboxContent();
        }
    }

    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', GalleryModule.init);
