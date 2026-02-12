// ===========================
// Disable Right Click & Developer Tools
// ===========================
// Disable right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I (Inspect)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+C (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
});

// Disable text selection
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

// Disable copy
document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
});

// ===========================
// Geometric Background Animation
// ===========================
const canvas = document.getElementById('geometric-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.strokeStyle = `rgba(102, 126, 234, ${1 - distance / 120})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===========================
// Navigation
// ===========================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===========================
// Typing Animation
// ===========================
const typingText = document.querySelector('.typing-text');
const phrases = [
    'Full Stack Developer',
    'Math Enthusiast',
    'Python Developer',
    'AI/ML Learner',
    'Mobile App Developer',
    'Problem Solver'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeAnimation() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeAnimation, typingSpeed);
}

typeAnimation();

// ===========================
// Scroll Animations (AOS-like)
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ===========================
// GitHub API Integration
// ===========================
const GITHUB_USERNAME = 'Ashwin138';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

async function fetchGitHubRepos() {
    const reposContainer = document.getElementById('github-repos');
    
    try {
        console.log('Fetching repos from:', GITHUB_API_URL);
        const response = await fetch(`${GITHUB_API_URL}?sort=updated&per_page=9`);
        
        if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}: ${response.statusText}`);
        }
        
        const repos = await response.json();
        console.log('Fetched repos:', repos.length);
        
        // Clear loading state
        reposContainer.innerHTML = '';
        
        // Show all repos (including forked ones)
        if (repos.length === 0) {
            reposContainer.innerHTML = `
                <div class="no-repos" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fab fa-github" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No repositories found</p>
                </div>
            `;
            return;
        }
        
        repos.forEach(repo => {
            const repoCard = createRepoCard(repo);
            reposContainer.appendChild(repoCard);
            // Trigger animation
            setTimeout(() => {
                observer.observe(repoCard);
            }, 100);
        });
        
        // Update project count
        updateProjectCount(repos.length);
        
    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        reposContainer.innerHTML = `
            <div class="error-message" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">Unable to load repositories from GitHub</p>
                <p style="color: var(--text-secondary); font-size: 0.9rem;">${error.message}</p>
                <a href="https://github.com/${GITHUB_USERNAME}?tab=repositories" target="_blank" class="btn btn-primary" style="margin-top: 1rem; display: inline-flex;">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
        `;
    }
}

function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card github-repo-card';
    card.style.opacity = '0';  // Start invisible for animation
    
    // Format repo name for display
    const displayName = repo.name
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-overlay">
                <a href="${repo.html_url}" target="_blank" class="project-link">
                    <i class="fab fa-github"></i>
                </a>
            </div>
            <div class="project-placeholder">
                <i class="fas fa-code-branch"></i>
            </div>
        </div>
        <div class="project-content">
            ${repo.fork ? '<span class="project-badge" style="background: #8B949E;">Forked</span>' : ''}
            <h3>${displayName}</h3>
            <p>${repo.description || 'A project repository on GitHub'}</p>
            <div class="project-tech">
                ${repo.language ? `<span style="border-color: ${getLanguageColor(repo.language)}; color: ${getLanguageColor(repo.language)};">${repo.language}</span>` : ''}
                ${repo.stargazers_count > 0 ? `<span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>` : ''}
                ${repo.forks_count > 0 ? `<span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>` : ''}
                <span><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" target="_blank" class="btn btn-small">
                    <i class="fab fa-github"></i> View Code
                </a>
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="btn btn-small btn-secondary">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    // Trigger fade-in animation after a brief delay
    setTimeout(() => {
        card.style.opacity = '1';
    }, 50);
    
    return card;
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'TypeScript': '#2b7489',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#A97BFF',
        'Dart': '#00B4AB',
        'C#': '#178600',
        'Shell': '#89e051',
        'Vue': '#41b883',
        'Jupyter Notebook': '#DA5B0B'
    };
    
    return colors[language] || '#667eea';
}

function updateProjectCount(count) {
    const projectCountElement = document.getElementById('projects-count');
    if (projectCountElement) {
        projectCountElement.textContent = `${count}+`;
    }
}

// Fetch repos when page loads
fetchGitHubRepos();

// ===========================
// Smooth Scroll for anchor links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// Add loading animation to buttons
// ===========================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
});

// ===========================
// Easter Egg: Konami Code
// ===========================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join('').includes(konamiSequence.join(''))) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    // Add rainbow animation to page
    document.body.style.animation = 'rainbow 2s infinite';
    
    // Create style for rainbow animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Show alert
    alert('🎉 You found the secret! Math + Code = Magic! ✨');
    
    // Remove animation after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// ===========================
// Performance: Lazy load images (if any added)
// ===========================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===========================
// Console Easter Egg
// ===========================
console.log('%c👋 Hello Developer!', 'color: #667EEA; font-size: 24px; font-weight: bold;');
console.log('%cLooks like you\'re curious about the code!', 'color: #8B949E; font-size: 14px;');
console.log('%c🔍 Feel free to explore and learn.', 'color: #8B949E; font-size: 14px;');
console.log('%c💻 Built with ❤️ by Ashwin Poudel', 'color: #667EEA; font-size: 14px;');
console.log('%c📧 Contact: ashwinpoudel138@gmail.com', 'color: #8B949E; font-size: 12px;');
