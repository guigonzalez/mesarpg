#!/usr/bin/env python3
"""
Script de Teste para Criação de Admin - MesaRPG
Testa se o usuário admin pode ser criado corretamente.
"""

import os
import sys
from datetime import datetime

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_admin_creation():
    """Testa a criação do usuário admin"""
    print("=== Teste de Criação de Admin ===")
    print(f"Data/Hora: {datetime.now()}")
    print()
    
    try:
        from mesarpg_app import create_app, db
        from mesarpg_app.models import User
        
        app = create_app()
        
        with app.app_context():
            # Criar tabelas
            db.create_all()
            print("✓ Tabelas criadas")
            
            # Verificar se admin já existe
            admin = User.query.filter_by(role='admin').first()
            if admin:
                print(f"✓ Admin já existe: {admin.username}")
                print(f"  - Email: {admin.email}")
                print(f"  - Role: {admin.role}")
                print(f"  - Ativo: {admin.is_active}")
                return admin
            
            # Criar admin de teste
            print("Criando admin de teste...")
            admin = User(
                username='test_admin',
                email='test@mesarpg.com',
                role='admin',
                is_active=True,
                created_at=datetime.utcnow()
            )
            admin.set_password('test123')
            
            db.session.add(admin)
            db.session.commit()
            
            print("✓ Admin criado com sucesso!")
            print(f"  - Username: {admin.username}")
            print(f"  - Email: {admin.email}")
            print(f"  - Role: {admin.role}")
            print(f"  - Ativo: {admin.is_active}")
            
            # Testar login
            if admin.check_password('test123'):
                print("✓ Senha configurada corretamente")
            else:
                print("✗ Erro na configuração da senha")
            
            return admin
            
    except Exception as e:
        print(f"✗ Erro: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_variables():
    """Testa as variáveis de ambiente"""
    print("=== Teste de Variáveis de Ambiente ===")
    
    variables = [
        'ADMIN_USERNAME',
        'ADMIN_EMAIL', 
        'ADMIN_PASSWORD',
        'DATABASE_URL',
        'SECRET_KEY',
        'RAILWAY_ENVIRONMENT'
    ]
    
    for var in variables:
        value = os.getenv(var)
        if value:
            if 'PASSWORD' in var:
                print(f"✓ {var}: {'*' * len(value)}")
            else:
                print(f"✓ {var}: {value}")
        else:
            print(f"✗ {var}: NÃO DEFINIDA")

if __name__ == '__main__':
    test_variables()
    print()
    test_admin_creation() 