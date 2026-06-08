# Site Cadeado Secreto

Projeto simples em HTML, CSS e JavaScript puro.

## Como usar

1. Extraia o arquivo ZIP.
2. Abra o arquivo `index.html` no navegador.
3. No celular, arraste os numeros para cima ou para baixo.
4. Clique em `Tentar abrir`.

## Senha padrao

A senha padrao e:

```js
4 1 2 6
```

## Como alterar a senha

Abra o arquivo `script.js` e altere esta linha:

```js
const senhaCorreta = [4, 1, 2, 6];
```

Exemplo para deixar a senha como 7 5 9 2:

```js
const senhaCorreta = [7, 5, 9, 2];
```
