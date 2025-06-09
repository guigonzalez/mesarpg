from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, IntegerField, BooleanField, FloatField, DateTimeField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, Length, EqualTo, Optional, NumberRange
from wtforms.widgets import TextArea


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()], render_kw={"placeholder": "seu@email.com"})
    password = PasswordField('Senha', validators=[DataRequired()], render_kw={"placeholder": "Sua senha"})
    remember_me = BooleanField('Lembrar de mim')
    submit = SubmitField('Entrar')


class RegisterForm(FlaskForm):
    username = StringField('Nome de usuário', validators=[DataRequired(), Length(min=3, max=20)], 
                          render_kw={"placeholder": "NomeDeUsuario"})
    email = StringField('Email', validators=[DataRequired(), Email()], render_kw={"placeholder": "seu@email.com"})
    full_name = StringField('Nome completo', validators=[DataRequired(), Length(max=100)], 
                           render_kw={"placeholder": "Seu Nome Completo"})
    password = PasswordField('Senha', validators=[DataRequired(), Length(min=6)], 
                            render_kw={"placeholder": "Mínimo 6 caracteres"})
    password2 = PasswordField('Confirmar senha', validators=[DataRequired(), EqualTo('password')], 
                             render_kw={"placeholder": "Confirme sua senha"})
    role = SelectField('Papel principal', choices=[
        ('player', 'Jogador'),
        ('master', 'Mestre'),
        ('both', 'Ambos')
    ], default='player')
    submit = SubmitField('Criar conta')


class SessionForm(FlaskForm):
    title = StringField('Título da sessão', validators=[DataRequired(), Length(max=100)], 
                       render_kw={"placeholder": "Ex: A Taverna do Dragão Dourado"})
    description = TextAreaField('Descrição', validators=[DataRequired()], 
                               render_kw={"placeholder": "Descreva sua sessão, enredo, expectativas...", "rows": 6})
    system = SelectField('Sistema', choices=[
        ('D&D 5e', 'Dungeons & Dragons 5ª Edição'),
        ('Tormenta20', 'Tormenta20'),
        ('Pathfinder', 'Pathfinder'),
        ('Call of Cthulhu', 'Call of Cthulhu'),
        ('Vampire', 'Vampire: The Masquerade'),
        ('3D&T', '3D&T Alpha'),
        ('Outro', 'Outro sistema')
    ], validators=[DataRequired()])
    session_type = SelectField('Tipo de sessão', choices=[
        ('one-shot', 'One-shot (sessão única)'),
        ('campaign', 'Campanha (múltiplas sessões)')
    ], default='one-shot')
    max_players = IntegerField('Máximo de jogadores', validators=[DataRequired(), NumberRange(min=1, max=8)], default=4)
    level_range = StringField('Nível dos personagens', render_kw={"placeholder": "Ex: 1-5, Iniciantes, Qualquer"})
    tags = StringField('Tags', render_kw={"placeholder": "Ex: iniciantes, roleplay, combate, investigação (separadas por vírgula)"})
    is_paid = BooleanField('Sessão paga')
    price = FloatField('Preço (R$)', validators=[Optional(), NumberRange(min=0)], 
                      render_kw={"placeholder": "0.00"})
    scheduled_date = DateTimeField('Data e hora', validators=[Optional()], format='%Y-%m-%dT%H:%M')
    duration_hours = IntegerField('Duração (horas)', validators=[DataRequired(), NumberRange(min=1, max=12)], default=4)
    is_beginner_friendly = BooleanField('Amigável para iniciantes')
    content_warnings = TextAreaField('Avisos de conteúdo', 
                                    render_kw={"placeholder": "Temas sensíveis, violência, etc.", "rows": 3})
    tools_required = StringField('Ferramentas necessárias', 
                                render_kw={"placeholder": "Ex: Discord, Roll20, dados físicos"})
    tone = SelectField('Tom da sessão', choices=[
        ('serious', 'Sério'),
        ('comic', 'Cômico'),
        ('mixed', 'Misto')
    ], default='mixed')
    submit = SubmitField('Criar sessão')


class ProfileForm(FlaskForm):
    full_name = StringField('Nome completo', validators=[DataRequired(), Length(max=100)])
    bio = TextAreaField('Biografia', render_kw={"rows": 4, "placeholder": "Conte um pouco sobre você como jogador/mestre..."})
    role = SelectField('Papel principal', choices=[
        ('player', 'Jogador'),
        ('master', 'Mestre'),
        ('both', 'Ambos')
    ])
    preferred_systems = StringField('Sistemas preferidos', 
                                   render_kw={"placeholder": "Ex: D&D 5e, Tormenta20, Call of Cthulhu"})
    submit = SubmitField('Salvar alterações')


class SessionApplicationForm(FlaskForm):
    message = TextAreaField('Mensagem para o mestre', 
                           render_kw={"placeholder": "Apresente-se, fale sobre seu personagem ou experiência...", "rows": 4})
    submit = SubmitField('Candidatar-se')


