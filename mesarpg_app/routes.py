import os
import json
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from datetime import datetime
import pytz
from mesarpg_app import db
from mesarpg_app.models import User, Session, SessionApplication, Rating, SessionNote, CampaignDiary, ChatMessage, CharacterTemplate, Character, SystemFieldConfig
from mesarpg_app.forms import LoginForm, RegisterForm, SessionForm, ProfileForm, SessionApplicationForm, RatingForm, SessionNoteForm, DiaryEntryForm, CharacterSheetForm
from sqlalchemy.exc import IntegrityError
import html

# Create blueprints
main_bp = Blueprint('main', __name__)
auth_bp = Blueprint('auth', __name__)
sessions_bp = Blueprint('sessions', __name__)
profile_bp = Blueprint('profile', __name__)
masters_bp = Blueprint('masters', __name__)
campaign_bp = Blueprint('campaign', __name__)

# Main routes
@main_bp.route('/')
def index():
    # Get some featured sessions for the homepage
    featured_sessions = Session.query.filter_by(status='open').order_by(Session.created_at.desc()).limit(6).all()
    return render_template('index.html', featured_sessions=featured_sessions)

@main_bp.route('/settings')
@login_required
def settings():
    return render_template('settings.html')

# Authentication routes
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember_me.data)
            next_page = request.args.get('next')
            return redirect(next_page) if next_page else redirect(url_for('main.index'))
        flash('Email ou senha inválidos.', 'danger')
    
    return render_template('auth/login.html', form=form)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    
    form = RegisterForm()
    if form.validate_on_submit():
        user = User(
            username=form.username.data,
            email=form.email.data,
            full_name=form.full_name.data,
            role=form.role.data
        )
        user.set_password(form.password.data)
        db.session.add(user)
        try:
            db.session.commit()
            flash('Conta criada com sucesso! Agora você pode fazer login.', 'success')
            return redirect(url_for('auth.login'))
        except IntegrityError as e:
            db.session.rollback()
            # Checa se o erro foi de email ou username duplicado
            if 'user.email' in str(e.orig):
                flash('Já existe uma conta com este email.', 'danger')
            elif 'user.username' in str(e.orig):
                flash('Já existe uma conta com este nome de usuário.', 'danger')
            else:
                flash('Erro ao criar conta. Tente novamente.', 'danger')
    
    return render_template('auth/register.html', form=form)

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você foi desconectado.', 'info')
    return redirect(url_for('main.index'))

# Session routes
@sessions_bp.route('/')
def list():
    page = request.args.get('page', 1, type=int)
    system_filter = request.args.get('system', '')
    beginner_filter = request.args.get('beginner', '')
    status_filter = request.args.get('status', 'open')
    
    query = Session.query
    
    if system_filter:
        query = query.filter(Session.system.ilike(f'%{system_filter}%'))
    
    if beginner_filter == 'true':
        query = query.filter(Session.is_beginner_friendly == True)
    
    if status_filter:
        query = query.filter(Session.status == status_filter)
    
    # Get user's own sessions and other sessions separately
    if current_user.is_authenticated:
        user_sessions = query.filter(Session.master_id == current_user.id).order_by(Session.created_at.desc()).all()
        other_sessions = query.filter(Session.master_id != current_user.id).order_by(Session.created_at.desc()).paginate(
            page=page, per_page=12, error_out=False
        )
    else:
        user_sessions = []
        other_sessions = query.order_by(Session.created_at.desc()).paginate(
            page=page, per_page=12, error_out=False
        )
    
    return render_template('sessions/list.html', user_sessions=user_sessions, other_sessions=other_sessions,
                         system_filter=system_filter, beginner_filter=beginner_filter, status_filter=status_filter)

