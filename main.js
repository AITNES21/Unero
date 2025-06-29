// Unero Espacio - JavaScript Completo con Tarjetas
// =========================================

class UneroWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initLoading();
        this.initScrollEffects();
        this.initAnimations();
        this.initNavigation();
        this.initFormValidation();
        this.initParallax();
        this.initProgressBar();
        this.initKeyboardNavigation();
        this.initLazyLoading();
        this.initCounterAnimations();
    }

    // =========================================
    // Event Binding
    // =========================================
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });

        window.addEventListener('load', () => {
            this.onWindowLoad();
        });

        window.addEventListener('scroll', this.throttle(() => {
            this.onScroll();
        }, 16));

        window.addEventListener('resize', this.debounce(() => {
            this.onResize();
        }, 250));
    }

    // =========================================
    // Loading Screen
    // =========================================
    initLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const body = document.body;

        if (!loadingScreen) return;

        body.classList.add('loading');

        const images = document.querySelectorAll('img');
        let loadedImages = 0;
        const totalImages = images.length;

        const checkImagesLoaded = () => {
            loadedImages++;
            if (loadedImages === totalImages || loadedImages >= 3) {
                this.hideLoading();
            }
        };

        if (totalImages === 0) {
            setTimeout(() => this.hideLoading(), 1500);
            return;
        }

        images.forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                checkImagesLoaded();
            } else {
                img.addEventListener('load', checkImagesLoaded);
                img.addEventListener('error', checkImagesLoaded);
                setTimeout(checkImagesLoaded, 3000);
            }
        });

        setTimeout(() => {
            this.hideLoading();
        }, 4000);
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const body = document.body;

        if (!loadingScreen) return;

        loadingScreen.classList.add('hidden');
        body.classList.remove('loading');

        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.style.display = 'none';
            }
        }, 500);
    }

    // =========================================
    // Progress Bar
    // =========================================
    initProgressBar() {
        this.progressBar = document.getElementById('progress-bar');
        if (this.progressBar) {
            this.updateProgressBar();
        }
    }

    updateProgressBar() {
        if (!this.progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        this.progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }

    // =========================================
    // Navigation UNIVERSAL
    // =========================================
    initNavigation() {
        this.initMobileMenu();
        this.initDropdowns();
        this.initSmoothScroll();
        this.initHeaderHide();
        this.initBackToTop();
    }

    initMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.universal-menu-toggle');
        const navbar = document.getElementById('navbar') || document.querySelector('.universal-navbar');
        const body = document.body;

        if (!menuToggle || !navbar) return;

        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
            body.classList.toggle('menu-open');
        });

        navbar.querySelectorAll('a[data-scroll], a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    menuToggle.classList.remove('active');
                    navbar.classList.remove('active');
                    body.classList.remove('menu-open');
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }

    initDropdowns() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            const link = dropdown.querySelector('a');

            if (!menu || !link) return;

            // Desktop: hover
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    this.closeAllDropdowns();
                    this.showDropdownDesktop(dropdown, menu);
                }
            });

            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    this.hideDropdownDesktop(dropdown, menu);
                }
            });

            // Mobile: click
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isActive = dropdown.classList.contains('active');

                    this.closeAllDropdowns();

                    if (!isActive) {
                        this.showDropdownMobile(dropdown, menu);
                    }
                }
            });

            menu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });

        window.addEventListener('resize', () => {
            this.closeAllDropdowns();
        });
    }

    showDropdownDesktop(dropdown, menu) {
        dropdown.classList.add('active');
        menu.style.display = 'flex';

        requestAnimationFrame(() => {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.transform = 'translateX(-50%) translateY(0)';
        });
    }

    hideDropdownDesktop(dropdown, menu) {
        dropdown.classList.remove('active');
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(-10px)';

        setTimeout(() => {
            if (!dropdown.classList.contains('active')) {
                menu.style.display = 'none';
            }
        }, 300);
    }

    showDropdownMobile(dropdown, menu) {
        dropdown.classList.add('active');
        menu.style.display = 'flex';

        requestAnimationFrame(() => {
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
            menu.style.maxHeight = '200px';
        });
    }

    hideDropdownMobile(dropdown, menu) {
        dropdown.classList.remove('active');
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.maxHeight = '0';

        setTimeout(() => {
            if (!dropdown.classList.contains('active')) {
                menu.style.display = 'none';
            }
        }, 400);
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;

            dropdown.classList.remove('active');

            if (window.innerWidth > 768) {
                this.hideDropdownDesktop(dropdown, menu);
            } else {
                this.hideDropdownMobile(dropdown, menu);
            }
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[data-scroll], a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href') || anchor.getAttribute('data-scroll');

                if (!href || href === '#' || href.startsWith('http') || href.includes('.html')) {
                    return;
                }

                e.preventDefault();

                const targetId = href.startsWith('#') ? href.substring(1) : href;
                const target = document.getElementById(targetId);

                if (target) {
                    const header = document.querySelector('.header, .universal-header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;

                    this.smoothScrollTo(targetPosition, 800);
                    this.setActiveNavItem(anchor);
                }
            });
        });
    }

    smoothScrollTo(target, duration) {
        const start = window.pageYOffset;
        const distance = target - start;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            const easeInOutCubic = progress < 0.5
                ? 4 * progress * progress * progress
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;

            window.scrollTo(0, start + distance * easeInOutCubic);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };

        requestAnimationFrame(animation);
    }

    setActiveNavItem(activeLink) {
        const navLinks = document.querySelectorAll('.navbar a, .universal-navbar a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    initHeaderHide() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header, .universal-header');
        let scrollDirection = 'up';

        if (!header) return;

        this.onScrollCallbacks.push(() => {
            const scrollTop = window.pageYOffset;

            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (scrollDirection !== 'down') {
                    header.classList.add('hidden');
                    scrollDirection = 'down';
                }
            } else {
                if (scrollDirection !== 'up') {
                    header.classList.remove('hidden');
                    scrollDirection = 'up';
                }
            }

            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = Math.max(scrollTop, 0);
        });
    }

    initBackToTop() {
        const backToTop = document.getElementById('back-to-top');

        if (!backToTop) return;

        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            this.smoothScrollTo(0, 600);
        });

        this.onScrollCallbacks.push(() => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }

    // =========================================
    // Scroll Effects
    // =========================================
    initScrollEffects() {
        this.onScrollCallbacks = [];
        this.initActiveNavSection();
    }

    initActiveNavSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar a[data-scroll], .universal-navbar a[data-scroll]');

        if (sections.length === 0 || navLinks.length === 0) return;

        this.onScrollCallbacks.push(() => {
            const scrollPosition = window.pageYOffset + 100;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const linkTarget = link.getAttribute('data-scroll') || link.getAttribute('href');
                        if (linkTarget === sectionId || linkTarget === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    onScroll() {
        this.updateProgressBar();
        if (this.onScrollCallbacks) {
            this.onScrollCallbacks.forEach(callback => callback());
        }
    }

    // =========================================
    // Animations MEJORADO
    // =========================================
    initAnimations() {
        this.initIntersectionObserver();
    }

    initIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay) || 0;

                    setTimeout(() => {
                        entry.target.classList.add('visible');

                        // Animación especial para estadísticas
                        if (entry.target.classList.contains('reforma-card')) {
                            this.animateStats(entry.target);
                        }
                    }, delay);

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observar elementos con animaciones
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .servicio-card, .proyecto-card, .location-card, .reforma-card'
        );
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Animación de estadísticas de reformas
    animateStats(reformaCard) {
        const stats = reformaCard.querySelectorAll('.stat-number');

        stats.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            const duration = 1500;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.floor(easeOutQuart * finalValue);

                stat.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    stat.textContent = finalValue;
                }
            };

            requestAnimationFrame(animate);
        });
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.counter');

        if (counters.length === 0) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 2000;
            let startTime = null;

            const updateCounter = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);

                counter.textContent = Math.floor(progress * target);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            };

            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            requestAnimationFrame(updateCounter);
                            observer.unobserve(entry.target);
                        }
                    });
                });

                observer.observe(counter);
            }
        });
    }

    // =========================================
    // Form Validation
    // =========================================
    initFormValidation() {
        const form = document.getElementById('contact-form');

        if (!form) return;

        const inputs = form.querySelectorAll('.form-input');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });

        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        const errorElement = document.getElementById(`${name}-error`);

        let isValid = true;
        let errorMessage = '';

        switch (name) {
            case 'nombre':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                break;

            case 'telefono':
                if (value && !/^\d{9,}$/.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Ingresa un teléfono válido';
                }
                break;

            case 'mensaje':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.toggle('show', !isValid);
        }

        field.classList.toggle('error', !isValid);
        return isValid;
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        field.classList.remove('error');
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const inputs = form.querySelectorAll('.form-input[required]');

        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Por favor, corrige los errores en el formulario', 'error');
            return;
        }

        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                this.showNotification('Mensaje enviado correctamente. Te contactaremos pronto.', 'success');
                form.reset();

                setTimeout(() => {
                    const nextPage = form.querySelector('input[name="_next"]');
                    if (nextPage && nextPage.value) {
                        window.location.href = nextPage.value;
                    }
                }, 2000);
            } else {
                throw new Error('Error en el envío');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        } finally {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }

    showNotification(message, type = 'info') {
        let notification = document.querySelector('.notification');

        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);

            if (!document.querySelector('#notification-styles')) {
                const styles = document.createElement('style');
                styles.id = 'notification-styles';
                styles.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        color: white;
                        font-weight: 600;
                        z-index: 10000;
                        transform: translateX(400px);
                        transition: transform 0.3s ease;
                        max-width: 400px;
                        font-family: 'Montserrat', sans-serif;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }
                    .notification.show {
                        transform: translateX(0);
                    }
                    .notification.success {
                        background: #28a745;
                    }
                    .notification.error {
                        background: #dc3545;
                    }
                    .notification.info {
                        background: var(--color-primary, #0a1a2f);
                    }
                `;
                document.head.appendChild(styles);
            }
        }

        notification.textContent = message;
        notification.className = `notification ${type}`;

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // =========================================
    // Parallax
    // =========================================
    initParallax() {
        if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.onScrollCallbacks.push(() => {
                const scrolled = window.pageYOffset;
                const hero = document.querySelector('.hero');

                if (hero) {
                    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
                }
            });
        }
    }

    // =========================================
    // Event Handlers
    // =========================================
    onDOMReady() {
        console.log('Unero Website loaded');

        setTimeout(() => {
            const fadeElements = document.querySelectorAll('.fade-in-up');
            fadeElements.forEach((el, index) => {
                if (this.isInViewport(el)) {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 200);
                }
            });
        }, 500);
    }

    onWindowLoad() {
        setTimeout(() => {
            this.hideLoading();
        }, 500);
    }

    onResize() {
        if (window.innerWidth > 768) {
            const navbar = document.getElementById('navbar') || document.querySelector('.universal-navbar');
            const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.universal-menu-toggle');

            if (navbar && menuToggle) {
                navbar.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }

            this.closeAllDropdowns();
        }

        if (window.innerWidth <= 768) {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.backgroundPositionY = '';
            }
        }
    }

    // =========================================
    // Utility Functions
    // =========================================
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function () {
            const context = this, args = arguments;
            const later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // =========================================
    // Lazy Loading para imágenes
    // =========================================
    initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        if (images.length === 0) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
            });
        }
    }

    // =========================================
    // Keyboard Navigation
    // =========================================
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const navbar = document.getElementById('navbar') || document.querySelector('.universal-navbar');
                const menuToggle = document.getElementById('menu-toggle') || document.querySelector('.universal-menu-toggle');

                if (navbar && navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.classList.remove('active');
                    }
                    document.body.classList.remove('menu-open');
                }

                this.closeAllDropdowns();
            }

            if (e.key === 'Enter') {
                const focused = document.activeElement;
                if (focused && focused.classList.contains('cta-button')) {
                    focused.click();
                }
            }
        });
    }

    // =========================================
    // Métodos públicos
    // =========================================
    scrollToTop() {
        this.smoothScrollTo(0, 600);
    }

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            const header = document.querySelector('.header, .universal-header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.offsetTop - headerHeight - 20;
            this.smoothScrollTo(targetPosition, 800);
        }
    }
}

// =========================================
// Función universal para menú hamburguesa
// =========================================
function initUniversalMenu() {
    const menuToggle = document.querySelector('.universal-menu-toggle');
    const navbar = document.querySelector('.universal-navbar');

    if (!menuToggle || !navbar) return;

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        menuToggle.classList.toggle('active');
        navbar.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navbar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// =========================================
// Inicialización
// =========================================
const uneroWebsite = new UneroWebsite();

window.UneroWebsite = UneroWebsite;
window.initUniversalMenu = initUniversalMenu;

document.addEventListener('DOMContentLoaded', () => {
    initUniversalMenu();
});