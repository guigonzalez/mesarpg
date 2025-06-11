#!/usr/bin/env python3
"""
Script de Teste para Deploy - MesaRPG
Verifica se a aplicação está funcionando corretamente.
"""

import os
import sys
import traceback

def test_imports():
    """Testa se todas as importações estão funcionando"""
    print("Testando importações...")
    
    try:
        from mesarpg_app import create_app, db
        print("✅ Importação da aplicação: OK")
        
        from mesarpg_app.models import User, System, CharacterType, CharacterCategory, CharacterField
        print("✅ Importação dos modelos: OK")
        
        from mesarpg_app.routes import main_bp, auth_bp, sessions_bp, profile_bp, masters_bp, campaign_bp, admin_bp
        print("✅ Importação dos blueprints: OK")
        
        return True
    except Exception as e:
        print(f"❌ Erro na importação: {str(e)}")
        traceback.print_exc()
        return False

def test_app_creation():
    """Testa se a aplicação pode ser criada"""
    print("Testando criação da aplicação...")
    
    try:
        from mesarpg_app import create_app
        app = create_app()
        print("✅ Criação da aplicação: OK")
        return True
    except Exception as e:
        print(f"❌ Erro na criação da aplicação: {str(e)}")
        traceback.print_exc()
        return False

def test_database_connection():
    """Testa se a conexão com o banco está funcionando"""
    print("Testando conexão com banco...")
    
    try:
        from mesarpg_app import create_app, db
        app = create_app()
        
        with app.app_context():
            # Testar conexão simples usando SQLAlchemy 2.0
            with db.engine.connect() as conn:
                result = conn.execute(db.text("SELECT 1"))
                result.fetchone()
            print("✅ Conexão com banco: OK")
            return True
    except Exception as e:
        print(f"❌ Erro na conexão com banco: {str(e)}")
        traceback.print_exc()
        return False

def test_blueprint_registration():
    """Testa se os blueprints estão registrados corretamente"""
    print("Testando registro de blueprints...")
    
    try:
        from mesarpg_app import create_app
        app = create_app()
        
        expected_blueprints = ['main', 'auth', 'sessions', 'profile', 'masters', 'campaign', 'admin']
        registered_blueprints = list(app.blueprints.keys())
        
        for bp in expected_blueprints:
            if bp not in registered_blueprints:
                print(f"❌ Blueprint '{bp}' não encontrado")
                return False
        
        print("✅ Registro de blueprints: OK")
        return True
    except Exception as e:
        print(f"❌ Erro no registro de blueprints: {str(e)}")
        traceback.print_exc()
        return False

def test_environment_variables():
    """Testa se as variáveis de ambiente estão configuradas"""
    print("Testando variáveis de ambiente...")
    
    # Variáveis obrigatórias para produção
    required_vars = ['SECRET_KEY', 'ADMIN_USERNAME', 'ADMIN_EMAIL', 'ADMIN_PASSWORD']
    missing_vars = []
    
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"⚠️  Variáveis ausentes: {missing_vars}")
        print("   (Isso é normal em desenvolvimento)")
    else:
        print("✅ Variáveis de ambiente: OK")
    
    # Verificar DATABASE_URL
    if os.getenv('DATABASE_URL'):
        print("✅ DATABASE_URL: Configurada")
    else:
        print("ℹ️  DATABASE_URL: Não configurada (usando SQLite)")
    
    return True

def main():
    """Executa todos os testes"""
    print("=== TESTE DE DEPLOY MESARPG ===")
    print()
    
    tests = [
        test_imports,
        test_app_creation,
        test_database_connection,
        test_blueprint_registration,
        test_environment_variables
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            print(f"❌ Erro inesperado no teste: {str(e)}")
        print()
    
    print(f"=== RESULTADO: {passed}/{total} testes passaram ===")
    
    if passed == total:
        print("🎉 Todos os testes passaram! A aplicação está pronta para deploy.")
        return True
    else:
        print("⚠️  Alguns testes falharam. Verifique os erros acima.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 