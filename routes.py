import os
import json
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from datetime import datetime
import pytz
from app import db
from models import User, Session, SessionApplication, Rating, SessionNote, CampaignDiary, ChatMessage, CharacterSheet, CharacterTemplate
from forms import LoginForm, RegisterForm, SessionForm, ProfileForm, SessionApplicationForm, RatingForm, SessionNoteForm, DiaryEntryForm, CharacterSheetForm

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
        db.session.commit()
        
        flash('Conta criada com sucesso! Agora você pode fazer login.', 'success')
        return redirect(url_for('auth.login'))
    
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
    
    data = request.get_json()
    message_text = data.get('message', '').strip()
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

# Character Sheet routes
@sessions_bp.route('/<int:id>/characters')
@login_required
def character_sheets(id):
    session = Session.query.get_or_404(id)
    
    # Verificar se o usuário pode acessar esta sessão
    if session.master_id != current_user.id:
        application = SessionApplication.query.filter_by(
            session_id=id,
            player_id=current_user.id,
            status='approved'
        ).first()
        if not application:
            flash('Você não tem acesso a esta sessão.', 'error')
            return redirect(url_for('sessions.list'))
    
    # Buscar fichas da sessão
    if session.master_id == current_user.id:
        # Mestre vê todas as fichas públicas
        character_sheets = CharacterSheet.query.filter_by(session_id=id, is_public=True).all()
    else:
        # Jogador vê apenas suas fichas e fichas públicas de outros
        character_sheets = CharacterSheet.query.filter(
            CharacterSheet.session_id == id,
            db.or_(
                CharacterSheet.player_id == current_user.id,
                CharacterSheet.is_public == True
            )
        ).all()
    
    return render_template('sessions/characters.html', session=session, character_sheets=character_sheets)

@sessions_bp.route('/<int:id>/characters/new')
@login_required
def new_character_sheet(id):
    session = Session.query.get_or_404(id)
    
    # Verificar se o usuário pode acessar esta sessão
    if session.master_id != current_user.id:
        application = SessionApplication.query.filter_by(
            session_id=id,
            player_id=current_user.id,
            status='approved'
        ).first()
        if not application:
            flash('Você não tem acesso a esta sessão.', 'error')
            return redirect(url_for('sessions.list'))
    
    form = CharacterSheetForm()
    
    if form.validate_on_submit():
        character_sheet = CharacterSheet(
            session_id=id,
            player_id=current_user.id,
            character_name=form.character_name.data,
            character_class=form.character_class.data,
            level=form.level.data,
            race=form.race.data,
            background=form.background.data,
            strength=form.strength.data,
            dexterity=form.dexterity.data,
            constitution=form.constitution.data,
            intelligence=form.intelligence.data,
            wisdom=form.wisdom.data,
            charisma=form.charisma.data,
            armor_class=form.armor_class.data,
            hit_points=form.hit_points.data,
            max_hit_points=form.max_hit_points.data,
            speed=form.speed.data,
            description=form.description.data,
            backstory=form.backstory.data,
            equipment=form.equipment.data,
            spells=form.spells.data,
            notes=form.notes.data,
            character_image_url=form.character_image_url.data,
            is_public=form.is_public.data
        )
        
        db.session.add(character_sheet)
        db.session.commit()
        
        flash('Ficha de personagem criada com sucesso!', 'success')
        return redirect(url_for('sessions.character_sheets', id=id))
    
    return render_template('sessions/new_character.html', session=session, form=form)

@sessions_bp.route('/<int:session_id>/characters/<int:character_id>')
@login_required
def view_character_sheet(session_id, character_id):
    session = Session.query.get_or_404(session_id)
    character = CharacterSheet.query.get_or_404(character_id)
    
    # Verificar se o usuário pode ver esta ficha
    if character.session_id != session_id:
        flash('Ficha não encontrada nesta sessão.', 'error')
        return redirect(url_for('sessions.character_sheets', id=session_id))
    
    # Verificar permissões
    can_view = False
    if session.master_id == current_user.id:
        can_view = True
    elif character.player_id == current_user.id:
        can_view = True
    elif character.is_public:
        # Verificar se é jogador aprovado na sessão
        application = SessionApplication.query.filter_by(
            session_id=session_id,
            player_id=current_user.id,
            status='approved'
        ).first()
        can_view = application is not None
    
    if not can_view:
        flash('Você não tem permissão para ver esta ficha.', 'error')
        return redirect(url_for('sessions.character_sheets', id=session_id))
    
    return render_template('sessions/view_character.html', session=session, character=character)