@sessions_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    if current_user.role not in ['master', 'both']:
        flash('Apenas mestres podem criar sessões.', 'warning')
        return redirect(url_for('sessions.list'))
    
    form = SessionForm()
    if form.validate_on_submit():
        try:
            session = Session(
                title=form.title.data,
                description=form.description.data,
                system=form.system.data,
                session_type=form.session_type.data,
                max_players=form.max_players.data,
                level_range=form.level_range.data,
                is_paid=form.is_paid.data,
                price=form.price.data if form.is_paid.data else None,
                scheduled_date=form.scheduled_date.data,
                duration_hours=form.duration_hours.data,
                is_beginner_friendly=form.is_beginner_friendly.data,
                content_warnings=form.content_warnings.data,
                tools_required=form.tools_required.data,
                tone=form.tone.data,
                master_id=current_user.id
            )
            
            # Handle tags
            if form.tags.data:
                tags_list = [tag.strip() for tag in form.tags.data.split(',')]
                session.set_tags_list(tags_list)
            
            db.session.add(session)
            db.session.commit()
            
            flash('Sessão criada com sucesso!', 'success')
            return redirect(url_for('sessions.detail', id=session.id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao criar sessão: {str(e)}', 'danger')
    elif request.method == 'POST':
        # Show form validation errors
        for field, errors in form.errors.items():
            for error in errors:
                flash(f'Erro no campo {field}: {error}', 'danger')
    
    return render_template('sessions/create.html', form=form)

@sessions_bp.route('/<int:id>')
def detail(id):
    session = Session.query.get_or_404(id)
    application_form = SessionApplicationForm()
    rating_form = RatingForm()
    
    user_application = None
    if current_user.is_authenticated:
        user_application = SessionApplication.query.filter_by(
            player_id=current_user.id, session_id=id
        ).first()
    
    return render_template('sessions/detail.html', session=session, 
                         application_form=application_form, rating_form=rating_form,
                         user_application=user_application)

@sessions_bp.route('/<int:id>/manage', methods=['GET', 'POST'])
@login_required
def manage_applications(id):
    session = Session.query.get_or_404(id)
    
    # Only the master can manage applications
    if current_user.id != session.master_id:
        flash('Apenas o mestre pode gerenciar candidaturas.', 'warning')
        return redirect(url_for('sessions.detail', id=id))
    
    if request.method == 'POST':
        application_id = request.form.get('application_id')
        action = request.form.get('action')
        
        application = SessionApplication.query.get_or_404(application_id)
        
        if action == 'approve':
            if session.current_players < session.max_players:
                application.status = 'approved'
                session.current_players += 1
                flash(f'Jogador {application.player.username} aprovado!', 'success')
            else:
                flash('Sessão já está lotada!', 'warning')
        elif action == 'reject':
            application.status = 'rejected'
            flash(f'Candidatura de {application.player.username} rejeitada.', 'info')
        
        db.session.commit()
        return redirect(url_for('sessions.manage_applications', id=id))
    
    # Get all applications for this session
    applications = SessionApplication.query.filter_by(session_id=id).order_by(SessionApplication.applied_at.desc()).all()
    
    return render_template('sessions/manage.html', session=session, applications=applications)

@sessions_bp.route('/<int:id>/delete', methods=['POST'])
@login_required
def delete_session(id):
    session = Session.query.get_or_404(id)
    
    # Only the master can delete the session
    if current_user.id != session.master_id:
        flash('Apenas o mestre pode deletar esta sessão.', 'warning')
        return redirect(url_for('sessions.detail', id=id))
    
    # Delete related applications and notes first
    SessionApplication.query.filter_by(session_id=id).delete()
    SessionNote.query.filter_by(session_id=id).delete()
    CampaignDiary.query.filter_by(session_id=id).delete()
    
    # Delete the session
    session_title = session.title
    db.session.delete(session)
    db.session.commit()
    
    flash(f'Sessão "{session_title}" foi deletada com sucesso.', 'success')
    return redirect(url_for('sessions.list'))

@sessions_bp.route('/<int:id>/apply', methods=['POST'])
@login_required
def apply(id):
    session = Session.query.get_or_404(id)
    
    if current_user.id == session.master_id:
        flash('Você não pode se inscrever na sua própria sessão.', 'warning')
        return redirect(url_for('sessions.detail', id=id))
    
    existing_application = SessionApplication.query.filter_by(
        player_id=current_user.id, session_id=id
    ).first()
    
    if existing_application:
        flash('Você já se inscreveu nesta sessão.', 'info')
        return redirect(url_for('sessions.detail', id=id))
    
    form = SessionApplicationForm()
    if form.validate_on_submit():
        application = SessionApplication(
            player_id=current_user.id,
            session_id=id,
            message=form.message.data
        )
        db.session.add(application)
        db.session.commit()
        
        flash('Inscrição enviada com sucesso!', 'success')
    
    return redirect(url_for('sessions.detail', id=id))

@sessions_bp.route('/<int:id>/live')
@login_required
def live(id):
    session = Session.query.get_or_404(id)
    
    # Check if user is part of this session
    is_master = current_user.id == session.master_id
    is_player = SessionApplication.query.filter_by(
        player_id=current_user.id, session_id=id, status='approved'
    ).first() is not None
    
    if not (is_master or is_player):
        flash('Você não tem acesso a esta sessão.', 'warning')
        return redirect(url_for('sessions.detail', id=id))
    
    notes = SessionNote.query.filter_by(session_id=id).order_by(SessionNote.created_at.desc()).all()
    note_form = SessionNoteForm()
    
    return render_template('sessions/live.html', session=session, notes=notes, note_form=note_form)

@sessions_bp.route('/<int:id>/notes', methods=['POST'])
@login_required
def add_note(id):
    session = Session.query.get_or_404(id)
    form = SessionNoteForm()
    
    if form.validate_on_submit():
        note = SessionNote(
            session_id=id,
            author_id=current_user.id,
            title=form.title.data,
            content=form.content.data,
            note_type=form.note_type.data,
            is_public=form.is_public.data
        )
        db.session.add(note)
        db.session.commit()
        
        flash('Nota adicionada com sucesso!', 'success')
    
    return redirect(url_for('sessions.live', id=id))

# Profile routes
@profile_bp.route('/<int:user_id>')
def view(user_id):
    user = User.query.get_or_404(user_id)
    created_sessions = Session.query.filter_by(master_id=user_id).order_by(Session.created_at.desc()).limit(5).all()
    average_rating = user.get_average_rating()
    
    return render_template('profile/view.html', user=user, created_sessions=created_sessions, average_rating=average_rating)

@profile_bp.route('/edit', methods=['GET', 'POST'])
@login_required
def edit():
    form = ProfileForm(obj=current_user)
    if form.validate_on_submit():
        current_user.full_name = form.full_name.data
        current_user.bio = form.bio.data
        current_user.role = form.role.data
        current_user.preferred_systems = form.preferred_systems.data
        db.session.commit()
        
        flash('Perfil atualizado com sucesso!', 'success')
        return redirect(url_for('profile.view', user_id=current_user.id))
    
    return render_template('profile/edit.html', form=form)

# Masters routes
@masters_bp.route('/')
def showcase():
    page = request.args.get('page', 1, type=int)
    masters = User.query.filter(User.role.in_(['master', 'both'])).paginate(
        page=page, per_page=12, error_out=False
    )
    
    return render_template('masters/showcase.html', masters=masters)

# Campaign routes
@campaign_bp.route('/<int:session_id>/diary')
@login_required
def diary(session_id):
    session = Session.query.get_or_404(session_id)
    
    # Check access
    is_master = current_user.id == session.master_id
    is_player = SessionApplication.query.filter_by(
        player_id=current_user.id, session_id=session_id, status='approved'
    ).first() is not None
    
    if not (is_master or is_player):
        flash('Você não tem acesso a este diário de campanha.', 'warning')
        return redirect(url_for('sessions.detail', id=session_id))
    
    entries = CampaignDiary.query.filter_by(session_id=session_id).order_by(CampaignDiary.updated_at.desc()).all()
    form = DiaryEntryForm()
    
    return render_template('campaign/diary.html', session=session, entries=entries, form=form)

@campaign_bp.route('/<int:session_id>/diary/add', methods=['POST'])
@login_required
def add_diary_entry(session_id):
    session = Session.query.get_or_404(session_id)
    form = DiaryEntryForm()
    
    if form.validate_on_submit():
        entry = CampaignDiary(
            session_id=session_id,
            title=form.title.data,
            content=form.content.data,
            author_id=current_user.id,
            entry_type=form.entry_type.data,
            is_public=form.is_public.data
        )
        db.session.add(entry)
        db.session.commit()
        
        flash('Entrada adicionada ao diário!', 'success')
    
    return redirect(url_for('campaign.diary', session_id=session_id))

# API routes for live session features
@main_bp.route('/api/dice/roll')
@login_required
def roll_dice():
    dice_type = request.args.get('type', '20')
    modifier = request.args.get('modifier', '0')
    
    try:
        import random
        dice_value = int(dice_type)
        mod_value = int(modifier)
        
        roll = random.randint(1, dice_value)
        total = roll + mod_value
        
        return jsonify({
            'roll': roll,
            'modifier': mod_value,
            'total': total,
            'dice_type': dice_value
        })
    except ValueError:
        return jsonify({'error': 'Valores inválidos'}), 400

# Chat API routes
@sessions_bp.route('/api/chat/<int:session_id>/messages', methods=['GET'])
@login_required
def get_chat_messages(session_id):
    session = Session.query.get_or_404(session_id)
    
    # Verificar se o usuário pode acessar esta sessão
    if session.master_id != current_user.id:
        # Verificar se é um jogador aprovado
        application = SessionApplication.query.filter_by(
            session_id=session_id,
            player_id=current_user.id,
            status='approved'
        ).first()
        if not application:
            return jsonify({'error': 'Acesso negado'}), 403
    
    messages = ChatMessage.query.filter_by(session_id=session_id)\
        .order_by(ChatMessage.created_at.asc())\
        .limit(100).all()
    
    # Timezone de São Paulo
    sp_tz = pytz.timezone('America/Sao_Paulo')
    
    messages_data = []
    for msg in messages:
        # Converter UTC para horário de São Paulo
        utc_time = msg.created_at.replace(tzinfo=pytz.UTC)
        sp_time = utc_time.astimezone(sp_tz)
        
        messages_data.append({
            'id': msg.id,
            'username': msg.user.username,
            'message': msg.message,
            'message_type': msg.message_type,
            'created_at': sp_time.strftime('%H:%M'),
            'is_current_user': msg.user_id == current_user.id
        })
    
    return jsonify({'messages': messages_data})

@sessions_bp.route('/api/chat/<int:session_id>/send', methods=['POST'])
@login_required
def send_chat_message(session_id):
    session = Session.query.get_or_404(session_id)
    
    # Verificar se o usuário pode acessar esta sessão
    if session.master_id != current_user.id:
        application = SessionApplication.query.filter_by(
            session_id=session_id,
            player_id=current_user.id,
            status='approved'
        ).first()
        if not application:
            return jsonify({'error': 'Acesso negado'}), 403
    
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': 'Dados de mensagem inválidos'}), 400

    message_text = (data.get('message') or '').strip()
    message_type = data.get('type', 'text')
    
    if not message_text:
        return jsonify({'error': 'Mensagem não pode estar vazia'}), 400
    
    if len(message_text) > 2000:
        return jsonify({'error': 'Mensagem muito longa (máximo 2000 caracteres)'}), 400
    
    # Criar nova mensagem
    chat_message = ChatMessage(
        session_id=session_id,
        user_id=current_user.id,
        message=message_text,
        message_type=message_type
    )
    
    db.session.add(chat_message)
    db.session.commit()
    
    # Timezone de São Paulo
    sp_tz = pytz.timezone('America/Sao_Paulo')
    utc_time = chat_message.created_at.replace(tzinfo=pytz.UTC)
    sp_time = utc_time.astimezone(sp_tz)
    
    return jsonify({
        'success': True,
        'message': {
            'id': chat_message.id,
            'username': current_user.username,
            'message': chat_message.message,
            'message_type': chat_message.message_type,
            'created_at': sp_time.strftime('%H:%M'),
            'is_current_user': True
        }
    })

# ============================================================================
# ROTAS UNIFICADAS PARA PERSONAGENS, NPCS E CRIATURAS
# ============================================================================

@sessions_bp.route('/<int:session_id>/characters')
@login_required
def characters_list(session_id):
    """Lista todos os personagens, NPCs e criaturas da sessão"""
    session = Session.query.get_or_404(session_id)
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    is_player = SessionApplication.query.filter_by(
        session_id=session_id,
        player_id=current_user.id,
        status='approved'
    ).first() is not None
    
    if not (is_master or is_player):
        flash('Você não tem permissão para ver os personagens desta sessão.', 'error')
        return redirect(url_for('sessions.view', id=session_id))
    
    # Buscar personagens por tipo
    players = Character.query.filter_by(session_id=session_id, character_type='player').all()
    npcs = Character.query.filter_by(session_id=session_id, character_type='npc').all()
    creatures = Character.query.filter_by(session_id=session_id, character_type='creature').all()
    
    return render_template('sessions/characters_list.html', 
                         session=session, 
                         players=players, 
                         npcs=npcs, 
                         creatures=creatures,
                         is_master=is_master)

@sessions_bp.route('/<int:session_id>/characters/create')
@login_required
def create_character(session_id):
    """Página para criar novo personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    is_player = SessionApplication.query.filter_by(
        session_id=session_id,
        player_id=current_user.id,
        status='approved'
    ).first() is not None
    
    if not (is_master or is_player):
        flash('Você não tem permissão para criar personagens nesta sessão.', 'error')
        return redirect(url_for('sessions.live', id=session_id))
    
    # Obter configurações de campos dinâmicos
    systems = SystemFieldConfig.get_all_systems()
    npc_categories = SystemFieldConfig.get_npc_categories(session.system)
    character_categories = SystemFieldConfig.get_character_categories(session.system)
    
    return render_template('sessions/create_character.html', 
                         session=session, 
                         is_master=is_master,
                         systems=systems,
                         npc_categories=npc_categories,
                         character_categories=character_categories)

@sessions_bp.route('/<int:session_id>/characters/create', methods=['POST'])
@login_required
def create_character_post(session_id):
    """Criar novo personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    is_player = SessionApplication.query.filter_by(
        session_id=session_id,
        player_id=current_user.id,
        status='approved'
    ).first() is not None
    
    if not (is_master or is_player):
        return jsonify({'error': 'Permissão negada'}), 403
    
    # Dados do formulário
    data = request.get_json()
    
    try:
        # Separar campos padrão dos campos dinâmicos
        standard_fields = {
            'name': data.get('name', 'Personagem'),
            'character_type': data.get('character_type', 'player'),
            'level': data.get('level', 1),
            'race': data.get('race', ''),
            'character_class': data.get('character_class', ''),
            'background': data.get('background', ''),
            'strength': data.get('strength', 10),
            'dexterity': data.get('dexterity', 10),
            'constitution': data.get('constitution', 10),
            'intelligence': data.get('intelligence', 10),
            'wisdom': data.get('wisdom', 10),
            'charisma': data.get('charisma', 10),
            'armor_class': data.get('armor_class', 10),
            'hit_points': data.get('hit_points', 8),
            'max_hit_points': data.get('hit_points', 8),
            'speed': data.get('speed', 30),
            'description': data.get('description', ''),
            'backstory': data.get('backstory', ''),
            'equipment': data.get('equipment', ''),
            'spells': data.get('spells', ''),
            'notes': data.get('notes', ''),
            'image_url': data.get('image_url', ''),
            'is_public': data.get('is_public', True)
        }
        
        # Campos dinâmicos (todos os outros campos)
        dynamic_fields = {}
        standard_field_names = set(standard_fields.keys())
        for key, value in data.items():
            if key not in standard_field_names and value and str(value).strip():
                dynamic_fields[key] = value
        
        character = Character(
            session_id=session_id,
            created_by=current_user.id,
            **standard_fields
        )
        
        # Salvar campos dinâmicos
        if dynamic_fields:
            character.set_dynamic_fields(dynamic_fields)
        
        db.session.add(character)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'character_id': character.id,
            'message': f'{character.character_type.title()} criado com sucesso!'
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao criar personagem: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@sessions_bp.route('/<int:session_id>/characters/<int:character_id>')
@login_required
def view_character(session_id, character_id):
    """Visualizar personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    character = Character.query.get_or_404(character_id)
    
    # Verificar se o personagem pertence à sessão
    if character.session_id != session_id:
        flash('Personagem não encontrado nesta sessão.', 'error')
        return redirect(url_for('sessions.characters_list', session_id=session_id))
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    is_player = SessionApplication.query.filter_by(
        session_id=session_id,
        player_id=current_user.id,
        status='approved'
    ).first() is not None
    
    can_view = False
    if is_master:
        can_view = True
    elif is_player and character.is_public:
        can_view = True
    elif character.created_by == current_user.id:
        can_view = True
    
    if not can_view:
        flash('Você não tem permissão para ver este personagem.', 'error')
        return redirect(url_for('sessions.characters_list', session_id=session_id))
    
    return render_template('sessions/view_character.html', 
                         session=session, 
                         character=character,
                         is_master=is_master)

@sessions_bp.route('/<int:session_id>/characters/<int:character_id>/edit')
@login_required
def edit_character(session_id, character_id):
    """Editar personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    character = Character.query.get_or_404(character_id)
    
    # Verificar se o personagem pertence à sessão
    if character.session_id != session_id:
        flash('Personagem não encontrado nesta sessão.', 'error')
        return redirect(url_for('sessions.characters_list', session_id=session_id))
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    can_edit = False
    
    if is_master:
        can_edit = True
    elif character.created_by == current_user.id:
        can_edit = True
    
    if not can_edit:
        flash('Você não tem permissão para editar este personagem.', 'error')
        return redirect(url_for('sessions.view_character', session_id=session_id, character_id=character_id))
    
    return render_template('sessions/edit_character.html', 
                         session=session, 
                         character=character,
                         is_master=is_master)

@sessions_bp.route('/<int:session_id>/characters/<int:character_id>/edit', methods=['POST'])
@login_required
def edit_character_post(session_id, character_id):
    """Atualizar personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    character = Character.query.get_or_404(character_id)
    
    # Verificar se o personagem pertence à sessão
    if character.session_id != session_id:
        return jsonify({'error': 'Personagem não encontrado nesta sessão'}), 400
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    can_edit = False
    
    if is_master:
        can_edit = True
    elif character.created_by == current_user.id:
        can_edit = True
    
    if not can_edit:
        return jsonify({'error': 'Permissão negada'}), 403
    
    # Dados do formulário
    data = request.get_json()
    
    try:
        # Atualizar campos
        character.name = data.get('name', character.name)
        character.level = data.get('level', character.level)
        character.race = data.get('race', character.race)
        character.character_class = data.get('character_class', character.character_class)
        character.background = data.get('background', character.background)
        character.strength = data.get('strength', character.strength)
        character.dexterity = data.get('dexterity', character.dexterity)
        character.constitution = data.get('constitution', character.constitution)
        character.intelligence = data.get('intelligence', character.intelligence)
        character.wisdom = data.get('wisdom', character.wisdom)
        character.charisma = data.get('charisma', character.charisma)
        character.armor_class = data.get('armor_class', character.armor_class)
        character.hit_points = data.get('hit_points', character.hit_points)
        character.max_hit_points = data.get('max_hit_points', character.max_hit_points)
        character.speed = data.get('speed', character.speed)
        character.description = data.get('description', character.description)
        character.backstory = data.get('backstory', character.backstory)
        character.equipment = data.get('equipment', character.equipment)
        character.spells = data.get('spells', character.spells)
        character.notes = data.get('notes', character.notes)
        character.image_url = data.get('image_url', character.image_url)
        character.is_public = data.get('is_public', character.is_public)
        character.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Personagem atualizado com sucesso!'
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao atualizar personagem: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@sessions_bp.route('/<int:session_id>/characters/<int:character_id>/delete', methods=['POST'])
@login_required
def delete_character(session_id, character_id):
    """Deletar personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    character = Character.query.get_or_404(character_id)
    
    # Verificar se o personagem pertence à sessão
    if character.session_id != session_id:
        return jsonify({'error': 'Personagem não encontrado nesta sessão'}), 400
    
    # Verificar permissões
    is_master = session.master_id == current_user.id
    can_delete = False
    
    if is_master:
        can_delete = True
    elif character.created_by == current_user.id:
        can_delete = True
    
    if not can_delete:
        return jsonify({'error': 'Permissão negada'}), 403
    
    try:
        db.session.delete(character)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Personagem deletado com sucesso!'
        })
        
    except Exception as e:
        db.session.rollback()
        print(f"Erro ao deletar personagem: {e}")
        return jsonify({'error': 'Erro interno do servidor'}), 500

