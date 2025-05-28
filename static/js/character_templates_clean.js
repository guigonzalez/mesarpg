// Templates de sistemas de RPG baseados no CSV fornecido
const RPG_TEMPLATES = {
    'D&D 5e': {
        name: 'Dungeons & Dragons 5ª Edição',
        fields: {
            // Informações básicas do personagem
            nome: { label: 'Nome do Personagem', type: 'text', required: true },
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
            // Informações básicas específicas do Vampire
            nome: { label: 'Nome do Vampiro', type: 'text', required: true, placeholder: 'Ex: Magnus Blackthorne' },
            raca: { label: 'Clã', type: 'text', placeholder: 'Ex: Brujah, Toreador, Ventrue, Nosferatu' },
            classe: { label: 'Conceito', type: 'text', placeholder: 'Ex: Rebelde, Artista, Político, Investigador' },
            alinhamento: { label: 'Natureza/Comportamento', type: 'text', placeholder: 'Ex: Visionário/Conformista' },
            background: { label: 'Prelúdio', type: 'text', placeholder: 'Vida mortal anterior' },
            
            // Atributos vampíricos (escala 1-5)
            forca: { label: 'Força', type: 'number', min: 1, max: 5, default: 1 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 5, default: 1 },
            constituicao: { label: 'Vigor', type: 'number', min: 1, max: 5, default: 1 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 5, default: 1 },
            sabedoria: { label: 'Raciocínio', type: 'number', min: 1, max: 5, default: 1 },
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 5, default: 1 },
            
            // Perícias específicas do Vampire
            acrobacia: { label: 'Esportes', type: 'number', min: 0, max: 5, default: 0 },
            arcanismo: { label: 'Ocultismo', type: 'number', min: 0, max: 5, default: 0 },
            atletismo: { label: 'Briga', type: 'number', min: 0, max: 5, default: 0 },
            enganacao: { label: 'Lábia', type: 'number', min: 0, max: 5, default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', min: 0, max: 5, default: 0 },
            historia: { label: 'Acadêmicos', type: 'number', min: 0, max: 5, default: 0 },
            intuicao: { label: 'Empatia', type: 'number', min: 0, max: 5, default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 0, max: 5, default: 0 },
            investigacao: { label: 'Investigação', type: 'number', min: 0, max: 5, default: 0 },
            lidar_animais: { label: 'Trato com Animais', type: 'number', min: 0, max: 5, default: 0 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 5, default: 0 },
            natureza: { label: 'Sobrevivência', type: 'number', min: 0, max: 5, default: 0 },
            percepcao: { label: 'Prontidão', type: 'number', min: 0, max: 5, default: 0 },
            persuasao: { label: 'Persuasão', type: 'number', min: 0, max: 5, default: 0 },
            prestidigitacao: { label: 'Ofícios', type: 'number', min: 0, max: 5, default: 0 },
            religiao: { label: 'Teologia', type: 'number', min: 0, max: 5, default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', min: 0, max: 5, default: 0 },
            
            // Equipamentos e habilidades vampíricas
            equipamentos: { label: 'Posses Pessoais', type: 'textarea', placeholder: 'Itens importantes, armas, objetos de valor...' },
            magias: { label: 'Disciplinas Vampíricas', type: 'textarea', placeholder: 'Ex: Dominação 2, Presença 1, Fortitude 2...' },
            ataques_especiais: { label: 'Poderes Especiais', type: 'textarea', placeholder: 'Habilidades únicas do clã ou linhagem...' },
            recursos_classe: { label: 'Antecedentes', type: 'textarea', placeholder: 'Aliados, Contatos, Recursos, Refúgio, etc...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Português, Inglês, Latim' },
            
            // Stats vampíricos específicos
            pv: { label: 'Vitalidade', type: 'number', min: 1, max: 15, default: 7 },
            ca: { label: 'Força de Vontade', type: 'number', min: 1, max: 10, default: 3 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Reserva de Sangue', type: 'number', min: 1, max: 20, default: 10 },
            historia_personagem: { label: 'História Vampírica', type: 'textarea', placeholder: 'Abraço, Sire, primeiras noites, experiências não-mortas...' }
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
    
    '3D&T': {
        name: '3D&T Alpha',
        fields: {
            // Informações básicas específicas do 3D&T
            nome: { label: 'Nome do Personagem', type: 'text', required: true, placeholder: 'Ex: Kenji Yamamoto' },
            raca: { label: 'Raça/Origem', type: 'text', placeholder: 'Ex: Humano, Youkai, Robô, Alienígena' },
            classe: { label: 'Classe/Conceito', type: 'text', placeholder: 'Ex: Lutador, Mago, Inventor, Detetive' },
            alinhamento: { label: 'Tendência', type: 'text', placeholder: 'Ex: Ordeiro e Bom, Neutro, Caótico' },
            background: { label: 'Origem', type: 'text', placeholder: 'Ex: Escola, Laboratório, Rua' },
            
            // Atributos do 3D&T (escala 0-5)
            forca: { label: 'Força', type: 'number', min: 0, max: 5, default: 1 },
            destreza: { label: 'Habilidade', type: 'number', min: 0, max: 5, default: 1 },
            constituicao: { label: 'Resistência', type: 'number', min: 0, max: 5, default: 1 },
            inteligencia: { label: 'Poder de Fogo', type: 'number', min: 0, max: 5, default: 0 },
            sabedoria: { label: 'Poder Mágico', type: 'number', min: 0, max: 5, default: 0 },
            carisma: { label: 'Carisma', type: 'number', min: 0, max: 5, default: 1 },
            
            // Perícias específicas do 3D&T
            acrobacia: { label: 'Acrobacia', type: 'number', min: 0, max: 5, default: 0 },
            arcanismo: { label: 'Ciências Proibidas', type: 'number', min: 0, max: 5, default: 0 },
            atletismo: { label: 'Esportes', type: 'number', min: 0, max: 5, default: 0 },
            enganacao: { label: 'Enganação', type: 'number', min: 0, max: 5, default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', min: 0, max: 5, default: 0 },
            historia: { label: 'Investigação', type: 'number', min: 0, max: 5, default: 0 },
            intuicao: { label: 'Intuição', type: 'number', min: 0, max: 5, default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 0, max: 5, default: 0 },
            investigacao: { label: 'Pesquisa', type: 'number', min: 0, max: 5, default: 0 },
            lidar_animais: { label: 'Animais', type: 'number', min: 0, max: 5, default: 0 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 5, default: 0 },
            natureza: { label: 'Sobrevivência', type: 'number', min: 0, max: 5, default: 0 },
            percepcao: { label: 'Crime', type: 'number', min: 0, max: 5, default: 0 },
            persuasao: { label: 'Manipulação', type: 'number', min: 0, max: 5, default: 0 },
            prestidigitacao: { label: 'Arte', type: 'number', min: 0, max: 5, default: 0 },
            religiao: { label: 'Idiomas', type: 'number', min: 0, max: 5, default: 0 },
            sobrevivencia: { label: 'Máquinas', type: 'number', min: 0, max: 5, default: 0 },
            
            // Equipamentos e habilidades do 3D&T
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, gadgets, itens especiais...' },
            magias: { label: 'Técnicas Especiais', type: 'textarea', placeholder: 'Ataques especiais, magias, habilidades únicas...' },
            ataques_especiais: { label: 'Vantagens', type: 'textarea', placeholder: 'Vantagens raciais e de classe...' },
            recursos_classe: { label: 'Desvantagens', type: 'textarea', placeholder: 'Limitações e fraquezas...' },
            idiomas: { label: 'Idiomas Conhecidos', type: 'text', placeholder: 'Ex: Japonês, Português, Inglês' },
            
            // Stats específicos do 3D&T
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 50, default: 5 },
            ca: { label: 'Armor', type: 'number', min: 0, max: 10, default: 0 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Pontos de Magia', type: 'number', min: 0, max: 50, default: 0 },
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background anime/mangá, motivações, objetivos...' }
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
    
    'Pathfinder': {
        name: 'Pathfinder',
        fields: {
            // Informações básicas do Pathfinder
            nome: { label: 'Nome do Personagem', type: 'text', required: true, placeholder: 'Ex: Seelah Brightblade' },
            raca: { label: 'Ancestralidade', type: 'text', placeholder: 'Ex: Humano, Élfico, Anão, Halfling' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Campeão, Ranger, Feiticeiro' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom, Neutro' },
            background: { label: 'Antecedente', type: 'text', placeholder: 'Ex: Acólito, Criminoso, Scholar' },
            
            // Atributos do Pathfinder 2e
            forca: { label: 'Força', type: 'number', min: 8, max: 25, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 8, max: 25, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 8, max: 25, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 8, max: 25, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 8, max: 25, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 8, max: 25, default: 10 },
            
            // Perícias do Pathfinder 2e
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
            persuasao: { label: 'Diplomacia', type: 'number', default: 0 },
            prestidigitacao: { label: 'Roubo', type: 'number', default: 0 },
            religiao: { label: 'Religião', type: 'number', default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', default: 0 },
            
            // Equipamentos e habilidades do Pathfinder
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, armaduras, itens mágicos...' },
            magias: { label: 'Magias/Cantrips', type: 'textarea', placeholder: 'Magias conhecidas e cantrips...' },
            ataques_especiais: { label: 'Feitos', type: 'textarea', placeholder: 'Feitos de classe e ancestralidade...' },
            recursos_classe: { label: 'Habilidades de Classe', type: 'textarea', placeholder: 'Características especiais da classe...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico, Dracônico' },
            
            // Stats do Pathfinder 2e
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 10, default: 10 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'CD de Percepção', type: 'number', default: 10 },
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background e motivações em Golarion...' }
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
            // Informações básicas do Call of Cthulhu
            nome: { label: 'Nome do Investigador', type: 'text', required: true, placeholder: 'Ex: Dr. Henry Armitage' },
            raca: { label: 'Ocupação', type: 'text', placeholder: 'Ex: Professor, Detetive, Jornalista' },
            classe: { label: 'Arquétipo', type: 'text', placeholder: 'Ex: Acadêmico, Combatente, Especialista' },
            alinhamento: { label: 'Motivação', type: 'text', placeholder: 'Ex: Busca por conhecimento, Justiça' },
            background: { label: 'Antecedentes', type: 'text', placeholder: 'Ex: Universidade, Força Policial' },
            
            // Atributos do Call of Cthulhu (3d6 x 5)
            forca: { label: 'Força', type: 'number', min: 15, max: 90, default: 50 },
            destreza: { label: 'Destreza', type: 'number', min: 15, max: 90, default: 50 },
            constituicao: { label: 'Constituição', type: 'number', min: 15, max: 90, default: 50 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 15, max: 90, default: 50 },
            sabedoria: { label: 'Poder', type: 'number', min: 15, max: 90, default: 50 },
            carisma: { label: 'Aparência', type: 'number', min: 15, max: 90, default: 50 },
            
            // Perícias específicas do Call of Cthulhu
            acrobacia: { label: 'Escalar', type: 'number', min: 0, max: 99, default: 20 },
            arcanismo: { label: 'Mitos de Cthulhu', type: 'number', min: 0, max: 99, default: 0 },
            atletismo: { label: 'Saltar', type: 'number', min: 0, max: 99, default: 20 },
            enganacao: { label: 'Enganar', type: 'number', min: 0, max: 99, default: 5 },
            furtividade: { label: 'Furtividade', type: 'number', min: 0, max: 99, default: 20 },
            historia: { label: 'História', type: 'number', min: 0, max: 99, default: 5 },
            intuicao: { label: 'Psicologia', type: 'number', min: 0, max: 99, default: 10 },
            intimidacao: { label: 'Intimidar', type: 'number', min: 0, max: 99, default: 15 },
            investigacao: { label: 'Descobrir Pistas', type: 'number', min: 0, max: 99, default: 25 },
            lidar_animais: { label: 'Cavalgar', type: 'number', min: 0, max: 99, default: 5 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 99, default: 1 },
            natureza: { label: 'Ciência Natural', type: 'number', min: 0, max: 99, default: 1 },
            percepcao: { label: 'Observar', type: 'number', min: 0, max: 99, default: 25 },
            persuasao: { label: 'Persuadir', type: 'number', min: 0, max: 99, default: 10 },
            prestidigitacao: { label: 'Prestidigitação', type: 'number', min: 0, max: 99, default: 10 },
            religiao: { label: 'Ocultismo', type: 'number', min: 0, max: 99, default: 5 },
            sobrevivencia: { label: 'Rastreamento', type: 'number', min: 0, max: 99, default: 10 },
            
            // Equipamentos e aspectos do Call of Cthulhu
            equipamentos: { label: 'Posses', type: 'textarea', placeholder: 'Livros, armas, equipamentos de investigação...' },
            magias: { label: 'Magias/Rituais', type: 'textarea', placeholder: 'Magias conhecidas (perigosas!)...' },
            ataques_especiais: { label: 'Fobias/Manias', type: 'textarea', placeholder: 'Medos e obsessões do investigador...' },
            recursos_classe: { label: 'Contatos', type: 'textarea', placeholder: 'Aliados, informantes, recursos...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Inglês, Latim, Grego Antigo' },
            
            // Stats específicos do Call of Cthulhu
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 30, default: 10 },
            ca: { label: 'Sanidade', type: 'number', min: 0, max: 99, default: 50 },
            iniciativa: { label: 'Iniciativa', type: 'number', default: 0 },
            percepcao_passiva: { label: 'Pontos de Magia', type: 'number', min: 0, max: 50, default: 10 },
            historia_personagem: { label: 'História do Investigador', type: 'textarea', placeholder: 'Como chegou aos mistérios do sobrenatural...' }
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
    console.log('Gerando formulário para sistema:', systemName);
    
    const template = RPG_TEMPLATES[systemName];
    if (!template) {
        console.error('Template não encontrado para sistema:', systemName);
        return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container não encontrado:', containerId);
        return;
    }
    
    console.log('Template encontrado:', template.name);
    console.log('Número de seções:', template.sections.length);
    
    container.innerHTML = '';
    
    // Gerar seções
    template.sections.forEach((section, sectionIndex) => {
        console.log(`Processando seção ${sectionIndex + 1}: ${section.name}`);
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mb-4';
        
        const sectionHeader = document.createElement('h6');
        sectionHeader.className = 'text-primary mb-3 border-bottom pb-2';
        sectionHeader.innerHTML = `<i class="fas fa-folder me-2"></i>${section.name}`;
        sectionDiv.appendChild(sectionHeader);
        
        const fieldsRow = document.createElement('div');
        fieldsRow.className = 'row g-3';
        
        let fieldsAdded = 0;
        section.fields.forEach(fieldName => {
            const fieldConfig = template.fields[fieldName];
            if (!fieldConfig) {
                console.warn(`Campo não encontrado: ${fieldName}`);
                return;
            }
            
            const colDiv = document.createElement('div');
            colDiv.className = getColumnClass(fieldConfig.type);
            
            const fieldHTML = generateFieldHTML(fieldName, fieldConfig);
            colDiv.innerHTML = fieldHTML;
            
            fieldsRow.appendChild(colDiv);
            fieldsAdded++;
        });
        
        console.log(`Adicionados ${fieldsAdded} campos na seção ${section.name}`);
        
        if (fieldsAdded > 0) {
            sectionDiv.appendChild(fieldsRow);
            container.appendChild(sectionDiv);
        }
    });
    
    console.log('Formulário gerado com sucesso!');
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

// Função principal para carregar template
function loadSystemTemplate() {
    const systemSelect = document.getElementById('systemSelect');
    const templateType = document.getElementById('templateType');
    
    if (!systemSelect || !templateType) {
        console.error('Elementos de seleção não encontrados!');
        return;
    }
    
    const systemName = systemSelect.value;
    const type = templateType.value;
    
    console.log(`=== CARREGANDO TEMPLATE ===`);
    console.log(`Sistema: ${systemName}`);
    console.log(`Tipo: ${type}`);
    
    // Limpar container primeiro
    const container = document.getElementById('systemFieldsContainer');
    if (container) {
        container.innerHTML = '';
    }
    
    // Adaptar campos iniciais baseados no sistema e tipo
    adaptInitialFields(systemName, type);
    
    // Decidir qual tipo de formulário gerar
    if (type === 'npc' || type === 'monster') {
        console.log(`🔥 GERANDO FORMULÁRIO SIMPLIFICADO para ${type.toUpperCase()}`);
        generateSimplifiedForm(systemName, type, 'systemFieldsContainer');
    } else {
        console.log(`⚡ GERANDO FORMULÁRIO AVANÇADO para ${type.toUpperCase()}`);
        generateTemplateForm(systemName, 'systemFieldsContainer');
    }
}

// Função para adaptar campos iniciais baseados no sistema e tipo
function adaptInitialFields(systemName, templateType = 'player') {
    console.log(`Adaptando campos para: ${systemName} - Tipo: ${templateType}`);
    
    const nameLabel = document.getElementById('characterNameLabel');
    const levelLabel = document.getElementById('levelLabel');
    const levelInput = document.getElementById('level');
    
    console.log('Elementos encontrados:', { nameLabel, levelLabel, levelInput });
    
    if (!nameLabel || !levelLabel || !levelInput) {
        console.error('Elementos não encontrados!');
        return;
    }
    
    // Adaptar nome baseado no tipo
    let baseName = 'Nome do Personagem';
    switch (templateType) {
        case 'npc':
            baseName = 'Nome do NPC';
            break;
        case 'monster':
            baseName = 'Nome da Criatura';
            break;
        default:
            baseName = 'Nome do Personagem';
    }
    
    // Adaptar campos baseado no sistema
    switch (systemName) {
        case 'Vampire':
            if (templateType === 'monster') {
                nameLabel.textContent = 'Nome da Criatura';
                levelLabel.textContent = 'Poder';
            } else {
                nameLabel.textContent = templateType === 'npc' ? 'Nome do Vampiro NPC' : 'Nome do Vampiro';
                levelLabel.textContent = 'Geração';
            }
            levelInput.min = 1;
            levelInput.max = 15;
            levelInput.value = templateType === 'monster' ? 5 : 13;
            levelInput.placeholder = templateType === 'monster' ? 'Nível de poder' : 'Geração vampírica';
            break;
            
        case 'Call of Cthulhu':
            if (templateType === 'monster') {
                nameLabel.textContent = 'Nome da Criatura';
                levelLabel.textContent = 'Poder';
                levelInput.min = 1;
                levelInput.max = 20;
                levelInput.value = 5;
                levelInput.placeholder = 'Nível de poder sobrenatural';
            } else {
                nameLabel.textContent = templateType === 'npc' ? 'Nome do NPC' : 'Nome do Investigador';
                levelLabel.textContent = 'Idade';
                levelInput.min = 18;
                levelInput.max = 90;
                levelInput.value = 25;
                levelInput.placeholder = 'Idade do personagem';
            }
            break;
            
        case '3D&T':
            nameLabel.textContent = baseName;
            levelLabel.textContent = 'Pontos';
            levelInput.min = 1;
            levelInput.max = templateType === 'monster' ? 15 : 10;
            levelInput.value = templateType === 'monster' ? 5 : 1;
            levelInput.placeholder = templateType === 'monster' ? 'Pontos de criatura' : 'Pontos de personagem';
            break;
            
        case 'Pathfinder':
        case 'Tormenta20':
        default: // D&D 5e
            nameLabel.textContent = baseName;
            levelLabel.textContent = templateType === 'monster' ? 'ND' : 'Nível';
            levelInput.min = templateType === 'monster' ? 0 : 1;
            levelInput.max = templateType === 'monster' ? 30 : 20;
            levelInput.value = templateType === 'monster' ? 1 : 1;
            levelInput.placeholder = templateType === 'monster' ? 'Nível de Desafio' : 'Nível do personagem';
            break;
    }
}

// Templates simplificados baseados no CSV fornecido
const SIMPLIFIED_TEMPLATES = {
    'D&D 5e': {
        npc: {
            title: 'NPC Simplificado - D&D 5e',
            fields: [
                { name: 'nome_npc', label: 'Nome', type: 'text', required: true },
                { name: 'raca_classe', label: 'Raça / Classe', type: 'text', placeholder: 'Ex: Humano Guerreiro' },
                { name: 'atributos_principais', label: 'Atributos Principais', type: 'text', placeholder: 'FOR 16, DES 14, CON 15' },
                { name: 'pv_npc', label: 'PV', type: 'number', min: 1, default: 20 },
                { name: 'ca_npc', label: 'CA', type: 'number', min: 10, default: 15 },
                { name: 'iniciativa_npc', label: 'Iniciativa', type: 'number', default: 2 },
                { name: 'pericias_principais', label: 'Perícias Principais', type: 'text', placeholder: 'Intimidação +5, Percepção +3' },
                { name: 'habilidades_npc', label: 'Habilidades', type: 'textarea', placeholder: 'Habilidades especiais...' },
                { name: 'motivacao', label: 'Motivação', type: 'textarea', placeholder: 'O que motiva este NPC...' },
                { name: 'recompensa', label: 'Recompensa', type: 'text', placeholder: 'XP, ouro, itens...' }
            ]
        },
        monster: {
            title: 'Monstro Simplificado - D&D 5e',
            fields: [
                { name: 'nome_monstro', label: 'Nome', type: 'text', required: true },
                { name: 'tipo_monstro', label: 'Tipo', type: 'text', placeholder: 'Besta, Morto-vivo, Dragão...' },
                { name: 'nd', label: 'ND', type: 'number', min: 0, max: 30, default: 1 },
                { name: 'pv_monstro', label: 'PV', type: 'number', min: 1, default: 25 },
                { name: 'ca_monstro', label: 'CA', type: 'number', min: 10, default: 13 },
                { name: 'deslocamento', label: 'Deslocamento', type: 'text', placeholder: '9m, voo 18m' },
                { name: 'atributos_monstro', label: 'Atributos', type: 'text', placeholder: 'FOR 18, DES 12, CON 16...' },
                { name: 'ataques', label: 'Ataques', type: 'textarea', placeholder: 'Garra +6 (1d8+4), Mordida +7 (2d6+4)...' },
                { name: 'sentidos', label: 'Sentidos', type: 'text', placeholder: 'Visão no escuro 18m, Percepção passiva 12' },
                { name: 'ambiente', label: 'Ambiente', type: 'text', placeholder: 'Florestas, cavernas...' },
                { name: 'reacoes', label: 'Reações', type: 'textarea', placeholder: 'Reações e habilidades especiais...' }
            ]
        }
    },
    'Vampire': {
        npc: {
            title: 'NPC Simplificado - Vampire',
            fields: [
                { name: 'nome_npc', label: 'Nome', type: 'text', required: true },
                { name: 'cla', label: 'Clã', type: 'text', placeholder: 'Brujah, Toreador, Ventrue...' },
                { name: 'geracao', label: 'Geração', type: 'number', min: 1, max: 15, default: 13 },
                { name: 'disciplinas', label: 'Disciplinas', type: 'text', placeholder: 'Dominação 2, Presença 1' },
                { name: 'motivacao_vampiro', label: 'Motivação', type: 'textarea', placeholder: 'Objetivos vampíricos...' },
                { name: 'pv_vampiro', label: 'PV', type: 'number', min: 1, default: 7 },
                { name: 'sangue', label: 'Sangue', type: 'number', min: 1, default: 10 },
                { name: 'atributo_social', label: 'Atributo Social', type: 'text', placeholder: 'Carisma 4, Manipulação 3...' }
            ]
        },
        monster: {
            title: 'Criatura Simplificada - Vampire',
            fields: [
                { name: 'nome_criatura', label: 'Nome', type: 'text', required: true },
                { name: 'tipo_criatura', label: 'Tipo', type: 'text', placeholder: 'Lupino, Fantasma, Demônio...' },
                { name: 'pv_criatura', label: 'PV', type: 'number', min: 1, default: 15 },
                { name: 'defesa_criatura', label: 'Defesa', type: 'number', min: 1, default: 3 },
                { name: 'poderes_criatura', label: 'Poderes', type: 'textarea', placeholder: 'Poderes sobrenaturais...' },
                { name: 'instinto', label: 'Instinto', type: 'text', placeholder: 'Comportamento natural...' },
                { name: 'perigosidade', label: 'Perigosidade', type: 'text', placeholder: 'Baixa, Média, Alta, Extrema' }
            ]
        }
    },
    'Call of Cthulhu': {
        npc: {
            title: 'NPC Simplificado - Call of Cthulhu',
            fields: [
                { name: 'nome_npc', label: 'Nome', type: 'text', required: true },
                { name: 'ocupacao_npc', label: 'Ocupação', type: 'text', placeholder: 'Professor, Detetive, Médico...' },
                { name: 'sanidade_npc', label: 'Sanidade', type: 'number', min: 0, max: 99, default: 60 },
                { name: 'pv_npc', label: 'PV', type: 'number', min: 1, default: 12 },
                { name: 'pm_npc', label: 'PM', type: 'number', min: 0, default: 12 },
                { name: 'pericias_npc', label: 'Perícias', type: 'text', placeholder: 'Medicina 70%, Biblioteca 60%...' },
                { name: 'motivacao_npc', label: 'Motivação', type: 'textarea', placeholder: 'O que move este investigador...' },
                { name: 'estado_mental', label: 'Estado Mental', type: 'text', placeholder: 'Estável, Ansioso, Paranóico...' }
            ]
        },
        monster: {
            title: 'Criatura Simplificada - Call of Cthulhu',
            fields: [
                { name: 'nome_criatura', label: 'Nome', type: 'text', required: true },
                { name: 'pv_criatura', label: 'PV', type: 'number', min: 1, default: 20 },
                { name: 'defesa_criatura', label: 'Defesa', type: 'number', min: 0, default: 2 },
                { name: 'acoes', label: 'Ações', type: 'textarea', placeholder: 'Ataques e ações especiais...' },
                { name: 'efeitos_psicologicos', label: 'Efeitos Psicológicos', type: 'textarea', placeholder: 'Perdas de sanidade...' },
                { name: 'sentidos_criatura', label: 'Sentidos', type: 'text', placeholder: 'Visão no escuro, teleponia...' },
                { name: 'conhecimento_mitico', label: 'Conhecimento Mítico', type: 'text', placeholder: 'Mitos de Cthulhu relacionados...' }
            ]
        }
    },
    '3D&T': {
        npc: {
            title: 'NPC Simplificado - 3D&T Alpha',
            fields: [
                { name: 'nome_npc', label: 'Nome', type: 'text', required: true },
                { name: 'elemento', label: 'Elemento', type: 'text', placeholder: 'Fogo, Água, Terra, Ar, Luz, Trevas' },
                { name: 'pv_npc', label: 'PV', type: 'number', min: 1, default: 10 },
                { name: 'pm_npc', label: 'PM', type: 'number', min: 0, default: 10 },
                { name: 'fa_fd', label: 'FA/FD', type: 'text', placeholder: 'FA 2, FD 1' },
                { name: 'vantagens', label: 'Vantagens', type: 'textarea', placeholder: 'Vantagens únicas...' },
                { name: 'motivacao_npc', label: 'Motivação', type: 'textarea', placeholder: 'Objetivos do personagem...' },
                { name: 'atributo_forte', label: 'Atributo Forte', type: 'text', placeholder: 'Força, Habilidade, Resistência...' }
            ]
        },
        monster: {
            title: 'Monstro Simplificado - 3D&T Alpha',
            fields: [
                { name: 'nome_monstro', label: 'Nome', type: 'text', required: true },
                { name: 'pv_monstro', label: 'PV', type: 'number', min: 1, default: 15 },
                { name: 'pm_monstro', label: 'PM', type: 'number', min: 0, default: 5 },
                { name: 'fa_fd_monstro', label: 'FA/FD', type: 'text', placeholder: 'FA 3, FD 2' },
                { name: 'ataque_monstro', label: 'Ataque', type: 'textarea', placeholder: 'Forma de ataque principal...' },
                { name: 'habilidade_especial', label: 'Habilidade Especial', type: 'textarea', placeholder: 'Poder único...' },
                { name: 'fraqueza', label: 'Fraqueza', type: 'text', placeholder: 'Vulnerabilidade específica...' }
            ]
        }
    },
    'Pathfinder': {
        npc: {
            title: 'NPC Simplificado - Pathfinder',
            fields: [
                { name: 'nome_npc', label: 'Nome', type: 'text', required: true },
                { name: 'classe_papel', label: 'Classe / Papel', type: 'text', placeholder: 'Guerreiro / Guarda' },
                { name: 'atributos_npc', label: 'Atributos', type: 'text', placeholder: 'FOR 16, DES 14, CON 15...' },
                { name: 'pv_npc', label: 'PV', type: 'number', min: 1, default: 18 },
                { name: 'ca_npc', label: 'CA', type: 'number', min: 10, default: 16 },
                { name: 'iniciativa_npc', label: 'Iniciativa', type: 'number', default: 2 },
                { name: 'habilidades_npc', label: 'Habilidades', type: 'textarea', placeholder: 'Feitos e habilidades...' },
                { name: 'equipamento_npc', label: 'Equipamento', type: 'text', placeholder: 'Armas e armaduras principais...' },
                { name: 'alianca', label: 'Aliança', type: 'text', placeholder: 'Facção ou grupo...' }
            ]
        },
        monster: {
            title: 'Monstro Simplificado - Pathfinder',
            fields: [
                { name: 'nome_monstro', label: 'Nome', type: 'text', required: true },
                { name: 'tipo_monstro', label: 'Tipo', type: 'text', placeholder: 'Animal, Besta, Morto-vivo...' },
                { name: 'nd_pathfinder', label: 'ND', type: 'number', min: 0, max: 25, default: 1 },
                { name: 'atributos_monstro', label: 'Atributos', type: 'text', placeholder: 'FOR 18, DES 12...' },
                { name: 'pv_monstro', label: 'PV', type: 'number', min: 1, default: 22 },
                { name: 'ca_monstro', label: 'CA', type: 'number', min: 10, default: 14 },
                { name: 'ataques_monstro', label: 'Ataques', type: 'textarea', placeholder: 'Formas de ataque...' },
                { name: 'resistencias', label: 'Resistências', type: 'text', placeholder: 'Resistências e imunidades...' },
                { name: 'ambiente_monstro', label: 'Ambiente', type: 'text', placeholder: 'Habitat natural...' }
            ]
        }
    },
    'Tormenta20': {
        npc: {
            title: 'NPC Simplificado - Tormenta20',
            fields: [
                { name: 'nome_npc', label: 'Nome', type: 'text', required: true },
                { name: 'classe_nex', label: 'Classe / NEX', type: 'text', placeholder: 'Guerreiro NEX 25%' },
                { name: 'tendencia', label: 'Tendência', type: 'text', placeholder: 'Ordeiro e Bom' },
                { name: 'pv_npc', label: 'PV', type: 'number', min: 1, default: 20 },
                { name: 'defesa_npc', label: 'Defesa', type: 'number', min: 10, default: 15 },
                { name: 'deslocamento_npc', label: 'Deslocamento', type: 'text', placeholder: '9m' },
                { name: 'poderes_npc', label: 'Poderes', type: 'textarea', placeholder: 'Poderes conhecidos...' },
                { name: 'historico_npc', label: 'Histórico', type: 'textarea', placeholder: 'Background do NPC...' }
            ]
        },
        monster: {
            title: 'Monstro Simplificado - Tormenta20',
            fields: [
                { name: 'nome_monstro', label: 'Nome', type: 'text', required: true },
                { name: 'tipo_monstro', label: 'Tipo', type: 'text', placeholder: 'Animal, Morto-vivo, Aberração...' },
                { name: 'nivel_monstro', label: 'Nível', type: 'number', min: 1, max: 20, default: 1 },
                { name: 'pv_monstro', label: 'PV', type: 'number', min: 1, default: 25 },
                { name: 'defesa_monstro', label: 'Defesa', type: 'number', min: 10, default: 13 },
                { name: 'atributos_monstro', label: 'Atributos', type: 'text', placeholder: 'FOR 4, DES 2, CON 3...' },
                { name: 'poderes_monstro', label: 'Poderes', type: 'textarea', placeholder: 'Habilidades especiais...' },
                { name: 'testes', label: 'Testes', type: 'text', placeholder: 'Modificadores de teste...' }
            ]
        }
    }
};

// Função para gerar formulário simplificado
function generateSimplifiedForm(systemName, type, containerId) {
    console.log(`Gerando formulário simplificado para: ${systemName} - ${type}`);
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container não encontrado:', containerId);
        return;
    }
    
    // Mapear tipo para template
    const templateKey = type === 'npc' ? 'npc' : 'monster';
    const template = SIMPLIFIED_TEMPLATES[systemName]?.[templateKey];
    
    if (!template) {
        console.error(`Template simplificado não encontrado para: ${systemName} - ${templateKey}`);
        return;
    }
    
    console.log(`Template simplificado encontrado: ${template.title}`);
    
    container.innerHTML = '';
    
    // Título da seção
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-4';
    titleDiv.innerHTML = `
        <h6 class="text-primary mb-3 border-bottom pb-2">
            <i class="fas fa-bolt me-2"></i>${template.title}
        </h6>
    `;
    container.appendChild(titleDiv);
    
    // Container dos campos
    const fieldsRow = document.createElement('div');
    fieldsRow.className = 'row g-3';
    
    template.fields.forEach(field => {
        const colDiv = document.createElement('div');
        colDiv.className = getColumnClass(field.type);
        
        const fieldHTML = generateSimplifiedFieldHTML(field);
        colDiv.innerHTML = fieldHTML;
        
        fieldsRow.appendChild(colDiv);
    });
    
    container.appendChild(fieldsRow);
    
    console.log(`Formulário simplificado gerado com ${template.fields.length} campos`);
}

// Função para gerar HTML de campo simplificado
function generateSimplifiedFieldHTML(field) {
    let inputHTML = '';
    
    switch (field.type) {
        case 'number':
            inputHTML = `<input type="number" class="form-control text-center" id="${field.name}" name="${field.name}" 
                        min="${field.min || 0}" max="${field.max || 100}" value="${field.default || 0}">`;
            break;
        case 'text':
            inputHTML = `<input type="text" class="form-control" id="${field.name}" name="${field.name}" 
                        placeholder="${field.placeholder || ''}" value="${field.default || ''}"
                        ${field.required ? 'required' : ''}>`;
            break;
        case 'textarea':
            inputHTML = `<textarea class="form-control" id="${field.name}" name="${field.name}" rows="3" 
                        placeholder="${field.placeholder || ''}">${field.default || ''}</textarea>`;
            break;
        default:
            inputHTML = `<input type="text" class="form-control" id="${field.name}" name="${field.name}" value="${field.default || ''}">`;
    }
    
    return `
        <label class="form-label" for="${field.name}">${field.label}</label>
        ${inputHTML}
    `;
}