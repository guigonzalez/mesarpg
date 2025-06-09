// Templates de sistemas de RPG para criação de fichas baseados no CSV
const RPG_TEMPLATES = {
    'D&D 5e': {
        name: 'Dungeons & Dragons 5ª Edição',
        fields: {
            // Informações básicas
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
            // Informações básicas (idênticas ao D&D 5e conforme CSV)
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            
            // Atributos (idênticos ao D&D 5e)
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            
            // Perícias (idênticas ao D&D 5e)
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
            
            // Equipamentos e Habilidades (idênticos ao D&D 5e)
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Liste armas, armaduras e itens...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Liste magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Ataques únicos do personagem...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico' },
            
            // Stats de combate (idênticos ao D&D 5e)
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
    
    'Call of Cthulhu': {
        name: 'Call of Cthulhu',
        fields: {
            // Informações básicas (idênticas ao D&D 5e conforme CSV)
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            
            // Atributos (idênticos ao D&D 5e)
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            
            // Perícias (idênticas ao D&D 5e)
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
            
            // Equipamentos e Habilidades (idênticos ao D&D 5e)
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Liste armas, armaduras e itens...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Liste magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Ataques únicos do personagem...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico' },
            
            // Stats de combate (idênticos ao D&D 5e)
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

    'Vampire': {
        name: 'Vampire: The Masquerade',
        fields: {
            // Informações básicas (idênticas ao D&D 5e conforme CSV)
            nome: { label: 'Nome', type: 'text', required: true },
            raca: { label: 'Raça', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom' },
            background: { label: 'Background', type: 'text', placeholder: 'Ex: Soldado, Artesão' },
            
            // Atributos (idênticos ao D&D 5e)
            forca: { label: 'Força', type: 'number', min: 1, max: 30, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 30, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 1, max: 30, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 30, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 1, max: 30, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 30, default: 10 },
            
            // Perícias (idênticas ao D&D 5e)
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