@sessions_bp.route('/api/character-fields/<system>/<character_type>')
@login_required
def get_character_fields(system, character_type):
    """API para obter campos dinâmicos baseados no sistema e tipo"""
    # Decodificar HTML entities no nome do sistema
    system = html.unescape(system)
    
    # Mapeamento de nomes abreviados para nomes completos
    system_mapping = {
        'Vampire': 'Vampire: The Masquerade',
        'CoC': 'Call of Cthulhu',
        '3D&T': '3D&T Alpha'
    }
    
    # Usar o nome completo se disponível
    full_system_name = system_mapping.get(system, system)
    
    print(f"DEBUG: Sistema recebido: '{system}', Tipo: '{character_type}'")
    print(f"DEBUG: Sistema mapeado: '{full_system_name}'")
    
    if character_type in ['npc', 'creature']:
        categories = SystemFieldConfig.get_npc_categories(full_system_name)
        print(f"DEBUG: Categorias NPC: {categories}")
        fields_data = {}
        for category in categories:
            fields = SystemFieldConfig.get_npc_fields(full_system_name, category)
            print(f"DEBUG: Campos para categoria '{category}': {fields}")
            fields_data[category] = fields
        return jsonify({
            'success': True,
            'categories': categories,
            'fields': fields_data
        })
    elif character_type == 'player':
        # Para personagens, usar a categoria 'Personagem'
        categories = ['Personagem']
        fields_data = {}
        for category in categories:
            fields = SystemFieldConfig.get_character_fields(full_system_name, category)
            print(f"DEBUG: Campos para categoria '{category}': {fields}")
            fields_data[category] = fields
        return jsonify({
            'success': True,
            'categories': categories,
            'fields': fields_data
        })
    else:
        return jsonify({'error': 'Tipo de personagem inválido'}), 400
