// JavaScript Interaction Code
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

    const whatsappUrl = `https://wa.me/972590000000?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank');
});

function openProgramModal(programName) {
    alert('شكراً لاهتمامك ببرنامج ' + programName + '. يمكنك الإرسال عبر نموذج التواصل للتسجيل في الدفعة القادمة!');
}

const fadeUpElements = document.querySelectorAll(
    '.custom-card, .vision-mission-card, .feature-box'
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