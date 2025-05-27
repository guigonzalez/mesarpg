// MesaRPG - Main JavaScript Functions

// Theme Toggle Functionality with Accessibility
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const themeButton = document.getElementById('theme-toggle-btn');
    
    if (!themeIcon) return; // Safety check
    
    if (html.getAttribute('data-bs-theme') === 'dark') {
        html.setAttribute('data-bs-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        if (themeButton) {
            themeButton.setAttribute('aria-label', 'Alternar para tema escuro');
        }
        localStorage.setItem('theme', 'light');
        announceToScreenReader('Tema claro ativado');
    } else {
        html.setAttribute('data-bs-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        if (themeButton) {
            themeButton.setAttribute('aria-label', 'Alternar para tema claro');
        }
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
    
    if (savedTheme && themeIcon) {
        document.documentElement.setAttribute('data-bs-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            if (themeButton) {
                themeButton.setAttribute('aria-label', 'Alternar para tema claro');
            }
        } else {
            themeIcon.className = 'fas fa-moon';
            if (themeButton) {
                themeButton.setAttribute('aria-label', 'Alternar para tema escuro');
            }
        }
    }
    
    // Initialize accessibility features
    initializeAccessibility();
    
    // Initialize datepicker
    initializeDatepicker();
});

// Initialize datepicker functionality
function initializeDatepicker() {
    const dateInput = document.getElementById('scheduled_date');
    if (dateInput) {
        // Set minimum date to today
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
        dateInput.min = minDateTime;
        
        // Add helpful placeholder
        dateInput.placeholder = 'DD/MM/AAAA HH:MM';
        
        // Add change event to validate date
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const currentDate = new Date();
            
            if (selectedDate < currentDate) {
                this.setCustomValidity('A data deve ser no futuro');
                this.classList.add('is-invalid');
                announceToScreenReader('Data inválida: deve ser no futuro');
            } else {
                this.setCustomValidity('');
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
                
                // Format and announce the selected date
                const formattedDate = selectedDate.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                announceToScreenReader(`Data selecionada: ${formattedDate}`);
            }
        });
    }
}

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