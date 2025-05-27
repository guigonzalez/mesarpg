// MesaRPG - Main JavaScript Functions

// Theme Toggle Functionality with Accessibility
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const themeButton = document.getElementById('theme-toggle-btn');
    
    if (html.getAttribute('data-bs-theme') === 'dark') {
        html.setAttribute('data-bs-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        themeButton.setAttribute('aria-label', 'Alternar para tema escuro');
        localStorage.setItem('theme', 'light');
        announceToScreenReader('Tema claro ativado');
    } else {
        html.setAttribute('data-bs-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        themeButton.setAttribute('aria-label', 'Alternar para tema claro');
        localStorage.setItem('theme', 'dark');
        announceToScreenReader('Tema escuro ativado');
    }
}

// Announce changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    const themeButton = document.getElementById('theme-toggle-btn');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeButton.setAttribute('aria-label', 'Alternar para tema claro');
        } else {
            themeIcon.className = 'fas fa-moon';
            themeButton.setAttribute('aria-label', 'Alternar para tema escuro');
        }
    }
    
    // Initialize accessibility features
    initializeAccessibility();
});

// Initialize accessibility features
function initializeAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.querySelector('a')) {
            card.setAttribute('tabindex', '0');
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const link = card.querySelector('a');
                    if (link) link.click();
                }
            });
        }
    });
    
    // Add form validation feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const invalidFields = form.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                const firstInvalid = invalidFields[0];
                firstInvalid.focus();
                announceToScreenReader(`Erro no campo: ${firstInvalid.labels[0]?.textContent || firstInvalid.name}`);
            }
        });
    });
    
    // Add live region for dynamic content
    if (!document.getElementById('live-region')) {
        const liveRegion = document.createElement('div');
        liveRegion.id = 'live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
}

// Auto-hide alerts after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});