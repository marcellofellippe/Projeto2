# 🚀 Projeto: Catálogo Online de Café - Coffeespresso

## 📋 Visão Geral

Este projeto consiste em transformar uma página estática de catálogo de café em uma aplicação interativa, implementando funcionalidades de carrinho de compras e listagem dinâmica de produtos usando JavaScript puro.

## 🎯 Objetivos

- ✅ Listar produtos dinamicamente na página Home
- ✅ Implementar funcionalidade completa de carrinho de compras
- ✅ Adicionar interatividade aos controles de quantidade
- ✅ Manipular DOM para criar uma experiência de usuário fluida

## 🚀 Como Começar

### Pré-requisitos
- Git instalado
- Editor de código (VS Code recomendado)
- Navegador web moderno

### Passos para Setup
1. **Fork** este repositório
2. **Clone** para sua máquina local:
   ```bash
   git clone [URL_DO_SEU_FORK]
   cd desafio-frontend-dom
   ```
3. **Abra** o projeto no seu editor
4. **Implemente** as funcionalidades conforme as orientações abaixo
5. **Submeta** o link do repositório na atividade do Classroom

## 📁 Estrutura do Projeto

```
desafio-frontend-dom/
├── css/
│   ├── global.css          # Estilos globais
│   ├── home.css            # Estilos da página inicial
│   ├── product.css         # Estilos da página de produto
│   └── cart.css            # Estilos do carrinho
├── js/
│   ├── data.js             # Dados dos produtos e carrinho
│   └── index.js            # Lógica principal (você implementa)
├── image/                  # Imagens dos produtos
├── index.html              # Página principal
└── README.md               # Este arquivo
```

