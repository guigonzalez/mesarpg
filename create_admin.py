#!/usr/bin/env python3
"""
Script para criar um usuário administrador
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mesarpg_app import create_app, db
from mesarpg_app.models import User
from werkzeug.security import generate_password_hash

def create_admin_user():
    """Cria um usuário administrador"""
    
    # Verificar se já existe um admin
    existing_admin = User.query.filter_by(role='admin').first()
    if existing_admin:
        print(f"⚠️  Já existe um usuário admin: {existing_admin.username}")
        response = input("Deseja criar outro usuário admin? (s/N): ")
        if response.lower() != 's':
            print("Operação cancelada.")
            return
    
    # Solicitar informações do usuário
    print("🔧 Criando usuário administrador")
    print("=" * 40)
    
    username = input("Nome de usuário: ").strip()
    if not username:
        print("❌ Nome de usuário é obrigatório!")
        return
    
    # Verificar se o usuário já existe
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        print(f"❌ Usuário '{username}' já existe!")
        return
    
    email = input("Email: ").strip()
    if not email:
        print("❌ Email é obrigatório!")
        return
    
    # Verificar se o email já existe
    existing_email = User.query.filter_by(email=email).first()
    if existing_email:
        print(f"❌ Email '{email}' já está em uso!")
        return
    
    password = input("Senha: ").strip()
    if not password:
        print("❌ Senha é obrigatória!")
        return
    
    confirm_password = input("Confirmar senha: ").strip()
    if password != confirm_password:
        print("❌ Senhas não coincidem!")
        return
    
    # Criar o usuário admin
    admin_user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
        role='admin',
        is_active=True
    )
    
    try:
        db.session.add(admin_user)
        db.session.commit()
        print("✅ Usuário administrador criado com sucesso!")
        print(f"👤 Username: {username}")
        print(f"📧 Email: {email}")
        print(f"🔑 Role: admin")
        print("\n🎯 Próximos passos:")
        print("   1. Faça login com as credenciais criadas")
        print("   2. Acesse o painel administrativo via menu do usuário")
        print("   3. Gerencie os sistemas e campos de personagem")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Erro ao criar usuário admin: {str(e)}")
        raise

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        create_admin_user() 