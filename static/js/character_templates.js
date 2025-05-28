// Templates de sistemas de RPG para criação de fichas
const RPG_TEMPLATES = {
    'D&D 5e': {
        name: 'Dungeons & Dragons 5ª Edição',
        fields: {
            // Atributos básicos
            strength: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            dexterity: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constitution: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            intelligence: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            wisdom: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            charisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            
            // Stats específicos de D&D 5e
            proficiency_bonus: { label: 'Bônus de Proficiência', type: 'number', min: 2, max: 6, default: 2 },
            inspiration: { label: 'Inspiração', type: 'checkbox', default: false },
            
            // Salvaguardas
            str_save: { label: 'Salvaguarda de Força', type: 'checkbox' },
            dex_save: { label: 'Salvaguarda de Destreza', type: 'checkbox' },
            con_save: { label: 'Salvaguarda de Constituição', type: 'checkbox' },
            int_save: { label: 'Salvaguarda de Inteligência', type: 'checkbox' },
            wis_save: { label: 'Salvaguarda de Sabedoria', type: 'checkbox' },
            cha_save: { label: 'Salvaguarda de Carisma', type: 'checkbox' },
            
            // Perícias
            skills: { label: 'Perícias', type: 'textarea', placeholder: 'Liste as perícias e modificadores...' },
            
            // Combate
            hit_dice: { label: 'Dados de Vida', type: 'text', placeholder: 'Ex: 3d8' },
            death_saves: { label: 'Salvaguardas contra Morte', type: 'text', placeholder: 'Sucessos/Falhas' }
        },
        sections: [
            { name: 'Atributos', fields: ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] },
            { name: 'Proficiências', fields: ['proficiency_bonus', 'inspiration', 'str_save', 'dex_save', 'con_save', 'int_save', 'wis_save', 'cha_save'] },
            { name: 'Perícias', fields: ['skills'] },
            { name: 'Combate Especial', fields: ['hit_dice', 'death_saves'] }
        ]
    },
    
    'Tormenta20': {
        name: 'Tormenta20',
        fields: {
            // Atributos do T20
            strength: { label: 'Força', type: 'number', min: 0, max: 30, default: 10 },
            dexterity: { label: 'Agilidade', type: 'number', min: 0, max: 30, default: 10 },
            intelligence: { label: 'Intelecto', type: 'number', min: 0, max: 30, default: 10 },
            presence: { label: 'Presença', type: 'number', min: 0, max: 30, default: 10 },
            vigor: { label: 'Vigor', type: 'number', min: 0, max: 30, default: 10 },
            
            // Stats específicos do T20
            defense: { label: 'Defesa', type: 'number', min: 0, max: 50, default: 10 },
            mana_points: { label: 'Pontos de Mana', type: 'number', min: 0, max: 999, default: 0 },
            max_mana: { label: 'Mana Máxima', type: 'number', min: 0, max: 999, default: 0 },
            
            // Perícias do T20
            acrobatics: { label: 'Acrobacia', type: 'number', default: 0 },
            athletics: { label: 'Atletismo', type: 'number', default: 0 },
            knowledge: { label: 'Conhecimento', type: 'number', default: 0 },
            diplomacy: { label: 'Diplomacia', type: 'number', default: 0 },
            stealth: { label: 'Furtividade', type: 'number', default: 0 },
            initiative: { label: 'Iniciativa', type: 'number', default: 0 },
            intimidation: { label: 'Intimidação', type: 'number', default: 0 },
            investigation: { label: 'Investigação', type: 'number', default: 0 },
            fighting: { label: 'Luta', type: 'number', default: 0 },
            medicine: { label: 'Medicina', type: 'number', default: 0 },
            occultism: { label: 'Ocultismo', type: 'number', default: 0 },
            perception: { label: 'Percepção', type: 'number', default: 0 },
            piloting: { label: 'Pilotagem', type: 'number', default: 0 },
            aim: { label: 'Pontaria', type: 'number', default: 0 },
            profession: { label: 'Profissão', type: 'number', default: 0 },
            reflexes: { label: 'Reflexos', type: 'number', default: 0 },
            religion: { label: 'Religião', type: 'number', default: 0 },
            survival: { label: 'Sobrevivência', type: 'number', default: 0 },
            tactics: { label: 'Tática', type: 'number', default: 0 },
            technology: { label: 'Tecnologia', type: 'number', default: 0 },
            treatment: { label: 'Tratamento', type: 'number', default: 0 },
            deceive: { label: 'Enganação', type: 'number', default: 0 },
            will: { label: 'Vontade', type: 'number', default: 0 }
        },
        sections: [
            { name: 'Atributos', fields: ['strength', 'dexterity', 'intelligence', 'presence', 'vigor'] },
            { name: 'Defesa e Mana', fields: ['defense', 'mana_points', 'max_mana'] },
            { name: 'Perícias Físicas', fields: ['acrobatics', 'athletics', 'fighting', 'piloting', 'aim', 'reflexes', 'stealth'] },
            { name: 'Perícias Mentais', fields: ['knowledge', 'investigation', 'medicine', 'occultism', 'perception', 'profession', 'religion', 'survival', 'tactics', 'technology', 'treatment'] },
            { name: 'Perícias Sociais', fields: ['diplomacy', 'intimidation', 'deceive', 'will'] }
        ]
    },
    
    'Call of Cthulhu': {
        name: 'Call of Cthulhu',
        fields: {
            // Características do CoC
            strength: { label: 'Força (STR)', type: 'number', min: 1, max: 100, default: 50 },
            constitution: { label: 'Constituição (CON)', type: 'number', min: 1, max: 100, default: 50 },
            dexterity: { label: 'Destreza (DEX)', type: 'number', min: 1, max: 100, default: 50 },
            intelligence: { label: 'Inteligência (INT)', type: 'number', min: 1, max: 100, default: 50 },
            power: { label: 'Poder (POW)', type: 'number', min: 1, max: 100, default: 50 },
            appearance: { label: 'Aparência (APP)', type: 'number', min: 1, max: 100, default: 50 },
            education: { label: 'Educação (EDU)', type: 'number', min: 1, max: 100, default: 50 },
            size: { label: 'Tamanho (SIZ)', type: 'number', min: 1, max: 100, default: 50 },
            
            // Stats derivados
            sanity: { label: 'Sanidade', type: 'number', min: 0, max: 99, default: 50 },
            max_sanity: { label: 'Sanidade Máxima', type: 'number', min: 0, max: 99, default: 99 },
            magic_points: { label: 'Pontos de Magia', type: 'number', min: 0, max: 99, default: 10 },
            luck: { label: 'Sorte', type: 'number', min: 1, max: 100, default: 50 },
            
            // Perícias principais do CoC
            accounting: { label: 'Contabilidade', type: 'number', default: 5 },
            anthropology: { label: 'Antropologia', type: 'number', default: 1 },
            archaeology: { label: 'Arqueologia', type: 'number', default: 1 },
            art_craft: { label: 'Arte/Ofício', type: 'number', default: 5 },
            charm: { label: 'Charme', type: 'number', default: 15 },
            climb: { label: 'Escalar', type: 'number', default: 20 },
            credit_rating: { label: 'Nível de Crédito', type: 'number', default: 0 },
            cthulhu_mythos: { label: 'Mitos de Cthulhu', type: 'number', default: 0 },
            disguise: { label: 'Disfarce', type: 'number', default: 5 },
            dodge: { label: 'Esquiva', type: 'number', default: 0 },
            drive_auto: { label: 'Dirigir Auto', type: 'number', default: 20 },
            fast_talk: { label: 'Lábia', type: 'number', default: 5 },
            fighting_brawl: { label: 'Briga', type: 'number', default: 25 },
            firearms_handgun: { label: 'Armas de Fogo (Pistola)', type: 'number', default: 20 },
            first_aid: { label: 'Primeiros Socorros', type: 'number', default: 30 },
            history: { label: 'História', type: 'number', default: 5 },
            intimidate: { label: 'Intimidar', type: 'number', default: 15 },
            jump: { label: 'Saltar', type: 'number', default: 20 },
            language_own: { label: 'Idioma (Próprio)', type: 'number', default: 0 },
            law: { label: 'Direito', type: 'number', default: 5 },
            library_use: { label: 'Uso de Bibliotecas', type: 'number', default: 20 },
            listen: { label: 'Ouvir', type: 'number', default: 20 },
            locksmith: { label: 'Chaveiro', type: 'number', default: 1 },
            medicine: { label: 'Medicina', type: 'number', default: 1 },
            occult: { label: 'Ocultismo', type: 'number', default: 5 },
            operate_machinery: { label: 'Operar Máquinas', type: 'number', default: 1 },
            persuade: { label: 'Persuasão', type: 'number', default: 10 },
            psychology: { label: 'Psicologia', type: 'number', default: 10 },
            ride: { label: 'Cavalgar', type: 'number', default: 5 },
            science: { label: 'Ciência', type: 'number', default: 1 },
            sleight_of_hand: { label: 'Prestidigitação', type: 'number', default: 10 },
            spot_hidden: { label: 'Observar', type: 'number', default: 25 },
            stealth: { label: 'Furtividade', type: 'number', default: 20 },
            survival: { label: 'Sobrevivência', type: 'number', default: 10 },
            swim: { label: 'Nadar', type: 'number', default: 20 },
            throw: { label: 'Arremessar', type: 'number', default: 20 },
            track: { label: 'Rastrear', type: 'number', default: 10 }
        },
        sections: [
            { name: 'Características', fields: ['strength', 'constitution', 'dexterity', 'intelligence', 'power', 'appearance', 'education', 'size'] },
            { name: 'Stats Derivados', fields: ['sanity', 'max_sanity', 'magic_points', 'luck'] },
            { name: 'Perícias Físicas', fields: ['climb', 'dodge', 'drive_auto', 'fighting_brawl', 'firearms_handgun', 'jump', 'ride', 'stealth', 'swim', 'throw'] },
            { name: 'Perícias Mentais', fields: ['accounting', 'anthropology', 'archaeology', 'art_craft', 'cthulhu_mythos', 'history', 'law', 'library_use', 'medicine', 'occult', 'psychology', 'science'] },
            { name: 'Perícias Sociais', fields: ['charm', 'credit_rating', 'disguise', 'fast_talk', 'intimidate', 'language_own', 'persuade'] },
            { name: 'Perícias Técnicas', fields: ['first_aid', 'listen', 'locksmith', 'operate_machinery', 'sleight_of_hand', 'spot_hidden', 'survival', 'track'] }
        ]
    },

    'Vampire': {
        name: 'Vampire: The Masquerade',
        fields: {
            // Atributos Físicos
            strength: { label: 'Força', type: 'number', min: 1, max: 5, default: 1 },
            dexterity: { label: 'Destreza', type: 'number', min: 1, max: 5, default: 1 },
            stamina: { label: 'Vigor', type: 'number', min: 1, max: 5, default: 1 },
            
            // Atributos Sociais
            charisma: { label: 'Carisma', type: 'number', min: 1, max: 5, default: 1 },
            manipulation: { label: 'Manipulação', type: 'number', min: 1, max: 5, default: 1 },
            appearance: { label: 'Aparência', type: 'number', min: 1, max: 5, default: 1 },
            
            // Atributos Mentais
            perception: { label: 'Percepção', type: 'number', min: 1, max: 5, default: 1 },
            intelligence: { label: 'Inteligência', type: 'number', min: 1, max: 5, default: 1 },
            wits: { label: 'Raciocínio', type: 'number', min: 1, max: 5, default: 1 },
            
            // Stats específicos de Vampiro
            generation: { label: 'Geração', type: 'number', min: 3, max: 15, default: 13 },
            blood_pool: { label: 'Reserva de Sangue', type: 'number', min: 0, max: 50, default: 1 },
            max_blood_pool: { label: 'Reserva Máxima', type: 'number', min: 1, max: 50, default: 10 },
            willpower: { label: 'Força de Vontade', type: 'number', min: 0, max: 10, default: 1 },
            max_willpower: { label: 'Força de Vontade Máxima', type: 'number', min: 1, max: 10, default: 1 },
            humanity: { label: 'Humanidade', type: 'number', min: 0, max: 10, default: 7 },
            
            // Clã e Seita
            clan: { label: 'Clã', type: 'text', placeholder: 'Ex: Ventrue, Toreador, Nosferatu...' },
            sect: { label: 'Seita', type: 'text', placeholder: 'Ex: Camarilla, Sabbat, Anarquistas...' },
            
            // Habilidades
            talents: { label: 'Talentos', type: 'textarea', placeholder: 'Liste talentos e níveis...' },
            skills: { label: 'Perícias', type: 'textarea', placeholder: 'Liste perícias e níveis...' },
            knowledges: { label: 'Conhecimentos', type: 'textarea', placeholder: 'Liste conhecimentos e níveis...' },
            
            // Disciplinas
            disciplines: { label: 'Disciplinas', type: 'textarea', placeholder: 'Liste disciplinas e níveis...' }
        },
        sections: [
            { name: 'Atributos Físicos', fields: ['strength', 'dexterity', 'stamina'] },
            { name: 'Atributos Sociais', fields: ['charisma', 'manipulation', 'appearance'] },
            { name: 'Atributos Mentais', fields: ['perception', 'intelligence', 'wits'] },
            { name: 'Características Vampíricas', fields: ['generation', 'blood_pool', 'max_blood_pool', 'willpower', 'max_willpower', 'humanity'] },
            { name: 'Identidade', fields: ['clan', 'sect'] },
            { name: 'Habilidades', fields: ['talents', 'skills', 'knowledges'] },
            { name: 'Poderes', fields: ['disciplines'] }
        ]
    }
};

// Função para aplicar template baseado no sistema
function applySystemTemplate(systemName) {
    const template = RPG_TEMPLATES[systemName];
    if (!template) return;
    
    console.log(`Aplicando template para ${systemName}`);
    
    // Aqui você pode aplicar os valores padrão e mostrar/ocultar campos
    // baseado no sistema selecionado
    
    // Exemplo: aplicar valores padrão
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
        sectionHeader.textContent = section.name;
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
                        placeholder="${config.placeholder || ''}" value="${config.default || ''}">`;
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
            return inputHTML; // Checkbox não precisa de label separado
        default:
            inputHTML = `<input type="text" class="form-control" id="${fieldName}" name="${fieldName}" value="${config.default || ''}">`;
    }
    
    return `
        <label class="form-label" for="${fieldName}">${config.label}</label>
        ${inputHTML}
    `;
}