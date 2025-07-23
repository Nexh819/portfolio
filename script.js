
// ========================================
// PROFESSIONAL PORTFOLIO JAVASCRIPT
// Mathew Munene - Full Stack Developer
// ========================================

'use strict';

// Global Variables
let currentTestimonial = 0;
let chatOpen = false;
let isLoading = true;
let darkMode = false;
// ========================================
// CV DOWNLOAD MANAGER - ADD THIS NEW SECTION
// ========================================

class CVDownloadManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupDownloadLinks();
    }

    setupDownloadLinks() {
        // Find all CV download links
        const cvLinks = document.querySelectorAll('a[download*="CV"], a[href*="cv/"]');
        
        cvLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.downloadCV();
            });
        });

        console.log('✅ CV download manager initialized');
    }

    downloadCV() {
        try {
            console.log('📄 Starting CV download...');
            
            // Create download link
            const link = document.createElement('a');
            link.href = 'assets/Mathew_Munene_CV.pdf';
link.download = 'Mathew_Munene_CV.pdf';
            link.style.display = 'none';
            
            // Add to page, click, then remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('📄 CV download started!', 'success');
            console.log('✅ CV download triggered successfully');
            
        } catch (error) {
            console.error('❌ CV download failed:', error);
            this.showNotification(
                '📧 Please contact me at munenemathew07@gmail.com for my CV!', 
                'info'
            );
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}
// ========================================
// LOADING SCREEN & INITIALIZATION
// ========================================

class LoadingManager {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.loadingWords = ['Initializing', 'Loading Assets', 'Preparing Portfolio', 'Almost Ready'];
        this.currentWordIndex = 0;
        this.progress = 0;

        // Add null checks
        if (!this.loadingScreen || !this.progressFill || !this.progressText) {
            console.warn('Loading screen elements not found');
            this.initializeApp();
            return;
        }
    }

    init() {
        this.animateLoading();
        this.simulateProgress();
    }

    animateLoading() {
        const loadingWord = document.querySelector('.loading-word');
        
        setInterval(() => {
            if (this.progress < 100) {
                loadingWord.textContent = this.loadingWords[this.currentWordIndex];
                this.currentWordIndex = (this.currentWordIndex + 1) % this.loadingWords.length;
            }
        }, 800);
    }

    simulateProgress() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.completeLoading();
            }
            
            this.updateProgress();
        }, 200);
    }

    updateProgress() {
        this.progressFill.style.width = `${this.progress}%`;
        this.progressText.textContent = `${Math.floor(this.progress)}%`;
    }

    completeLoading() {
        setTimeout(() => {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
                isLoading = false;
                this.initializeApp();
            }, 500);
        }, 500);
    }

    initializeApp() {
    // Initialize critical components immediately
    const initializeComponent = (ComponentClass) => {
        try {
            return new ComponentClass();
        } catch (error) {
            console.warn(`Failed to initialize component:`, error);
            return null;
        }
    };

    // Initialize critical components first
    initializeComponent(NavigationManager);
    initializeComponent(ThemeManager);
    initializeComponent(CVDownloadManager);
    
    // Use requestIdleCallback for better performance
    const initializeSecondary = (ComponentClass) => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => initializeComponent(ComponentClass));
        } else {
            setTimeout(() => initializeComponent(ComponentClass), 0);
        }
    };

    // Initialize non-critical components when browser is idle
    [
        AnimationManager,
        ProjectManager,
        ContactManager,
        ChatWidget,
        TestimonialSlider,
        SkillsAnimator,
        ParticleSystem,
        ScrollManager,
        PerformanceMonitor,
        CursorEffects,
        AccessibilityManager,
        ErrorHandler,
        MemoryManager
    ].forEach(ComponentClass => initializeSecondary(ComponentClass));
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }

    console.log('🚀 Portfolio initialized successfully!');
}
}
// Add mobile optimizations
if (window.innerWidth <= 768) {
    // Reduce particle count on mobile
    if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
        window.pJSDom[0].pJS.particles.number.value = 30;
    }
    
    // Disable cursor effects on mobile
    const cursorFollower = document.getElementById('cursorFollower');
    if (cursorFollower) {
        cursorFollower.style.display = 'none';
    }
    
    // Reduce animation complexity
    document.body.classList.add('mobile-optimized');
}
// ========================================
// NAVIGATION MANAGER
// ========================================

