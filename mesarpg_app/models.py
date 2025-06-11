from datetime import datetime
import pytz
from mesarpg_app import db
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256))
    full_name = db.Column(db.String(100))
    avatar_url = db.Column(db.String(255))
    bio = db.Column(db.Text)
    role = db.Column(db.String(20), default='player')  # 'player', 'master', 'both'
    is_premium = db.Column(db.Boolean, default=False)
    preferred_systems = db.Column(db.String(255))  # JSON string of systems
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    created_sessions = db.relationship('Session', backref='master', lazy='dynamic')
    session_applications = db.relationship('SessionApplication', backref='player', lazy='dynamic')
    ratings_given = db.relationship('Rating', foreign_keys='Rating.rater_id', backref='rater', lazy='dynamic')
    ratings_received = db.relationship('Rating', foreign_keys='Rating.rated_id', backref='rated', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_average_rating(self):
        ratings = self.ratings_received.all()
        if not ratings:
            return 0
        return sum(r.score for r in ratings) / len(ratings)

    def __repr__(self):
        return f'<User {self.username}>'


class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    system = db.Column(db.String(50), nullable=False)  # 'D&D 5e', 'Tormenta20', etc.
    session_type = db.Column(db.String(20), default='one-shot')  # 'one-shot', 'campaign'
    max_players = db.Column(db.Integer, default=4)
    current_players = db.Column(db.Integer, default=0)
    level_range = db.Column(db.String(50))  # e.g., "1-5", "Iniciantes", "Qualquer"
    tags = db.Column(db.String(255))  # JSON string of tags
    is_paid = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float)
    scheduled_date = db.Column(db.DateTime)
    duration_hours = db.Column(db.Integer, default=4)
    status = db.Column(db.String(20), default='open')  # 'open', 'full', 'in_progress', 'completed', 'cancelled'
    is_beginner_friendly = db.Column(db.Boolean, default=False)
    content_warnings = db.Column(db.Text)
    tools_required = db.Column(db.String(255))
    tone = db.Column(db.String(20))  # 'serious', 'comic', 'mixed'
    
    master_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    applications = db.relationship('SessionApplication', backref='session', lazy='dynamic', cascade='all, delete-orphan')
    notes = db.relationship('SessionNote', backref='session', lazy='dynamic', cascade='all, delete-orphan')

    def get_tags_list(self):
        if self.tags:
            import json
            return json.loads(self.tags)
        return []

    def set_tags_list(self, tags_list):
        import json
        self.tags = json.dumps(tags_list)

    def __repr__(self):
        return f'<Session {self.title}>'


class SessionApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'), nullable=False)
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # 'pending', 'approved', 'rejected'
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<SessionApplication {self.player.username} -> {self.session.title}>'


class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rater_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rated_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'))
    score = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Rating {self.score}/5 from {self.rater.username} to {self.rated.username}>'


class SessionNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(100))
    content = db.Column(db.Text)
    note_type = db.Column(db.String(20), default='general')  # 'general', 'character', 'world', 'npc'
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    author = db.relationship('User', backref='session_notes')

    def __repr__(self):
        return f'<SessionNote {self.title}>'


class CampaignDiary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    entry_type = db.Column(db.String(20), default='entry')  # 'entry', 'character', 'location', 'npc'
    is_public = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    session = db.relationship('Session', backref='diary_entries')
    author = db.relationship('User', backref='diary_entries')

    def __repr__(self):
        return f'<CampaignDiary {self.title}>'


class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    message_type = db.Column(db.String(20), default='text')  # 'text', 'dice', 'system'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    session = db.relationship('Session', backref='chat_messages')
    user = db.relationship('User', backref='chat_messages')
    
    def __repr__(self):
        return f'<ChatMessage {self.user.username}: {self.message[:50]}>'


