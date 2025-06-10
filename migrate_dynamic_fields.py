#!/usr/bin/env python3
"""
Script de migração para adicionar a coluna dynamic_fields à tabela character
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mesarpg_app import create_app, db
from mesarpg_app.models import Character
from sqlalchemy import text

def migrate_dynamic_fields():
    """Adiciona a coluna dynamic_fields à tabela character"""
    app = create_app()
    
    with app.app_context():
        try:
            # Verificar se a coluna já existe
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('character')]
            
            if 'dynamic_fields' in columns:
                print("✅ Coluna 'dynamic_fields' já existe na tabela 'character'")
                return
            
            # Adicionar a coluna
            with db.engine.connect() as conn:
                conn.execute(text('ALTER TABLE character ADD COLUMN dynamic_fields TEXT'))
                conn.commit()
            
            print("✅ Coluna 'dynamic_fields' adicionada com sucesso!")
            
            # Verificar se há dados existentes
            characters = Character.query.all()
            print(f"📊 Encontrados {len(characters)} personagens no banco de dados")
            
        except Exception as e:
            print(f"❌ Erro durante a migração: {e}")
            raise

if __name__ == '__main__':
    print("🔄 Iniciando migração para adicionar coluna dynamic_fields...")
    migrate_dynamic_fields()
    print("✅ Migração concluída!") 