class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id], header[id]');
        
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveLinks();
        this.setupNavbarBehavior();
    }

    setupMobileMenu() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.showMenu());
        }
        
        if (this.navClose) {
            this.navClose.addEventListener('click', () => this.hideMenu());
        }

        // Close menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.hideMenu());
        });
    }

    showMenu() {
        this.navMenu.classList.add('show-menu');
    }

    hideMenu() {
        this.navMenu.classList.remove('show-menu');
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offset = this.navbar.offsetHeight + 20;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveLinks() {
        window.addEventListener('scroll', () => {
            let current = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupNavbarBehavior() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add background on scroll
            if (scrollTop > 100) {
                this.navbar.classList.add('navbar-scrolled');
            } else {
                this.navbar.classList.remove('navbar-scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

// ========================================
// THEME MANAGER
// ========================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.body = document.body;
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.setupThemeToggle();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        if (savedTheme === 'dark') {
            this.enableDarkMode();
        }
    }

    setupThemeToggle() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        if (darkMode) {
            this.enableLightMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        this.body.setAttribute('data-theme', 'dark');
        this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('portfolio-theme', 'dark');
        darkMode = true;
        
        // Update particles color for dark mode
        this.updateParticlesTheme('dark');
    }

    enableLightMode() {
        this.body.setAttribute('data-theme', 'light');
        this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('portfolio-theme', 'light');
        darkMode = false;
        
        // Update particles color for light mode
        this.updateParticlesTheme('light');
    }

    updateParticlesTheme(theme) {
        if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
            const particleColor = theme === 'dark' ? '#ffffff' : '#3b82f6';
            try {
                window.pJSDom[0].pJS.particles.color.value = particleColor;
                window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
                // Refresh particles
                window.pJSDom[0].pJS.fn.particlesRefresh();
            } catch (error) {
                console.warn('Could not update particle theme:', error);
            }
        }
    }
}

// ========================================
// ANIMATION MANAGER
// ========================================

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupCounterAnimations();
        this.setupTypingEffect();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('.section, .card, .project-card, .service-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupHoverEffects() {
        // Skill tags hover effect
        document.querySelectorAll('.skill-tag, .tech-item').forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Project cards hover effect
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            });
        });
    }

    setupCounterAnimations() {
        const counterElements = document.querySelectorAll('[data-count]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counterElements.forEach(el => {
            counterObserver.observe(el);
        });
    }

   animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    if (isNaN(target)) return;
    
    // Reset to 0 first
    element.textContent = '0';
    
    const duration = 2000;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target; // Ensure exact final value
        }
    };
    
    requestAnimationFrame(animate);
}

    setupTypingEffect() {
        // Initialize typed.js if element exists
        const typedElement = document.getElementById('typed-text');
        if (typedElement && typeof Typed !== 'undefined') {
            new Typed('#typed-text', {
                strings: [
                    'Full Stack Developer',
                    'Data Scientist', 
                    'UI/UX Designer',
                    'Problem Solver',
                    'Tech Innovator',
                    'Digital Creator'
                ],
                typeSpeed: 60,
                backSpeed: 40,
                backDelay: 2000,
                startDelay: 1000,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                autoInsertCss: true
            });
        }
    }
}

// ========================================
// PROJECT MANAGER
// ========================================

class ProjectManager {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.setupFiltering();
        this.setupProjectModals();
    }

    setupFiltering() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.filterProjects(filter);
                this.updateActiveFilter(e.target);
            });
        });
    }

    filterProjects(category) {
        this.projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    updateActiveFilter(activeButton) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    setupProjectModals() {
    // Setup project modal functionality
    window.openProjectModal = (projectId) => {
        const modal = document.getElementById('projectModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalTitle && modalBody) {
            const projectData = this.getProjectData(projectId);
            
            modalTitle.textContent = projectData.title;
            modalBody.innerHTML = projectData.content;
            modal.style.display = 'flex';
            
            document.body.style.overflow = 'hidden';
        }
    };

        window.closeProjectModal = () => {
            const modal = document.getElementById('projectModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Close modal on outside click
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('projectModal');
            if (e.target === modal) {
                window.closeProjectModal();
            }
        });
    }

    getProjectData(projectId) {
        const projects = {
            'project1': {
                title: 'Advanced E-Commerce Platform',
                content: `
                    <div class="project-details">
                        <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="E-Commerce Platform">
                        <h4>Project Overview</h4>
                        <p>A comprehensive e-commerce solution built from scratch with modern technologies and best practices.</p>
                        
                        <h4>Key Features</h4>
                        <ul>
                            <li>Real-time inventory management</li>
                            <li>Secure payment processing with Stripe</li>
                            <li>Advanced search and filtering</li>
                            <li>Admin dashboard with analytics</li>
                            <li>Mobile-responsive design</li>
                        </ul>
                        
                        <h4>Technologies Used</h4>
                        <div class="tech-stack">
                            <span class="tech-tag">React</span>
                            <span class="tech-tag">Node.js</span>
                            <span class="tech-tag">MongoDB</span>
                            <span class="tech-tag">Stripe API</span>
                            <span class="tech-tag">Socket.io</span>
                        </div>
                        
                        <div class="project-actions">
                            <a href="#" class="btn btn-primary">Live Demo</a>
                            <a href="#" class="btn btn-outline">View Code</a>
                        </div>
                    </div>
                `
            }
            // Add more projects as needed
        };
        
        return projects[projectId] || { title: 'Project Details', content: '<p>Project details not available.</p>' };
    }
}

