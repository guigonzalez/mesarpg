// Sistema de Chat para Sessões RPG
let currentSessionId = null;
let chatPollingInterval = null;
let lastMessageId = 0;

// Inicializar chat quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Extrair ID da sessão da URL
    const pathParts = window.location.pathname.split('/');
    const sessionIndex = pathParts.indexOf('sessions');
    if (sessionIndex !== -1 && pathParts[sessionIndex + 1]) {
        currentSessionId = parseInt(pathParts[sessionIndex + 1]);
        initializeChat();
    }
});

function initializeChat() {
    if (!currentSessionId) return;
    
    // Carregar mensagens existentes
    loadChatMessages();
    
    // Iniciar polling para novas mensagens a cada 3 segundos
    chatPollingInterval = setInterval(loadChatMessages, 3000);
    
    // Remover mensagem de boas-vindas
    const welcomeMsg = document.getElementById('chatWelcome');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
}

function loadChatMessages() {
    if (!currentSessionId) return;
    
    fetch(`/sessions/api/chat/${currentSessionId}/messages`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Erro ao carregar mensagens:', data.error);
                return;
            }
            
            const chatContainer = document.getElementById('chatMessages');
            const newMessages = data.messages.filter(msg => msg.id > lastMessageId);
            
            newMessages.forEach(message => {
                addChatMessageToDOM(message);
                lastMessageId = Math.max(lastMessageId, message.id);
            });
            
            // Auto-scroll para a última mensagem se o usuário estiver próximo do final
            if (chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 50) {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
        });
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || !currentSessionId) return;
    
    // Limpar input
    input.value = '';
    
    // Enviar mensagem
    sendChatMessage(message, 'text');
}

function sendChatMessage(message, type = 'text') {
    if (!currentSessionId) return;
    
    fetch(`/sessions/api/chat/${currentSessionId}/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            type: type
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Erro ao enviar mensagem:', data.error);
            addSystemMessage('Erro ao enviar mensagem: ' + data.error);
            return;
        }
        
        if (data.success && data.message) {
            addChatMessageToDOM(data.message);
            lastMessageId = Math.max(lastMessageId, data.message.id);
            
            // Auto-scroll para a última mensagem
            const chatContainer = document.getElementById('chatMessages');
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    })
    .catch(error => {
        console.error('Erro na requisição:', error);
        addSystemMessage('Erro de conexão ao enviar mensagem');
    });
}

function addChatMessageToDOM(message) {
    const chatContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message mb-2';
    messageDiv.setAttribute('data-message-id', message.id);
    
    let messageClass = 'chat-bubble';
    if (message.is_current_user) {
        messageClass += ' own-message';
    }
    
    if (message.message_type === 'dice') {
        messageClass += ' dice-message';
    } else if (message.message_type === 'system') {
        messageClass += ' system-message';
    }
    
    const timeStr = message.created_at;
    const username = message.message_type === 'system' ? 'Sistema' : message.username;
    
    messageDiv.innerHTML = `
        <div class="${messageClass}">
            <div class="message-header">
                <strong class="username">${username}</strong>
                <small class="text-muted timestamp">${timeStr}</small>
            </div>
            <div class="message-content">
                ${message.message}
            </div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    
    // Animar nova mensagem
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

function addSystemMessage(message) {
    const systemMessage = {
        id: Date.now(),
        username: 'Sistema',
        message: message,
        message_type: 'system',
        created_at: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        is_current_user: false
    };
    
    addChatMessageToDOM(systemMessage);
    
    const chatContainer = document.getElementById('chatMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Função auxiliar para adicionar mensagem (compatibilidade com dice.js)
function addChatMessage(username, message, type = 'text') {
    if (type === 'system') {
        addSystemMessage(message);
    } else {
        sendChatMessage(message, type);
    }
}

// Limpar polling quando sair da página
window.addEventListener('beforeunload', function() {
    if (chatPollingInterval) {
        clearInterval(chatPollingInterval);
    }
});

// Detectar comandos de dados no chat
function detectDiceCommands(message) {
    const dicePattern = /\/roll\s+(\d*d\d+(?:[+-]\d+)?)/i;
    const match = message.match(dicePattern);
    
    if (match) {
        const notation = match[1];
        rollDiceFromNotation(notation);
        return true;
    }
    
    return false;
}

// Sobrescrever a função sendMessage para detectar comandos
const originalSendMessage = sendMessage;
sendMessage = function() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Verificar se é um comando de dados
    if (detectDiceCommands(message)) {
        input.value = '';
        return;
    }
    
    // Caso contrário, enviar mensagem normal
    originalSendMessage();
};