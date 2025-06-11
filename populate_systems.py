#!/usr/bin/env python3
"""
Script para popular o banco de dados com sistemas de RPG padrão
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from mesarpg_app import create_app, db
from mesarpg_app.models import System, CharacterType, CharacterCategory, CharacterField, CharacterSubfield

def create_default_systems():
    """Cria sistemas padrão com suas configurações"""
    
    # Sistema: D&D 5e
    dnd_system = System(
        name='D&D 5e',
        description='Dungeons & Dragons 5ª Edição - Sistema de fantasia medieval com classes, raças e magia'
    )
    db.session.add(dnd_system)
    db.session.flush()  # Para obter o ID
    
    # Tipos de personagem para D&D 5e
    dnd_player = CharacterType(
        system_id=dnd_system.id,
        name='player',
        display_name='Personagem do Jogador',
        sort_order=1
    )
    db.session.add(dnd_player)
    
    dnd_npc = CharacterType(
        system_id=dnd_system.id,
        name='npc',
        display_name='NPC',
        sort_order=2
    )
    db.session.add(dnd_npc)
    
    dnd_creature = CharacterType(
        system_id=dnd_system.id,
        name='creature',
        display_name='Monstro',
        sort_order=3
    )
    db.session.add(dnd_creature)
    
    db.session.flush()
    
    # Categorias para Personagem do Jogador (D&D 5e)
    dnd_player_category = CharacterCategory(
        character_type_id=dnd_player.id,
        name='Personagem',
        sort_order=1
    )
    db.session.add(dnd_player_category)
    
    # Categorias para NPC (D&D 5e)
    dnd_npc_category = CharacterCategory(
        character_type_id=dnd_npc.id,
        name='NPC',
        sort_order=1
    )
    db.session.add(dnd_npc_category)
    
    dnd_monster_category = CharacterCategory(
        character_type_id=dnd_creature.id,
        name='Monstro',
        sort_order=2
    )
    db.session.add(dnd_monster_category)
    
    db.session.flush()
    
    # Campos para Personagem do Jogador (D&D 5e)
    dnd_player_fields = [
        {'name': 'Nome', 'field_type': 'texto', 'sort_order': 1, 'is_required': True},
        {'name': 'Raça', 'field_type': 'texto', 'sort_order': 2, 'is_required': True},
        {'name': 'Classe', 'field_type': 'texto', 'sort_order': 3, 'is_required': True},
        {'name': 'Nível', 'field_type': 'numérico', 'sort_order': 4, 'is_required': True},
        {'name': 'Atributos', 'field_type': 'grupo', 'sort_order': 5, 'is_required': True},
        {'name': 'PV', 'field_type': 'numérico', 'sort_order': 6, 'is_required': True},
        {'name': 'CA', 'field_type': 'numérico', 'sort_order': 7, 'is_required': True},
        {'name': 'Iniciativa', 'field_type': 'numérico', 'sort_order': 8},
        {'name': 'Deslocamento', 'field_type': 'numérico', 'sort_order': 9},
        {'name': 'Perícias', 'field_type': 'lista_texto', 'sort_order': 10},
        {'name': 'Magias', 'field_type': 'lista_texto', 'sort_order': 11},
        {'name': 'Equipamentos', 'field_type': 'lista_texto', 'sort_order': 12},
        {'name': 'Idiomas', 'field_type': 'lista_texto', 'sort_order': 13},
        {'name': 'Alinhamento', 'field_type': 'texto', 'sort_order': 14},
        {'name': 'Antecedente', 'field_type': 'texto', 'sort_order': 15},
        {'name': 'História', 'field_type': 'texto', 'sort_order': 16}
    ]
    
    for field_data in dnd_player_fields:
        field = CharacterField(
            category_id=dnd_player_category.id,
            **field_data
        )
        db.session.add(field)
        db.session.flush()
        
        # Se for campo de grupo (atributos), criar subcampos
        if field_data['name'] == 'Atributos':
            subfields = [
                {'name': 'Força', 'field_type': 'numérico', 'sort_order': 1},
                {'name': 'Destreza', 'field_type': 'numérico', 'sort_order': 2},
                {'name': 'Constituição', 'field_type': 'numérico', 'sort_order': 3},
                {'name': 'Inteligência', 'field_type': 'numérico', 'sort_order': 4},
                {'name': 'Sabedoria', 'field_type': 'numérico', 'sort_order': 5},
                {'name': 'Carisma', 'field_type': 'numérico', 'sort_order': 6}
            ]
            
            for subfield_data in subfields:
                subfield = CharacterSubfield(
                    parent_field_id=field.id,
                    **subfield_data
                )
                db.session.add(subfield)
    
    # Campos para NPC (D&D 5e)
    dnd_npc_fields = [
        {'name': 'Nome', 'field_type': 'texto', 'sort_order': 1, 'is_required': True},
        {'name': 'Raça / Classe', 'field_type': 'texto', 'sort_order': 2},
        {'name': 'Atributos principais', 'field_type': 'texto', 'sort_order': 3},
        {'name': 'PV', 'field_type': 'numérico', 'sort_order': 4},
        {'name': 'CA', 'field_type': 'numérico', 'sort_order': 5},
        {'name': 'Iniciativa', 'field_type': 'numérico', 'sort_order': 6},
        {'name': 'Perícias principais', 'field_type': 'lista_texto', 'sort_order': 7},
        {'name': 'Habilidades', 'field_type': 'lista_texto', 'sort_order': 8},
        {'name': 'Motivação', 'field_type': 'texto', 'sort_order': 9},
        {'name': 'Recompensa', 'field_type': 'texto', 'sort_order': 10}
    ]
    
    for field_data in dnd_npc_fields:
        field = CharacterField(
            category_id=dnd_npc_category.id,
            **field_data
        )
        db.session.add(field)
    
    # Campos para Monstro (D&D 5e)
    dnd_monster_fields = [
        {'name': 'Nome', 'field_type': 'texto', 'sort_order': 1, 'is_required': True},
        {'name': 'Tipo', 'field_type': 'texto', 'sort_order': 2},
        {'name': 'ND', 'field_type': 'numérico', 'sort_order': 3},
        {'name': 'PV', 'field_type': 'numérico', 'sort_order': 4},
        {'name': 'CA', 'field_type': 'numérico', 'sort_order': 5},
        {'name': 'Deslocamento', 'field_type': 'numérico', 'sort_order': 6},
        {'name': 'Atributos', 'field_type': 'grupo', 'sort_order': 7},
        {'name': 'Ataques', 'field_type': 'lista_texto', 'sort_order': 8},
        {'name': 'Sentidos', 'field_type': 'lista_texto', 'sort_order': 9},
        {'name': 'Resistências', 'field_type': 'lista_texto', 'sort_order': 10},
        {'name': 'Imunidades', 'field_type': 'lista_texto', 'sort_order': 11},
        {'name': 'Ações', 'field_type': 'lista_texto', 'sort_order': 12},
        {'name': 'Ambiente', 'field_type': 'texto', 'sort_order': 13}
    ]
    
    for field_data in dnd_monster_fields:
        field = CharacterField(
            category_id=dnd_monster_category.id,
            **field_data
        )
        db.session.add(field)
        db.session.flush()
        
        # Se for campo de grupo (atributos), criar subcampos
        if field_data['name'] == 'Atributos':
            subfields = [
                {'name': 'Força', 'field_type': 'numérico', 'sort_order': 1},
                {'name': 'Destreza', 'field_type': 'numérico', 'sort_order': 2},
                {'name': 'Constituição', 'field_type': 'numérico', 'sort_order': 3},
                {'name': 'Inteligência', 'field_type': 'numérico', 'sort_order': 4},
                {'name': 'Sabedoria', 'field_type': 'numérico', 'sort_order': 5},
                {'name': 'Carisma', 'field_type': 'numérico', 'sort_order': 6}
            ]
            
            for subfield_data in subfields:
                subfield = CharacterSubfield(
                    parent_field_id=field.id,
                    **subfield_data
                )
                db.session.add(subfield)
    
    # Sistema: Call of Cthulhu
    coc_system = System(
        name='Call of Cthulhu',
        description='Call of Cthulhu - Sistema de horror cósmico baseado nos mitos de Lovecraft'
    )
    db.session.add(coc_system)
    db.session.flush()
    
    # Tipos de personagem para Call of Cthulhu
    coc_player = CharacterType(
        system_id=coc_system.id,
        name='player',
        display_name='Personagem do Jogador',
        sort_order=1
    )
    db.session.add(coc_player)
    
    coc_npc = CharacterType(
        system_id=coc_system.id,
        name='npc',
        display_name='NPC',
        sort_order=2
    )
    db.session.add(coc_npc)
    
    coc_creature = CharacterType(
        system_id=coc_system.id,
        name='creature',
        display_name='Criatura',
        sort_order=3
    )
    db.session.add(coc_creature)
    
    db.session.flush()
    
    # Categorias para Call of Cthulhu
    coc_player_category = CharacterCategory(
        character_type_id=coc_player.id,
        name='Personagem',
        sort_order=1
    )
    db.session.add(coc_player_category)
    
    coc_npc_category = CharacterCategory(
        character_type_id=coc_npc.id,
        name='NPC',
        sort_order=1
    )
    db.session.add(coc_npc_category)
    
    coc_creature_category = CharacterCategory(
        character_type_id=coc_creature.id,
        name='Criatura',
        sort_order=2
    )
    db.session.add(coc_creature_category)
    
    db.session.flush()
    
    # Campos para Personagem do Jogador (Call of Cthulhu)
    coc_player_fields = [
        {'name': 'Nome', 'field_type': 'texto', 'sort_order': 1, 'is_required': True},
        {'name': 'Ocupação', 'field_type': 'texto', 'sort_order': 2, 'is_required': True},
        {'name': 'Sanidade', 'field_type': 'numérico', 'sort_order': 3, 'is_required': True},
        {'name': 'Pontos de Magia', 'field_type': 'numérico', 'sort_order': 4},
        {'name': 'PV', 'field_type': 'numérico', 'sort_order': 5, 'is_required': True},
        {'name': 'Perícias', 'field_type': 'lista_texto', 'sort_order': 6},
        {'name': 'História', 'field_type': 'texto', 'sort_order': 7},
        {'name': 'Eventos Traumáticos', 'field_type': 'lista_texto', 'sort_order': 8}
    ]
    
    for field_data in coc_player_fields:
        field = CharacterField(
            category_id=coc_player_category.id,
            **field_data
        )
        db.session.add(field)
    
    # Campos para NPC (Call of Cthulhu)
    coc_npc_fields = [
        {'name': 'Nome', 'field_type': 'texto', 'sort_order': 1, 'is_required': True},
        {'name': 'Ocupação', 'field_type': 'texto', 'sort_order': 2},
        {'name': 'Sanidade', 'field_type': 'numérico', 'sort_order': 3},
        {'name': 'PV', 'field_type': 'numérico', 'sort_order': 4},
        {'name': 'PM', 'field_type': 'numérico', 'sort_order': 5},
        {'name': 'Perícias', 'field_type': 'lista_texto', 'sort_order': 6},
        {'name': 'Motivação', 'field_type': 'texto', 'sort_order': 7},
        {'name': 'Estado Mental', 'field_type': 'texto', 'sort_order': 8}
    ]
    
    for field_data in coc_npc_fields:
        field = CharacterField(
            category_id=coc_npc_category.id,
            **field_data
        )
        db.session.add(field)
    
    # Campos para Criatura (Call of Cthulhu)
    coc_creature_fields = [
        {'name': 'Nome', 'field_type': 'texto', 'sort_order': 1, 'is_required': True},
        {'name': 'PV', 'field_type': 'numérico', 'sort_order': 2},
        {'name': 'Defesa', 'field_type': 'numérico', 'sort_order': 3},
        {'name': 'Ações', 'field_type': 'lista_texto', 'sort_order': 4},
        {'name': 'Efeitos Psicológicos', 'field_type': 'lista_texto', 'sort_order': 5},
        {'name': 'Sentidos', 'field_type': 'lista_texto', 'sort_order': 6},
        {'name': 'Conhecimento Mítico', 'field_type': 'numérico', 'sort_order': 7}
    ]
    
    for field_data in coc_creature_fields:
        field = CharacterField(
            category_id=coc_creature_category.id,
            **field_data
        )
        db.session.add(field)
    
    try:
        db.session.commit()
        print("✅ Sistemas padrão criados com sucesso!")
        print("📋 Sistemas criados:")
        print("   - D&D 5e")
        print("   - Call of Cthulhu")
        print("\n🎯 Próximos passos:")
        print("   1. Acesse /admin para gerenciar os sistemas")
        print("   2. Crie personagens para testar os campos")
        print("   3. Personalize os campos conforme necessário")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Erro ao criar sistemas: {str(e)}")
        raise

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        # Verificar se já existem sistemas
        existing_systems = System.query.count()
        if existing_systems > 0:
            print(f"⚠️  Já existem {existing_systems} sistema(s) no banco de dados.")
            response = input("Deseja continuar e adicionar os sistemas padrão? (s/N): ")
            if response.lower() != 's':
                print("Operação cancelada.")
                exit()
        
        create_default_systems() 