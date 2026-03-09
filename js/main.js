document.addEventListener('DOMContentLoaded', () => {

    /* =======================================================
       1. Mobile Menu Toggle
    ======================================================== */

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = mobileMenuBtn?.querySelector('i');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {

            const isHidden = mobileMenu.classList.toggle('hidden');

            if (!isHidden) {
                mobileMenu.classList.add('animate-fade-in-down');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-bars');
                    menuIcon.classList.add('fa-times');
                }
            } else {
                mobileMenu.classList.remove('animate-fade-in-down');
                if (menuIcon) {
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            }
        });
    }



    /* =======================================================
       2. Sticky Transparent Navbar on Scroll
    ======================================================== */

    const header = document.getElementById('main-header');

    if (header) {

        window.addEventListener('scroll', () => {

            if (window.scrollY > 50) {

                header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-md');
                header.classList.remove('bg-transparent', 'py-4');
                header.classList.add('py-2');

                if (header.dataset.transparent === 'true') {

                    const links = header.querySelectorAll('.nav-link');
                    links.forEach(link => {
                        link.classList.remove('text-white');
                        link.classList.add('text-navy');
                    });

                    const logoText = header.querySelector('.logo-text');
                    if (logoText) {
                        logoText.classList.remove('text-white');
                        logoText.classList.add('text-navy');
                    }

                    if (menuIcon) {
                        menuIcon.classList.remove('text-white');
                        menuIcon.classList.add('text-navy');
                    }
                }

            } else {

                header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-md', 'py-2');
                header.classList.add('py-4');

                if (header.dataset.transparent === 'true') {

                    header.classList.add('bg-transparent');

                    const links = header.querySelectorAll('.nav-link:not(.active)');
                    links.forEach(link => {
                        link.classList.add('text-white');
                        link.classList.remove('text-navy');
                    });

                    const logoText = header.querySelector('.logo-text');
                    if (logoText) {
                        logoText.classList.add('text-white');
                        logoText.classList.remove('text-navy');
                    }

                    if (menuIcon) {
                        menuIcon.classList.add('text-white');
                        menuIcon.classList.remove('text-navy');
                    }

                } else {
                    header.classList.add('bg-white');
                }
            }
        });

        window.dispatchEvent(new Event('scroll'));
    }



    /* =======================================================
       3. Scroll Reveal Animations
    ======================================================== */

    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });



    /* =======================================================
       4. Horizontal Scroll Gallery
    ======================================================== */

    const galleryContainer = document.querySelector('.horizontal-gallery');

    if (galleryContainer) {

        let isDown = false;
        let startX;
        let scrollLeft;

        galleryContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            galleryContainer.classList.add('cursor-grabbing');
            startX = e.pageX - galleryContainer.offsetLeft;
            scrollLeft = galleryContainer.scrollLeft;
        });

        galleryContainer.addEventListener('mouseleave', () => {
            isDown = false;
            galleryContainer.classList.remove('cursor-grabbing');
        });

        galleryContainer.addEventListener('mouseup', () => {
            isDown = false;
            galleryContainer.classList.remove('cursor-grabbing');
        });

        galleryContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - galleryContainer.offsetLeft;
            const walk = (x - startX) * 2;
            galleryContainer.scrollLeft = scrollLeft - walk;
        });
    }



    /* =======================================================
       5. Contact Form Submission
    ======================================================== */

    const handleFormSubmission = (formId, statusId) => {

        const form = document.getElementById(formId);
        const status = document.getElementById(statusId);
        if (!form || !status) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            const inputs = form.querySelectorAll('input, textarea');

            let isValid = true;

            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    isValid = false;
                    input.classList.add('border-red-500');
                } else {
                    input.classList.remove('border-red-500');
                }
            });

            if (!isValid) {
                status.textContent = 'Please fill in all required fields.';
                status.className = 'text-red-500 mt-4 text-sm font-semibold block animate-pulse';
                status.classList.remove('hidden');
                return;
            }

            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i> Sending...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const action = form.getAttribute('action');

            fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(response => {
                    if (response.ok) {
                        status.innerHTML = '<i class="fas fa-check-circle mr-2"></i> Message sent successfully!';
                        status.className = 'text-green-600 mt-6 text-sm font-semibold p-4 bg-green-50 rounded border border-green-200 block animate-fade-in-up';
                        status.classList.remove('hidden');
                        form.reset();
                    } else {
                        status.innerHTML = "Oops! There was a problem submitting your form.";
                        status.className = 'text-red-600 mt-6 text-sm font-semibold p-4 bg-red-50 rounded border border-red-200 block animate-fade-in-up';
                        status.classList.remove('hidden');
                    }
                })
                .catch(() => {
                    status.innerHTML = '<i class="fas fa-exclamation-circle mr-2"></i> Submission failed.';
                    status.className = 'text-red-600 mt-6 text-sm font-semibold p-4 bg-red-50 rounded border border-red-200 block animate-fade-in-up';
                    status.classList.remove('hidden');
                })
                .finally(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    setTimeout(() => { status.classList.add('hidden'); }, 8000);
                });
        });
    };

    handleFormSubmission('contact-form', 'form-status');
    handleFormSubmission('contact-form-home', 'form-status-home');



    /* =======================================================
       6. Page Load Animation
    ======================================================== */

    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

});