class RatingForm(FlaskForm):
    score = SelectField('Avaliação', choices=[
        ('5', '5 estrelas - Excelente'),
        ('4', '4 estrelas - Muito bom'),
        ('3', '3 estrelas - Bom'),
        ('2', '2 estrelas - Regular'),
        ('1', '1 estrela - Ruim')
    ], validators=[DataRequired()])
    comment = TextAreaField('Comentário', render_kw={"rows": 3, "placeholder": "Compartilhe sua experiência..."})
    submit = SubmitField('Avaliar')


class SessionNoteForm(FlaskForm):
    title = StringField('Título da nota', validators=[DataRequired(), Length(max=100)], 
                       render_kw={"placeholder": "Ex: Encontro na taverna"})
    content = TextAreaField('Conteúdo', validators=[DataRequired()], 
                           render_kw={"rows": 4, "placeholder": "Descreva o que aconteceu..."})
    note_type = SelectField('Tipo', choices=[
        ('general', 'Geral'),
        ('character', 'Personagem'),
        ('world', 'Mundo'),
        ('npc', 'NPC')
    ], default='general')
    is_public = BooleanField('Nota pública', default=True)
    submit = SubmitField('Adicionar nota')


class DiaryEntryForm(FlaskForm):
    title = StringField('Título', validators=[DataRequired(), Length(max=100)], 
                       render_kw={"placeholder": "Ex: Resumo da Sessão 1"})
    content = TextAreaField('Conteúdo', validators=[DataRequired()], 
                           render_kw={"rows": 6, "placeholder": "Escreva sobre eventos, personagens, locais..."})
    entry_type = SelectField('Tipo de entrada', choices=[
        ('entry', 'Entrada geral'),
        ('character', 'Personagem'),
        ('location', 'Local'),
        ('npc', 'NPC')
    ], default='entry')
    is_public = BooleanField('Entrada pública')
    submit = SubmitField('Adicionar entrada')

class CharacterSheetForm(FlaskForm):
    character_name = StringField('Nome do Personagem', validators=[DataRequired(), Length(max=100)], 
                                render_kw={"placeholder": "Ex: Aragorn"})
    character_class = StringField('Classe', validators=[Length(max=50)], 
                                 render_kw={"placeholder": "Ex: Guerreiro, Mago, Ladino"})
    level = IntegerField('Nível', validators=[Optional(), NumberRange(min=1, max=20)], default=1)
    race = StringField('Raça', validators=[Length(max=50)], 
                      render_kw={"placeholder": "Ex: Humano, Elfo, Anão"})
    background = StringField('Antecedente', validators=[Length(max=100)], 
                            render_kw={"placeholder": "Ex: Soldado, Artesão, Nobre"})
    
    # Atributos principais
    strength = IntegerField('Força', validators=[Optional(), NumberRange(min=1, max=30)], default=10)
    dexterity = IntegerField('Destreza', validators=[Optional(), NumberRange(min=1, max=30)], default=10)
    constitution = IntegerField('Constituição', validators=[Optional(), NumberRange(min=1, max=30)], default=10)
    intelligence = IntegerField('Inteligência', validators=[Optional(), NumberRange(min=1, max=30)], default=10)
    wisdom = IntegerField('Sabedoria', validators=[Optional(), NumberRange(min=1, max=30)], default=10)
    charisma = IntegerField('Carisma', validators=[Optional(), NumberRange(min=1, max=30)], default=10)
    
    # Stats básicos
    armor_class = IntegerField('Classe de Armadura', validators=[Optional(), NumberRange(min=1, max=50)], default=10)
    hit_points = IntegerField('Pontos de Vida Atuais', validators=[Optional(), NumberRange(min=0, max=999)], default=8)
    max_hit_points = IntegerField('Pontos de Vida Máximos', validators=[Optional(), NumberRange(min=1, max=999)], default=8)
    speed = IntegerField('Velocidade', validators=[Optional(), NumberRange(min=0, max=200)], default=30)
    
    # Informações do personagem
    description = TextAreaField('Descrição Física', 
                               render_kw={"rows": 3, "placeholder": "Descreva a aparência do personagem..."})
    backstory = TextAreaField('História Pessoal', 
                             render_kw={"rows": 4, "placeholder": "Conte a história e motivações do personagem..."})
    equipment = TextAreaField('Equipamentos', 
                             render_kw={"rows": 4, "placeholder": "Liste armas, armaduras, itens mágicos..."})
    spells = TextAreaField('Magias', 
                          render_kw={"rows": 4, "placeholder": "Liste magias conhecidas e slots disponíveis..."})
    notes = TextAreaField('Anotações', 
                         render_kw={"rows": 3, "placeholder": "Anotações gerais sobre o personagem..."})
    
    character_image_url = StringField('URL da Imagem do Personagem', 
                                     render_kw={"placeholder": "https://exemplo.com/imagem.jpg"})
    
    is_public = BooleanField('Ficha pública (visível para outros jogadores)', default=True)
    submit = SubmitField('Salvar Ficha')
