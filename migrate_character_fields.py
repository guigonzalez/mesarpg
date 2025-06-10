#!/usr/bin/env python3
"""
Script de migração para adicionar os campos skills e languages à tabela character
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mesarpg_app import create_app, db
from mesarpg_app.models import Character
from sqlalchemy import text

def migrate_character_fields():
    """Adiciona os campos skills e languages à tabela character"""
    app = create_app()
    
    with app.app_context():
        try:
            # Verificar se as colunas já existem
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('character')]
            
            with db.engine.connect() as conn:
                # Adicionar campo skills se não existir
                if 'skills' not in columns:
                    conn.execute(text('ALTER TABLE character ADD COLUMN skills TEXT'))
                    print("✅ Coluna 'skills' adicionada com sucesso!")
                else:
                    print("✅ Coluna 'skills' já existe na tabela 'character'")
                
                # Adicionar campo languages se não existir
                if 'languages' not in columns:
                    conn.execute(text('ALTER TABLE character ADD COLUMN languages TEXT'))
                    print("✅ Coluna 'languages' adicionada com sucesso!")
                else:
                    print("✅ Coluna 'languages' já existe na tabela 'character'")
                
                conn.commit()
            
            # Verificar se há dados existentes
            characters = Character.query.all()
            print(f"📊 Encontrados {len(characters)} personagens no banco de dados")
            
            # Migrar dados dos campos dinâmicos para os novos campos padrão
            migrated_count = 0
            for character in characters:
                dynamic_fields = character.get_dynamic_fields()
                updated = False
                
                # Migrar skills se existir nos campos dinâmicos
                if 'skills' in dynamic_fields and dynamic_fields['skills'] and not character.skills:
                    character.skills = dynamic_fields['skills']
                    updated = True
                    print(f"📝 Migrando skills para personagem {character.name}: {dynamic_fields['skills'][:50]}...")
                
                # Migrar languages se existir nos campos dinâmicos
                if 'languages' in dynamic_fields and dynamic_fields['languages'] and not character.languages:
                    character.languages = dynamic_fields['languages']
                    updated = True
                    print(f"📝 Migrando languages para personagem {character.name}: {dynamic_fields['languages'][:50]}...")
                
                if updated:
                    migrated_count += 1
            
            if migrated_count > 0:
                db.session.commit()
                print(f"✅ {migrated_count} personagens foram migrados com sucesso!")
            else:
                print("ℹ️  Nenhum personagem precisou ser migrado")
            
        except Exception as e:
            print(f"❌ Erro durante a migração: {e}")
            raise

if __name__ == "__main__":
    print("🚀 Iniciando migração dos campos skills e languages...")
    migrate_character_fields()
    print("✅ Migração concluída!") 