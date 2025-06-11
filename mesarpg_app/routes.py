import os
import json
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify, current_app
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from datetime import datetime
import pytz
from mesarpg_app import db
from mesarpg_app.models import User, Session, SessionApplication, Rating, SessionNote, CampaignDiary, ChatMessage, CharacterTemplate, Character, SystemFieldConfig, System, CharacterType, CharacterCategory, CharacterField, CharacterSubfield
from mesarpg_app.forms import LoginForm, RegisterForm, SessionForm, ProfileForm, SessionApplicationForm, RatingForm, SessionNoteForm, DiaryEntryForm, CharacterSheetForm
from sqlalchemy.exc import IntegrityError
import html
from functools import wraps

# Create blueprints
main_bp = Blueprint('main', __name__)
auth_bp = Blueprint('auth', __name__)
sessions_bp = Blueprint('sessions', __name__)
profile_bp = Blueprint('profile', __name__)
masters_bp = Blueprint('masters', __name__)
campaign_bp = Blueprint('campaign', __name__)
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

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
    if not _can_access_session(session):
        flash('Você não tem permissão para ver os personagens desta sessão.', 'error')
        return redirect(url_for('sessions.detail', id=session_id))
    
    # Buscar personagens por tipo
    characters = Character.query.filter_by(session_id=session_id).all()
    
    # Organizar por tipo
    players = [c for c in characters if c.character_type == 'player']
    npcs = [c for c in characters if c.character_type == 'npc']
    creatures = [c for c in characters if c.character_type == 'creature']
    
    return render_template('sessions/characters_list.html', 
                         session=session, 
                         players=players, 
                         npcs=npcs, 
                         creatures=creatures,
                         is_master=_is_session_master(session))