// ========================================
// SKILLS ANIMATOR
// ========================================

class SkillsAnimator {
    constructor() {
        this.init();
    }

    init() {
        this.setupProgressBars();
    }

    setupProgressBars() {
        const progressBars = document.querySelectorAll('.skill-progress');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    animateProgressBar(progressBar) {
        const width = progressBar.getAttribute('data-width');
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s ease-out';
            progressBar.style.width = width;
        }, 200);
    }
}

// ========================================
// CONTACT MANAGER
// ========================================

class ContactManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFormSubmission();
        }
    }

    setupFormValidation() {
    if (!this.form) return;
    
    const inputs = this.form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        const validateHandler = (e) => this.validateField(e.target);
        const clearHandler = (e) => this.clearError(e.target);
        
        input.addEventListener('blur', validateHandler);
        input.addEventListener('input', clearHandler);
    });
}

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                }
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;
                
            case 'subject':
                if (!value) {
                    errorMessage = 'Please select a subject';
                    isValid = false;
                }
                break;
                
            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                }
                break;
        }

        this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            field.classList.toggle('error', !!message);
        }
    }

    clearError(field) {
        const errorElement = document.getElementById(`${field.name}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            field.classList.remove('error');
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    submitForm() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Validate all fields
        let isFormValid = true;
        const requiredFields = this.form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showSuccessMessage();
            this.form.reset();
            
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.classList.add('show');
            
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ========================================
// CHAT WIDGET
// ========================================

class ChatWidget {
    constructor() {
        this.chatWidget = document.getElementById('chatWidget');
        this.chatBox = document.getElementById('chatBox');
        this.chatButton = document.querySelector('.chat-button');
        this.chatInput = document.getElementById('chatInput');
        this.chatMessages = document.getElementById('chatMessages');
        
        // Add null checks
        if (!this.chatWidget || !this.chatBox || !this.chatButton) {
            console.warn('Chat elements not found');
            return;
        }
        
        this.init();
    }

    init() {
        this.setupChatToggle();
        this.setupChatInput();
        this.setupSuggestions();
        this.setupTouchSupport();
        this.setupChatClose();
        this.showWelcomeMessage();
    }

    setupTouchSupport() {
    // Add touch support for mobile devices
    if ('ontouchstart' in window && this.chatButton) {
        this.chatButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.toggleChat();
        });
    }
}

    setupChatToggle() {
    if (this.chatButton) {
        this.chatButton.addEventListener('click', () => this.toggleChat());
    }
}

    setupChatInput() {
    if (this.chatInput) {
        this.chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    const chatSend = document.querySelector('.chat-send');
    if (chatSend) {
        chatSend.addEventListener('click', () => this.sendMessage());
    }
}

setupSuggestions() {
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (this.chatInput) {
                this.chatInput.value = btn.textContent;
                this.sendMessage();
            }
        });
    });
}
setupChatClose() {
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', () => {
            chatOpen = false;
            this.chatBox.style.display = 'none';
        });
    }
}

toggleChat() {
    if (this.chatBox) {
        chatOpen = !chatOpen;
        
        if (chatOpen) {
            this.chatBox.style.display = 'flex';
            this.hideNotification();
        } else {
            this.chatBox.style.display = 'none';
        }
    }
}
    sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            this.chatInput.value = '';
            
            // Show typing indicator
            this.showTypingIndicator();
            
            // Generate bot response
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.generateResponse(message);
                this.addMessage(response, 'bot');
            }, 1500);
        }
    }

    addMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message; // Safe text content
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = time;
    
    messageContent.appendChild(messageParagraph);
    messageContent.appendChild(timeSpan);
    
    if (sender === 'bot') {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        const img = document.createElement('img');
        img.src = 'profile.jpg';
        img.alt = 'Mathew';
        avatar.appendChild(img);
        messageElement.appendChild(avatar);
    }
    
    messageElement.appendChild(messageContent);
    this.chatMessages.appendChild(messageElement);
    this.scrollToBottom();
}

    showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message bot typing-indicator';
        typingElement.innerHTML = `
            <div class="message-avatar">
                <img src="profile.jpg" alt="Mathew">
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = this.chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        const responses = {
            greeting: [
                "Hello! 👋 Great to see you here! How can I help you today?",
                "Hi there! 😊 Thanks for visiting my portfolio. What would you like to know?",
                "Hey! 🎉 Welcome to my portfolio. Feel free to ask me anything!"
            ],
            services: [
                "I offer full-stack development, UI/UX design, data analytics, and consulting services. Each project starts at different price points based on complexity. Would you like to know more about a specific service?",
                "My main services include web development, mobile apps, data science solutions, and digital consulting. I'd be happy to discuss your specific needs!"
            ],
            projects: [
                "I've worked on 50+ projects including e-commerce platforms, data dashboards, mobile apps, and AI solutions. Check out my Projects section for detailed case studies!",
                "My portfolio showcases work in web development, mobile apps, data science, and UI/UX design. Which type of project interests you most?"
            ],
            contact: [
                "You can reach me at munenemathew07@gmail.com or call +254 745 207 444. I typically respond within 24 hours!",
                "Feel free to use the contact form below or email me directly. I'm always excited to discuss new projects!"
            ],
            pricing: [
                "My rates vary by project complexity: Web development starts at $500, Full-stack solutions at $1,200, and consulting at $100/hour. Let's discuss your specific needs!",
                "Project pricing depends on scope and timeline. I offer competitive rates and can work within most budgets. Shall we schedule a call to discuss?"
            ],
            experience: [
                "I have 3+ years of professional experience in full-stack development, with expertise in React, Python, Node.js, and modern web technologies.",
                "I've been coding professionally for 3+ years, working with startups and established companies. I specialize in modern web technologies and data science."
            ],
            default: [
                "That's a great question! I'd love to help you with that. Could you provide more details so I can give you the best answer?",
                "Thanks for asking! For detailed discussions about your specific needs, feel free to use the contact form or email me directly.",
                "I appreciate your interest! Let's connect via the contact form so I can give you a comprehensive response."
            ]
        };

        // Determine response category
        let category = 'default';
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            category = 'greeting';
        } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you do')) {
            category = 'services';
        } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work')) {
            category = 'projects';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
            category = 'contact';
        } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('rate')) {
            category = 'pricing';
        } else if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
            category = 'experience';
        }

        // Return random response from category
        const categoryResponses = responses[category];
        return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    showWelcomeMessage() {
    // Show notification after 3 seconds
    setTimeout(() => {
        if (!chatOpen) {
            this.showNotification();
        }
    }, 3000);
    
    // Auto-hide notification after 10 seconds
    setTimeout(() => {
        if (!chatOpen) {
            this.hideNotification();
        }
    }, 13000);
    
    // Show notification again every 30 seconds
    setInterval(() => {
        if (!chatOpen) {
            this.showNotification();
            setTimeout(() => {
                if (!chatOpen) {
                    this.hideNotification();
                }
            }, 5000);
        }
    }, 30000);
}
    showNotification() {
    if (!this.chatButton) {
        console.log('❌ Chat button not found');
        return;
    }
    
    const notification = this.chatButton.querySelector('.chat-notification');
    if (notification) {
        notification.style.display = 'block';
        notification.style.animation = 'bounce 0.6s ease-in-out';
        
        // Apply pop animation to the button
        this.chatButton.style.animation = 'chatPop 0.8s ease-out';
        
        // Reset animation after completion
        setTimeout(() => {
            this.chatButton.style.animation = 'pulseGlow 2s infinite';
        }, 800);
        
        console.log('💬 Chat notification shown with pop animation');
    } else {
        console.log('❌ Chat notification element not found');
    }
}

   hideNotification() {
    if (!this.chatButton) return;
    
    const notification = this.chatButton.querySelector('.chat-notification');
    if (notification) {
        notification.style.display = 'none';
        this.chatButton.style.animation = 'pulseGlow 2s infinite';
    }
}
}

