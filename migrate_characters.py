#!/usr/bin/env python3
"""
Script de migração para criar a nova tabela Character unificada.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mesarpg_app import create_app, db
from mesarpg_app.models import Character, Session, User

def create_character_table():
    """Cria a nova tabela Character"""
    app = create_app()
    
    with app.app_context():
        print("🔄 Criando nova tabela Character...")
        
        try:
            # Criar a tabela Character
            db.create_all()
            print("✅ Tabela Character criada com sucesso!")
            
            # Verificar se a tabela foi criada
            result = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='character'")
            if result.fetchone():
                print("✅ Tabela 'character' existe no banco de dados")
            else:
                print("❌ Tabela 'character' não foi criada")
                
        except Exception as e:
            print(f"❌ Erro ao criar tabela: {e}")

def check_existing_data():
    """Verifica se existem dados nas tabelas antigas"""
    app = create_app()
    
    with app.app_context():
        print("\n📊 Verificando dados existentes...")
        
        try:
            # Verificar tabela character_sheet
            result = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='character_sheet'")
            if result.fetchone():
                count = db.engine.execute("SELECT COUNT(*) FROM character_sheet").fetchone()[0]
                print(f"   - Tabela 'character_sheet': {count} registros")
            else:
                print("   - Tabela 'character_sheet': não existe")
            
            # Verificar tabela npc
            result = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='npc'")
            if result.fetchone():
                count = db.engine.execute("SELECT COUNT(*) FROM npc").fetchone()[0]
                print(f"   - Tabela 'npc': {count} registros")
            else:
                print("   - Tabela 'npc': não existe")
            
            # Verificar nova tabela character
            result = db.engine.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='character'")
            if result.fetchone():
                count = db.engine.execute("SELECT COUNT(*) FROM character").fetchone()[0]
                print(f"   - Tabela 'character': {count} registros")
            else:
                print("   - Tabela 'character': não existe")
                
        except Exception as e:
            print(f"❌ Erro ao verificar dados: {e}")

if __name__ == '__main__':
    print("🔄 Script de Criação da Tabela Character - MesaRPG")
    print("=" * 50)
    
    # Verificar dados existentes
    check_existing_data()
    
    # Criar nova tabela
    create_character_table()
    
    # Verificar novamente
    check_existing_data()
    
    print("\n🎉 Processo finalizado!")
    print("\n💡 Próximos passos:")
    print("   1. Teste o novo sistema criando alguns personagens")
    print("   2. Se tudo estiver funcionando, você pode remover as tabelas antigas manualmente")
    print("   3. Atualize os templates que ainda referenciam as rotas antigas") 