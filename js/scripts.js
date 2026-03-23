/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
//

function BlazorScrollToId(id) {
    const element = document.getElementById(id);
    if (element instanceof HTMLElement) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }
}

// ============================================
// Scroll-triggered reveal animations
// ============================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el) => observer.observe(el));
}

// ============================================
// Active nav section tracking on scroll
// ============================================

let _sectionObserver = null;
let _dotNetRef = null;

function initSectionObserver(dotNetRef) {
    _dotNetRef = dotNetRef;

    if (_sectionObserver) {
        _sectionObserver.disconnect();
    }

    const sections = document.querySelectorAll('.resume-section[id]');
    if (sections.length === 0) return;

    _sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && _dotNetRef) {
                _dotNetRef.invokeMethodAsync('OnSectionVisible', entry.target.id);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-10% 0px -60% 0px'
    });

    sections.forEach((section) => _sectionObserver.observe(section));
}

function disposeSectionObserver() {
    if (_sectionObserver) {
        _sectionObserver.disconnect();
        _sectionObserver = null;
    }
    _dotNetRef = null;
}
