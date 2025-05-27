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
        // Set minimum date to today for datetime-local input
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
        const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
        dateInput.min = minDateTime;
        
        // Add change event to validate date
        dateInput.addEventListener('change', function() {
            if (this.value) {
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

// Dice Rolling Functions for Live Sessions
function rollDice(notation) {
    try {
        // Parse dice notation like "1d20", "2d6+3", etc.
        const match = notation.match(/(\d+)?d(\d+)(\+\d+|\-\d+)?/i);
        if (!match) {
            alert('Formato inválido. Use: XdY ou XdY+Z (exemplo: 1d20, 2d6+3)');
            return;
        }
        
        const numDice = parseInt(match[1]) || 1;
        const diceSize = parseInt(match[2]);
        const modifier = parseInt(match[3]) || 0;
        
        if (numDice > 20 || diceSize > 100) {
            alert('Máximo 20 dados de 100 lados cada');
            return;
        }
        
        const rolls = [];
        let total = 0;
        
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * diceSize) + 1;
            rolls.push(roll);
            total += roll;
        }
        
        total += modifier;
        
        // Display result
        displayDiceResult(notation, rolls, modifier, total);
        
        // Announce to screen readers
        announceToScreenReader(`Resultado: ${notation} = ${total}`);
        
    } catch (error) {
        alert('Erro ao rolar dados. Verifique o formato.');
    }
}

function displayDiceResult(notation, rolls, modifier, total) {
    const resultsContainer = document.getElementById('dice-results');
    if (resultsContainer) {
        const timestamp = new Date().toLocaleTimeString('pt-BR');
        const rollsText = rolls.join(', ');
        const modifierText = modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : '';
        
        const resultHTML = `
            <div class="dice-result bg-light border rounded p-3 mb-2">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <strong>${notation}</strong>: [${rollsText}]${modifierText} = <strong class="text-primary">${total}</strong>
                    </div>
                    <small class="text-muted">${timestamp}</small>
                </div>
            </div>
        `;
        
        resultsContainer.insertAdjacentHTML('afterbegin', resultHTML);
    }
}

// Chat Functions for Live Sessions  
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-messages');
    
    if (!messageInput || !chatContainer) return;
    
    const message = messageInput.value.trim();
    if (!message) return;
    
    // Create message element
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const messageHTML = `
        <div class="chat-message bg-light border rounded p-2 mb-2">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <strong class="text-primary">Você:</strong> ${message}
                </div>
                <small class="text-muted">${timestamp}</small>
            </div>
        </div>
    `;
    
    chatContainer.insertAdjacentHTML('beforeend', messageHTML);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Clear input
    messageInput.value = '';
    
    // Announce to screen readers
    announceToScreenReader('Mensagem enviada');
}

// Quick dice roll buttons
function quickRoll(diceType) {
    rollDice(diceType);
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
    
    // Initialize chat enter key handler
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
});