@sessions_bp.route('/<int:session_id>/characters/create')
@login_required
def create_character(session_id):
    """Página para criar novo personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    
    # Verificar permissões
    if not _can_access_session(session):
        flash('Você não tem permissão para criar personagens nesta sessão.', 'error')
        return redirect(url_for('sessions.detail', id=session_id))
    
    # Obter configurações de campos dinâmicos
    systems = SystemFieldConfig.get_all_systems()
    npc_categories = SystemFieldConfig.get_npc_categories(session.system)
    character_categories = SystemFieldConfig.get_character_categories(session.system)
    
    return render_template('sessions/create_character.html', 
                         session=session, 
                         is_master=_is_session_master(session),
                         systems=systems,
                         npc_categories=npc_categories,
                         character_categories=character_categories)

@sessions_bp.route('/<int:session_id>/characters/create', methods=['POST'])
@login_required
def create_character_post(session_id):
    """Criar novo personagem, NPC ou criatura"""
    session = Session.query.get_or_404(session_id)
    
    # Verificar permissões
    if not _can_access_session(session):
        return jsonify({'error': 'Permissão negada'}), 403
    
    try:
        data = request.get_json()
        character_data = _process_character_data(data, session.system)
        
        character = Character(
            session_id=session_id,
            created_by=current_user.id,
            **character_data['standard_fields']
        )
        
        # Salvar campos dinâmicos
        character.set_dynamic_fields(character_data['dynamic_fields'])
        
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
    if not _can_access_session(session):
        flash('Você não tem permissão para ver este personagem.', 'error')
        return redirect(url_for('sessions.detail', id=session_id))
    
    # Verificar se pode editar
    can_edit = _can_edit_character(character, session)
    
    return render_template('sessions/view_character.html', 
                         session=session, 
                         character=character,
                         can_edit=can_edit,
                         is_master=_is_session_master(session))

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
    if not _can_edit_character(character, session):
        flash('Você não tem permissão para editar este personagem.', 'error')
        return redirect(url_for('sessions.characters_list', session_id=session_id))
    
    return render_template('sessions/edit_character.html', 
                         session=session, 
                         character=character,
                         is_master=_is_session_master(session))

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
    if not _can_edit_character(character, session):
        return jsonify({'error': 'Permissão negada'}), 403
    
    try:
        data = request.get_json()
        character_data = _process_character_data(data, session.system, character)
        
        # Atualizar campos padrão
        for field, value in character_data['standard_fields'].items():
            setattr(character, field, value)
        
        # Atualizar campos dinâmicos
        character.set_dynamic_fields(character_data['dynamic_fields'])
        character.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'{character.character_type.title()} atualizado com sucesso!'
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
    if not _can_edit_character(character, session):
        return jsonify({'error': 'Permissão negada'}), 403
    
    try:
        character_name = character.name
        character_type = character.character_type
        db.session.delete(character)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': f'{character_type.title()} "{character_name}" deletado com sucesso!'
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

# Helper functions for character CRUD
def _can_access_session(session):
    """Verifica se o usuário pode acessar a sessão"""
    if not current_user.is_authenticated:
        return False
    
    # Mestre sempre pode acessar
    if session.master_id == current_user.id:
        return True
    
    # Jogador aprovado pode acessar
    application = SessionApplication.query.filter_by(
        session_id=session.id,
        player_id=current_user.id,
        status='approved'
    ).first()
    
    return application is not None

def _is_session_master(session):
    """Verifica se o usuário é o mestre da sessão"""
    return current_user.is_authenticated and session.master_id == current_user.id

def _can_edit_character(character, session):
    """Verifica se o usuário pode editar o personagem"""
    if not current_user.is_authenticated:
        return False
    
    # Mestre sempre pode editar
    if session.master_id == current_user.id:
        return True
    
    # Criador do personagem pode editar
    if character.created_by == current_user.id:
        return True
    
    return False

def _process_character_data(data, system, existing_character=None):
    """Processa os dados do formulário de personagem"""
    # Mapeamento de campos dinâmicos para campos padrão
    field_mapping = {
        'nome': 'name',
        'raça': 'race',
        'classe': 'character_class',
        'nível': 'level',
        'força': 'strength',
        'destreza': 'dexterity',
        'constituição': 'constitution',
        'inteligência': 'intelligence',
        'sabedoria': 'wisdom',
        'carisma': 'charisma',
        'pv': 'hit_points',
        'ca': 'armor_class',
        'iniciativa': 'initiative',
        'deslocamento': 'speed',
        'perícias': 'skills',
        'magias': 'spells',
        'equipamentos': 'equipment',
        'idiomas': 'languages',
        'alinhamento': 'alignment',
        'antecedente': 'background',
        'história': 'backstory'
    }
    
    # Aplicar mapeamento de campos dinâmicos para campos padrão
    for dynamic_key, standard_key in field_mapping.items():
        if dynamic_key in data and data[dynamic_key]:
            data[standard_key] = data[dynamic_key]
    
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
    
    # Se estiver editando, usar valores existentes como fallback
    if existing_character:
        for field in standard_fields:
            if not standard_fields[field] and hasattr(existing_character, field):
                standard_fields[field] = getattr(existing_character, field)
    
    # Se não há nome mas há campo 'nome', usar o campo 'nome'
    if (not standard_fields['name'] or standard_fields['name'] == 'Personagem') and data.get('nome'):
        standard_fields['name'] = data.get('nome')
    
    # Garantir que sempre há um nome
    if not standard_fields['name'] or standard_fields['name'] == 'Personagem':
        standard_fields['name'] = 'Personagem Sem Nome'
    
    # Coletar campos dinâmicos (excluindo os que já foram mapeados para campos padrão)
    dynamic_fields = {}
    standard_field_names = set(field_mapping.values())
    mapped_dynamic_fields = set(field_mapping.keys())
    
    for key, value in data.items():
        # Excluir campos padrão e campos dinâmicos que foram mapeados
        if (key not in standard_field_names and 
            key not in ['name', 'character_type', 'level', 'description', 'notes', 'image_url', 'is_public'] and
            key not in mapped_dynamic_fields):
            dynamic_fields[key] = value if value is not None else ''
    
    return {
        'standard_fields': standard_fields,
        'dynamic_fields': dynamic_fields
    }

# Admin routes
def admin_required(f):
    """Decorator para verificar se o usuário é admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated:
            return redirect(url_for('auth.login'))
        if current_user.role not in ['admin', 'master']:
            flash('Acesso negado. Apenas administradores podem acessar esta área.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

# Admin Dashboard
@admin_bp.route('/')
@admin_required
def dashboard():
    """Dashboard administrativo"""
    systems_count = System.query.count()
    character_types_count = CharacterType.query.count()
    categories_count = CharacterCategory.query.count()
    fields_count = CharacterField.query.count()
    
    recent_systems = System.query.order_by(System.created_at.desc()).limit(5).all()
    
    return render_template('admin/dashboard.html',
                         systems_count=systems_count,
                         character_types_count=character_types_count,
                         categories_count=categories_count,
                         fields_count=fields_count,
                         recent_systems=recent_systems)

# Systems CRUD
@admin_bp.route('/systems')
@admin_required
def systems_list():
    """Lista todos os sistemas"""
    systems = System.query.order_by(System.name).all()
    return render_template('admin/systems/list.html', systems=systems)

@admin_bp.route('/systems/create', methods=['GET', 'POST'])
@admin_required
def create_system():
    """Criar novo sistema"""
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        
        if not name:
            flash('Nome do sistema é obrigatório.', 'danger')
            return redirect(url_for('admin.create_system'))
        
        # Verificar se já existe
        existing = System.query.filter_by(name=name).first()
        if existing:
            flash('Já existe um sistema com este nome.', 'danger')
            return redirect(url_for('admin.create_system'))
        
        system = System(name=name, description=description)
        db.session.add(system)
        
        # Criar tipos de personagem padrão
        default_types = [
            {'name': 'player', 'display_name': 'Personagem do Jogador', 'sort_order': 1},
            {'name': 'npc', 'display_name': 'NPC', 'sort_order': 2},
            {'name': 'creature', 'display_name': 'Criatura/Monstro', 'sort_order': 3}
        ]
        
        for type_data in default_types:
            char_type = CharacterType(
                system_id=system.id,
                name=type_data['name'],
                display_name=type_data['display_name'],
                sort_order=type_data['sort_order']
            )
            db.session.add(char_type)
        
        try:
            db.session.commit()
            flash('Sistema criado com sucesso!', 'success')
            return redirect(url_for('admin.systems_list'))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao criar sistema: {str(e)}', 'danger')
    
    return render_template('admin/systems/create.html')

@admin_bp.route('/systems/<int:system_id>/edit', methods=['GET', 'POST'])
@admin_required
def edit_system(system_id):
    """Editar sistema"""
    system = System.query.get_or_404(system_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        is_active = request.form.get('is_active') == 'on'
        
        if not name:
            flash('Nome do sistema é obrigatório.', 'danger')
            return redirect(url_for('admin.edit_system', system_id=system_id))
        
        # Verificar se já existe (exceto o atual)
        existing = System.query.filter_by(name=name).filter(System.id != system_id).first()
        if existing:
            flash('Já existe um sistema com este nome.', 'danger')
            return redirect(url_for('admin.edit_system', system_id=system_id))
        
        system.name = name
        system.description = description
        system.is_active = is_active
        
        try:
            db.session.commit()
            flash('Sistema atualizado com sucesso!', 'success')
            return redirect(url_for('admin.systems_list'))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao atualizar sistema: {str(e)}', 'danger')
    
    return render_template('admin/systems/edit.html', system=system)

@admin_bp.route('/systems/<int:system_id>/delete', methods=['POST'])
@admin_required
def delete_system(system_id):
    """Deletar sistema"""
    system = System.query.get_or_404(system_id)
    
    try:
        db.session.delete(system)
        db.session.commit()
        flash('Sistema deletado com sucesso!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Erro ao deletar sistema: {str(e)}', 'danger')
    
    return redirect(url_for('admin.systems_list'))

# Character Types CRUD
@admin_bp.route('/systems/<int:system_id>/character-types')
@admin_required
def character_types_list(system_id):
    """Lista tipos de personagem de um sistema"""
    system = System.query.get_or_404(system_id)
    character_types = CharacterType.query.filter_by(system_id=system_id).order_by(CharacterType.sort_order).all()
    return render_template('admin/character_types/list.html', system=system, character_types=character_types)

@admin_bp.route('/systems/<int:system_id>/character-types/create', methods=['GET', 'POST'])
@admin_required
def create_character_type(system_id):
    """Criar novo tipo de personagem"""
    system = System.query.get_or_404(system_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        display_name = request.form.get('display_name')
        description = request.form.get('description')
        sort_order = int(request.form.get('sort_order', 0))
        
        if not name or not display_name:
            flash('Nome e nome de exibição são obrigatórios.', 'danger')
            return redirect(url_for('admin.create_character_type', system_id=system_id))
        
        # Verificar se já existe
        existing = CharacterType.query.filter_by(system_id=system_id, name=name).first()
        if existing:
            flash('Já existe um tipo de personagem com este nome neste sistema.', 'danger')
            return redirect(url_for('admin.create_character_type', system_id=system_id))
        
        character_type = CharacterType(
            system_id=system_id,
            name=name,
            display_name=display_name,
            description=description,
            sort_order=sort_order
        )
        db.session.add(character_type)
        
        try:
            db.session.commit()
            flash('Tipo de personagem criado com sucesso!', 'success')
            return redirect(url_for('admin.character_types_list', system_id=system_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao criar tipo de personagem: {str(e)}', 'danger')
    
    return render_template('admin/character_types/create.html', system=system)

@admin_bp.route('/character-types/<int:type_id>/edit', methods=['GET', 'POST'])
@admin_required
def edit_character_type(type_id):
    """Editar tipo de personagem"""
    character_type = CharacterType.query.get_or_404(type_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        display_name = request.form.get('display_name')
        description = request.form.get('description')
        sort_order = int(request.form.get('sort_order', 0))
        is_active = request.form.get('is_active') == 'on'
        
        if not name or not display_name:
            flash('Nome e nome de exibição são obrigatórios.', 'danger')
            return redirect(url_for('admin.edit_character_type', type_id=type_id))
        
        # Verificar se já existe (exceto o atual)
        existing = CharacterType.query.filter_by(
            system_id=character_type.system_id, 
            name=name
        ).filter(CharacterType.id != type_id).first()
        
        if existing:
            flash('Já existe um tipo de personagem com este nome neste sistema.', 'danger')
            return redirect(url_for('admin.edit_character_type', type_id=type_id))
        
        character_type.name = name
        character_type.display_name = display_name
        character_type.description = description
        character_type.sort_order = sort_order
        character_type.is_active = is_active
        
        try:
            db.session.commit()
            flash('Tipo de personagem atualizado com sucesso!', 'success')
            return redirect(url_for('admin.character_types_list', system_id=character_type.system_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao atualizar tipo de personagem: {str(e)}', 'danger')
    
    return render_template('admin/character_types/edit.html', character_type=character_type)

# Categories CRUD
@admin_bp.route('/character-types/<int:type_id>/categories')
@admin_required
def categories_list(type_id):
    """Lista categorias de um tipo de personagem"""
    character_type = CharacterType.query.get_or_404(type_id)
    categories = CharacterCategory.query.filter_by(character_type_id=type_id).order_by(CharacterCategory.sort_order).all()
    return render_template('admin/categories/list.html', character_type=character_type, categories=categories)

@admin_bp.route('/character-types/<int:type_id>/categories/create', methods=['GET', 'POST'])
@admin_required
def create_category(type_id):
    """Criar nova categoria"""
    character_type = CharacterType.query.get_or_404(type_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        sort_order = int(request.form.get('sort_order', 0))
        
        if not name:
            flash('Nome da categoria é obrigatório.', 'danger')
            return redirect(url_for('admin.create_category', type_id=type_id))
        
        # Verificar se já existe
        existing = CharacterCategory.query.filter_by(character_type_id=type_id, name=name).first()
        if existing:
            flash('Já existe uma categoria com este nome neste tipo de personagem.', 'danger')
            return redirect(url_for('admin.create_category', type_id=type_id))
        
        category = CharacterCategory(
            character_type_id=type_id,
            name=name,
            description=description,
            sort_order=sort_order
        )
        db.session.add(category)
        
        try:
            db.session.commit()
            flash('Categoria criada com sucesso!', 'success')
            return redirect(url_for('admin.categories_list', type_id=type_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao criar categoria: {str(e)}', 'danger')
    
    return render_template('admin/categories/create.html', character_type=character_type)

@admin_bp.route('/categories/<int:category_id>/edit', methods=['GET', 'POST'])
@admin_required
def edit_category(category_id):
    """Editar categoria"""
    category = CharacterCategory.query.get_or_404(category_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description')
        sort_order = int(request.form.get('sort_order', 0))
        is_active = request.form.get('is_active') == 'on'
        
        if not name:
            flash('Nome da categoria é obrigatório.', 'danger')
            return redirect(url_for('admin.edit_category', category_id=category_id))
        
        # Verificar se já existe (exceto o atual)
        existing = CharacterCategory.query.filter_by(
            character_type_id=category.character_type_id, 
            name=name
        ).filter(CharacterCategory.id != category_id).first()
        
        if existing:
            flash('Já existe uma categoria com este nome neste tipo de personagem.', 'danger')
            return redirect(url_for('admin.edit_category', category_id=category_id))
        
        category.name = name
        category.description = description
        category.sort_order = sort_order
        category.is_active = is_active
        
        try:
            db.session.commit()
            flash('Categoria atualizada com sucesso!', 'success')
            return redirect(url_for('admin.categories_list', type_id=category.character_type_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao atualizar categoria: {str(e)}', 'danger')
    
    return render_template('admin/categories/edit.html', category=category)

# Fields CRUD
@admin_bp.route('/categories/<int:category_id>/fields')
@admin_required
def fields_list(category_id):
    """Lista campos de uma categoria"""
    category = CharacterCategory.query.get_or_404(category_id)
    fields = CharacterField.query.filter_by(category_id=category_id).order_by(CharacterField.sort_order).all()
    return render_template('admin/fields/list.html', category=category, fields=fields)

@admin_bp.route('/categories/<int:category_id>/fields/create', methods=['GET', 'POST'])
@admin_required
def create_field(category_id):
    """Criar novo campo"""
    category = CharacterCategory.query.get_or_404(category_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        field_type = request.form.get('field_type')
        description = request.form.get('description')
        placeholder = request.form.get('placeholder')
        default_value = request.form.get('default_value')
        is_required = request.form.get('is_required') == 'on'
        sort_order = int(request.form.get('sort_order', 0))
        
        if not name or not field_type:
            flash('Nome e tipo do campo são obrigatórios.', 'danger')
            return redirect(url_for('admin.create_field', category_id=category_id))
        
        # Verificar se já existe
        existing = CharacterField.query.filter_by(category_id=category_id, name=name).first()
        if existing:
            flash('Já existe um campo com este nome nesta categoria.', 'danger')
            return redirect(url_for('admin.create_field', category_id=category_id))
        
        field = CharacterField(
            category_id=category_id,
            name=name,
            field_type=field_type,
            description=description,
            placeholder=placeholder,
            default_value=default_value,
            is_required=is_required,
            sort_order=sort_order
        )
        db.session.add(field)
        
        # Se for campo de grupo, criar subcampos
        if field_type == 'grupo':
            subfields_data = request.form.getlist('subfield_name[]')
            subfields_type = request.form.getlist('subfield_type[]')
            
            for i, (sub_name, sub_type) in enumerate(zip(subfields_data, subfields_type)):
                if sub_name and sub_type:
                    subfield = CharacterSubfield(
                        parent_field_id=field.id,
                        name=sub_name,
                        field_type=sub_type,
                        sort_order=i
                    )
                    db.session.add(subfield)
        
        try:
            db.session.commit()
            flash('Campo criado com sucesso!', 'success')
            return redirect(url_for('admin.fields_list', category_id=category_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao criar campo: {str(e)}', 'danger')
    
    return render_template('admin/fields/create.html', category=category)

@admin_bp.route('/fields/<int:field_id>/edit', methods=['GET', 'POST'])
@admin_required
def edit_field(field_id):
    """Editar campo"""
    field = CharacterField.query.get_or_404(field_id)
    
    if request.method == 'POST':
        name = request.form.get('name')
        field_type = request.form.get('field_type')
        description = request.form.get('description')
        placeholder = request.form.get('placeholder')
        default_value = request.form.get('default_value')
        is_required = request.form.get('is_required') == 'on'
        sort_order = int(request.form.get('sort_order', 0))
        is_active = request.form.get('is_active') == 'on'
        
        if not name or not field_type:
            flash('Nome e tipo do campo são obrigatórios.', 'danger')
            return redirect(url_for('admin.edit_field', field_id=field_id))
        
        # Verificar se já existe (exceto o atual)
        existing = CharacterField.query.filter_by(
            category_id=field.category_id, 
            name=name
        ).filter(CharacterField.id != field_id).first()
        
        if existing:
            flash('Já existe um campo com este nome nesta categoria.', 'danger')
            return redirect(url_for('admin.edit_field', field_id=field_id))
        
        field.name = name
        field.field_type = field_type
        field.description = description
        field.placeholder = placeholder
        field.default_value = default_value
        field.is_required = is_required
        field.sort_order = sort_order
        field.is_active = is_active
        
        try:
            db.session.commit()
            flash('Campo atualizado com sucesso!', 'success')
            return redirect(url_for('admin.fields_list', category_id=field.category_id))
        except Exception as e:
            db.session.rollback()
            flash(f'Erro ao atualizar campo: {str(e)}', 'danger')
    
    return render_template('admin/fields/edit.html', field=field)
