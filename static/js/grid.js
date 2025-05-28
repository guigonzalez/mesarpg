// Sistema de Grid de Combate para RPG
class CombatGrid {
    constructor() {
        this.canvas = document.getElementById('gameGrid');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 30; // Tamanho de cada quadrado do grid em pixels
        this.scale = 1;
        this.panX = 0;
        this.panY = 0;
        this.showGrid = true;
        this.currentMode = 'token';
        this.selectedToken = 'player';
        this.tokens = [];
        this.markers = [];
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.selectedElement = null;
        
        this.initEventListeners();
        this.draw();
    }
    
    initEventListeners() {
        // Eventos do canvas
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('contextmenu', (e) => this.onRightClick(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        
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
            x: (e.clientX - rect.left - this.panX) / this.scale,
            y: (e.clientY - rect.top - this.panY) / this.scale
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
        this.dragStart = { x: e.clientX, y: e.clientY };
        
        if (this.currentMode === 'pan' || e.button === 1) {
            this.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
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
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.dragStart.x;
        const deltaY = e.clientY - this.dragStart.y;
        
        if (this.currentMode === 'pan' || e.button === 1) {
            this.panX += deltaX;
            this.panY += deltaY;
            this.draw();
        } else if (this.selectedElement) {
            const pos = this.getMousePos(e);
            const gridPos = this.getGridPosition(pos.x, pos.y);
            this.selectedElement.x = gridPos.centerX;
            this.selectedElement.y = gridPos.centerY;
            this.draw();
        }
        
        this.dragStart = { x: e.clientX, y: e.clientY };
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
    
    onWheel(e) {
        e.preventDefault();
        const pos = this.getMousePos(e);
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        
        this.scale *= zoomFactor;
        this.scale = Math.max(0.5, Math.min(3, this.scale));
        
        // Ajustar pan para zoom centrado no mouse
        this.panX -= (pos.x * (zoomFactor - 1));
        this.panY -= (pos.y * (zoomFactor - 1));
        
        this.draw();
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
    
    draw() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Aplicar transformações
        this.ctx.translate(this.panX, this.panY);
        this.ctx.scale(this.scale, this.scale);
        
        // Desenhar grid
        if (this.showGrid) {
            this.drawGrid();
        }
        
        // Desenhar marcadores
        this.drawMarkers();
        
        // Desenhar tokens
        this.drawTokens();
        
        this.ctx.restore();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#dee2e6';
        this.ctx.lineWidth = 1;
        
        const startX = Math.floor(-this.panX / this.scale / this.gridSize) * this.gridSize;
        const startY = Math.floor(-this.panY / this.scale / this.gridSize) * this.gridSize;
        const endX = startX + (this.canvas.width / this.scale) + this.gridSize;
        const endY = startY + (this.canvas.height / this.scale) + this.gridSize;
        
        // Linhas verticais
        for (let x = startX; x <= endX; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }
        
        // Linhas horizontais
        for (let y = startY; y <= endY; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
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
        
        const icons = {
            player: '👤',
            enemy: '💀',
            npc: '👥',
            object: '📦'
        };
        
        this.ctx.fillStyle = colors[token.tokenType] || '#6c757d';
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        
        // Desenhar círculo do token
        this.ctx.beginPath();
        this.ctx.arc(token.x, token.y, this.gridSize * 0.4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Desenhar ícone
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `${this.gridSize * 0.5}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const iconMap = {
            player: '♦',
            enemy: '♠',
            npc: '♣',
            object: '■'
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
}

// Variáveis globais
let grid;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('gameGrid')) {
        grid = new CombatGrid();
    }
});

// Funções globais para os botões
function toggleTokenMode() {
    grid.currentMode = 'token';
    updateButtonStates();
}

function toggleMarkerMode() {
    grid.currentMode = 'marker';
    updateButtonStates();
}

function toggleMeasureMode() {
    grid.currentMode = 'measure';
    updateButtonStates();
}

function clearGrid() {
    grid.tokens = [];
    grid.markers = [];
    grid.draw();
}

function toggleGrid() {
    grid.showGrid = !grid.showGrid;
    grid.draw();
    
    const btn = document.getElementById('gridBtn');
    btn.classList.toggle('active', grid.showGrid);
}

function selectToken(tokenType) {
    grid.selectedToken = tokenType;
    grid.currentMode = 'token';
    
    // Atualizar visual dos botões de token
    document.querySelectorAll('.token-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-token="${tokenType}"]`).classList.add('active');
    updateButtonStates();
}

function zoomIn() {
    grid.scale *= 1.2;
    grid.scale = Math.min(3, grid.scale);
    grid.draw();
}

function zoomOut() {
    grid.scale *= 0.8;
    grid.scale = Math.max(0.5, grid.scale);
    grid.draw();
}

function resetZoom() {
    grid.scale = 1;
    grid.panX = 0;
    grid.panY = 0;
    grid.draw();
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