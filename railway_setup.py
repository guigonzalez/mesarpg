#!/usr/bin/env python3
"""
Script de Setup para Railway - MesaRPG
Execute este script no console do Railway para configurar o sistema.
"""

import os
import sys
from datetime import datetime

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    """Função principal do script"""
    print("=== Setup Railway - MesaRPG ===")
    print(f"Data/Hora: {datetime.now()}")
    print()
    
    # Verificar variáveis de ambiente
    print("Verificando variáveis de ambiente...")
    admin_username = os.getenv('ADMIN_USERNAME', 'admin')
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@mesarpg.com')
    admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    print(f"ADMIN_USERNAME: {admin_username}")
    print(f"ADMIN_EMAIL: {admin_email}")
    print(f"ADMIN_PASSWORD: {'*' * len(admin_password) if admin_password else 'NÃO DEFINIDA'}")
    print(f"DATABASE_URL: {'Definida' if os.getenv('DATABASE_URL') else 'NÃO DEFINIDA'}")
    print()
    
    try:
        # Importar e executar setup
        from setup_production import main as setup_main
        setup_main()
        
    except Exception as e:
        print(f"Erro durante o setup: {str(e)}")
        print()
        print("Tentando setup manual...")
        
        try:
            from mesarpg_app import create_app, db
            from mesarpg_app.models import User
            
            app = create_app()
            with app.app_context():
                db.create_all()
                
                # Verificar se admin existe
                admin = User.query.filter_by(role='admin').first()
                if not admin:
                    print("Criando admin manual...")
                    admin = User(
                        username=admin_username,
                        email=admin_email,
                        role='admin',
                        is_active=True,
                        created_at=datetime.utcnow()
                    )
                    admin.set_password(admin_password)
                    db.session.add(admin)
                    db.session.commit()
                    print(f"Admin criado: {admin_username}")
                else:
                    print(f"Admin já existe: {admin.username}")
                    
        except Exception as e2:
            print(f"Erro no setup manual: {str(e2)}")
            sys.exit(1)

if __name__ == '__main__':
    main() 