@sessions_bp.route('/<int:session_id>/characters/<int:character_id>/edit', methods=['GET', 'POST'])
@login_required
def edit_character_sheet(session_id, character_id):
    session = Session.query.get_or_404(session_id)
    character = CharacterSheet.query.get_or_404(character_id)
    
    # Verificar se o usuário pode editar esta ficha
    if character.player_id != current_user.id and session.master_id != current_user.id:
        flash('Você não tem permissão para editar esta ficha.', 'error')
        return redirect(url_for('sessions.character_sheets', id=session_id))
    
    form = CharacterSheetForm(obj=character)
    
    if form.validate_on_submit():
        form.populate_obj(character)
        character.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        flash('Ficha atualizada com sucesso!', 'success')
        return redirect(url_for('sessions.view_character_sheet', session_id=session_id, character_id=character_id))
    
    return render_template('sessions/edit_character.html', session=session, character=character, form=form)

@sessions_bp.route('/<int:id>/characters/template')
@login_required
def character_template(id):
    session = Session.query.get_or_404(id)
    
    # Verificar se é o mestre da sessão
    if session.master_id != current_user.id:
        flash('Apenas o mestre pode usar o criador de fichas.', 'error')
        return redirect(url_for('sessions.character_sheets', id=id))
    
    return render_template('sessions/character_template.html', session=session, template_type='player')

@sessions_bp.route('/<int:id>/npcs')
@login_required
def npcs_list(id):
    session = Session.query.get_or_404(id)
    
    # Verificar se é o mestre da sessão
    if session.master_id != current_user.id:
        flash('Apenas o mestre pode gerenciar NPCs e Criaturas.', 'error')
        return redirect(url_for('sessions.character_sheets', id=id))
    
    # Buscar NPCs e Criaturas da sessão
    npcs = CharacterSheet.query.filter_by(session_id=id, character_class='NPC').all()
    creatures = CharacterSheet.query.filter_by(session_id=id, character_class='Criatura').all()
    
    return render_template('sessions/npcs.html', session=session, npcs=npcs, creatures=creatures)

@sessions_bp.route('/<int:id>/npcs/template')
@login_required
def npc_template(id):
    session = Session.query.get_or_404(id)
    
    # Verificar se é o mestre da sessão
    if session.master_id != current_user.id:
        flash('Apenas o mestre pode criar NPCs e Criaturas.', 'error')
        return redirect(url_for('sessions.character_sheets', id=id))
    
    return render_template('sessions/npc_template.html', session=session)

@sessions_bp.route('/<int:id>/characters/from-template', methods=['POST'])
@login_required  
def create_from_template(id):
    session = Session.query.get_or_404(id)
    
    # Verificar se é o mestre da sessão
    if session.master_id != current_user.id:
        flash('Apenas o mestre pode usar o criador de fichas.', 'error')
        return redirect(url_for('sessions.character_sheets', id=id))
    
    # Dados do template vêm do JavaScript/formulário
    template_data = request.get_json()
    
    # Converter checkbox para booleano corretamente
    is_public_value = template_data.get('is_public', True)
    if isinstance(is_public_value, str):
        is_public_value = is_public_value.lower() in ['true', 'on', '1', 'yes']
    
    # Criar ficha baseada no template
    character_sheet = CharacterSheet(
        session_id=id,
        player_id=current_user.id,  # Mestre cria a ficha inicialmente
        character_name=template_data.get('nome', 'Personagem'),
        character_class=template_data.get('character_class', ''),
        level=template_data.get('level', 1),
        race=template_data.get('race', ''),
        background=template_data.get('background', ''),
        strength=template_data.get('strength', 10),
        dexterity=template_data.get('dexterity', 10),
        constitution=template_data.get('constitution', 10),
        intelligence=template_data.get('intelligence', 10),
        wisdom=template_data.get('wisdom', 10),
        charisma=template_data.get('charisma', 10),
        armor_class=template_data.get('armor_class', 10),
        hit_points=template_data.get('hit_points', 8),
        max_hit_points=template_data.get('max_hit_points', 8),
        speed=template_data.get('speed', 30),
        description=template_data.get('description', ''),
        backstory=template_data.get('backstory', ''),
        equipment=template_data.get('equipment', ''),
        spells=template_data.get('spells', ''),
        notes=template_data.get('notes', ''),
        character_image_url=template_data.get('character_image_url', ''),
        is_public=is_public_value
    )
    
    db.session.add(character_sheet)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'character_id': character_sheet.id,
        'message': 'Ficha criada com sucesso!'
    })
