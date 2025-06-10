# Documento de Requisitos do Produto (PRD) – MVP da Plataforma MesaRPG

## Visão Geral

O presente documento descreve a versão mínima viável (MVP) da plataforma **MesaRPG**, uma solução web voltada à comunidade brasileira de jogadores de RPG. O objetivo principal é permitir que jogadores e mestres encontrem e realizem sessões de RPG em tempo real com ferramentas simples e acessíveis, valorizando a experiência social e a construção de comunidade.

A plataforma será lançada com suporte a múltiplos sistemas de RPG, priorizando D&D 5e e Tormenta20, e oferecerá uma monetização leve para Mestres via modelo de assinatura mensal.

---

## Objetivos do MVP

1. **Jogo ao Vivo Simplificado:** Permitir que grupos joguem sessões online com chat, rolagem de dados e um grid interativo para posicionamento e organização visual.
2. **Descoberta de Sessões:** Criar uma interface intuitiva para que jogadores possam encontrar e se candidatar a mesas compatíveis com seu estilo e disponibilidade.
3. **Cadastro e Perfis:** Estrutura básica de usuários com perfis personalizados para jogadores e mestres.
4. **Monetização para Mestres:** Implementação de um modelo freemium com assinatura mensal (R$9,90) para mestres criarem e gerenciarem sessões ilimitadas.
5. **Comunidade Inicial:** Estimular a formação de comunidade com recursos sociais iniciais, como avaliações básicas e preferências por sistema.

---

## Funcionalidades do MVP

### 1. Landing Page e Autenticação
- Página inicial com resumo da proposta de valor
- Botões de login e registro com e-mail ou conta Google
- Explicação clara dos planos disponíveis (Jogador gratuito / Mestre pago)
- Interface responsiva com identidade visual temática (fantasia medieval)

### 2. Listagem de Sessões
- Página de sessões públicas disponíveis
- Cards com título, sistema, estilo de jogo, vagas e horário
- Filtros por sistema, experiência do jogador (iniciante, veterano), estilo (roleplay, combate), tags e agenda
- Botão de candidatura rápida para jogadores

### 3. Criação de Sessões
- Formulário para Mestres criarem novas sessões com os seguintes campos:
  - Título da campanha
  - Sistema utilizado (ex: D&D 5e, Tormenta20)
  - Descrição e tom da mesa
  - Quantidade de vagas
  - Status (one-shot ou recorrente)
  - Ferramenta preferida para voz/vídeo (Discord, Zoom, plataforma própria)
- Possibilidade de sessões públicas ou privadas

### 4. Perfis de Usuário
- Perfis com papel definido (Jogador ou Mestre)
- Preferências por sistemas
- Histórico de sessões participadas ou conduzidas
- Campos de bio e avatar
- Avaliações básicas de outros usuários

### 5. Sessão ao Vivo (Interface Realtime)
- Ambiente para conduzir sessões dentro da plataforma com:
  - **Chat em tempo real** com suporte a comandos de dados (/d20, /d100, etc.)
  - **Rolador de dados personalizado**
  - **Grid interativo simples**, com visualização de posicionamento básico (mapa quadrado com ícones ou marcadores)
  - Bloco de notas compartilhado
  - Upload de fichas em PDF
  - Campo para link externo de comunicação por voz/vídeo (ex: Discord)

### 6. Área Exclusiva para Mestres (Freemium)
- Painel do Mestre com:
  - Lista de sessões criadas
  - Gerenciamento de candidatos
  - Acesso ao painel de assinatura e pagamento
- Gate de assinatura mensal via Stripe ou integração local (ex: Pix/PicPay)

---

## Funcionalidades Planejadas para Pós-MVP

### P1 – Curto Prazo (Fase Beta)
- Sistema de avaliação detalhado (jogadores e mestres)
- Integração com calendários externos
- Notificações por e-mail e in-app
- Diário de campanha colaborativo simples (formato texto)

### P2 – Médio Prazo (Pós-lançamento)
- Modo espectador para sessões abertas
- Matchmaking inteligente com base em preferências
- Biblioteca de recursos (tokens, mapas, NPCs)
- Aplicativo móvel (WebView ou nativo)
- Integração com APIs de VTTs externos (Roll20, Foundry, etc.)

---

## Sistemas Suportados no Lançamento

- Dungeons & Dragons 5ª Edição (D&D 5e)
- Tormenta20
- Chamado de Cthulhu (opcional)
- Sistema genérico (“Outro”) para inclusão ampla

---

## Métricas de Sucesso do MVP

- Número de sessões criadas por semana
- Taxa de preenchimento de vagas por sessão
- Tempo médio gasto em sessões ativas
- Conversão de mestres para plano pago
- Retenção de usuários (30, 60, 90 dias)

---

## Stack Recomendada

- **Frontend:** HTML, CSS e JS
- **Backend:** Python
- **Banco de Dados:** PostgreeSQL
- **Realtime:** WebSockets nativos (ou uso de serviço como Ably, se necessário)
- **Hospedagem:** Railway

---

## Roadmap de Lançamento

### Fase Alpha (2 meses)
- Desenvolvimento de todas funcionalidades do MVP
- Testes internos com grupo reduzido
- Correções críticas de bugs

### Fase Beta (3 meses)
- Liberação para comunidade limitada
- Coleta e implementação de feedback
- Início do desenvolvimento de funcionalidades P1

### Lançamento Público (1 mês)
- Campanha de divulgação com criadores de conteúdo
- Parcerias com canais de RPG nacionais
- Programa de indicação com bônus para usuários ativos

---

## Considerações Finais

O MVP da MesaRPG busca validar, com um esforço técnico reduzido, três hipóteses principais:
1. Existe demanda recorrente por uma plataforma brasileira de sessões em tempo real com jogabilidade simplificada.
2. Mestres estão dispostos a pagar um valor acessível por ferramentas e visibilidade para monetizar suas campanhas.
3. Uma comunidade engajada se forma quando há boa curadoria e recursos leves que favoreçam a narrativa e o vínculo social, em vez da automação pesada.

Este MVP será o primeiro passo para expandir a MesaRPG como uma solução completa para a experiência de RPG online no Brasil.

