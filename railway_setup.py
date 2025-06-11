#!/usr/bin/env python3
"""
Script de Setup Específico para Railway - MesaRPG
Versão mais robusta para evitar crashes no deploy.
"""

import os
import sys
import time
from datetime import datetime

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def setup_railway():
    """Setup completo para Railway"""
    print("=== SETUP RAILWAY MESARPG ===")
    
    try:
        # Verificar variáveis de ambiente
        print("Verificando variáveis de ambiente...")
        
        required_vars = ['DATABASE_URL', 'SECRET_KEY']
        missing_vars = []
        
        for var in required_vars:
            if not os.getenv(var):
                missing_vars.append(var)
        
        if missing_vars:
            print(f"AVISO: Variáveis de ambiente ausentes: {missing_vars}")
            print("O setup pode falhar se essas variáveis forem necessárias.")
        
        # Criar aplicação
        print("Criando aplicação Flask...")
        from mesarpg_app import create_app, db
        app = create_app()
        
        with app.app_context():
            print("Criando tabelas do banco de dados...")
            db.create_all()
            print("Tabelas criadas com sucesso!")
            
            # Aguardar um pouco para garantir que o banco está pronto
            time.sleep(2)
            
            # Importar e executar setup
            print("Executando setup de dados...")
            from setup_production import create_admin_user, create_default_systems
            
            # Criar admin
            print("Criando usuário admin...")
            admin = create_admin_user()
            
            # Criar sistemas padrão
            print("Criando sistemas padrão...")
            create_default_systems()
            
            print("=== SETUP CONCLUÍDO COM SUCESSO ===")
            print(f"Admin criado: {admin.username}")
            print("Sistemas padrão criados!")
            
    except Exception as e:
        print(f"ERRO no setup: {str(e)}")
        print("Detalhes do erro:")
        import traceback
        traceback.print_exc()
        return False
    
    return True

if __name__ == "__main__":
    success = setup_railway()
    if success:
        print("Setup executado com sucesso!")
        sys.exit(0)
    else:
        print("Setup falhou!")
        sys.exit(1) 