## Layout
 [Link do figma](https://www.figma.com/design/s3cHWPjspc0k60nYuMPkHo/desafio-js-dom?m=auto&t=Xn2rmkA3Q4De9sDX-1)

## 💻 O que Implementar

### 🔧 PARTE 1: Funcionalidades Básicas

#### 1. Listagem Dinâmica de Produtos

**Objetivo**: Substituir o HTML estático por produtos renderizados dinamicamente do `data.js`

**Implementação**:
- Use o array `dados.produtos` do arquivo `data.js`
- Renderize cada produto na categoria correta (Clássicos/Gelados)
- Mantenha a estrutura HTML existente:

```html
<div class="products__list--item">
  <img src="./image/product-02.png" alt="">
  <h3 class="products__list--price">R$ 8,00 <span>R$ 6,00</span></h3>
  <h4 class="products__list--name">Americano</h4>
  <div class="product__tag">
    <img src="./image/Plant.png" alt="vegano">
    <span>Vegano</span>
  </div>
  <form>
    <div class="product__buy">
      <section class="product__quantity">
        <button class="product__quantity--minus">
          <img src="./image/Minus.svg" alt="diminuir">
        </button>
        <input type="text" class="product__quantity--input" value="1">
        <button class="product__quantity--plus">
          <img src="./image/Plus.svg" alt="aumentar">
        </button>
      </section>
      <button class="product__button">Comprar</button>
    </div>
  </form>
</div>
```

---

## Carrinho de Produtos

**Objetivo**: Implementar um sistema de carrinho que permita adicionar produtos, gerenciar quantidades e finalizar compras.

**Funcionalidades**:
- Adicionar produtos ao carrinho
- Visualizar produtos no carrinho
- Alterar quantidades
- Remover produtos
- Calcular valor total
- Persistir dados no localStorage

**Estrutura HTML do Carrinho**:
```html
<div class="cart">
  <div class="cart__header">
    <h3>Seu Carrinho</h3>
    <button class="cart__close">×</button>
  </div>
  
  <div class="cart__products">
    <!-- Produtos serão inseridos dinamicamente aqui -->
  </div>
  
  <div class="cart__footer">
    <div class="cart__total">
      <span>Total:</span>
      <strong class="cart__total--value">R$ 0,00</strong>
    </div>
    <button class="cart__checkout">Finalizar Compra</button>
  </div>
</div>
```

**Estrutura de um Item do Carrinho**:
```html
<div class="cart__item" data-id="produto-123">
  <div class="cart__item--image">
    <img src="./image/product-01.png" alt="Nome do Produto">
  </div>
  
  <div class="cart__item--details">
    <h4 class="cart__item--name">Nome do Produto</h4>
    <p class="cart__item--observation">Observação do cliente</p>
    
    <div class="cart__item--controls">
      <button class="cart__item--minus">-</button>
      <span class="cart__item--quantity">2</span>
      <button class="cart__item--plus">+</button>
    </div>
  </div>
  
  <div class="cart__item--price">
    <span class="cart__item--unit-price">R$ 8,00</span>
    <span class="cart__item--total-price">R$ 16,00</span>
  </div>
  
  <button class="cart__item--remove">×</button>
</div>
```

**Implementação JavaScript**:

1. **Estrutura de Dados**:
```javascript
// Item do carrinho
const itemCarrinho = {
  id: "produto-123",
  idProduto: "produto-123",
  nome: "Nome do Produto",
  imagem: "./image/product-01.png",
  preco: 800, // em centavos
  quantidade: 2
};
```

**Eventos e Interações**:
- Clique no ícone do carrinho: Abre/fecha o carrinho
- Botão "+" no item: Aumenta quantidade
- Botão "-" no item: Diminui quantidade (remove se chegar a 0)
- Botão "×" no item: Remove produto do carrinho
- Botão "Finalizar Compra": Processa a compra (pode abrir modal de confirmação)

**Validações**:
- Quantidade mínima: 1
- Quantidade máxima: 99
- Produto já existe: Atualizar quantidade ao invés de duplicar
- Carrinho vazio: Mostrar mensagem "Seu carrinho está vazio"

#### 2. Controles de Quantidade

**Funcionalidades**:
- Botão `-` diminui a quantidade (mínimo: 1)
- Botão `+` aumenta a quantidade
- Input aceita digitação direta (validação: mínimo 1)
- Sincronização entre botões e input

#### 3. Funcionalidade "Comprar"

**Implementação**:
- Ao clicar em "Comprar", adicione o produto ao carrinho
- Considere a quantidade selecionada
- Estrutura do item no carrinho:

```javascript
{
  id: "unique-id",           // ID único do item no carrinho
  idProduto: "4",            // ID do produto original
  nome: "Café com Leite",
  imagem: "./image/product-04.png",
  preco: 1000,               // Preço em centavos
  vegano: false,
  quantidade: 3
}
```

#### 4. Modal do Carrinho

**Funcionalidades**:
- Abrir: clique no ícone do carrinho no header
- Fechar: clique no botão X (`.cart__close`)
- Toggle da classe `.cart--active` para mostrar/ocultar

### 🛒 PARTE 2: Gerenciamento do Carrinho

#### Header do Carrinho
- **Contador de itens**: Atualizar dinamicamente `badge__quantity`
- **Botão fechar**: Funcionalidade já implementada na parte 1
- **Excluir tudo**: Remove todos os itens do carrinho

#### Listagem de Produtos
- Renderizar itens do array `dados.carrinho`
- Exibir: imagem, nome, preço, quantidade, tag vegano
- Botão remover individual (ícone `Trash.svg`)

#### Controles de Quantidade no Carrinho
- Mesma funcionalidade da página principal
- Atualizar preço total em tempo real
- Validação: quantidade mínima 1

#### Rodapé do Carrinho
- **Subtotal**: Soma de (preço × quantidade) de todos os itens
- **Frete**: Valor fixo (pode ser 0)
- **Total**: Subtotal + Frete
- **Finalizar Compra**: Popup com mensagem de sucesso

## 🎨 Estrutura de Dados

### Produto
```javascript
{
  id: "1",
  nome: "Espresso",
  imagem: "./image/product-01.png",
  descricao: "Descrição completa...",
  preco: {
    de: 800,    // Preço original (centavos)
    por: 600    // Preço com desconto (centavos)
  },
  vegano: true,
  categoria: "classicos"  // "classicos" ou "gelados"
}
```

### Item no Carrinho
```javascript
{
  id: "6b9f",              // ID único no carrinho
  idProduto: "4",          // Referência ao produto
  nome: "Café com Leite",
  imagem: "./image/product-04.png",
  preco: 1000,             // Preço unitário (centavos)
  vegano: false,
  quantidade: 3
}
```

## 🔧 Boas Práticas

### Código
- ✅ Nomes semânticos para variáveis e funções
- ✅ Funções reutilizáveis para lógicas repetidas

## 🧪 Testes e Validação

### Funcionalidades a Testar
- [ ] Listagem de produtos por categoria
- [ ] Controles de quantidade funcionando
- [ ] Adição de produtos ao carrinho
- [ ] Abertura/fechamento do modal
- [ ] Atualização do contador de itens
- [ ] Cálculos corretos de preços
- [ ] Remoção de itens individuais
- [ ] Exclusão de todos os itens
- [ ] Finalização da compra

## 📚 Recursos Úteis

### JavaScript
- [Manipulação do DOM](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model)
- [Event Listeners](https://developer.mozilla.org/pt-BR/docs/Web/API/EventTarget/addEventListener)
- [Template Literals](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Template_literals)
- [Array Methods](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array)

---

**Boa sorte! 🚀☕**

*Este projeto foi desenvolvido para testar suas habilidades em JavaScript e DOM manipulation.*