// ========================================
// TESTIMONIAL SLIDER
// ========================================

class TestimonialSlider {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.querySelector('.testimonial-prev');
        this.nextBtn = document.querySelector('.testimonial-next');
        this.currentIndex = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        
        if (this.testimonials.length === 0) {
            console.warn('No testimonials found');
            return;
        }
        
        this.init();
    }

    init() {
        this.setupControls();
        this.setupDots();
        this.setupKeyboardNavigation();
        this.setupTouchSupport();
        this.setupHoverPause();
        this.showTestimonial(0, false);
        this.startAutoPlay();
        
        console.log('✅ Testimonial slider initialized with animations');
    }

    setupControls() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousTestimonial());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextTestimonial());
        }

        window.changeTestimonial = (direction) => {
            if (direction === 1) {
                this.nextTestimonial();
            } else {
                this.previousTestimonial();
            }
        };

        window.currentTestimonial = (index) => {
            this.goToTestimonial(index - 1);
        };
    }

    setupDots() {
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToTestimonial(index));
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousTestimonial();
            } else if (e.key === 'ArrowRight') {
                this.nextTestimonial();
            }
        });
    }

    setupTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        const slider = document.querySelector('.testimonials-slider');
        if (!slider) return;

        slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        slider.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });

        const handleSwipe = () => {
            const threshold = 50;
            const diff = startX - endX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.nextTestimonial();
                } else {
                    this.previousTestimonial();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }

    setupHoverPause() {
        const slider = document.querySelector('.testimonials-slider');
        if (slider) {
            slider.addEventListener('mouseenter', () => this.stopAutoPlay());
            slider.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    nextTestimonial() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentIndex + 1) % this.testimonials.length;
        this.showTestimonial(nextIndex, true);
    }

    previousTestimonial() {
        if (this.isAnimating) return;
        
        const prevIndex = this.currentIndex === 0 ? this.testimonials.length - 1 : this.currentIndex - 1;
        this.showTestimonial(prevIndex, true);
    }

    goToTestimonial(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.showTestimonial(index, true);
    }

    showTestimonial(index, animate = true) {
        if (index < 0 || index >= this.testimonials.length) return;
        
        this.isAnimating = animate;
        
        this.testimonials.forEach((testimonial) => {
            testimonial.classList.remove('active', 'prev', 'next');
        });

        this.testimonials[index].classList.add('active');
        
        const prevIndex = index === 0 ? this.testimonials.length - 1 : index - 1;
        const nextIndex = (index + 1) % this.testimonials.length;
        
        if (this.testimonials[prevIndex]) {
            this.testimonials[prevIndex].classList.add('prev');
        }
        if (this.testimonials[nextIndex]) {
            this.testimonials[nextIndex].classList.add('next');
        }

        this.dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('active', dotIndex === index);
        });

        this.currentIndex = index;

        if (animate) {
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        } else {
            this.isAnimating = false;
        }
    }

    startAutoPlay() {
        this.stopAutoPlay();
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.isAnimating) {
                this.nextTestimonial();
            }
        }, this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ========================================
