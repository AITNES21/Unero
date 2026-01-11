// Language Persistence System for Unero Website
// =============================================
// This script ensures the selected language persists across page navigation

(function () {
    'use strict';

    const LANG_STORAGE_KEY = 'unero_language';

    // Detect current language based on URL path
    function detectCurrentLanguage() {
        const path = window.location.pathname;
        if (path.includes('/en/')) {
            return 'en';
        }
        return 'es';
    }

    // Save language preference
    function saveLanguage(lang) {
        try {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        } catch (e) {
            console.warn('Could not save language preference:', e);
        }
    }

    // Get saved language preference
    function getSavedLanguage() {
        try {
            return localStorage.getItem(LANG_STORAGE_KEY);
        } catch (e) {
            console.warn('Could not read language preference:', e);
            return null;
        }
    }

    // Get equivalent page in the other language
    function getEquivalentPage(targetLang) {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'index.html';

        // Pages that exist in English version
        const englishPages = [
            'index.html',
            'construccion.html',
            'promocionesdeviviendas.html',
            'viviendasindividuales.html',
            'reformasintegrales.html',
            'disenodeinteriores.html'
        ];

        // Check if we're currently in English section
        const isInEnglish = currentPath.includes('/en/');

        if (targetLang === 'en' && !isInEnglish) {
            // Trying to go to English
            if (englishPages.includes(currentFile)) {
                // This page has an English version
                return 'en/' + currentFile;
            }
            // No English version available, stay on current page
            return null;
        } else if (targetLang === 'es' && isInEnglish) {
            // Trying to go to Spanish
            return '../' + currentFile;
        }

        return null;
    }

    // Handle language selector clicks
    function initLanguageSelector() {
        document.addEventListener('click', function (e) {
            const link = e.target.closest('.language-selector a, .mobile-dropdown a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            // Detect which language is being selected
            let newLang = null;
            if (href.includes('/en/') || href === 'index.html' && window.location.pathname.includes('/en/')) {
                newLang = 'en';
            } else if (href.includes('../index.html') || href === 'index.html' && !window.location.pathname.includes('/en/')) {
                newLang = 'es';
            }

            // Check if this is a language selection link by checking parent or text content
            const text = link.textContent.toLowerCase();
            if (text.includes('english') || text.includes('en')) {
                newLang = 'en';
            } else if (text.includes('español') || text.includes('spanish')) {
                newLang = 'es';
            }

            if (newLang) {
                saveLanguage(newLang);
            }
        });
    }

    // Update navigation links to maintain language consistency
    function updateNavigationLinks() {
        const currentLang = detectCurrentLanguage();
        saveLanguage(currentLang);

        if (currentLang === 'en') {
            // We're on an English page - update any internal links that point to Spanish pages
            // to maintain context or show a visual indicator
            const links = document.querySelectorAll('.desktop-menu a, .mobile-menu a');
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('../') && !href.includes('#')) {
                    // This link goes to a Spanish page - add a language indicator if not already present
                    if (!link.querySelector('.lang-indicator')) {
                        // Pages without English version - they will load in Spanish
                        // We don't prevent navigation, but we update the stored language
                        link.addEventListener('click', function () {
                            // When navigating to a Spanish-only page from English, keep the English preference
                            // so if they return to a page with English, they get English
                            // But we need to be careful not to create a redirect loop
                        });
                    }
                }
            });
        }
    }

    // Check on page load if we should redirect based on saved preference
    function checkLanguagePreference() {
        const savedLang = getSavedLanguage();
        const currentLang = detectCurrentLanguage();

        // Only redirect if there's a saved preference and it differs from current
        if (savedLang && savedLang !== currentLang) {
            const equivalent = getEquivalentPage(savedLang);
            if (equivalent) {
                // There's an equivalent page in the preferred language - redirect
                window.location.href = equivalent;
                return true;
            }
        }

        return false;
    }

    // Initialize on DOM ready
    function init() {
        // First, check if we need to redirect
        if (checkLanguagePreference()) {
            return; // We're redirecting, don't continue initialization
        }

        // Save current language
        const currentLang = detectCurrentLanguage();
        saveLanguage(currentLang);

        // Set up language selector tracking
        initLanguageSelector();

        // Update navigation links
        updateNavigationLinks();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
