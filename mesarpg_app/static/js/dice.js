// Sistema de Rolagem de Dados para RPG
function rollDice() {
    const count = parseInt(document.getElementById('diceCount').value) || 1;
    const sides = parseInt(document.getElementById('diceType').value);
    const modifier = parseInt(document.getElementById('diceModifier').value) || 0;
    
    // Validar entrada
    if (count < 1 || count > 20) {
        displayDiceResult('Erro: Quantidade deve ser entre 1 e 20 dados');
        return;
    }
    
    const notation = `${count}d${sides}${modifier >= 0 ? '+' : ''}${modifier}`;
    const results = rollDiceNotation(count, sides, modifier);
    
    displayDiceResult(notation, results);
}

function rollDiceNotation(count, sides, modifier) {
    const rolls = [];
    let total = 0;
    
    // Rolar cada dado individualmente
    for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * sides) + 1;
        rolls.push(roll);
        total += roll;
    }
    
    // Adicionar modificador ao total
    total += modifier;
    
    return {
        rolls: rolls,
        modifier: modifier,
        subtotal: rolls.reduce((sum, roll) => sum + roll, 0),
        total: total,
        count: count,
        sides: sides
    };
}

function displayDiceResult(notation, results) {
    if (typeof results === 'string') {
        // Exibir erro no chat
        addChatMessage('Sistema', results, 'system');
        return;
    }
    
    // Criar elementos visuais para os dados
    const diceIcons = results.rolls.map(roll => {
        const isCritical = roll === results.sides;
        const isFumble = roll === 1 && results.sides === 20;
        
        let diceClass = 'dice-result';
        if (isCritical) diceClass += ' critical';
        if (isFumble) diceClass += ' fumble';
        
        return `<span class="${diceClass}" title="d${results.sides}: ${roll}">${roll}</span>`;
    }).join(' ');
    
    // Construir mensagem de dados para o chat
    let diceMessage = `
        <div class="dice-roll-chat">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <strong>${notation}</strong>
                <span class="badge bg-primary">${results.total}</span>
            </div>
            <div class="dice-rolls">
                ${diceIcons}
            </div>
    `;
    
    // Mostrar breakdown se houver modificador ou múltiplos dados
    if (results.modifier !== 0 || results.count > 1) {
        let breakdown = `Dados: ${results.subtotal}`;
        if (results.modifier !== 0) {
            breakdown += ` ${results.modifier >= 0 ? '+' : ''}${results.modifier}`;
        }
        breakdown += ` = ${results.total}`;
        
        diceMessage += `<small class="text-muted">${breakdown}</small>`;
    }
    
    diceMessage += '</div>';
    
    // Enviar resultado para o chat
    sendChatMessage(diceMessage, 'dice');
}

function quickRoll(sides) {
    const notation = `1d${sides}`;
    const results = rollDiceNotation(1, sides, 0);
    displayDiceResult(notation, results);
}

function rollInitiative() {
    const notation = '1d20+DEX';
    const results = rollDiceNotation(1, 20, 0);
    const roll = results.rolls[0];
    
    // Personalizar para iniciativa
    let initiativeMessage = `
        <div class="dice-roll-chat">
            <div class="d-flex justify-content-between align-items-center mb-1">
                <strong>Iniciativa</strong>
                <span class="badge bg-success">${roll} + DEX</span>
            </div>
            <div class="dice-rolls">
                <span class="dice-result" title="d20: ${roll}">${roll}</span>
                <small class="text-muted ms-2">+ modificador de Destreza</small>
            </div>
        </div>
    `;
    
    // Enviar para o chat
    sendChatMessage(initiativeMessage, 'dice');
}

// Função para rolar dados via notação (ex: "2d6+3")
function rollDiceFromNotation(notation) {
    const regex = /(\d+)?d(\d+)([+-]\d+)?/i;
    const match = notation.match(regex);
    
    if (!match) {
        displayDiceResult('Formato inválido. Use: XdY+Z (ex: 2d6+3)');
        return;
    }
    
    const count = parseInt(match[1]) || 1;
    const sides = parseInt(match[2]);
    const modifier = parseInt(match[3]) || 0;
    
    if (count < 1 || count > 20) {
        displayDiceResult('Erro: Quantidade deve ser entre 1 e 20 dados');
        return;
    }
    
    const results = rollDiceNotation(count, sides, modifier);
    displayDiceResult(notation, results);
}

// Adicionar eventos de teclado
document.addEventListener('DOMContentLoaded', function() {
    // Enter para rolar dados
    const inputs = ['diceCount', 'diceType', 'diceModifier'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    rollDice();
                }
            });
        }
    });
});