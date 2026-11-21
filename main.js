// JavaScript Interaction Code
let siteContent = null;

document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    const whatsappText = `مرحباً مدار تك، أنا ${name}%0A` +
                         `البريد: ${email}%0A` +
                         `الهاتف: ${phone}%0A` +
                         `الرسالة: ${message}`;

    const configuredNumber = siteContent && siteContent.settings.phone
        ? siteContent.settings.phone.replace(/\D/g, '')
        : '';
    const contactNumber = configuredNumber || '972590000000';
    const whatsappUrl = `https://wa.me/${contactNumber}?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
});

function openProgramModal(programName) {
    alert('شكراً لاهتمامك ببرنامج ' + programName + '. يمكنك الإرسال عبر نموذج التواصل للتسجيل في الدفعة القادمة!');
}

function renderSiteContent(content) {
    const heroTitle = document.querySelector('.hero-slide .hero-title');
    heroTitle.querySelector('.hero-title-main').textContent = content.hero.title;
    heroTitle.querySelector('.hero-title-highlight').textContent = content.hero.highlight;
    document.querySelector('.hero-slide .hero-desc').textContent = content.hero.description;

    [
        ['.hero-primary-link', content.hero.primaryButtonText, content.hero.primaryButtonHref],
        ['.hero-secondary-link', content.hero.secondaryButtonText, content.hero.secondaryButtonHref]
    ].forEach(([selector, label, href]) => {
        const link = document.querySelector(selector);
        if (!MadarSiteContent.isSafeHref(href)) {
            throw new Error(`رابط الزر ${label} غير آمن.`);
        }
        link.textContent = label;
        link.href = href;
    });

    document.getElementById('aboutDescription').textContent = content.aboutDescription;
    renderServices(content.services);
    renderPrograms(content.programs, content.settings);
    renderCustomSections(content.customSections);
    renderContactDetails(content.settings);

    setElementVisibility(document.getElementById('bookingButton'), content.settings.acceptApplications);
}

function renderServices(services) {
    const list = document.getElementById('homeServicesList');
    list.replaceChildren();

    services.forEach((service) => {
        const card = document.createElement('article');
        const iconBox = document.createElement('div');
        const icon = document.createElement('i');
        const title = document.createElement('h3');
        const description = document.createElement('p');
        card.className = 'custom-card';
        iconBox.className = 'card-icon';
        icon.className = `fa-solid ${service.icon}`;
        iconBox.append(icon);
        title.className = 'card-title';
        title.textContent = service.title;
        description.className = 'card-text';
        description.textContent = service.description;
        card.append(iconBox, title, description);
        list.append(card);
    });
}

function renderPrograms(programs, settings) {
    const list = document.getElementById('homeProgramList');
    list.replaceChildren();

    programs
        .filter((program) => settings.showUpcoming || program.status !== 'soon')
        .forEach((program) => {
            const column = document.createElement('div');
            const card = document.createElement('article');
            const tag = document.createElement('span');
            const title = document.createElement('h3');
            const description = document.createElement('p');
            const button = document.createElement('button');
            const accepting = settings.acceptApplications && program.status !== 'closed';

            column.className = 'col-md-4';
            card.className = 'custom-card';
            tag.className = 'program-tag';
            tag.textContent = program.category;
            title.className = 'card-title';
            title.textContent = program.name;
            description.className = 'card-text';
            description.textContent = program.description;
            button.className = 'btn btn-outline-oxford w-100 mt-3';
            button.style.color = 'var(--color-oxford-blue)';
            button.type = 'button';
            button.textContent = accepting ? 'اعرف المزيد' : 'التسجيل غير متاح حالياً';
            button.disabled = !accepting;
            if (accepting) {
                button.addEventListener('click', () => openProgramModal(program.name));
            }

            card.append(tag, title, description, button);
            column.append(card);
            list.append(column);
        });
}

function renderCustomSections(sections) {
    const list = document.getElementById('customHomeSections');
    list.replaceChildren();

    sections.filter((section) => section.visible).forEach((section) => {
        const sectionElement = document.createElement('section');
        const container = document.createElement('div');
        const header = document.createElement('div');
        const title = document.createElement('h2');
        const description = document.createElement('p');
        sectionElement.className = 'about-section custom-home-section';
        sectionElement.dataset.customSectionId = section.id;
        container.className = 'container';
        header.className = 'section-header';
        title.className = 'section-title';
        title.textContent = section.title;
        description.className = 'lead text-center text-muted';
        description.textContent = section.description;
        description.style.maxWidth = '900px';
        description.style.margin = '0 auto';
        header.append(title);
        container.append(header, description);

        if (section.buttonText && section.buttonHref) {
            if (!MadarSiteContent.isSafeHref(section.buttonHref)) {
                throw new Error(`رابط الزر في قسم "${section.title}" غير آمن.`);
            }
            const actions = document.createElement('div');
            const link = document.createElement('a');
            actions.className = 'text-center mt-4';
            link.className = 'btn btn-lime';
            link.textContent = section.buttonText;
            link.href = section.buttonHref;
            actions.append(link);
            container.append(actions);
        }

        sectionElement.append(container);
        list.append(sectionElement);
    });
}

function renderContactDetails(settings) {
    document.querySelectorAll('[data-site-address]').forEach((element) => {
        element.textContent = settings.address;
        setElementVisibility(element.parentElement, Boolean(settings.address));
    });

    document.querySelectorAll('[data-site-email]').forEach((element) => {
        element.textContent = settings.email;
        element.href = `mailto:${settings.email}`;
    });
    setElementVisibility(document.getElementById('contactEmailRow'), Boolean(settings.email));

    document.querySelectorAll('[data-site-phone]').forEach((element) => {
        element.textContent = settings.phone;
        element.href = `tel:${settings.phone.replace(/[^\d+*#,;]/g, '')}`;
    });
    setElementVisibility(document.getElementById('contactPhoneRow'), Boolean(settings.phone));
    setElementVisibility(document.getElementById('footerPhoneRow'), Boolean(settings.phone));
}

