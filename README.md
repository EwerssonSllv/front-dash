# 🔗 Backend

```md
🔗 Backend: https://github.com/EwerssonSllv/dashlyze
```


# 🚀 Dashlyze

**Dashlyze** é um SaaS moderno para gestão de vendas, clientes, produtos e métricas financeiras.
Projetado com foco em **performance, escalabilidade e experiência do usuário**, o sistema oferece uma arquitetura robusta semelhante a aplicações reais de mercado.

---

# 🧠 Visão Geral

O Dashlyze permite que pequenos e médios empreendedores:

* Gerenciem produtos e estoque
* Cadastrem e analisem clientes
* Registrem vendas e acompanhem status
* Visualizem métricas avançadas
* Automatizem processos financeiros

---

# 🏗️ Arquitetura do Projeto

O frontend foi construído com **Next.js (App Router)** utilizando uma arquitetura desacoplada e escalável:

```
/app            → páginas (App Router)
/components     → UI e componentes reutilizáveis
/services       → regras de negócio e comunicação com API
/lib            → http, helpers e configurações
/hooks          → hooks customizados
/api/proxy      → gateway interno (proxy)
/middleware     → proteção de rotas
```

---

# 🔐 Autenticação e Segurança

## ✔️ Estratégia

* Autenticação baseada em **cookies HTTP-only**
* Refresh token automático
* Proteção de rotas via middleware

## 🔒 Middleware

Rotas protegidas:

* `/dashboard`
* `/products`
* `/sales`
* `/clients`
* `/analytics`
* `/settings`

Fluxo:

1. Intercepta requisição
2. Verifica cookie `refresh_token`
3. Se não existir → redireciona para `/login`
4. Se existir → permite acesso

---

# 🌐 API Gateway (Proxy Interno)

Local: `/api/proxy/route.ts`

Funciona como um intermediário entre frontend e backend:

### Responsabilidades:

* Encaminhar requisições para o backend
* Preservar cookies e headers
* Evitar problemas de CORS
* Ocultar URL real da API

### Benefícios:

* Segurança
* Centralização de autenticação
* Melhor controle de requisições

---

# 🔁 Camada HTTP (Axios)

## `http.ts`

Cliente principal da aplicação:

```ts
baseURL: "/api/proxy"
withCredentials: true
```

### 🔄 Refresh Token Automático

Fluxo:

1. Requisição retorna 401
2. Interceptor executa `/auth/refresh`
3. Reexecuta requisição original

### 🧠 Sistema de fila

* Evita múltiplos refresh simultâneos
* Requisições aguardam enquanto o token é renovado

---

# 📡 Gerenciamento de Dados (SWR)

## Configuração global

* Sem revalidação ao focar
* Sem retry automático

## Fetcher padrão

```ts
const response = await http.get(url)
return response.data
```

---

# 🔑 Services Layer

Toda comunicação com backend é centralizada nos services:

---

## 🔐 Auth Service

* Login
* Registro
* Logout
* Obter usuário atual

---

## 👥 Client Service

* CRUD de clientes
* Estatísticas:

  * Top compradores
  * Devedores
  * Canceladores
  * Pagadores rápidos

---

## 📦 Product Service

* Criar produto
* Atualizar
* Soft delete
* Restaurar
* Produtos mais vendidos

---

## 💰 Sale Service

* Criar venda
* Buscar por status:

  * Pendentes
  * Pagas
  * Canceladas
  * Devolvidas
* Marcar como paga
* Cancelar venda
* Registrar devolução

---

## 💳 Stripe Service

* Geração de checkout de pagamento

---

# 📊 Páginas do Sistema

---

## 📈 Dashboard

* Visão geral de métricas
* Indicadores financeiros
* Resumo de vendas

---

## 📦 Produtos

* CRUD completo
* Controle de estoque
* Filtros e busca

---

## 👥 Clientes

* Listagem
* Detalhes
* Histórico de compras
* Estatísticas comportamentais

---

## 💰 Vendas

### Funcionalidades:

* Organização por abas:

  * Pendentes
  * Pagas
  * Canceladas
  * Devolvidas

* Ações rápidas:

  * Marcar como pago
  * Cancelar
  * Registrar devolução

* Tooltip inteligente:

  * Exibe itens da venda ao passar o mouse

* UX otimizada:

  * Skeleton loading
  * Feedback com toast

---

## ⚙️ Configurações

### Seções:

#### 👤 Perfil

* Nome e email (somente leitura)

#### 🔔 Notificações

* Email
* Alertas de estoque
* Relatórios semanais

#### 🔒 Segurança

* Logout com estado de loading

---

## 🌐 Landing Page

Composição:

* Navbar
* Hero Section
* Benefícios
* Analytics
* Segurança
* Pricing
* Footer

---

# 🧠 Tipagem (TypeScript)

Tipos principais:

* `Product`
* `Client`
* `Sale`
* `SaleItem`
* `SaleStatus`
* Estatísticas diversas

Benefícios:

* Segurança
* Autocomplete
* Redução de bugs

---

# 🧰 Utilitários

## format.ts

* Formatação de moeda
* Labels de status
* Cores dinâmicas

## utils.ts

* Helper para classes CSS (`cn`)

---

# 📱 Hooks Customizados

* `useAuth` → usuário autenticado
* `useToast` → sistema de notificações
* `useIsMobile` → responsividade

---

# 🔄 Fluxo de Requisição

```
Component → Service → Axios
         → Proxy (/api/proxy)
         → Backend
         → Response → UI
```

---

# ⚙️ Variáveis de Ambiente

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

# ▶️ Como Rodar o Projeto

```bash
npm install
npm run dev
```

---

# 🔥 Diferenciais Técnicos

* Arquitetura escalável
* Proxy interno (nível produção)
* Refresh token automático
* Separação clara de responsabilidades
* Tipagem forte com TypeScript
* Integração com Stripe
* UX refinada (skeleton, toast, feedback visual)
* Cache inteligente com SWR

---

# 🚀 Possíveis Melhorias Futuras

* Endpoint único para analytics (reduzir múltiplas requisições)
* Cache mais avançado com SWR
* Error boundaries globais
* Prefetch de rotas
* Melhor tratamento de estados vazios
* Sistema de permissões (roles)

---

# 🧠 Conclusão

O Dashlyze não é apenas um projeto de estudo — é uma aplicação estruturada com padrões reais de mercado.

A arquitetura, organização e decisões técnicas refletem um sistema preparado para:

* Escalar
* Evoluir
* Ser utilizado em produção

---

# Autor

Desenvolvido por **Ewersson**

---