// PARTICLE SYSTEM
// ========================================

class ParticleSystem {
   constructor() {
       this.init();
   }

   init() {
       setTimeout(() => {
           if (typeof particlesJS !== 'undefined') {
               this.initializeParticles();
           }
       }, 1000);
   }

   initializeParticles() {
       particlesJS('particles-js', {
           particles: {
               number: {
                   value: 80,
                   density: {
                       enable: true,
                       value_area: 800
                   }
               },
               color: {
                   value: darkMode ? '#ffffff' : '#3b82f6'
               },
               shape: {
                   type: 'circle',
                   stroke: {
                       width: 0,
                       color: '#000000'
                   }
               },
               opacity: {
                   value: 0.4,
                   random: false,
                   anim: {
                       enable: false,
                       speed: 1,
                       opacity_min: 0.1,
                       sync: false
                   }
               },
               size: {
                   value: 3,
                   random: true,
                   anim: {
                       enable: false,
                       speed: 40,
                       size_min: 0.1,
                       sync: false
                   }
               },
               line_linked: {
                   enable: true,
                   distance: 150,
                   color: darkMode ? '#ffffff' : '#3b82f6',
                   opacity: 0.3,
                   width: 1
               },
               move: {
                   enable: true,
                   speed: 2,
                   direction: 'none',
                   random: false,
                   straight: false,
                   out_mode: 'out',
                   bounce: false,
                   attract: {
                       enable: false,
                       rotateX: 600,
                       rotateY: 1200
                   }
               }
           },
           interactivity: {
               detect_on: 'canvas',
               events: {
                   onhover: {
                       enable: true,
                       mode: 'repulse'
                   },
                   onclick: {
                       enable: true,
                       mode: 'push'
                   },
                   resize: true
               },
               modes: {
                   grab: {
                       distance: 400,
                       line_linked: {
                           opacity: 1
                       }
                   },
                   bubble: {
                       distance: 400,
                       size: 40,
                       duration: 2,
                       opacity: 8,
                       speed: 3
                   },
                   repulse: {
                       distance: 100,
                       duration: 0.4
                   },
                   push: {
                       particles_nb: 4
                   },
                   remove: {
                       particles_nb: 2
                   }
               }
           },
           retina_detect: true
       });
   }
}