function setElementVisibility(element, visible) {
    element.hidden = !visible;
    element.classList.toggle('d-none', !visible);
}

try {
    siteContent = MadarSiteContent.load();
    renderSiteContent(siteContent);
} catch (error) {
    console.error('تعذر تحميل بيانات الصفحة الرئيسية:', error);
    const alert = document.createElement('p');
    alert.className = 'alert alert-warning m-3';
    alert.setAttribute('role', 'alert');
    alert.textContent = `تعذر تحميل بعض بيانات الصفحة من التخزين المحلي: ${error.message}`;
    document.body.prepend(alert);
}

window.addEventListener('storage', (event) => {
    if (event.key !== MadarSiteContent.key && event.key !== null) {
        return;
    }

    try {
        siteContent = MadarSiteContent.load();
        renderSiteContent(siteContent);
    } catch (error) {
        console.error('تعذر تحديث بيانات الصفحة الرئيسية:', error);
    }
});

const fadeUpElements = document.querySelectorAll(
    '.section-header, .custom-card, .custom-home-section, .vision-mission-card, .gallery-card, .feature-box, ' +
    '.contact-section .col-lg-5, .contact-form-container, .footer .col-lg-4'
);

fadeUpElements.forEach((element, index) => {
    element.classList.add('fade-up-pending');
    element.style.setProperty('--fade-up-delay', `${(index % 3) * 100}ms`);
});

if ('IntersectionObserver' in window) {
    const fadeUpObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    fadeUpElements.forEach((element) => fadeUpObserver.observe(element));
} else {
    fadeUpElements.forEach((element) => element.classList.add('is-visible'));
}

const heroCarousel = document.querySelector('.hero-carousel');

if (heroCarousel) {
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const indicators = Array.from(heroCarousel.querySelectorAll('.hero-indicator'));
    const previousButton = heroCarousel.querySelector('.hero-previous');
    const nextButton = heroCarousel.querySelector('.hero-next');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeSlide = slides.findIndex((slide) => slide.classList.contains('is-active'));
    let autoplayTimer;

    function showSlide(index) {
        activeSlide = (index + slides.length) % slides.length;

        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;
            slide.classList.toggle('is-active', isActive);
            slide.setAttribute('aria-hidden', String(!isActive));
            slide.inert = !isActive;
        });

        indicators.forEach((indicator, indicatorIndex) => {
            const isActive = indicatorIndex === activeSlide;
            indicator.classList.toggle('is-active', isActive);

            if (isActive) {
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.removeAttribute('aria-current');
            }
        });
    }

    function stopAutoplay() {
        window.clearInterval(autoplayTimer);
    }

    function startAutoplay() {
        stopAutoplay();

        if (!prefersReducedMotion && !document.hidden) {
            autoplayTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
        }
    }

    previousButton.addEventListener('click', () => {
        showSlide(activeSlide - 1);
        startAutoplay();
    });

    nextButton.addEventListener('click', () => {
        showSlide(activeSlide + 1);
        startAutoplay();
    });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            startAutoplay();
        });
    });

    heroCarousel.addEventListener('mouseenter', stopAutoplay);
    heroCarousel.addEventListener('mouseleave', startAutoplay);
    heroCarousel.addEventListener('focusin', stopAutoplay);
    heroCarousel.addEventListener('focusout', (event) => {
        if (!heroCarousel.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });
    document.addEventListener('visibilitychange', startAutoplay);

    showSlide(activeSlide);
    startAutoplay();
}