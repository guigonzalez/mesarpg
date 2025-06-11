# Sistema Administrativo - MesaRPG

## Visão Geral

O sistema administrativo permite gerenciar dinamicamente os sistemas de RPG, tipos de personagem, categorias e campos, substituindo a configuração hardcoded anterior. Isso torna o sistema muito mais flexível e permite personalização completa.

## Funcionalidades

### 🎯 Dashboard Administrativo
- **Estatísticas**: Contadores de sistemas, tipos, categorias e campos
- **Ações Rápidas**: Links para criar sistemas e gerenciar configurações
- **Sistemas Recentes**: Lista dos últimos sistemas criados
- **Navegação Intuitiva**: Breadcrumbs e botões de navegação

### 🎲 Gerenciamento de Sistemas
- **CRUD Completo**: Criar, visualizar, editar e deletar sistemas
- **Validação**: Verificação de nomes únicos e campos obrigatórios
- **Status**: Ativar/desativar sistemas
- **Tipos Padrão**: Criação automática de tipos de personagem básicos

### 👥 Tipos de Personagem
- **Flexibilidade**: Tipos personalizáveis por sistema
- **Ordenação**: Controle da ordem de exibição
- **Status**: Ativar/desativar tipos específicos
- **Categorias**: Organização hierárquica

### 📋 Categorias
- **Organização**: Agrupamento lógico de campos
- **Ordenação**: Controle da ordem de exibição
- **Status**: Ativar/desativar categorias

### 📝 Campos de Personagem
- **Tipos de Campo**:
  - `texto`: Campos de texto simples
  - `numérico`: Campos numéricos
  - `lista_texto`: Listas de texto (perícias, equipamentos, etc.)
  - `grupo`: Grupos de campos (atributos, etc.)
- **Validação**: Campos obrigatórios e regras de validação
- **Subcampos**: Para campos do tipo grupo
- **Ordenação**: Controle da ordem de exibição

## Acesso ao Sistema

### Requisitos
- Usuário com role `admin` ou `master`
- Login na aplicação

### Navegação
1. Faça login na aplicação
2. Clique no menu do usuário (canto superior direito)
3. Selecione "Painel Administrativo"
4. Ou acesse diretamente: `/admin`

## Estrutura do Banco de Dados

### Modelos Principais

#### System
```python
- id: Chave primária
- name: Nome único do sistema
- description: Descrição opcional
- is_active: Status ativo/inativo
- created_at/updated_at: Timestamps
```

#### CharacterType
```python
- id: Chave primária
- system_id: Referência ao sistema
- name: Nome interno (player, npc, creature)
- display_name: Nome de exibição
- description: Descrição opcional
- is_active: Status ativo/inativo
- sort_order: Ordem de exibição
```

#### CharacterCategory
```python
- id: Chave primária
- character_type_id: Referência ao tipo
- name: Nome da categoria
- description: Descrição opcional
- is_active: Status ativo/inativo
- sort_order: Ordem de exibição
```

#### CharacterField
```python
- id: Chave primária
- category_id: Referência à categoria
- name: Nome do campo
- field_type: Tipo (texto, numérico, lista_texto, grupo)
- description: Descrição opcional
- placeholder: Placeholder do campo
- default_value: Valor padrão
- is_required: Campo obrigatório
- is_active: Status ativo/inativo
- sort_order: Ordem de exibição
- validation_rules: Regras de validação (JSON)
```

#### CharacterSubfield
```python
- id: Chave primária
- parent_field_id: Referência ao campo pai
- name: Nome do subcampo
- field_type: Tipo (texto, numérico)
- description: Descrição opcional
- placeholder: Placeholder do campo
- default_value: Valor padrão
- is_required: Campo obrigatório
- is_active: Status ativo/inativo
- sort_order: Ordem de exibição
```

## Scripts de Configuração

### Populate Systems
```bash
python populate_systems.py
```
Cria sistemas padrão (D&D 5e, Call of Cthulhu) com suas configurações completas.

### Create Admin
```bash
python create_admin.py
```
Cria um usuário administrador para acessar o painel.

## Fluxo de Trabalho Recomendado

### 1. Criar Sistema
1. Acesse o painel administrativo
2. Clique em "Novo Sistema"
3. Preencha nome e descrição
4. O sistema criará automaticamente os tipos básicos

### 2. Configurar Tipos de Personagem
1. Acesse "Gerenciar Tipos" do sistema
2. Edite os tipos existentes ou crie novos
3. Configure nomes de exibição e descrições

### 3. Criar Categorias
1. Acesse "Categorias" do tipo de personagem
2. Crie categorias para organizar os campos
3. Exemplo: "Informações Básicas", "Atributos", "Combate"

### 4. Definir Campos
1. Acesse "Campos" da categoria
2. Crie campos específicos do sistema
3. Configure tipos, validações e subcampos

### 5. Testar
1. Crie personagens para testar os campos
2. Ajuste configurações conforme necessário

## Vantagens do Sistema Dinâmico

### ✅ Flexibilidade
- Adicionar novos sistemas sem modificar código
- Personalizar campos por sistema
- Configurar validações específicas

### ✅ Manutenibilidade
- Sem código hardcoded
- Fácil atualização de configurações
- Interface administrativa intuitiva

### ✅ Escalabilidade
- Suporte a múltiplos sistemas
- Estrutura hierárquica organizada
- Performance otimizada

### ✅ Usabilidade
- Interface administrativa moderna
- Validações em tempo real
- Feedback visual claro

## Próximas Funcionalidades

### 🚀 Planejadas
- **Import/Export**: Backup e restauração de configurações
- **Templates**: Templates pré-configurados para sistemas populares
- **Validações Avançadas**: Regras de validação mais complexas
- **Histórico**: Log de alterações nas configurações
- **Permissões Granulares**: Controle de acesso por funcionalidade

### 🔧 Melhorias Técnicas
- **Cache**: Cache de configurações para performance
- **API**: Endpoints para integração externa
- **Auditoria**: Log detalhado de alterações
- **Backup Automático**: Backup automático das configurações

## Troubleshooting

### Problema: Sistema não aparece na criação de personagem
**Solução**: Verifique se o sistema está ativo (`is_active = True`)

### Problema: Campos não aparecem
**Solução**: Verifique se a categoria e os campos estão ativos

### Problema: Erro de validação
**Solução**: Verifique as regras de validação do campo

### Problema: Acesso negado
**Solução**: Verifique se o usuário tem role `admin` ou `master`

## Suporte

Para dúvidas ou problemas:
1. Verifique os logs da aplicação
2. Consulte a documentação
3. Entre em contato com o administrador do sistema

---

**Desenvolvido para MesaRPG** 🎲
*Plataforma Brasileira de RPG* 