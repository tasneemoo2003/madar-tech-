(function () {
    'use strict';

    const storageKey = 'madarTechHomeContent.v1';
    const serviceIcons = new Set([
        'fa-graduation-cap',
        'fa-mug-hot',
        'fa-chalkboard-user',
        'fa-users',
        'fa-laptop-code',
        'fa-lightbulb'
    ]);

    const defaultContent = {
        version: 1,
        hero: {
            title: 'مساحتك للتعلم، التطور، و',
            highlight: 'صناعة الفرص',
            description: 'نساعد الطلاب والخريجين والشباب على تطوير مهاراتهم، واكتساب الخبرات العملية، والانطلاق نحو فرص جديدة.',
            primaryButtonText: 'اكتشف خدماتنا',
            primaryButtonHref: '#services',
            secondaryButtonText: 'تواصل معنا',
            secondaryButtonHref: '#contact'
        },
        aboutDescription: 'مدار تك مؤسسة تعليمية وتدريبية تسعى إلى ربط المعرفة الأكاديمية بالتطبيق العملي من خلال تقديم برامج تدريبية وأنشطة تعليمية تساعد الشباب على تطوير قدراتهم ومواكبة متطلبات سوق العمل.',
        programs: [
            {
                id: 'program-frontend',
                name: 'Front-End Development',
                category: 'برنامج تقني',
                description: 'تعلم أساسيات تطوير واجهات المواقع الإلكترونية باستخدام HTML5, CSS3, JavaScript و Bootstrap لبناء مواقع متجاوبة وعصرية.',
                audience: 'الطلاب والخريجون',
                date: '2026-12-01',
                status: 'active'
            },
            {
                id: 'program-ai',
                name: 'Artificial Intelligence',
                category: 'الذكاء الاصطناعي',
                description: 'التعرف على أدوات الذكاء الاصطناعي وتطبيقاتها العملية لزيادة الإنتاجية وتسريع وتيرة العمل البرمجي والمهني.',
                audience: 'المهتمون بالتقنية',
                date: '2027-01-10',
                status: 'soon'
            },
            {
                id: 'program-digital-skills',
                name: 'Digital Skills',
                category: 'مهارات مستقبلية',
                description: 'تطوير المهارات الرقمية واستخدام الأدوات التقنية الحديثة لدخول سوق العمل الحر بثبات واحترافية.',
                audience: 'الشباب والباحثون عن عمل',
                date: '2027-02-15',
                status: 'active'
            }
        ],
        services: [
            {
                id: 'service-training',
                title: 'التدريب والتطوير',
                description: 'برامج تدريبية متخصصة تهدف إلى تطوير المهارات التقنية والمهنية من خلال التعلم والتطبيق.',
                icon: 'fa-graduation-cap'
            },
            {
                id: 'service-coworking',
                title: 'مساحات العمل المشتركة',
                description: 'بيئة مناسبة للطلاب والمستقلين وأصحاب المشاريع لإنجاز أعمالهم وتبادل الأفكار.',
                icon: 'fa-mug-hot'
            },
            {
                id: 'service-classrooms',
                title: 'القاعات التدريبية',
                description: 'قاعات مجهزة لاستضافة الدورات التدريبية والاجتماعات والفعاليات والأنشطة.',
                icon: 'fa-chalkboard-user'
            },
            {
                id: 'service-activities',
                title: 'الأنشطة التعليمية',
                description: 'لقاءات ومبادرات تعليمية تساهم في نشر المعرفة وتبادل الخبرات.',
                icon: 'fa-users'
            }
        ],
        customSections: [],
        settings: {
            email: 'madartech1@gmail.com',
            phone: '',
            address: 'خانيونس - بجانب المحكمة الشرعية',
            acceptApplications: true,
            showUpcoming: true
        }
    };

    function cloneDefaults() {
        return JSON.parse(JSON.stringify(defaultContent));
    }

    function requireString(value, field) {
        if (typeof value !== 'string') {
            throw new Error(`قيمة ${field} المحفوظة غير صالحة.`);
        }
    }

    function validateContent(content) {
        if (!content || typeof content !== 'object' || content.version !== 1) {
            throw new Error('إصدار بيانات الموقع المحفوظة غير مدعوم.');
        }

        ['title', 'highlight', 'description', 'primaryButtonText', 'primaryButtonHref', 'secondaryButtonText', 'secondaryButtonHref']
            .forEach((field) => requireString(content.hero && content.hero[field], field));
        if (!isSafeHref(content.hero.primaryButtonHref) || !isSafeHref(content.hero.secondaryButtonHref)) {
            throw new Error('روابط أزرار الواجهة الرئيسية غير صالحة.');
        }
        requireString(content.aboutDescription, 'aboutDescription');

        if (!Array.isArray(content.programs) || !Array.isArray(content.services) || !Array.isArray(content.customSections)) {
            throw new Error('قوائم محتوى الموقع المحفوظة غير صالحة.');
        }

        content.programs.forEach((program) => {
            ['id', 'name', 'category', 'description', 'audience', 'date', 'status']
                .forEach((field) => requireString(program && program[field], field));
            if (!['active', 'soon', 'closed'].includes(program.status)) {
                throw new Error('حالة أحد البرامج المحفوظة غير صالحة.');
            }
        });

        content.services.forEach((service) => {
            ['id', 'title', 'description', 'icon'].forEach((field) => requireString(service && service[field], field));
            if (!serviceIcons.has(service.icon)) {
                throw new Error('أيقونة إحدى الخدمات المحفوظة غير مدعومة.');
            }
        });

        content.customSections.forEach((section) => {
            ['id', 'title', 'description', 'buttonText', 'buttonHref']
                .forEach((field) => requireString(section && section[field], field));
            if (typeof section.visible !== 'boolean') {
                throw new Error('حالة أحد الأقسام الإضافية المحفوظة غير صالحة.');
            }
            if (Boolean(section.buttonText) !== Boolean(section.buttonHref) ||
                (section.buttonHref && !isSafeHref(section.buttonHref))) {
                throw new Error('زر أحد الأقسام الإضافية أو رابطه غير صالح.');
            }
        });

        const settings = content.settings;
        ['email', 'phone', 'address'].forEach((field) => requireString(settings && settings[field], field));
        if (typeof settings.acceptApplications !== 'boolean' || typeof settings.showUpcoming !== 'boolean') {
            throw new Error('إعدادات الموقع المحفوظة غير صالحة.');
        }
    }

    function load() {
        let serialized;

        try {
            serialized = window.localStorage.getItem(storageKey);
        } catch (error) {
            throw new Error(`تعذر الوصول إلى التخزين المحلي: ${error.message}`);
        }

        if (serialized === null) {
            return cloneDefaults();
        }

        let content;
        try {
            content = JSON.parse(serialized);
        } catch (error) {
            throw new Error(`تعذر قراءة بيانات الموقع المحفوظة: ${error.message}`);
        }

        validateContent(content);
        return content;
    }

    function save(content) {
        validateContent(content);
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(content));
        } catch (error) {
            throw new Error(`تعذر حفظ بيانات الموقع في التخزين المحلي: ${error.message}`);
        }
    }

    function reset() {
        const content = cloneDefaults();
        save(content);
        return content;
    }

    function isSafeHref(value) {
        const href = value.trim();
        return /^(https?:\/\/|mailto:|tel:|#|\/|\.\/|index\.html(?:#|$))/i.test(href);
    }

    window.MadarSiteContent = {
        key: storageKey,
        createDefaults: cloneDefaults,
        load,
        save,
        reset,
        isSafeHref
    };
}());
