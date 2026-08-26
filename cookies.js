/**
 * Banner de consentimiento de cookies + Google Consent Mode v2
 * Unero.es — cumplimiento RGPD / LSSI
 *
 * El consentimiento arranca DENEGADO desde el <head> de cada página.
 * Este script solo lo actualiza cuando el usuario decide.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'unero_cookie_consent';
    var VERSION = 1; // súbelo si cambian las categorías: vuelve a pedir consentimiento

    /* ---------- Persistencia (tolerante a modo privado / cookies bloqueadas) ---------- */

    function leerConsentimiento() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var datos = JSON.parse(raw);
            return datos && datos.version === VERSION ? datos : null;
        } catch (e) {
            return null;
        }
    }

    function guardarConsentimiento(estado) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                version: VERSION,
                estado: estado,
                fecha: new Date().toISOString()
            }));
        } catch (e) {
            /* Sin almacenamiento: la decisión vale solo para esta visita. */
        }
    }

    /* ---------- Consent Mode ---------- */

    function aplicarConsentimiento(estado) {
        if (typeof window.gtag !== 'function') return;
        var concedido = estado === 'aceptado' ? 'granted' : 'denied';
        window.gtag('consent', 'update', {
            ad_storage: concedido,
            ad_user_data: concedido,
            ad_personalization: concedido,
            analytics_storage: concedido
        });
    }

    /* ---------- Banner ---------- */

    function construirBanner() {
        var banner = document.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', 'Aviso de cookies');

        banner.innerHTML =
            '<div class="cookie-banner__contenido">' +
                '<p class="cookie-banner__texto">' +
                    'Usamos cookies propias y de terceros para analizar el uso de la web y mejorar ' +
                    'nuestros servicios. Puedes aceptarlas o rechazarlas; si las rechazas, solo se ' +
                    'usarán las estrictamente necesarias.' +
                '</p>' +
                '<div class="cookie-banner__acciones">' +
                    '<button type="button" class="cookie-banner__btn cookie-banner__btn--rechazar">Rechazar</button>' +
                    '<button type="button" class="cookie-banner__btn cookie-banner__btn--aceptar">Aceptar</button>' +
                '</div>' +
            '</div>';

        return banner;
    }

    function ocultarBanner(banner) {
        banner.classList.remove('cookie-banner--visible');
        // Retirado del DOM al terminar la transición; el fallback cubre el caso
        // de que transitionend no dispare (p. ej. prefers-reduced-motion).
        var retirar = function () {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
        };
        banner.addEventListener('transitionend', retirar, { once: true });
        setTimeout(retirar, 600);
    }

    function mostrarBanner() {
        var banner = construirBanner();
        document.body.appendChild(banner);

        // Fuerza un reflow para que la transición de entrada se ejecute.
        void banner.offsetHeight;
        banner.classList.add('cookie-banner--visible');

        function decidir(estado) {
            guardarConsentimiento(estado);
            aplicarConsentimiento(estado);
            ocultarBanner(banner);
        }

        banner.querySelector('.cookie-banner__btn--aceptar')
            .addEventListener('click', function () { decidir('aceptado'); });
        banner.querySelector('.cookie-banner__btn--rechazar')
            .addEventListener('click', function () { decidir('rechazado'); });
    }

    /* ---------- Arranque ---------- */

    function iniciar() {
        var previo = leerConsentimiento();
        if (previo) {
            aplicarConsentimiento(previo.estado); // Reaplica en cada carga
            return;
        }
        mostrarBanner();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

    /**
     * Permite reabrir el banner desde un enlace tipo
     * <a href="#" onclick="Unero.cookies.reabrir(); return false;">Configurar cookies</a>
     */
    window.Unero = window.Unero || {};
    window.Unero.cookies = {
        reabrir: function () {
            try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            if (!document.querySelector('.cookie-banner')) mostrarBanner();
        }
    };
})();