// ========================================
// SCROLL MANAGER
// ========================================

class ScrollManager {
   constructor() {
       this.scrollToTopBtn = document.getElementById('scrollToTop');
       this.init();
   }

   init() {
       this.setupScrollToTop();
       this.setupScrollIndicator();
   }

   setupScrollToTop() {
       window.scrollToTop = () => {
           window.scrollTo({
               top: 0,
               behavior: 'smooth'
           });
       };

       window.addEventListener('scroll', () => {
           if (this.scrollToTopBtn) {
               if (window.pageYOffset > 300) {
                   this.scrollToTopBtn.classList.add('show');
               } else {
                   this.scrollToTopBtn.classList.remove('show');
               }
           }
       });
   }

   setupScrollIndicator() {
       // Create scroll progress indicator
       const scrollProgress = document.createElement('div');
       scrollProgress.className = 'scroll-progress';
       document.body.appendChild(scrollProgress);

       window.addEventListener('scroll', () => {
           const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
           const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
           const scrolled = (winScroll / height) * 100;
           scrollProgress.style.width = scrolled + '%';
       });
   }
}

// ========================================
// SERVICE WORKER REGISTRATION
// ========================================

class ServiceWorkerManager {
   constructor() {
       this.init();
   }

   init() {
       if ('serviceWorker' in navigator) {
           window.addEventListener('load', () => {
               navigator.serviceWorker.register('/sw.js')
                   .then((registration) => {
                       console.log('SW registered: ', registration);
                   })
                   .catch((registrationError) => {
                       console.log('SW registration failed: ', registrationError);
                   });
           });
       }
   }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Improved CV Download Function
// Consolidated Utility Functions
class UtilityManager {
    static downloadCV() {
        try {
            console.log('📄 Starting CV download...');
            
            const link = document.createElement('a');
            link.href = 'assets/Mathew_Munene_CV.pdf';
            link.download = 'Mathew_Munene_CV.pdf';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            UtilityManager.showNotification('📄 CV download started!', 'success');
            console.log('✅ CV download triggered successfully');
            
        } catch (error) {
            console.error('❌ CV download failed:', error);
            UtilityManager.showNotification('📧 Please contact me at munenemathew07@gmail.com for my CV!', 'info');
        }
    }

    static scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = document.createElement('i');
        icon.className = `fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}`;
        
        const span = document.createElement('span');
        span.textContent = message;
        
        notification.appendChild(icon);
        notification.appendChild(span);
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Global functions for HTML event handlers
window.downloadCV = () => UtilityManager.downloadCV();
window.scrollToTop = () => UtilityManager.scrollToTop();

// Helper function for notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = document.createElement('i');
    icon.className = `fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}`;
    
    const span = document.createElement('span');
    span.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(span);
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Performance Monitoring
class PerformanceMonitor {
   constructor() {
       this.init();
   }

   init() {
       // Monitor page load performance
       window.addEventListener('load', () => {
           setTimeout(() => {
               this.logPerformanceMetrics();
           }, 1000);
       });
   }

