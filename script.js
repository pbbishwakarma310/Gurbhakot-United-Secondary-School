/**
 * Gurbhakot United Secondary School
 * Main Global Application Script
 * 
 * Handles navigation, mobile menu, scroll effects, central configuration binding,
 * modal dialogs, and helper utilities.
 */

document.addEventListener('DOMContentLoaded', function() {
    initHeaderAndNav();
    bindSchoolConfig();
    setupBackToTop();
});

/**
 * Header and Mobile Navigation Drawer
 */
function initHeaderAndNav() {
    const header = document.querySelector('.main-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const drawerCloseBtn = document.querySelector('.drawer-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Sticky Header Shadow on Scroll
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Mobile Drawer Open
    if (menuToggle && mobileDrawer && mobileOverlay) {
        menuToggle.addEventListener('click', function() {
            const isOpen = mobileDrawer.classList.contains('open');
            if (isOpen) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        if (drawerCloseBtn) {
            drawerCloseBtn.addEventListener('click', closeDrawer);
        }

        mobileOverlay.addEventListener('click', closeDrawer);

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
                closeDrawer();
            }
        });

        // Close when clicking any nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });
    }

    function openDrawer() {
        mobileDrawer.classList.add('open');
        mobileOverlay.classList.add('open');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('open');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Set Active State for Current Page Link
    highlightActivePage();
}

/**
 * Highlight Active Navigation Links based on URL
 */
function highlightActivePage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Bind Central School Configuration to HTML Elements
 */
function bindSchoolConfig() {
    if (typeof SCHOOL_CONFIG === 'undefined') return;

    // Elements requesting config data via data-config attribute
    document.querySelectorAll('[data-config]').forEach(el => {
        const key = el.getAttribute('data-config');
        if (SCHOOL_CONFIG[key]) {
            if (el.tagName === 'A' && key.includes('Url')) {
                el.href = SCHOOL_CONFIG[key];
            } else if (el.tagName === 'IFRAME' && key === 'mapEmbedUrl') {
                el.src = SCHOOL_CONFIG[key];
            } else {
                el.textContent = SCHOOL_CONFIG[key];
            }
        }
    });

    // Update dynamic Facebook links
    document.querySelectorAll('.school-facebook-link').forEach(link => {
        if (SCHOOL_CONFIG.facebookUrl) {
            link.href = SCHOOL_CONFIG.facebookUrl;
        }
    });

    // Update dynamic Phone links
    document.querySelectorAll('.school-phone-display').forEach(span => {
        if (SCHOOL_CONFIG.phone) {
            span.textContent = SCHOOL_CONFIG.phone;
        }
    });

    // Update dynamic Email links
    document.querySelectorAll('.school-email-display').forEach(span => {
        if (SCHOOL_CONFIG.email) {
            span.textContent = SCHOOL_CONFIG.email;
        }
    });
}

/**
 * Back to Top Smooth Button
 */
function setupBackToTop() {
    const backBtn = document.getElementById('backToTopBtn');
    if (!backBtn) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backBtn.style.display = 'flex';
        } else {
            backBtn.style.display = 'none';
        }
    });

    backBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * Safe JSON Fetch Helper with error handling
 */
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.warn(`Could not load ${url} via fetch:`, err);
        throw err;
    }
}

/**
 * Helper to escape HTML and prevent XSS
 */
function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Global Toast Notification
 */
function showToast(message, type = 'success') {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.display = 'flex';
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 4000);
}

// Export utilities
window.escapeHTML = escapeHTML;
window.fetchJSON = fetchJSON;
window.showToast = showToast;
window.highlightActivePage = highlightActivePage;
