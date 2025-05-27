import os
import json
from datetime import datetime
from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash
from app import db
from models import User, Session, SessionApplication, Rating, SessionNote, CampaignDiary
from forms import LoginForm, RegisterForm, SessionForm, ProfileForm, SessionApplicationForm, RatingForm, SessionNoteForm, DiaryEntryForm

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
    
    sessions = query.order_by(Session.created_at.desc()).paginate(
        page=page, per_page=12, error_out=False
    )
    
    return render_template('sessions/list.html', sessions=sessions, 
                         system_filter=system_filter, beginner_filter=beginner_filter, status_filter=status_filter)

@sessions_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    if current_user.role not in ['master', 'both']:
        flash('Apenas mestres podem criar sessões.', 'warning')
        return redirect(url_for('sessions.list'))
    
    form = SessionForm()
    if form.validate_on_submit():
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
