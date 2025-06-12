# Widget de Busca SmartHint

Este script cria um widget de busca inteligente para produtos e marcas, com autocompletar e resultados dinâmicos, utilizando a API pública da SmartHint.

## Funcionalidades

- Campo de busca com debounce para evitar buscas frequentes.
- Busca ativada somente a partir de 3 caracteres digitados.
- Integração com a API da SmartHint para obtenção dos resultados.
- Resultados exibidos em um dropdown com imagem, título, preço e link.
- Tratamento de erros e estado de carregamento.
- Estilos Bootstrap injetados automaticamente apenas uma vez.
- Acessibilidade: uso de roles ARIA para melhorar compatibilidade com leitores de tela.
- Suporta limpeza e reinicialização para múltiplas instâncias.
- Compatível com qualquer contêiner HTML informado por ID.

## Como usar

Adicione o contêiner HTML onde o widget será inserido:

```html
<div id="smarthint-search"></div>