class Character(db.Model):
    """Modelo unificado para Personagens, NPCs e Criaturas"""
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('session.id'), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Identificação básica
    name = db.Column(db.String(100), nullable=False)
    character_type = db.Column(db.String(20), nullable=False)  # 'player', 'npc', 'creature'
    
    # Informações básicas
    level = db.Column(db.Integer, default=1)
    race = db.Column(db.String(50))
    character_class = db.Column(db.String(50))
    background = db.Column(db.String(100))
    
    # Atributos principais
    strength = db.Column(db.Integer, default=10)
    dexterity = db.Column(db.Integer, default=10)
    constitution = db.Column(db.Integer, default=10)
    intelligence = db.Column(db.Integer, default=10)
    wisdom = db.Column(db.Integer, default=10)
    charisma = db.Column(db.Integer, default=10)
    
    # Stats básicos
    armor_class = db.Column(db.Integer, default=10)
    hit_points = db.Column(db.Integer, default=8)
    max_hit_points = db.Column(db.Integer, default=8)
    speed = db.Column(db.Integer, default=30)
    
    # Informações detalhadas
    description = db.Column(db.Text)
    backstory = db.Column(db.Text)
    equipment = db.Column(db.Text)
    spells = db.Column(db.Text)
    notes = db.Column(db.Text)
    
    # URL da imagem
    image_url = db.Column(db.String(255))
    
    # Campos dinâmicos específicos do sistema
    dynamic_fields = db.Column(db.Text)  # JSON com campos específicos do sistema
    
    # Configurações
    is_public = db.Column(db.Boolean, default=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    session = db.relationship('Session', backref='characters')
    creator = db.relationship('User', backref='created_characters')
    
    def get_modifier(self, ability_score):
        """Calcula o modificador de um atributo"""
        return (ability_score - 10) // 2
    
    def get_attributes_text(self):
        """Retorna os atributos em formato de texto"""
        attrs = [
            f"FOR {self.strength} ({self.get_modifier(self.strength):+d})",
            f"DES {self.dexterity} ({self.get_modifier(self.dexterity):+d})",
            f"CON {self.constitution} ({self.get_modifier(self.constitution):+d})",
            f"INT {self.intelligence} ({self.get_modifier(self.intelligence):+d})",
            f"SAB {self.wisdom} ({self.get_modifier(self.wisdom):+d})",
            f"CAR {self.charisma} ({self.get_modifier(self.charisma):+d})"
        ]
        return ", ".join(attrs)
    
    def get_dynamic_fields(self):
        """Retorna os campos dinâmicos como dicionário"""
        if self.dynamic_fields:
            import json
            return json.loads(self.dynamic_fields)
        return {}
    
    def set_dynamic_fields(self, fields_dict):
        """Define os campos dinâmicos"""
        import json
        self.dynamic_fields = json.dumps(fields_dict)

    def __repr__(self):
        return f'<Character {self.name} ({self.character_type})>'


class CharacterTemplate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    system_name = db.Column(db.String(50), nullable=False)  # 'D&D 5e', 'Tormenta20', etc.
    template_name = db.Column(db.String(100), nullable=False)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Campos específicos do sistema
    custom_fields = db.Column(db.Text)  # JSON com campos personalizados
    default_values = db.Column(db.Text)  # JSON com valores padrão
    
    # Configurações do template
    is_public = db.Column(db.Boolean, default=False)  # Templates públicos para todos usarem
    description = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamentos
    creator = db.relationship('User', backref='character_templates')
    
    def get_custom_fields(self):
        """Retorna os campos personalizados como dict"""
        if self.custom_fields:
            import json
            return json.loads(self.custom_fields)
        return {}
    
    def set_custom_fields(self, fields_dict):
        """Define os campos personalizados a partir de um dict"""
        import json
        self.custom_fields = json.dumps(fields_dict)
    
    def get_default_values(self):
        """Retorna os valores padrão como dict"""
        if self.default_values:
            import json
            return json.loads(self.default_values)
        return {}
    
    def set_default_values(self, values_dict):
        """Define os valores padrão a partir de um dict"""
        import json
        self.default_values = json.dumps(values_dict)
    
    def __repr__(self):
        return f'<CharacterTemplate {self.system_name} - {self.template_name}>'


class System(db.Model):
    """Modelo para gerenciar sistemas de RPG"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    character_types = db.relationship('CharacterType', backref='system', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<System {self.name}>'


class CharacterType(db.Model):
    """Modelo para gerenciar tipos de personagem por sistema"""
    id = db.Column(db.Integer, primary_key=True)
    system_id = db.Column(db.Integer, db.ForeignKey('system.id'), nullable=False)
    name = db.Column(db.String(50), nullable=False)  # 'player', 'npc', 'creature'
    display_name = db.Column(db.String(100), nullable=False)  # 'Personagem do Jogador', 'NPC', 'Criatura'
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    categories = db.relationship('CharacterCategory', backref='character_type', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<CharacterType {self.display_name} ({self.system.name})>'


class CharacterCategory(db.Model):
    """Modelo para gerenciar categorias de personagem"""
    id = db.Column(db.Integer, primary_key=True)
    character_type_id = db.Column(db.Integer, db.ForeignKey('character_type.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # 'Personagem', 'NPC', 'Monstro', 'Criatura'
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    fields = db.relationship('CharacterField', backref='category', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<CharacterCategory {self.name} ({self.character_type.display_name})>'


class CharacterField(db.Model):
    """Modelo para gerenciar campos de personagem"""
    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('character_category.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # 'Nome', 'Força', 'PV', etc.
    field_type = db.Column(db.String(20), nullable=False)  # 'texto', 'numérico', 'lista_texto', 'grupo'
    description = db.Column(db.Text)
    placeholder = db.Column(db.String(200))
    default_value = db.Column(db.String(200))
    is_required = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    validation_rules = db.Column(db.Text)  # JSON com regras de validação
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamentos
    subfields = db.relationship('CharacterSubfield', backref='parent_field', lazy='dynamic', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<CharacterField {self.name} ({self.field_type})>'
    
    def get_validation_rules(self):
        """Retorna as regras de validação como dicionário"""
        if self.validation_rules:
            try:
                return json.loads(self.validation_rules)
            except:
                return {}
        return {}
    
    def set_validation_rules(self, rules_dict):
        """Define as regras de validação como JSON"""
        self.validation_rules = json.dumps(rules_dict)


class CharacterSubfield(db.Model):
    """Modelo para gerenciar subcampos (ex: atributos dentro de um grupo)"""
    id = db.Column(db.Integer, primary_key=True)
    parent_field_id = db.Column(db.Integer, db.ForeignKey('character_field.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)  # 'Força', 'Destreza', etc.
    field_type = db.Column(db.String(20), nullable=False)  # 'texto', 'numérico'
    description = db.Column(db.Text)
    placeholder = db.Column(db.String(200))
    default_value = db.Column(db.String(200))
    is_required = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<CharacterSubfield {self.name} ({self.parent_field.name})>'


class SystemFieldConfig:
    """Classe para gerenciar configurações de campos por sistema e categoria"""
    
    @classmethod
    def get_npc_fields(cls, system, category):
        """Retorna os campos para NPCs/Criaturas de um sistema específico"""
        system_obj = System.query.filter_by(name=system, is_active=True).first()
        if not system_obj:
            return []
        
        character_type = CharacterType.query.filter_by(
            system_id=system_obj.id, 
            name__in=['npc', 'creature'],
            is_active=True
        ).first()
        
        if not character_type:
            return []
        
        category_obj = CharacterCategory.query.filter_by(
            character_type_id=character_type.id,
            name=category,
            is_active=True
        ).first()
        
        if not category_obj:
            return []
        
        fields = CharacterField.query.filter_by(
            category_id=category_obj.id,
            is_active=True
        ).order_by(CharacterField.sort_order).all()
        
        return [cls._field_to_dict(field) for field in fields]
    
    @classmethod
    def get_character_fields(cls, system, category):
        """Retorna os campos para Personagens de um sistema específico"""
        system_obj = System.query.filter_by(name=system, is_active=True).first()
        if not system_obj:
            return []
        
        character_type = CharacterType.query.filter_by(
            system_id=system_obj.id, 
            name='player',
            is_active=True
        ).first()
        
        if not character_type:
            return []
        
        category_obj = CharacterCategory.query.filter_by(
            character_type_id=character_type.id,
            name=category,
            is_active=True
        ).first()
        
        if not category_obj:
            return []
        
        fields = CharacterField.query.filter_by(
            category_id=category_obj.id,
            is_active=True
        ).order_by(CharacterField.sort_order).all()
        
        return [cls._field_to_dict(field) for field in fields]
    
    @classmethod
    def get_all_systems(cls):
        """Retorna todos os sistemas disponíveis"""
        systems = System.query.filter_by(is_active=True).order_by(System.name).all()
        return [system.name for system in systems]
    
    @classmethod
    def get_npc_categories(cls, system):
        """Retorna as categorias disponíveis para NPCs de um sistema"""
        system_obj = System.query.filter_by(name=system, is_active=True).first()
        if not system_obj:
            return []
        
        character_types = CharacterType.query.filter_by(
            system_id=system_obj.id, 
            name__in=['npc', 'creature'],
            is_active=True
        ).all()
        
        categories = []
        for char_type in character_types:
            cats = CharacterCategory.query.filter_by(
                character_type_id=char_type.id,
                is_active=True
            ).order_by(CharacterCategory.sort_order).all()
            categories.extend([cat.name for cat in cats])
        
        return categories
    
    @classmethod
    def get_character_categories(cls, system):
        """Retorna as categorias disponíveis para Personagens de um sistema"""
        system_obj = System.query.filter_by(name=system, is_active=True).first()
        if not system_obj:
            return []
        
        character_type = CharacterType.query.filter_by(
            system_id=system_obj.id, 
            name='player',
            is_active=True
        ).first()
        
        if not character_type:
            return []
        
        categories = CharacterCategory.query.filter_by(
            character_type_id=character_type.id,
            is_active=True
        ).order_by(CharacterCategory.sort_order).all()
        
        return [cat.name for cat in categories]
    
    @classmethod
    def _field_to_dict(cls, field):
        """Converte um campo do banco para o formato esperado pela API"""
        field_dict = {
            'nome': field.name,
            'tipo': field.field_type
        }
        
        if field.field_type == 'grupo' and field.subfields.count() > 0:
            subfields = CharacterSubfield.query.filter_by(
                parent_field_id=field.id,
                is_active=True
            ).order_by(CharacterSubfield.sort_order).all()
            
            field_dict['subcampos'] = [
                {
                    'nome': subfield.name,
                    'tipo': subfield.field_type
                }
                for subfield in subfields
            ]
        
        return field_dict
