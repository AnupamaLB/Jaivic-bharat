// main.js - Main JavaScript for Jaivic Bharat

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== MOBILE MENU TOGGLE ======
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('nav') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // ====== SMOOTH PAGE TRANSITIONS ======
    const pageTransition = document.querySelector('.page-transition');
    const allLinks = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="tel"])');
    
    // Add transition when clicking internal links
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't transition for same-page anchors
            if (this.getAttribute('href').startsWith('#')) return;
            
            // Don't transition for external links
            if (this.hostname !== window.location.hostname) return;
            
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Start transition
            if (pageTransition) {
                pageTransition.classList.add('active');
                
                setTimeout(() => {
                    window.location.href = href;
                }, 600);
            } else {
                window.location.href = href;
            }
        });
    });
    
    // ====== FORM HANDLING ======
    const contactForm = document.getElementById('joinForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Add loading state
            const submitBtn = this.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitBtn.disabled = true;
            }
            
            // Formspree will handle the actual submission
            // We keep the loading state until page redirects
        });
    }
    
    // ====== SCROLL REVEAL ANIMATIONS ======
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        });
    }
    
    // Initial check
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // ====== ACTIVE NAV LINK HIGHLIGHTING ======
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Set active link on page load
    setActiveNavLink();
    
    // ====== BACK TO TOP BUTTON ======
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);
    
    // Style the button
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-green);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        z-index: 100;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    `;
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'flex';
            backToTopBtn.style.justifyContent = 'center';
            backToTopBtn.style.alignItems = 'center';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ====== FORM SUCCESS MESSAGE ======
    // Check URL for success parameter (Formspree redirect)
    if (window.location.search.includes('success=true')) {
        const form = document.getElementById('joinForm');
        const successMessage = document.getElementById('formSuccess');
        
        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Clear URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // ====== PAGE LOAD ANIMATION ======
    // Add fade-in class to body on load
    document.body.classList.add('loaded');
    
    // Remove transition overlay after page loads
    window.addEventListener('load', function() {
        if (pageTransition) {
            pageTransition.classList.remove('active');
        }
    });
});

// Add CSS variables to global scope for JavaScript
document.documentElement.style.setProperty('--primary-green', '#2e8b57');