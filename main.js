// Unero Espacio - JavaScript con menÃº mÃ³vil de TriInfinity
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
        this.initFAQ();
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
        }, 16), { passive: true });

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
    // Navigation - Estilo TriInfinity
    // =========================================
    initNavigation() {
        this.initMobileMenu();
        this.initDesktopDropdowns();
        this.initMobileDropdowns();
        this.initSmoothScroll();
        this.initHeaderHide();
        this.initBackToTop();
    }

    initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

        if (!mobileMenuBtn || !mobileMenu) return;

        // Toggle menú móvil
        mobileMenuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            mobileMenu.classList.toggle('active');
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.toggle('active');
            }
            const icon = mobileMenuBtn.querySelector('i');

            if (mobileMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Prevenir scroll del body cuando el menú está abierto
            document.body.classList.toggle('menu-open', mobileMenu.classList.contains('active'));
        });

        // Cerrar menú al hacer clic en enlaces (excepto dropdowns)
        mobileMenu.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                if (mobileMenuOverlay) {
                    mobileMenuOverlay.classList.remove('active');
                }
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.classList.remove('menu-open');
            });
        });

        // Cerrar menú al hacer clic en el overlay
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.classList.remove('menu-open');
            });
        }

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
                if (mobileMenuOverlay) {
                    mobileMenuOverlay.classList.remove('active');
                }
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.classList.remove('menu-open');
            }
        });
    }

    initDesktopDropdowns() {
        // Solo para menÃº desktop
        const desktopDropdowns = document.querySelectorAll('.desktop-menu .dropdown');

        desktopDropdowns.forEach(dropdown => {
            const menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;

            let hoverTimeout;

            // Mostrar en hover
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(hoverTimeout);
                menu.style.display = 'flex';
                requestAnimationFrame(() => {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateX(-50%) translateY(0)';
                });
            });

            // Ocultar al salir
            dropdown.addEventListener('mouseleave', () => {
                hoverTimeout = setTimeout(() => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateX(-50%) translateY(-10px)';

                    setTimeout(() => {
                        menu.style.display = 'none';
                    }, 300);
                }, 100);
            });
        });
    }

    initMobileDropdowns() {
        // TriInfinity-style mobile dropdowns
        document.querySelectorAll('.mobile-dropdown > .dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = toggle.parentElement;
                parent.classList.toggle('active');

                const icon = toggle.querySelector('.dropdown-icon');
                if (icon) {
                    icon.style.transform = parent.classList.contains('active')
                        ? 'rotate(180deg)'
                        : 'rotate(0deg)';
                }
            });
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
                    const header = document.querySelector('.header');
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
        const navLinks = document.querySelectorAll('.desktop-menu a, .mobile-menu a');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    initHeaderHide() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');
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
        const navLinks = document.querySelectorAll('.desktop-menu a[data-scroll], .mobile-menu a[href^="#"]');

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
    // Animations
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

                        // AnimaciÃ³n especial para estadÃ­sticas
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

    // AnimaciÃ³n de estadÃ­sticas de reformas
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
                    errorMessage = 'Ingresa un email vÃ¡lido';
                }
                break;

            case 'telefono':
                if (value && !/^\d{9,}$/.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Ingresa un telÃ©fono vÃ¡lido';
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
                throw new Error('Error en el envÃ­o');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Error al enviar el mensaje. IntÃ©ntalo de nuevo.', 'error');
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
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

            if (mobileMenu && mobileMenuBtn) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.classList.remove('menu-open');
                if (mobileMenuOverlay) {
                    mobileMenuOverlay.classList.remove('active');
                }
            }

            // Cerrar todos los dropdowns móviles
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
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
    // Lazy Loading para imÃ¡genes
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
                const mobileMenu = document.getElementById('mobileMenu');
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');

                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    if (mobileMenuBtn) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                    if (mobileMenuOverlay) {
                        mobileMenuOverlay.classList.remove('active');
                    }
                    document.body.classList.remove('menu-open');
                }

                // Cerrar dropdowns móviles
                document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
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
    // FAQ Accordion
    // =========================================
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            if (!question) return;

            question.addEventListener('click', () => {
                const wasActive = item.classList.contains('active');

                // Cerrar todos los demás FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle el FAQ actual
                item.classList.toggle('active', !wasActive);
            });
        });
    }

    // =========================================
    // MÃ©todos pÃºblicos
    // =========================================
    scrollToTop() {
        this.smoothScrollTo(0, 600);
    }

    scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (target) {
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 80;
            const targetPosition = target.offsetTop - headerHeight - 20;
            this.smoothScrollTo(targetPosition, 800);
        }
    }
}

// =========================================
// InicializaciÃ³n
// =========================================
const uneroWebsite = new UneroWebsite();

// Exportar para uso global si es necesario
window.UneroWebsite = UneroWebsite;
window.uneroWebsite = uneroWebsite;