   logPerformanceMetrics() {
       if ('performance' in window) {
           const perfData = performance.getEntriesByType('navigation')[0];
           const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
           
           console.log('📊 Performance Metrics:');
           console.log(`⚡ Page Load Time: ${loadTime}ms`);
           console.log(`🔄 DOM Content Loaded: ${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
           console.log(`🎨 First Paint: ${performance.getEntriesByType('paint')[0]?.startTime || 'N/A'}ms`);
       }
   }
}

// ========================================
// CURSOR EFFECTS
// ========================================

class CursorEffects {
   constructor() {
       this.cursor = document.getElementById('cursorFollower');
       this.init();
   }

   init() {
       if (window.innerWidth > 768) { // Only on desktop
           this.setupCursorFollower();
       }
   }

   setupCursorFollower() {
       document.addEventListener('mousemove', (e) => {
           if (this.cursor) {
               this.cursor.style.left = e.clientX + 'px';
               this.cursor.style.top = e.clientY + 'px';
           }
       });

       // Add hover effects for interactive elements
       const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .service-card');
       
       interactiveElements.forEach(el => {
           el.addEventListener('mouseenter', () => {
               if (this.cursor) {
                   this.cursor.classList.add('cursor-hover');
               }
           });

           el.addEventListener('mouseleave', () => {
               if (this.cursor) {
                   this.cursor.classList.remove('cursor-hover');
               }
           });
       });
   }
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

class AccessibilityManager {
   constructor() {
       this.init();
   }

   init() {
       this.setupKeyboardNavigation();
       this.setupFocusManagement();
       this.setupReducedMotion();
   }

   setupKeyboardNavigation() {
       // Add keyboard navigation for custom elements
       document.addEventListener('keydown', (e) => {
           if (e.key === 'Escape') {
               // Close modals on escape
               if (chatOpen) {
               }
               if (typeof window.closeProjectModal === 'function') {
                   window.closeProjectModal();
               }
           }
       });
   }

   setupFocusManagement() {
       // Improve focus management for screen readers
       const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
       
       focusableElements.forEach(el => {
           el.addEventListener('focus', () => {
               el.classList.add('keyboard-focus');
           });

           el.addEventListener('blur', () => {
               el.classList.remove('keyboard-focus');
           });
       });
   }

   setupReducedMotion() {
       // Respect user's reduced motion preference
       if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
           document.body.classList.add('reduced-motion');
       }
   }
}

// ========================================
// ERROR HANDLING
// ========================================

class ErrorHandler {
    constructor() {
        this.errorCount = 0;
        this.maxErrors = 5; // Reduced from 10
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => {
            this.handleError('JavaScript Error', e.error || e.message, e.filename, e.lineno);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.handleError('Unhandled Promise Rejection', e.reason);
        });
    }

    handleError(type, error, filename = '', lineno = '') {
        this.errorCount++;
        
        if (this.errorCount <= this.maxErrors) {
            const errorInfo = {
                type,
                message: error?.message || error,
                filename,
                lineno,
                timestamp: new Date().toISOString()
            };
            
            console.error(`${type}:`, errorInfo);
            
            // Store errors for debugging
            if (!window.portfolioErrors) {
                window.portfolioErrors = [];
            }
            window.portfolioErrors.push(errorInfo);
        }
    }
}
// ========================================
// MEMORY MANAGER
// ========================================
class MemoryManager {
    constructor() {
        this.observers = [];
        this.eventListeners = [];
        this.init();
    }

    init() {
        this.setupCleanup();
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({ element, event, handler });
    }

    setupCleanup() {
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    cleanup() {
        // Disconnect observers
        this.observers.forEach(observer => {
            if (observer && typeof observer.disconnect === 'function') {
                observer.disconnect();
            }
        });

        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
            element.removeEventListener(event, handler);
        });

        console.log('🧹 Memory cleanup completed');
    }
}

// ========================================
// ADDITIONAL DYNAMIC STYLES
// ========================================

const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
   /* Loading animations */
   @keyframes fadeInUp {
       from {
           opacity: 0;
           transform: translateY(30px);
       }
       to {
           opacity: 1;
           transform: translateY(0);
       }
   }

   @keyframes slideInLeft {
       from {
           opacity: 0;
           transform: translateX(-30px);
       }
       to {
           opacity: 1;
           transform: translateX(0);
       }
   }

   @keyframes bounce {
       0%, 20%, 60%, 100% {
           transform: translateY(0);
       }
       40% {
           transform: translateY(-10px);
       }
       80% {
           transform: translateY(-5px);
       }
   }

   @keyframes pulse {
       0% {
           transform: scale(1);
       }
       50% {
           transform: scale(1.05);
       }
       100% {
           transform: scale(1);
       }
   }
@keyframes chatPop {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
   /* Scroll progress bar */
   .scroll-progress {
       position: fixed;
       top: 0;
       left: 0;
       width: 0%;
       height: 3px;
       background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
       z-index: 9999;
       transition: width 0.3s ease;
   }

   /* Cursor follower */
   .cursor-follower {
       position: fixed;
       width: 20px;
       height: 20px;
       border: 2px solid var(--primary-color);
       border-radius: 50%;
       pointer-events: none;
       z-index: 9999;
       transition: transform 0.2s ease;
       mix-blend-mode: difference;
   }

   .cursor-follower.cursor-hover {
       transform: scale(1.5);
       background: var(--primary-color);
   }

   /* Typing indicator */
   .typing-dots {
       display: flex;
       gap: 4px;
       padding: 8px;
   }

   .typing-dots span {
       width: 6px;
       height: 6px;
       background: var(--text-secondary);
       border-radius: 50%;
       animation: typing 1.4s infinite ease-in-out;
   }

   .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
   .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

   @keyframes typing {
       0%, 80%, 100% {
           transform: scale(0);
       }
       40% {
           transform: scale(1);
       }
   }

   /* Notification styles */
   .notification {
       position: fixed;
       top: 20px;
       right: 20px;
       padding: 15px 20px;
       border-radius: 8px;
       color: white;
       font-weight: 500;
       z-index: 10000;
       transform: translateX(100%);
       transition: transform 0.3s ease;
       display: flex;
       align-items: center;
       gap: 10px;
       max-width: 300px;
   }

   .notification.show {
       transform: translateX(0);
   }

   .notification-success {
       background: #10b981;
   }

   .notification-error {
       background: #ef4444;
   }

   .notification-info {
       background: #3b82f6;
   }

   /* Reduced motion support */
   @media (prefers-reduced-motion: reduce) {
       .reduced-motion * {
           animation-duration: 0.01ms !important;
           animation-iteration-count: 1 !important;
           transition-duration: 0.01ms !important;
       }
   }

   /* Focus styles for accessibility */
   .keyboard-focus {
       outline: 2px solid var(--primary-color);
       outline-offset: 2px;
   }

   /* Mobile optimizations */
   @media (max-width: 768px) {
       .cursor-follower {
           display: none;
       }
       
       .floating-actions {
           bottom: 20px;
           right: 20px;
       }
   }
`;

document.head.appendChild(dynamicStyles);

// ========================================
// CONSOLE STYLING
// ========================================

console.log(
   '%c🚀 Portfolio Loaded Successfully!',
   'color: #3b82f6; font-size: 16px; font-weight: bold; text-shadow: 1px 1px 0px rgba(0,0,0,0.2);'
);

console.log(
   '%cMathew Munene - Full Stack Developer\n' +
   '%cEmail: munenemathew07@gmail.com\n' +
   '%cPhone: +254 745 207 444\n' +
   '%cWebsite: https://mathew-munene.dev',
   'color: #8b5cf6; font-size: 14px; font-weight: bold;',
   'color: #06b6d4; font-size: 12px;',
   'color: #06b6d4; font-size: 12px;',
   'color: #06b6d4; font-size: 12px;'
);

// ========================================
// EXPORT FOR TESTING (if needed)
// ========================================

if (typeof module !== 'undefined' && module.exports) {
   module.exports = {
       LoadingManager,
       NavigationManager,
       ThemeManager,
       AnimationManager,
       ProjectManager,
       ContactManager,
       ChatWidget,
       TestimonialSlider
   };
}
// ========================================
// SIMPLE INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    new LoadingManager().init();
});
// ========================================
// FORCE TESTIMONIAL INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Wait for elements to be ready
    setTimeout(() => {
        const testimonials = document.querySelectorAll('.testimonial-card');
        if (testimonials.length > 0) {
            console.log('🎯 Found', testimonials.length, 'testimonials - initializing slider...');
            new TestimonialSlider();
        } else {
            console.warn('❌ No testimonials found in DOM');
        }
    }, 2000); // Wait 2 seconds for page to fully load
});
// Global theme toggle function
window.toggleTheme = () => {
    const themeManager = new ThemeManager();
    themeManager.toggleTheme();
};

// Global modal close function
window.closeProjectModal = () => {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};