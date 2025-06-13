# Widget de Busca SmartHint

Widget de busca inteligente para produtos e marcas com autocompletar e resultados dinâmicos, utilizando a API pública da SmartHint.

## Instalação

1. Adicione o script ao seu HTML:
```html
<script src="smarthint-widget.js"></script>
```

2. Crie um container para o widget:
```html
<div id="smarthint-search"></div>
```

## Configuração

Configure o widget através de atributos de dados no elemento HTML:

```html
<div id="smarthint-search"
     data-min-search-length="3"     <!-- Caracteres mínimos para iniciar busca -->
     data-debounce-time="300"       <!-- Tempo de espera entre buscas (ms) -->
     data-shcode="SH-251914"        <!-- Seu código SH -->
     data-cluster="v3"              <!-- Cluster da API -->
     data-anonymous="seu-id"        <!-- ID anônimo -->
     data-results-size="10">        <!-- Número de resultados -->
  <script src="smarthint-widget.js"></script>
</div>
```

## Funcionalidades

- Busca com autocompletar
- Resultados com imagem, título e preço
- Responsivo e acessível
- Estilos Bootstrap incluídos
- Suporte a múltiplas instâncias
- Configurável via HTML

## Exemplo de Uso

```html
<!-- Configuração básica -->
<div id="smarthint-search">
  <script src="smarthint-widget.js"></script>
</div>

<!-- Configuração personalizada -->
<div id="smarthint-search"
     data-min-search-length="4"
     data-debounce-time="500"
     data-shcode="SEU-CODIGO-SH"
     data-results-size="20">
  <script src="smarthint-widget.js"></script>
</div>
```

## Como usar

Adicione o contêiner HTML onde o widget será inserido:

```html
<div id="smarthint-search"></div>
