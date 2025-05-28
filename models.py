from datetime import datetime
from app import db
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
