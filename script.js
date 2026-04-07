document.addEventListener("DOMContentLoaded", () => {
    // 1. Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Smooth scroll via JS (acts as a polyfill or enhanced control over CSS smooth scroll)
                let scrollOptions = {
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                };
                window.scrollTo(scrollOptions);
            }
        });
    });

    // 2. Intersection Observer for Fade-In Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once it has faded in once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // 3. Custom Cursor Logic
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let vel = { x: 0, y: 0 };
        
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        const renderCursor = () => {
            // Spring animation for smooth catching up
            pos.x += (mouse.x - pos.x) * 0.35;
            pos.y += (mouse.y - pos.y) * 0.35;
            
            // Calculate velocity tracking for ellipse distortion
            vel.x = mouse.x - pos.x;
            vel.y = mouse.y - pos.y;
            
            const angle = Math.atan2(vel.y, vel.x) * 180 / Math.PI;
            const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
            
            // Stretch horizontally and squeeze vertically based on speed
            const scaleX = 1 + Math.min(speed * 0.04, 1.5);
            const scaleY = 1 - Math.min(speed * 0.015, 0.5);
            
            // Apply all transforms: position, center alignment, rotation, and scale
            cursor.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
            
            requestAnimationFrame(renderCursor);
        };
        requestAnimationFrame(renderCursor);
        
        // Add hover effect for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .btn, .bento-card, .hero-portrait');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 4. Hide Navbar on Scroll Down (Mobile)
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768) {
            if (window.scrollY > lastScrollY && window.scrollY > 80) {
                // Scrolling down past 80px: hide
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up or at top: show
                navbar.style.transform = 'translateY(0)';
            }
        } else {
            // Always show on desktop
            navbar.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
});
