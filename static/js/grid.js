// Sistema de Grid de Combate para RPG
class CombatGrid {
    constructor() {
        this.canvas = document.getElementById('gameGrid');
        if (!this.canvas) {
            console.warn('Canvas gameGrid não encontrado');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 40; // Tamanho de cada quadrado do grid em pixels
        this.gridScale = 1.5; // Escala métrica: 1 quadrado = 1.5 metros
        this.showGrid = true;
        this.currentMode = 'token';
        this.selectedToken = 'player';
        this.tokens = [];
        this.markers = [];
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.selectedElement = null;
        this.measuring = false;
        this.measureStart = null;
        this.measureEnd = null;
        this.backgroundImage = null;
        this.imageLoaded = false;
        
        this.initEventListeners();
        this.draw();
    }
    
    initEventListeners() {
        // Eventos do canvas
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => this.onRightClick(e));
        
        // Redimensionar canvas
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const container = document.getElementById('gridContainer');
        const rect = container.getBoundingClientRect();
        this.canvas.width = Math.max(1200, rect.width);
        this.canvas.height = Math.max(900, rect.height);
        this.draw();
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getGridPosition(x, y) {
        return {
            gridX: Math.floor(x / this.gridSize),
            gridY: Math.floor(y / this.gridSize),
            centerX: Math.floor(x / this.gridSize) * this.gridSize + this.gridSize / 2,
            centerY: Math.floor(y / this.gridSize) * this.gridSize + this.gridSize / 2
        };
    }
    
    onMouseDown(e) {
        const pos = this.getMousePos(e);
        
        if (this.currentMode === 'measure') {
            if (!this.measuring) {
                this.measureStart = { x: pos.x, y: pos.y };
                this.measuring = true;
                this.measureEnd = null;
            } else {
                this.measureEnd = { x: pos.x, y: pos.y };
                this.showMeasurement();
                this.measuring = false;
                this.measureStart = null;
                this.measureEnd = null;
            }
            this.draw();
            return;
        }
        
        // Verificar se clicou em um token existente
        this.selectedElement = this.getElementAt(pos.x, pos.y);
        
        if (this.selectedElement) {
            this.isDragging = true;
        } else if (this.currentMode === 'token') {
            this.placeToken(pos.x, pos.y);
        } else if (this.currentMode === 'marker') {
            this.placeMarker(pos.x, pos.y);
        }
    }
    
    onMouseMove(e) {
        if (this.currentMode === 'measure' && this.measuring) {
            const pos = this.getMousePos(e);
            this.measureEnd = { x: pos.x, y: pos.y };
            this.draw();
            return;
        }
        
        if (!this.isDragging || !this.selectedElement) return;
        
        const pos = this.getMousePos(e);
        const gridPos = this.getGridPosition(pos.x, pos.y);
        this.selectedElement.x = gridPos.centerX;
        this.selectedElement.y = gridPos.centerY;
        this.draw();
    }
    
    onMouseUp(e) {
        this.isDragging = false;
        this.selectedElement = null;
        this.canvas.style.cursor = 'default';
    }
    
    onRightClick(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const element = this.getElementAt(pos.x, pos.y);
        
        if (element) {
            // Remover elemento
            if (element.type === 'token') {
                this.tokens = this.tokens.filter(t => t !== element);
            } else if (element.type === 'marker') {
                this.markers = this.markers.filter(m => m !== element);
            }
            this.draw();
        }
    }
    
    getElementAt(x, y) {
        // Verificar tokens
        for (let token of this.tokens) {
            const dist = Math.sqrt((x - token.x) ** 2 + (y - token.y) ** 2);
            if (dist < this.gridSize / 2) {
                return token;
            }
        }
        
        // Verificar marcadores
        for (let marker of this.markers) {
            const dist = Math.sqrt((x - marker.x) ** 2 + (y - marker.y) ** 2);
            if (dist < 10) {
                return marker;
            }
        }
        
        return null;
    }
    
    placeToken(x, y) {
        const gridPos = this.getGridPosition(x, y);
        
        // Verificar se já existe um token nesta posição
        const existing = this.tokens.find(t => 
            Math.abs(t.x - gridPos.centerX) < 5 && 
            Math.abs(t.y - gridPos.centerY) < 5
        );
        
        if (!existing) {
            this.tokens.push({
                type: 'token',
                tokenType: this.selectedToken,
                x: gridPos.centerX,
                y: gridPos.centerY,
                id: Date.now()
            });
            this.draw();
        }
    }
    
    placeMarker(x, y) {
        this.markers.push({
            type: 'marker',
            x: x,
            y: y,
            id: Date.now()
        });
        this.draw();
    }
    
    showMeasurement() {
        if (!this.measureStart || !this.measureEnd) return;
        
        const dx = this.measureEnd.x - this.measureStart.x;
        const dy = this.measureEnd.y - this.measureStart.y;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);
        const gridDistance = pixelDistance / this.gridSize;
        const realDistance = gridDistance * this.gridScale;
        
        // Mostrar resultado em um alert temporário
        const distanceText = `Distância: ${realDistance.toFixed(1)}m (${gridDistance.toFixed(1)} quadrados)`;
        
        // Criar elemento de notificação temporário
        const notification = document.createElement('div');
        notification.textContent = distanceText;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007bff;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    setGridSize(size) {
        this.gridSize = parseInt(size);
        this.draw();
    }
    
    setGridScale(scale) {
        this.gridScale = parseFloat(scale);
    }
    
    setBackgroundImage(image) {
        this.backgroundImage = image;
        this.imageLoaded = true;
        this.draw();
    }
    
    clearBackgroundImage() {
        this.backgroundImage = null;
        this.imageLoaded = false;
        this.draw();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Desenhar imagem de fundo
        if (this.backgroundImage && this.imageLoaded) {
            this.drawBackgroundImage();
        }
        
        // Desenhar grid
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Desenhar marcadores
        this.drawMarkers();
        
        // Desenhar tokens
        this.drawTokens();
        
        // Desenhar linha de medição
        this.drawMeasurementLine();
    }
    
    drawBackgroundImage() {
        if (!this.backgroundImage) return;
        
        // Desenhar a imagem para cobrir toda a área do canvas
        this.ctx.globalAlpha = 0.8; // Tornar ligeiramente transparente
        this.ctx.drawImage(
            this.backgroundImage,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        this.ctx.globalAlpha = 1.0; // Restaurar opacidade
    }
    
    drawGrid() {
        this.ctx.strokeStyle = this.backgroundImage ? 'rgba(222, 226, 230, 0.7)' : '#dee2e6';
        this.ctx.lineWidth = 1;
        
        // Linhas verticais
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Linhas horizontais
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    drawTokens() {
        for (let token of this.tokens) {
            this.drawToken(token);
        }
    }
    
    drawToken(token) {
        const colors = {
            player: '#007bff',
            enemy: '#dc3545',
            npc: '#28a745',
            object: '#6c757d'
        };
        
        this.ctx.fillStyle = colors[token.tokenType] || '#6c757d';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        
        // Desenhar círculo do token
        this.ctx.beginPath();
        this.ctx.arc(token.x, token.y, this.gridSize * 0.4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Desenhar ícone usando símbolos simples (não emojis)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold ${this.gridSize * 0.3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const iconMap = {
            player: '♦',   // Losango para jogador
            enemy: '♠',    // Espada para inimigo
            npc: '♣',      // Trevo para NPC
            object: '■'    // Quadrado para objeto
        };
        
        this.ctx.fillText(iconMap[token.tokenType] || '?', token.x, token.y);
    }
    
    drawMarkers() {
        for (let marker of this.markers) {
            this.ctx.fillStyle = '#ffc107';
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            
            this.ctx.beginPath();
            this.ctx.arc(marker.x, marker.y, 5, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }
    
    drawMeasurementLine() {
        if (this.currentMode === 'measure' && this.measureStart && this.measureEnd) {
            this.ctx.strokeStyle = '#ff6b6b';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.measureStart.x, this.measureStart.y);
            this.ctx.lineTo(this.measureEnd.x, this.measureEnd.y);
            this.ctx.stroke();
            
            // Pontos de início e fim
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.setLineDash([]);
            
            this.ctx.beginPath();
            this.ctx.arc(this.measureStart.x, this.measureStart.y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(this.measureEnd.x, this.measureEnd.y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
}

// Variáveis globais
let grid;

// Inicializar quando a página carregar
function initializeGrid() {
    const canvas = document.getElementById('gameGrid');
    if (canvas && canvas.getContext) {
        try {
            grid = new CombatGrid();
            console.log('Grid de combate inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar grid:', error);
        }
    } else {
        console.warn('Canvas gameGrid não encontrado ou não suportado');
    }
}

// Tentar inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    initializeGrid();
});

// Tentar novamente após carregar completamente
window.addEventListener('load', function() {
    if (!grid) {
        initializeGrid();
    }
});

// Funções globais para os botões
function toggleTokenMode() {
    if (!grid) return;
    grid.currentMode = 'token';
    updateButtonStates();
}

function toggleMarkerMode() {
    if (!grid) return;
    grid.currentMode = 'marker';
    updateButtonStates();
}

function toggleMeasureMode() {
    if (!grid) return;
    grid.currentMode = 'measure';
    updateButtonStates();
}

function clearGrid() {
    if (!grid) return;
    grid.tokens = [];
    grid.markers = [];
    grid.draw();
}

function toggleGrid() {
    if (!grid) return;
    grid.showGrid = !grid.showGrid;
    grid.draw();
    
    const btn = document.getElementById('gridBtn');
    if (btn) {
        btn.classList.toggle('active', grid.showGrid);
    }
}

function selectToken(tokenType) {
    if (!grid) return;
    grid.selectedToken = tokenType;
    grid.currentMode = 'token';
    
    // Atualizar visual dos botões de token
    document.querySelectorAll('.token-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const tokenBtn = document.querySelector(`[data-token="${tokenType}"]`);
    if (tokenBtn) {
        tokenBtn.classList.add('active');
    }
    updateButtonStates();
}

function zoomIn() {
    if (!grid) return;
    grid.scale *= 1.2;
    grid.scale = Math.min(3, grid.scale);
    grid.draw();
}

function zoomOut() {
    if (!grid) return;
    grid.scale *= 0.8;
    grid.scale = Math.max(0.5, grid.scale);
    grid.draw();
}

function resetZoom() {
    if (!grid) return;
    grid.scale = 1;
    grid.panX = 0;
    grid.panY = 0;
    grid.draw();
}

function setGridSize(size) {
    if (grid && grid.setGridSize) {
        grid.setGridSize(size);
    }
}

function setGridScale(scale) {
    if (grid && grid.setGridScale) {
        grid.setGridScale(scale);
    }
}

function uploadMap(input) {
    if (!grid) return;
    
    const file = input.files[0];
    if (!file) return;
    
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
        alert('Por favor, selecione apenas arquivos PNG ou JPEG.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            grid.setBackgroundImage(img);
            console.log('Mapa carregado com sucesso');
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Limpar o input para permitir upload do mesmo arquivo novamente
    input.value = '';
}

function clearMap() {
    if (!grid) return;
    grid.clearBackgroundImage();
    console.log('Mapa removido');
}

function toggleGridConfig() {
    const content = document.getElementById('gridConfigContent');
    const btn = document.getElementById('toggleConfigBtn');
    const icon = btn.querySelector('i');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.className = 'fas fa-eye-slash';
        btn.title = 'Ocultar configurações';
    } else {
        content.style.display = 'none';
        icon.className = 'fas fa-eye';
        btn.title = 'Mostrar configurações';
    }
}

function updateButtonStates() {
    // Limpar estados ativos
    document.querySelectorAll('#tokenBtn, #markerBtn, #measureBtn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ativar botão atual
    const activeBtn = {
        'token': 'tokenBtn',
        'marker': 'markerBtn',
        'measure': 'measureBtn'
    }[grid.currentMode];
    
    if (activeBtn) {
        document.getElementById(activeBtn).classList.add('active');
    }
}