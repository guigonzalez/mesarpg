#!/usr/bin/env python3
"""
Script de Setup para Produção - MesaRPG
Cria usuário admin e sistemas padrão automaticamente.
"""

import os
import sys
from datetime import datetime

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from mesarpg_app import create_app, db
from mesarpg_app.models import User, System, CharacterType, CharacterCategory, CharacterField

def create_admin_user():
    """Cria usuário admin se não existir"""
    print("Verificando usuário admin...")
    
    # Verificar se já existe um admin
    admin = User.query.filter_by(role='admin').first()
    if admin:
        print(f"Usuário admin já existe: {admin.username}")
        return admin
    
    # Obter credenciais das variáveis de ambiente
    admin_username = os.getenv('ADMIN_USERNAME', 'admin')
    admin_email = os.getenv('ADMIN_EMAIL', 'admin@mesarpg.com')
    admin_password = os.getenv('ADMIN_PASSWORD', 'admin123')
    
    print(f"Criando usuário admin: {admin_username}")
    
    # Criar usuário admin
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
    
    print(f"Usuário admin criado com sucesso!")
    print(f"Username: {admin_username}")
    print(f"Email: {admin_email}")
    print(f"Password: {admin_password}")
    
    return admin

def create_default_systems():
    """Cria sistemas padrão se não existirem"""
    print("Verificando sistemas padrão...")
    
    # D&D 5e
    dnd_system = System.query.filter_by(name='dnd5e').first()
    if not dnd_system:
        print("Criando sistema D&D 5e...")
        dnd_system = System(
            name='dnd5e',
            display_name='Dungeons & Dragons 5ª Edição',
            description='Sistema de RPG de fantasia medieval da Wizards of the Coast',
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.session.add(dnd_system)
        db.session.flush()  # Para obter o ID
        
        # Tipos de personagem para D&D 5e
        player_type = CharacterType(
            system_id=dnd_system.id,
            name='player',
            display_name='Jogador',
            description='Personagem controlado por um jogador',
            sort_order=1,
            is_active=True
        )
        db.session.add(player_type)
        db.session.flush()
        
        # Categorias para personagem jogador
        basic_info = CharacterCategory(
            character_type_id=player_type.id,
            name='basic_info',
            display_name='Informações Básicas',
            description='Informações básicas do personagem',
            sort_order=1,
            is_active=True
        )
        db.session.add(basic_info)
        db.session.flush()
        
        # Campos básicos
        fields_data = [
            ('name', 'Nome', 'texto', 'Nome do personagem', True, 1),
            ('race', 'Raça', 'texto', 'Raça do personagem', True, 2),
            ('class', 'Classe', 'texto', 'Classe do personagem', True, 3),
            ('level', 'Nível', 'numérico', 'Nível do personagem', True, 4),
            ('background', 'Antecedente', 'texto', 'Antecedente do personagem', False, 5),
            ('alignment', 'Tendência', 'texto', 'Tendência do personagem', False, 6),
        ]
        
        for name, display_name, field_type, description, required, order in fields_data:
            field = CharacterField(
                category_id=basic_info.id,
                name=name,
                display_name=display_name,
                field_type=field_type,
                description=description,
                is_required=required,
                sort_order=order,
                is_active=True
            )
            db.session.add(field)
        
        # Categoria de Atributos
        attributes = CharacterCategory(
            character_type_id=player_type.id,
            name='attributes',
            display_name='Atributos',
            description='Atributos do personagem',
            sort_order=2,
            is_active=True
        )
        db.session.add(attributes)
        db.session.flush()
        
        # Campos de atributos
        attr_fields = [
            ('strength', 'Força', 'numérico', 'Força do personagem', True, 1),
            ('dexterity', 'Destreza', 'numérico', 'Destreza do personagem', True, 2),
            ('constitution', 'Constituição', 'numérico', 'Constituição do personagem', True, 3),
            ('intelligence', 'Inteligência', 'numérico', 'Inteligência do personagem', True, 4),
            ('wisdom', 'Sabedoria', 'numérico', 'Sabedoria do personagem', True, 5),
            ('charisma', 'Carisma', 'numérico', 'Carisma do personagem', True, 6),
        ]
        
        for name, display_name, field_type, description, required, order in attr_fields:
            field = CharacterField(
                category_id=attributes.id,
                name=name,
                display_name=display_name,
                field_type=field_type,
                description=description,
                is_required=required,
                sort_order=order,
                is_active=True,
                validation_rules='{"min": 1, "max": 20}'
            )
            db.session.add(field)
        
        print("Sistema D&D 5e criado com sucesso!")
    
    # Call of Cthulhu
    coc_system = System.query.filter_by(name='coc').first()
    if not coc_system:
        print("Criando sistema Call of Cthulhu...")
        coc_system = System(
            name='coc',
            display_name='Call of Cthulhu',
            description='Sistema de RPG de horror cósmico da Chaosium',
            is_active=True,
            created_at=datetime.utcnow()
        )
        db.session.add(coc_system)
        db.session.flush()
        
        # Tipos de personagem para CoC
        investigator_type = CharacterType(
            system_id=coc_system.id,
            name='investigator',
            display_name='Investigador',
            description='Personagem investigador em Call of Cthulhu',
            sort_order=1,
            is_active=True
        )
        db.session.add(investigator_type)
        db.session.flush()
        
        # Categorias para investigador
        coc_basic = CharacterCategory(
            character_type_id=investigator_type.id,
            name='basic_info',
            display_name='Informações Básicas',
            description='Informações básicas do investigador',
            sort_order=1,
            is_active=True
        )
        db.session.add(coc_basic)
        db.session.flush()
        
        # Campos básicos para CoC
        coc_fields = [
            ('name', 'Nome', 'texto', 'Nome do investigador', True, 1),
            ('occupation', 'Profissão', 'texto', 'Profissão do investigador', True, 2),
            ('age', 'Idade', 'numérico', 'Idade do investigador', True, 3),
            ('sex', 'Sexo', 'texto', 'Sexo do investigador', False, 4),
            ('residence', 'Residência', 'texto', 'Local de residência', False, 5),
            ('birthplace', 'Local de Nascimento', 'texto', 'Local de nascimento', False, 6),
        ]
        
        for name, display_name, field_type, description, required, order in coc_fields:
            field = CharacterField(
                category_id=coc_basic.id,
                name=name,
                display_name=display_name,
                field_type=field_type,
                description=description,
                is_required=required,
                sort_order=order,
                is_active=True
            )
            db.session.add(field)
        
        # Categoria de Atributos CoC
        coc_attributes = CharacterCategory(
            character_type_id=investigator_type.id,
            name='attributes',
            display_name='Atributos',
            description='Atributos do investigador',
            sort_order=2,
            is_active=True
        )
        db.session.add(coc_attributes)
        db.session.flush()
        
        # Campos de atributos CoC
        coc_attr_fields = [
            ('strength', 'Força', 'numérico', 'Força do investigador', True, 1),
            ('constitution', 'Constituição', 'numérico', 'Constituição do investigador', True, 2),
            ('power', 'Poder', 'numérico', 'Poder do investigador', True, 3),
            ('dexterity', 'Destreza', 'numérico', 'Destreza do investigador', True, 4),
            ('appearance', 'Aparência', 'numérico', 'Aparência do investigador', True, 5),
            ('education', 'Educação', 'numérico', 'Educação do investigador', True, 6),
            ('size', 'Tamanho', 'numérico', 'Tamanho do investigador', True, 7),
            ('intelligence', 'Inteligência', 'numérico', 'Inteligência do investigador', True, 8),
        ]
        
        for name, display_name, field_type, description, required, order in coc_attr_fields:
            field = CharacterField(
                category_id=coc_attributes.id,
                name=name,
                display_name=display_name,
                field_type=field_type,
                description=description,
                is_required=required,
                sort_order=order,
                is_active=True,
                validation_rules='{"min": 1, "max": 100}'
            )
            db.session.add(field)
        
        print("Sistema Call of Cthulhu criado com sucesso!")
    
    db.session.commit()
    print("Todos os sistemas padrão foram criados!")

def main():
    """Função principal do script"""
    print("=== Setup de Produção - MesaRPG ===")
    print(f"Data/Hora: {datetime.now()}")
    print()
    
    try:
        # Criar aplicação Flask
        app = create_app()
        
        with app.app_context():
            # Criar tabelas se não existirem
            db.create_all()
            print("Banco de dados inicializado.")
            
            # Criar usuário admin
            admin = create_admin_user()
            
            # Criar sistemas padrão
            create_default_systems()
            
            print()
            print("=== Setup concluído com sucesso! ===")
            print("O sistema está pronto para uso.")
            
    except Exception as e:
        print(f"Erro durante o setup: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main() 