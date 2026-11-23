// Smooth-scroll into view by element id. Called from AnchorNavigation and NavMenu.
function BlazorScrollToId(id) {
    const element = document.getElementById(id);
    if (element instanceof HTMLElement) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        element.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start', inline: 'nearest' });
    }
}

// Reveal-on-scroll: adds `.in` to `.reveal` elements as they enter the viewport.
let _revealObserver = null;
function initScrollReveal() {
    if (_revealObserver) _revealObserver.disconnect();
    const els = document.querySelectorAll('.reveal');
    if (els.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        els.forEach((el) => el.classList.add('in'));
        return;
    }
    _revealObserver = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                _revealObserver.unobserve(e.target);
            }
        }
    }, { rootMargin: '0px 0px -8% 0px' });
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

// Move keyboard focus to the selected project tab after Razor changes selection.
function PortfolioFocusProject(index) {
    const option = document.querySelector(`.project-option[data-project-index="${index}"]`);
    if (option instanceof HTMLElement) option.focus();
}

// Prevent page scrolling only for navigation keys handled by the project selector.
function PortfolioBindProjectKeys() {
    const selector = document.querySelector('.project-selector');
    if (!(selector instanceof HTMLElement) || selector.dataset.projectKeysBound === 'true') return;
    selector.dataset.projectKeysBound = 'true';
    selector.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft'
            || event.key === 'ArrowDown' || event.key === 'ArrowRight'
            || event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
        }
    });
}

// Mobile drawer auto-close — closes when viewport widens past 900px or Esc is pressed.
window.PortfolioDrawer = {
    bind(dotNetRef, toggleElement) {
        const onResize = () => {
            if (window.innerWidth > 900) {
                const drawer = document.querySelector('.sidebar .sb-drawer.open');
                if (drawer) dotNetRef.invokeMethodAsync('CloseDrawerFromJs');
            }
        };
        const onKey = (e) => {
            if (e.key !== 'Escape' || window.innerWidth > 900) return;
            const drawer = document.querySelector('.sidebar .sb-drawer.open');
            if (drawer) {
                dotNetRef.invokeMethodAsync('CloseDrawerFromJs');
                if (toggleElement) toggleElement.focus();
            }
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('keydown', onKey);
        window.PortfolioDrawer._cleanup = () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('keydown', onKey);
        };
    },
    unbind() {
        window.PortfolioDrawer._cleanup?.();
        window.PortfolioDrawer._cleanup = null;
    },
    focusToggle() {
        if (window.innerWidth <= 900) {
            const toggle = document.querySelector('.sb-toggle');
            if (toggle instanceof HTMLElement) toggle.focus();
        }
    }
};
