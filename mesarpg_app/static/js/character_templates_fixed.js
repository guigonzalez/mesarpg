// Templates de sistemas de RPG com campos de nível/NEX/Geração corrigidos
const RPG_TEMPLATES = {
    'D&D 5e': {
        name: 'Dungeons & Dragons 5ª Edição',
        fields: {
            // Informações básicas do personagem
            nome: { label: 'Nome do Personagem', type: 'text', required: true },
            nivel: { label: 'Nível', type: 'number', min: 1, max: 20, default: 1 },
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
            acrobacia: { label: 'Acrobacia', type: 'number', min: 0, max: 20, default: 0 },
            arcanismo: { label: 'Arcanismo', type: 'number', min: 0, max: 20, default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', min: 0, max: 20, default: 0 },
            enganacao: { label: 'Enganação', type: 'number', min: 0, max: 20, default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', min: 0, max: 20, default: 0 },
            historia: { label: 'História', type: 'number', min: 0, max: 20, default: 0 },
            intuicao: { label: 'Intuição', type: 'number', min: 0, max: 20, default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 0, max: 20, default: 0 },
            investigacao: { label: 'Investigação', type: 'number', min: 0, max: 20, default: 0 },
            lidar_animais: { label: 'Lidar com Animais', type: 'number', min: 0, max: 20, default: 0 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 20, default: 0 },
            natureza: { label: 'Natureza', type: 'number', min: 0, max: 20, default: 0 },
            percepcao: { label: 'Percepção', type: 'number', min: 0, max: 20, default: 0 },
            persuasao: { label: 'Persuasão', type: 'number', min: 0, max: 20, default: 0 },
            prestidigitacao: { label: 'Prestidigitação', type: 'number', min: 0, max: 20, default: 0 },
            religiao: { label: 'Religião', type: 'number', min: 0, max: 20, default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', min: 0, max: 20, default: 0 },
            
            // Combate
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 999, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 1, max: 30, default: 10 },
            iniciativa: { label: 'Iniciativa', type: 'number', min: -5, max: 15, default: 0 },
            percepcao_passiva: { label: 'Percepção Passiva', type: 'number', min: 1, max: 30, default: 10 },
            
            // Habilidades
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Lista de magias conhecidas...' },
            ataques_especiais: { label: 'Ataques Especiais', type: 'textarea', placeholder: 'Habilidades de combate especiais...' },
            recursos_classe: { label: 'Recursos de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            
            // Equipamentos e outros
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, armaduras, itens...' },
            idiomas: { label: 'Idiomas', type: 'text', placeholder: 'Ex: Comum, Élfico, Anão' },
            historia_personagem: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background e motivações...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'nivel', 'raca', 'classe', 'alinhamento', 'background'] },
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
            // Informações básicas específicas do Tormenta20
            nome: { label: 'Nome do Personagem', type: 'text', required: true },
            nex: { label: 'NEX', type: 'number', min: 5, max: 99, default: 5 },
            raca: { label: 'Origem', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão, Qareen' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Combatente, Arcanista, Especialista' },
            alinhamento: { label: 'Tendência', type: 'text', placeholder: 'Ex: Ordem, Caos, Neutro' },
            background: { label: 'Trilha', type: 'text', placeholder: 'Ex: Soldado, Acadêmico, Criminoso' },
            
            // Atributos
            forca: { label: 'Força', type: 'number', min: 0, max: 5, default: 1 },
            agilidade: { label: 'Agilidade', type: 'number', min: 0, max: 5, default: 1 },
            intelecto: { label: 'Intelecto', type: 'number', min: 0, max: 5, default: 1 },
            presenca: { label: 'Presença', type: 'number', min: 0, max: 5, default: 1 },
            vigor: { label: 'Vigor', type: 'number', min: 0, max: 5, default: 1 },
            
            // Perícias
            adestramento: { label: 'Adestramento', type: 'number', min: 0, max: 20, default: 0 },
            artes: { label: 'Artes', type: 'number', min: 0, max: 20, default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', min: 0, max: 20, default: 0 },
            atualidades: { label: 'Atualidades', type: 'number', min: 0, max: 20, default: 0 },
            ciencias: { label: 'Ciências', type: 'number', min: 0, max: 20, default: 0 },
            crime: { label: 'Crime', type: 'number', min: 0, max: 20, default: 0 },
            diplomacia: { label: 'Diplomacia', type: 'number', min: 0, max: 20, default: 0 },
            enganacao: { label: 'Enganação', type: 'number', min: 0, max: 20, default: 0 },
            fortitude: { label: 'Fortitude', type: 'number', min: 0, max: 20, default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', min: 0, max: 20, default: 0 },
            iniciativa: { label: 'Iniciativa', type: 'number', min: 0, max: 20, default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 0, max: 20, default: 0 },
            intuicao: { label: 'Intuição', type: 'number', min: 0, max: 20, default: 0 },
            investigacao: { label: 'Investigação', type: 'number', min: 0, max: 20, default: 0 },
            luta: { label: 'Luta', type: 'number', min: 0, max: 20, default: 0 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 20, default: 0 },
            ocultismo: { label: 'Ocultismo', type: 'number', min: 0, max: 20, default: 0 },
            percepcao: { label: 'Percepção', type: 'number', min: 0, max: 20, default: 0 },
            pilotagem: { label: 'Pilotagem', type: 'number', min: 0, max: 20, default: 0 },
            pontaria: { label: 'Pontaria', type: 'number', min: 0, max: 20, default: 0 },
            profissao: { label: 'Profissão', type: 'number', min: 0, max: 20, default: 0 },
            reflexos: { label: 'Reflexos', type: 'number', min: 0, max: 20, default: 0 },
            religiao: { label: 'Religião', type: 'number', min: 0, max: 20, default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', min: 0, max: 20, default: 0 },
            tatica: { label: 'Tática', type: 'number', min: 0, max: 20, default: 0 },
            tecnologia: { label: 'Tecnologia', type: 'number', min: 0, max: 20, default: 0 },
            vontade: { label: 'Vontade', type: 'number', min: 0, max: 20, default: 0 },
            
            // Combate
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 999, default: 12 },
            pe: { label: 'Pontos de Esforço', type: 'number', min: 1, max: 999, default: 2 },
            defesa: { label: 'Defesa', type: 'number', min: 10, max: 50, default: 10 },
            sanidade: { label: 'Sanidade', type: 'number', min: 1, max: 99, default: 12 },
            
            // Habilidades
            rituais: { label: 'Rituais', type: 'textarea', placeholder: 'Lista de rituais conhecidos...' },
            poderes_classe: { label: 'Poderes de Classe', type: 'textarea', placeholder: 'Habilidades específicas da classe...' },
            habilidades_origem: { label: 'Habilidades da Origem', type: 'textarea', placeholder: 'Poderes raciais...' },
            
            // Equipamentos e outros
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, armaduras, itens paranormais...' },
            historico: { label: 'Histórico', type: 'textarea', placeholder: 'Background do personagem...' },
            medos_trauma: { label: 'Medos e Traumas', type: 'textarea', placeholder: 'Traumas relacionados ao paranormal...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'nex', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'agilidade', 'intelecto', 'presenca', 'vigor'] },
            { name: 'Perícias', fields: ['adestramento', 'artes', 'atletismo', 'atualidades', 'ciencias', 'crime', 'diplomacia', 'enganacao', 'fortitude', 'furtividade', 'iniciativa', 'intimidacao', 'intuicao', 'investigacao', 'luta', 'medicina', 'ocultismo', 'percepcao', 'pilotagem', 'pontaria', 'profissao', 'reflexos', 'religiao', 'sobrevivencia', 'tatica', 'tecnologia', 'vontade'] },
            { name: 'Combate', fields: ['pv', 'pe', 'defesa', 'sanidade'] },
            { name: 'Habilidades', fields: ['rituais', 'poderes_classe', 'habilidades_origem'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'historico', 'medos_trauma'] }
        ]
    },
    
    'Vampire': {
        name: 'Vampire: The Masquerade',
        fields: {
            // Informações básicas específicas do Vampire (sem nível)
            nome: { label: 'Nome do Vampiro', type: 'text', required: true, placeholder: 'Ex: Magnus Blackthorne' },
            geracao: { label: 'Geração', type: 'number', min: 4, max: 16, default: 13 },
            raca: { label: 'Clã', type: 'text', placeholder: 'Ex: Brujah, Toreador, Ventrue, Nosferatu' },
            classe: { label: 'Conceito', type: 'text', placeholder: 'Ex: Rebelde, Artista, Político, Investigador' },
            alinhamento: { label: 'Natureza/Comportamento', type: 'text', placeholder: 'Ex: Visionário/Conformista' },
            background: { label: 'Prelúdio', type: 'text', placeholder: 'Vida mortal anterior' },
            
            // Atributos Físicos
            forca: { label: 'Força', type: 'number', min: 1, max: 5, default: 1 },
            destreza: { label: 'Destreza', type: 'number', min: 1, max: 5, default: 1 },
            vigor: { label: 'Vigor', type: 'number', min: 1, max: 5, default: 1 },
            
            // Atributos Sociais
            carisma: { label: 'Carisma', type: 'number', min: 1, max: 5, default: 1 },
            manipulacao: { label: 'Manipulação', type: 'number', min: 1, max: 5, default: 1 },
            aparencia: { label: 'Aparência', type: 'number', min: 1, max: 5, default: 1 },
            
            // Atributos Mentais
            percepcao: { label: 'Percepção', type: 'number', min: 1, max: 5, default: 1 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 1, max: 5, default: 1 },
            raciocinio: { label: 'Raciocínio', type: 'number', min: 1, max: 5, default: 1 },
            
            // Habilidades Físicas
            prontidao: { label: 'Prontidão', type: 'number', min: 0, max: 5, default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', min: 0, max: 5, default: 0 },
            briga: { label: 'Briga', type: 'number', min: 0, max: 5, default: 0 },
            esquiva: { label: 'Esquiva', type: 'number', min: 0, max: 5, default: 0 },
            empatia: { label: 'Empatia', type: 'number', min: 0, max: 5, default: 0 },
            expressao: { label: 'Expressão', type: 'number', min: 0, max: 5, default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 0, max: 5, default: 0 },
            lideranca: { label: 'Liderança', type: 'number', min: 0, max: 5, default: 0 },
            manha: { label: 'Manha', type: 'number', min: 0, max: 5, default: 0 },
            subterfugio: { label: 'Subterfúgio', type: 'number', min: 0, max: 5, default: 0 },
            
            // Combate
            vitalidade: { label: 'Vitalidade', type: 'number', min: 1, max: 15, default: 7 },
            forca_vontade: { label: 'Força de Vontade', type: 'number', min: 1, max: 10, default: 3 },
            reserva_sangue: { label: 'Reserva de Sangue', type: 'number', min: 0, max: 40, default: 10 },
            humanidade: { label: 'Humanidade', type: 'number', min: 0, max: 10, default: 7 },
            
            // Habilidades especiais
            disciplinas: { label: 'Disciplinas', type: 'textarea', placeholder: 'Poderes vampíricos...' },
            antecedentes: { label: 'Antecedentes', type: 'textarea', placeholder: 'Aliados, Contatos, Recursos...' },
            qualidades_defeitos: { label: 'Qualidades e Defeitos', type: 'textarea', placeholder: 'Méritos e falhas...' },
            
            // Equipamentos e outros
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Pertences, armas, refúgios...' },
            historia_vampirica: { label: 'História Vampírica', type: 'textarea', placeholder: 'Abraço, senhor, coterie...' },
            segredos: { label: 'Segredos e Objetivos', type: 'textarea', placeholder: 'Motivações secretas...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'geracao', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'vigor', 'carisma', 'manipulacao', 'aparencia', 'percepcao', 'inteligencia', 'raciocinio'] },
            { name: 'Habilidades', fields: ['prontidao', 'atletismo', 'briga', 'esquiva', 'empatia', 'expressao', 'intimidacao', 'lideranca', 'manha', 'subterfugio'] },
            { name: 'Combate', fields: ['vitalidade', 'forca_vontade', 'reserva_sangue', 'humanidade'] },
            { name: 'Poderes', fields: ['disciplinas', 'antecedentes', 'qualidades_defeitos'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'historia_vampirica', 'segredos'] }
        ]
    },
    
    'Call of Cthulhu': {
        name: 'Call of Cthulhu',
        fields: {
            // Informações básicas específicas do Call of Cthulhu (sem nível)
            nome: { label: 'Nome do Investigador', type: 'text', required: true },
            raca: { label: 'Ocupação', type: 'text', placeholder: 'Ex: Detetive, Professor, Jornalista' },
            classe: { label: 'Local de Nascimento', type: 'text', placeholder: 'Cidade/País de origem' },
            alinhamento: { label: 'Idade', type: 'number', min: 15, max: 90, default: 25 },
            background: { label: 'Educação', type: 'text', placeholder: 'Formação acadêmica' },
            
            // Atributos (características)
            forca: { label: 'Força (STR)', type: 'number', min: 15, max: 90, default: 50 },
            destreza: { label: 'Destreza (DEX)', type: 'number', min: 15, max: 90, default: 50 },
            constituicao: { label: 'Constituição (CON)', type: 'number', min: 15, max: 90, default: 50 },
            inteligencia: { label: 'Inteligência (INT)', type: 'number', min: 40, max: 90, default: 50 },
            sabedoria: { label: 'Poder (POW)', type: 'number', min: 15, max: 90, default: 50 },
            carisma: { label: 'Aparência (APP)', type: 'number', min: 15, max: 90, default: 50 },
            tamanho: { label: 'Tamanho (SIZ)', type: 'number', min: 40, max: 90, default: 60 },
            educacao: { label: 'Educação (EDU)', type: 'number', min: 40, max: 90, default: 60 },
            sorte: { label: 'Sorte (LUCK)', type: 'number', min: 15, max: 90, default: 50 },
            
            // Perícias principais
            antropologia: { label: 'Antropologia', type: 'number', min: 1, max: 99, default: 1 },
            armas_fogo: { label: 'Armas de Fogo', type: 'number', min: 20, max: 99, default: 20 },
            arte_oficio: { label: 'Arte/Ofício', type: 'number', min: 5, max: 99, default: 5 },
            charme: { label: 'Charme', type: 'number', min: 15, max: 99, default: 15 },
            dirigir_auto: { label: 'Dirigir Auto', type: 'number', min: 20, max: 99, default: 20 },
            direito: { label: 'Direito', type: 'number', min: 5, max: 99, default: 5 },
            esquivar: { label: 'Esquivar', type: 'number', min: 1, max: 99, default: 1 },
            historia: { label: 'História', type: 'number', min: 20, max: 99, default: 20 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 15, max: 99, default: 15 },
            investigacao: { label: 'Investigação', type: 'number', min: 25, max: 99, default: 25 },
            luta: { label: 'Luta', type: 'number', min: 25, max: 99, default: 25 },
            medicina: { label: 'Medicina', type: 'number', min: 5, max: 99, default: 5 },
            mundo_natural: { label: 'Mundo Natural', type: 'number', min: 10, max: 99, default: 10 },
            ocultismo: { label: 'Ocultismo', type: 'number', min: 5, max: 99, default: 5 },
            persuasao: { label: 'Persuasão', type: 'number', min: 15, max: 99, default: 15 },
            psicologia: { label: 'Psicologia', type: 'number', min: 5, max: 99, default: 5 },
            usar_bibliotecas: { label: 'Usar Bibliotecas', type: 'number', min: 25, max: 99, default: 25 },
            
            // Combate e Sanidade
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 30, default: 10 },
            sanidade: { label: 'Sanidade', type: 'number', min: 0, max: 99, default: 50 },
            magia: { label: 'Pontos de Magia', type: 'number', min: 0, max: 30, default: 10 },
            sorte_atual: { label: 'Sorte Atual', type: 'number', min: 0, max: 99, default: 50 },
            
            // Habilidades especiais
            mythos: { label: 'Mythos de Cthulhu', type: 'number', min: 0, max: 99, default: 0 },
            traumas: { label: 'Fobias e Manias', type: 'textarea', placeholder: 'Transtornos mentais adquiridos...' },
            contatos: { label: 'Contatos', type: 'textarea', placeholder: 'Pessoas importantes...' },
            
            // Equipamentos e outros
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, ferramentas, livros...' },
            background_investigador: { label: 'Background do Investigador', type: 'textarea', placeholder: 'História pessoal...' },
            objetivos: { label: 'Objetivos', type: 'textarea', placeholder: 'Motivações e metas...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma', 'tamanho', 'educacao', 'sorte'] },
            { name: 'Perícias', fields: ['antropologia', 'armas_fogo', 'arte_oficio', 'charme', 'dirigir_auto', 'direito', 'esquivar', 'historia', 'intimidacao', 'investigacao', 'luta', 'medicina', 'mundo_natural', 'ocultismo', 'persuasao', 'psicologia', 'usar_bibliotecas'] },
            { name: 'Combate', fields: ['pv', 'sanidade', 'magia', 'sorte_atual'] },
            { name: 'Habilidades', fields: ['mythos', 'traumas', 'contatos'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'background_investigador', 'objetivos'] }
        ]
    },
    
    '3D&T': {
        name: '3D&T Alpha',
        fields: {
            // Informações básicas específicas do 3D&T
            nome: { label: 'Nome do Personagem', type: 'text', required: true, placeholder: 'Ex: Kenji Yamamoto' },
            nivel: { label: 'Nível', type: 'number', min: 1, max: 10, default: 1 },
            raca: { label: 'Raça/Origem', type: 'text', placeholder: 'Ex: Humano, Youkai, Robô, Alienígena' },
            classe: { label: 'Classe/Conceito', type: 'text', placeholder: 'Ex: Lutador, Mago, Inventor, Detetive' },
            alinhamento: { label: 'Tendência', type: 'text', placeholder: 'Ex: Ordeiro e Bom, Neutro, Caótico' },
            background: { label: 'Origem', type: 'text', placeholder: 'Ex: Escola, Laboratório, Rua' },
            
            // Atributos
            forca: { label: 'Força', type: 'number', min: 0, max: 5, default: 1 },
            habilidade: { label: 'Habilidade', type: 'number', min: 0, max: 5, default: 1 },
            resistencia: { label: 'Resistência', type: 'number', min: 0, max: 5, default: 1 },
            armadura: { label: 'Armadura', type: 'number', min: 0, max: 5, default: 0 },
            poder_fogo: { label: 'Poder de Fogo', type: 'number', min: 0, max: 5, default: 0 },
            
            // Especializações
            acrobacia: { label: 'Acrobacia', type: 'number', min: 0, max: 5, default: 0 },
            animais: { label: 'Animais', type: 'number', min: 0, max: 5, default: 0 },
            arte: { label: 'Arte', type: 'number', min: 0, max: 5, default: 0 },
            ciencias: { label: 'Ciências', type: 'number', min: 0, max: 5, default: 0 },
            crime: { label: 'Crime', type: 'number', min: 0, max: 5, default: 0 },
            esportes: { label: 'Esportes', type: 'number', min: 0, max: 5, default: 0 },
            idiomas: { label: 'Idiomas', type: 'number', min: 0, max: 5, default: 0 },
            informatica: { label: 'Informática', type: 'number', min: 0, max: 5, default: 0 },
            investigacao: { label: 'Investigação', type: 'number', min: 0, max: 5, default: 0 },
            luta: { label: 'Luta', type: 'number', min: 0, max: 5, default: 0 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 5, default: 0 },
            ocultismo: { label: 'Ocultismo', type: 'number', min: 0, max: 5, default: 0 },
            pilotagem: { label: 'Pilotagem', type: 'number', min: 0, max: 5, default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', min: 0, max: 5, default: 0 },
            
            // Combate
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 50, default: 5 },
            pm: { label: 'Pontos de Magia', type: 'number', min: 0, max: 50, default: 5 },
            ip: { label: 'Índice de Proteção', type: 'number', min: 0, max: 10, default: 0 },
            iniciativa: { label: 'Iniciativa', type: 'number', min: 0, max: 10, default: 1 },
            
            // Habilidades especiais
            tecnicas: { label: 'Técnicas Especiais', type: 'textarea', placeholder: 'Ataques especiais, combos...' },
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Feitiços conhecidos...' },
            vantagens: { label: 'Vantagens', type: 'textarea', placeholder: 'Poderes únicos...' },
            
            // Equipamentos e outros
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, armaduras, gadgets...' },
            historia_anime: { label: 'História do Personagem', type: 'textarea', placeholder: 'Background estilo anime/mangá...' },
            objetivos_sonhos: { label: 'Objetivos e Sonhos', type: 'textarea', placeholder: 'Metas do personagem...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'nivel', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'habilidade', 'resistencia', 'armadura', 'poder_fogo'] },
            { name: 'Especializações', fields: ['acrobacia', 'animais', 'arte', 'ciencias', 'crime', 'esportes', 'idiomas', 'informatica', 'investigacao', 'luta', 'medicina', 'ocultismo', 'pilotagem', 'sobrevivencia'] },
            { name: 'Combate', fields: ['pv', 'pm', 'ip', 'iniciativa'] },
            { name: 'Habilidades', fields: ['tecnicas', 'magias', 'vantagens'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'historia_anime', 'objetivos_sonhos'] }
        ]
    },
    
    'Pathfinder': {
        name: 'Pathfinder 2e',
        fields: {
            // Informações básicas do Pathfinder
            nome: { label: 'Nome do Personagem', type: 'text', required: true },
            nivel: { label: 'Nível', type: 'number', min: 1, max: 20, default: 1 },
            raca: { label: 'Ancestralidade', type: 'text', placeholder: 'Ex: Humano, Elfo, Anão, Halfling' },
            classe: { label: 'Classe', type: 'text', placeholder: 'Ex: Guerreiro, Mago, Ladino, Clérigo' },
            alinhamento: { label: 'Alinhamento', type: 'text', placeholder: 'Ex: Leal e Bom, Neutro' },
            background: { label: 'Antecedente', type: 'text', placeholder: 'Ex: Acólito, Artesão, Criminoso' },
            
            // Atributos
            forca: { label: 'Força', type: 'number', min: 8, max: 20, default: 10 },
            destreza: { label: 'Destreza', type: 'number', min: 8, max: 20, default: 10 },
            constituicao: { label: 'Constituição', type: 'number', min: 8, max: 20, default: 10 },
            inteligencia: { label: 'Inteligência', type: 'number', min: 8, max: 20, default: 10 },
            sabedoria: { label: 'Sabedoria', type: 'number', min: 8, max: 20, default: 10 },
            carisma: { label: 'Carisma', type: 'number', min: 8, max: 20, default: 10 },
            
            // Perícias principais
            acrobacia: { label: 'Acrobacia', type: 'number', min: 0, max: 30, default: 0 },
            arcanismo: { label: 'Arcanismo', type: 'number', min: 0, max: 30, default: 0 },
            atletismo: { label: 'Atletismo', type: 'number', min: 0, max: 30, default: 0 },
            artesanato: { label: 'Artesanato', type: 'number', min: 0, max: 30, default: 0 },
            enganacao: { label: 'Enganação', type: 'number', min: 0, max: 30, default: 0 },
            diplomacia: { label: 'Diplomacia', type: 'number', min: 0, max: 30, default: 0 },
            intimidacao: { label: 'Intimidação', type: 'number', min: 0, max: 30, default: 0 },
            conhecimento: { label: 'Conhecimento', type: 'number', min: 0, max: 30, default: 0 },
            medicina: { label: 'Medicina', type: 'number', min: 0, max: 30, default: 0 },
            natureza: { label: 'Natureza', type: 'number', min: 0, max: 30, default: 0 },
            ocultismo: { label: 'Ocultismo', type: 'number', min: 0, max: 30, default: 0 },
            atuacao: { label: 'Atuação', type: 'number', min: 0, max: 30, default: 0 },
            religiao: { label: 'Religião', type: 'number', min: 0, max: 30, default: 0 },
            sociedade: { label: 'Sociedade', type: 'number', min: 0, max: 30, default: 0 },
            furtividade: { label: 'Furtividade', type: 'number', min: 0, max: 30, default: 0 },
            sobrevivencia: { label: 'Sobrevivência', type: 'number', min: 0, max: 30, default: 0 },
            ladinagem: { label: 'Ladinagem', type: 'number', min: 0, max: 30, default: 0 },
            
            // Combate
            pv: { label: 'Pontos de Vida', type: 'number', min: 1, max: 500, default: 8 },
            ca: { label: 'Classe de Armadura', type: 'number', min: 10, max: 50, default: 10 },
            velocidade: { label: 'Velocidade', type: 'number', min: 5, max: 60, default: 25 },
            percepcao: { label: 'Percepção', type: 'number', min: 0, max: 30, default: 0 },
            
            // Habilidades
            magias: { label: 'Magias', type: 'textarea', placeholder: 'Feitiços conhecidos e slots...' },
            feitos: { label: 'Feitos', type: 'textarea', placeholder: 'Habilidades especiais...' },
            habilidades_classe: { label: 'Habilidades de Classe', type: 'textarea', placeholder: 'Poderes únicos da classe...' },
            
            // Equipamentos e outros
            equipamentos: { label: 'Equipamentos', type: 'textarea', placeholder: 'Armas, armaduras, itens mágicos...' },
            historia: { label: 'História', type: 'textarea', placeholder: 'Background do personagem...' },
            aliados_inimigos: { label: 'Aliados e Inimigos', type: 'textarea', placeholder: 'Contatos importantes...' }
        },
        sections: [
            { name: 'Informações Básicas', fields: ['nome', 'nivel', 'raca', 'classe', 'alinhamento', 'background'] },
            { name: 'Atributos', fields: ['forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma'] },
            { name: 'Perícias', fields: ['acrobacia', 'arcanismo', 'atletismo', 'artesanato', 'enganacao', 'diplomacia', 'intimidacao', 'conhecimento', 'medicina', 'natureza', 'ocultismo', 'atuacao', 'religiao', 'sociedade', 'furtividade', 'sobrevivencia', 'ladinagem'] },
            { name: 'Combate', fields: ['pv', 'ca', 'velocidade', 'percepcao'] },
            { name: 'Habilidades', fields: ['magias', 'feitos', 'habilidades_classe'] },
            { name: 'Equipamentos e Outros', fields: ['equipamentos', 'historia', 'aliados_inimigos'] }
        ]
    }
};

// Restante das funções já existentes permanecem iguais...
function applySystemTemplate(systemName) {
    console.log('Carregando template para:', systemName);
    const container = document.getElementById('systemFieldsContainer');
    if (!container) {
        console.error('Container não encontrado!');
        return;
    }
    
    container.innerHTML = '';
    
    if (systemName && RPG_TEMPLATES[systemName]) {
        generateTemplateForm(systemName, 'systemFieldsContainer');
    }
}

function generateTemplateForm(systemName, containerId) {
    console.log('Gerando formulário para sistema:', systemName);
    const container = document.getElementById(containerId);
    const template = RPG_TEMPLATES[systemName];
    
    if (!template) {
        console.error('Template não encontrado para:', systemName);
        return;
    }
    
    console.log('Template encontrado:', template.name);
    console.log('Número de seções:', template.sections.length);
    
    template.sections.forEach((section, index) => {
        console.log(`Processando seção ${index + 1}: ${section.name}`);
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mb-4';
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header mb-3';
        sectionHeader.innerHTML = `
            <h6 class="text-primary">
                <i class="fas fa-cog me-2"></i>${section.name}
            </h6>
        `;
        sectionDiv.appendChild(sectionHeader);
        
        const fieldsContainer = document.createElement('div');
        fieldsContainer.className = 'row g-3';
        
        let fieldsAdded = 0;
        section.fields.forEach(fieldName => {
            const fieldConfig = template.fields[fieldName];
            if (fieldConfig) {
                const fieldHTML = generateFieldHTML(fieldName, fieldConfig);
                fieldsContainer.appendChild(fieldHTML);
                fieldsAdded++;
            }
        });
        
        console.log(`Adicionados ${fieldsAdded} campos na seção ${section.name}`);
        
        sectionDiv.appendChild(fieldsContainer);
        container.appendChild(sectionDiv);
    });
    
    console.log('Formulário gerado com sucesso!');
}

function getColumnClass(fieldType) {
    switch (fieldType) {
        case 'textarea':
            return 'col-12';
        case 'number':
            return 'col-md-3';
        case 'select':
            return 'col-md-4';
        default:
            return 'col-md-6';
    }
}

function generateFieldHTML(fieldName, config) {
    const div = document.createElement('div');
    div.className = getColumnClass(config.type);
    
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = config.label;
    label.setAttribute('for', fieldName);
    
    let input;
    if (config.type === 'textarea') {
        input = document.createElement('textarea');
        input.className = 'form-control';
        input.rows = 3;
    } else if (config.type === 'select') {
        input = document.createElement('select');
        input.className = 'form-select';
        if (config.options) {
            config.options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.label;
                input.appendChild(optionElement);
            });
        }
    } else {
        input = document.createElement('input');
        input.type = config.type || 'text';
        input.className = 'form-control';
        
        if (config.type === 'number') {
            input.className += ' text-center';
            if (config.min !== undefined) input.min = config.min;
            if (config.max !== undefined) input.max = config.max;
            if (config.default !== undefined) input.value = config.default;
        }
    }
    
    input.id = fieldName;
    input.name = fieldName;
    
    if (config.placeholder) input.placeholder = config.placeholder;
    if (config.required) input.required = true;
    
    div.appendChild(label);
    div.appendChild(input);
    
    return div;
}

function loadSystemTemplate() {
    const systemSelect = document.getElementById('systemSelect');
    if (systemSelect) {
        systemSelect.addEventListener('change', function() {
            applySystemTemplate(this.value);
        });
        
        // Carregar template padrão se houver um sistema selecionado
        if (systemSelect.value) {
            applySystemTemplate(systemSelect.value);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadSystemTemplate);