// Templates de sistemas de RPG baseados no CSV fornecido
const RPG_TEMPLATES = {
    'D&D 5e': {
        name: 'Dungeons & Dragons 5ª Edição',
        fields: {
            // Informações básicas do personagem
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            
            // Atributos
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            
            // Perícias
            acrobacia: { label: 'Acrobacia', type: 'number', default: 0 },
            arcanismo: { label: 'Arcanismo', type: 'number', default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', default: 0 },
            enganacao: { label: 'Enganação', type: 'number', default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', default: 0 },
            historia: { label: 'História', type: 'number', default: 0 },
            intuicao: { label: 'Intuição', type: 'number', default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', default: 0 },
            investigacao: { label: 'Investigação', type: 'number', default: 0 },
            lidar_animais: { label: 'Lidar com Animais', type: 'number', default: 0 },
            medicina: { label: 'Medicina', type: 'number', default: 0 },
            natureza: { label: 'Natureza', type: 'number', default: 0 },
            percepcao: { label: 'Percepção', type: 'number', default: 0 },
            persuasao: { label: 'Persuasão', type: 'number', default: 0 },
            prestidigitacao: { label: 'Prestidigitação', type: 'number', default: 0 },
            religiao: { label: 'Religião', type: 'number', default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', default: 0 },
            
            // Equipamentos e Habilidades
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Liste armas, armaduras e itens...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Liste magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Ataques únicos do personagem...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico' },
            
            // Stats de combate
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 1, default: 10 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Percepção Passiva', type: 'number', default: 10 },
            
            // História
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background e motivações...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] },
            { name: 'Perícias', fields: ['acrobacia', 'arcanismo', 'atletismo', 'enganacao', 'furtividade', 'historia', 'intuicao', 'intimidacao', 'investigacao', 'lidar_animais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia'] },
            { name: 'Combate', fields: ['pv', 'ca', 'iniciativa', 'percepcao_passiva'] },
            { name: 'Habilidades', fields: ['magias', 'ataques_especiais', 'recursos_classe'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'idiomas', 'historia_personagem'] }
        ]
    },
    
    'Tormenta20': {
        name: 'Tormenta20',
        fields: {
            // Todas as categorias são idênticas ao D&D 5e conforme CSV
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            acrobacia: { label: 'Acrobacia', type: 'number', default: 0 },
            arcanismo: { label: 'Arcanismo', type: 'number', default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', default: 0 },
            enganacao: { label: 'Enganação', type: 'number', default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', default: 0 },
            historia: { label: 'História', type: 'number', default: 0 },
            intuicao: { label: 'Intuição', type: 'number', default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', default: 0 },
            investigacao: { label: 'Investigação', type: 'number', default: 0 },
            lidar_animais: { label: 'Lidar com Animais', type: 'number', default: 0 },
            medicina: { label: 'Medicina', type: 'number', default: 0 },
            natureza: { label: 'Natureza', type: 'number', default: 0 },
            percepcao: { label: 'Percepção', type: 'number', default: 0 },
            persuasao: { label: 'Persuasão', type: 'number', default: 0 },
            prestidigitacao: { label: 'Prestidigitação', type: 'number', default: 0 },
            religiao: { label: 'Religião', type: 'number', default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', default: 0 },
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Liste armas, armaduras e itens...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Liste magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Ataques únicos do personagem...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico' },
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 1, default: 10 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Percepção Passiva', type: 'number', default: 10 },
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background e motivações...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] },
            { name: 'Perícias', fields: ['acrobacia', 'arcanismo', 'atletismo', 'enganacao', 'furtividade', 'historia', 'intuicao', 'intimidacao', 'investigacao', 'lidar_animais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia'] },
            { name: 'Combate', fields: ['pv', 'ca', 'iniciativa', 'percepcao_passiva'] },
            { name: 'Habilidades', fields: ['magias', 'ataques_especiais', 'recursos_classe'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'idiomas', 'historia_personagem'] }
        ]
    },
    
    'Call of Cthulhu': {
        name: 'Call of Cthulhu',
        fields: {
            // Todas as categorias são idênticas ao D&D 5e conforme CSV
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            acrobacia: { label: 'Acrobacia', type: 'number', default: 0 },
            arcanismo: { label: 'Arcanismo', type: 'number', default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', default: 0 },
            enganacao: { label: 'Enganação', type: 'number', default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', default: 0 },
            historia: { label: 'História', type: 'number', default: 0 },
            intuicao: { label: 'Intuição', type: 'number', default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', default: 0 },
            investigacao: { label: 'Investigação', type: 'number', default: 0 },
            lidar_animais: { label: 'Lidar com Animais', type: 'number', default: 0 },
            medicina: { label: 'Medicina', type: 'number', default: 0 },
            natureza: { label: 'Natureza', type: 'number', default: 0 },
            percepcao: { label: 'Percepção', type: 'number', default: 0 },
            persuasao: { label: 'Persuasão', type: 'number', default: 0 },
            prestidigitacao: { label: 'Prestidigitação', type: 'number', default: 0 },
            religiao: { label: 'Religião', type: 'number', default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', default: 0 },
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Liste armas, armaduras e itens...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Liste magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Ataques únicos do personagem...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico' },
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 1, default: 10 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Percepção Passiva', type: 'number', default: 10 },
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background e motivações...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] },
            { name: 'Perícias', fields: ['acrobacia', 'arcanismo', 'atletismo', 'enganacao', 'furtividade', 'historia', 'intuicao', 'intimidacao', 'investigacao', 'lidar_animais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia'] },
            { name: 'Combate', fields: ['pv', 'ca', 'iniciativa', 'percepcao_passiva'] },
            { name: 'Habilidades', fields: ['magias', 'ataques_especiais', 'recursos_classe'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'idiomas', 'historia_personagem'] }
        ]
    },
    
    'Vampire': {
        name: 'Vampire: The Masquerade',
        fields: {
            // Todas as categorias são idênticas ao D&D 5e conforme CSV
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            acrobacia: { label: 'Acrobacia', type: 'number', default: 0 },
            arcanismo: { label: 'Arcanismo', type: 'number', default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', default: 0 },
            enganacao: { label: 'Enganação', type: 'number', default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', default: 0 },
            historia: { label: 'História', type: 'number', default: 0 },
            intuicao: { label: 'Intuição', type: 'number', default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', default: 0 },
            investigacao: { label: 'Investigação', type: 'number', default: 0 },
            lidar_animais: { label: 'Lidar com Animais', type: 'number', default: 0 },
            medicina: { label: 'Medicina', type: 'number', default: 0 },
            natureza: { label: 'Natureza', type: 'number', default: 0 },
            percepcao: { label: 'Percepção', type: 'number', default: 0 },
            persuasao: { label: 'Persuasão', type: 'number', default: 0 },
            prestidigitacao: { label: 'Prestidigitação', type: 'number', default: 0 },
            religiao: { label: 'Religião', type: 'number', default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', default: 0 },
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Liste armas, armaduras e itens...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Liste magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Ataques únicos do personagem...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico' },
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 1, default: 10 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Percepção Passiva', type: 'number', default: 10 },
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background e motivações...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] },
            { name: 'Perícias', fields: ['acrobacia', 'arcanismo', 'atletismo', 'enganacao', 'furtividade', 'historia', 'intuicao', 'intimidacao', 'investigacao', 'lidar_animais', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia'] },
            { name: 'Combate', fields: ['pv', 'ca', 'iniciativa', 'percepcao_passiva'] },
            { name: 'Habilidades', fields: ['magias', 'ataques_especiais', 'recursos_classe'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'idiomas', 'historia_personagem'] }
        ]
    }
};

// Função para aplicar template baseado no sistema
function applySystemTemplate(systemName) {
    const template = RPG_TEMPLATES[systemName];
    if (!template) return;
    
    console.log(`Aplicando template para ${systemName}`);
    
    // Aplicar valores padrão
    const defaultValues = template.fields;
    for (const [fieldName, config] of Object.entries(defaultValues)) {
        const field = document.getElementById(fieldName);
        if (field && config.default !== undefined) {
            field.value = config.default;
        }
    }
}

// Função para gerar formulário dinâmico baseado no template
function generateTemplateForm(systemName, containerId) {
    const template = RPG_TEMPLATES[systemName];
    if (!template) return;
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Gerar seções
    template.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mb-4';
        
        const sectionHeader = document.createElement('h6');
        sectionHeader.className = 'text-primary mb-3';
        sectionHeader.innerHTML = `<i class="fas fa-folder me-2"></i>${section.name}`;
        sectionDiv.appendChild(sectionHeader);
        
        const fieldsRow = document.createElement('div');
        fieldsRow.className = 'row g-3';
        
        section.fields.forEach(fieldName => {
            const fieldConfig = template.fields[fieldName];
            if (!fieldConfig) return;
            
            const colDiv = document.createElement('div');
            colDiv.className = getColumnClass(fieldConfig.type);
            
            const fieldHTML = generateFieldHTML(fieldName, fieldConfig);
            colDiv.innerHTML = fieldHTML;
            
            fieldsRow.appendChild(colDiv);
        });
        
        sectionDiv.appendChild(fieldsRow);
        container.appendChild(sectionDiv);
    });
}

function getColumnClass(fieldType) {
    switch (fieldType) {
        case 'textarea':
            return 'col-12';
        case 'checkbox':
            return 'col-md-4';
        case 'number':
            return 'col-md-3';
        default:
            return 'col-md-6';
    }
}

function generateFieldHTML(fieldName, config) {
    let inputHTML = '';
    
    switch (config.type) {
        case 'number':
            inputHTML = `<input type="number" class="form-control text-center" id="${fieldName}" name="${fieldName}" 
                        min="${config.min || 0}" max="${config.max || 100}" value="${config.default || 0}">`;
            break;
        case 'text':
            inputHTML = `<input type="text" class="form-control" id="${fieldName}" name="${fieldName}" 
                        placeholder="${config.placeholder || ''}" value="${config.default || ''}"
                        ${config.required ? 'required' : ''}>`;
            break;
        case 'textarea':
            inputHTML = `<textarea class="form-control" id="${fieldName}" name="${fieldName}" rows="3" 
                        placeholder="${config.placeholder || ''}">${config.default || ''}</textarea>`;
            break;
        case 'checkbox':
            const checked = config.default ? 'checked' : '';
            inputHTML = `<div class="form-check">
                        <input type="checkbox" class="form-check-input" id="${fieldName}" name="${fieldName}" ${checked}>
                        <label class="form-check-label" for="${fieldName}">${config.label}</label>
                        </div>`;
            return inputHTML;
        default:
            inputHTML = `<input type="text" class="form-control" id="${fieldName}" name="${fieldName}" value="${config.default || ''}">`;
    }
    
    return `
        <label class="form-label" for="${fieldName}">${config.label}</label>
        ${inputHTML}
    `;
}