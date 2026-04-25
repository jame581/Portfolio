// Smooth-scroll into view by element id. Called from AnchorNavigation and NavMenu.
function BlazorScrollToId(id) {
    const element = document.getElementById(id);
    if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
}

// Reveal-on-scroll: adds `.in` to `.reveal` elements as they enter the viewport.
let _revealObserver = null;
function initScrollReveal() {
    if (_revealObserver) _revealObserver.disconnect();
    const els = document.querySelectorAll('.reveal');
    if (els.length === 0) return;
    _revealObserver = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                _revealObserver.unobserve(e.target);
            }
        }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => _revealObserver.observe(el));
}

// Section scroll-spy for the sidebar. dotnetRef must expose `SetActiveSection(string)`.
let _sectionObserver = null;
let _sectionRef = null;
function PortfolioObserveSections(dotnetRef, ids) {
    if (_sectionObserver) _sectionObserver.disconnect();
    _sectionRef = dotnetRef;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;
    _sectionObserver = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting && _sectionRef) {
                _sectionRef.invokeMethodAsync('SetActiveSection', e.target.id);
            }
        }
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    els.forEach((el) => _sectionObserver.observe(el));
}

function PortfolioDisposeObservers() {
    if (_sectionObserver) { _sectionObserver.disconnect(); _sectionObserver = null; }
    if (_revealObserver) { _revealObserver.disconnect(); _revealObserver = null; }
    _sectionRef = null;
}

// Filmstrip arrow click — scroll one card width.
function PortfolioScrollStrip(el, dir) {
    if (!el) return;
    const card = el.querySelector('.proj');
    const w = card ? card.offsetWidth + 18 : 380;
    el.scrollBy({ left: dir * w, behavior: 'smooth' });
}

// Mobile drawer auto-close — closes when viewport widens past 900px or Esc is pressed.
window.PortfolioDrawer = {
    bind(dotNetRef) {
        const onResize = () => {
            if (window.innerWidth > 900) dotNetRef.invokeMethodAsync('CloseDrawerFromJs');
        };
        const onKey = (e) => {
            if (e.key === 'Escape') dotNetRef.invokeMethodAsync('CloseDrawerFromJs');
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', onKey);
        window.PortfolioDrawer._cleanup = () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('keydown', onKey);
        };
    },
    unbind() { window.PortfolioDrawer._cleanup?.(); }
};
