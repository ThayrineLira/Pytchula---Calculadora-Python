# 🐍 Pytchula - A Calculadora Python Alegre & Divertida

> Uma calculadora carismática, colorida e muito fácil de usar focada nas **quatro operações básicas** da matemática, com mascote interativa, efeitos sonoros e código Python em tempo real!

---

## ✨ Funcionalidades

* ➕ **Adição (`+`)**: Soma direta com visualização alegre.
* ➖ **Subtração (`-`)**: Subtrações rápidas, com suporte a números negativos (`±`).
* ✖️ **Multiplicação (`*`)**: Mostra o asterisco do Python na tela.
* ➗ **Divisão (`/`)**: Exibe o comportamento real do Python (gerando `float`) e tratando `ZeroDivisionError` de forma bem-humorada.
* 🐍 **Mascote Pytchula**: Uma cobrinha fofa com óculos e chapéu de festa que reage a cada conta e conta curiosidades matemáticas quando clicada.
* 🎶 **Sons Táteis**: Sintetizador via Web Audio API com estalos e acordes de vitória (com botão de silenciar).
* ⌨️ **Suporte ao Teclado Físico**: Use `0-9`, `+`, `-`, `*`, `/`, `Enter`, `Backspace` e `Esc`.
* 📜 **Histórico Completo**: Reutilize resultados e copie o código Python correspondente com 1 clique.
* 🏆 **Desafio Divertido**: Mini-jogo de perguntas e respostas para treinar as 4 operações com pontuação e estrelas.

---

## 🚀 Como Executar os Scripts em Python (Desktop / Terminal)

Este repositório já inclui os arquivos em Python puro prontos para rodar no seu computador (sem precisar instalar nenhuma biblioteca externa, pois o `Tkinter` já vem incluso no Python padrão do Windows, Mac e Linux):

### 1. Versão com Interface Gráfica (Desktop)
```bash
python calculadora_pytchula_gui.py
```

### 2. Versão de Linha de Comando (Terminal / CLI)
```bash
python calculadora_pytchula_cli.py
```

---

## 💻 Como Executar a Aplicação Web Interativa

Esta versão conta com a interface moderna completa desenvolvida em React + TypeScript + Tailwind CSS:

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. Abra o navegador no endereço indicado (geralmente `http://localhost:3000`).

### Publicar no GitHub Pages

O workflow do GitHub Actions publica a aplicação automaticamente a cada envio para a branch `main`. No repositório, acesse **Settings → Pages** e selecione **GitHub Actions** como origem da publicação. Depois que o workflow terminar, o endereço estará disponível na seção **Pages** dessa página.

---

## 📁 Estrutura do Repositório

```text
├── calculadora_pytchula_gui.py  # Calculadora gráfica em Python nativo (Tkinter)
├── calculadora_pytchula_cli.py  # Calculadora interativa para terminal em Python
├── src/
│   ├── components/              # Componentes visuais (Visor, Teclado, Mascote, Quiz, Histórico)
│   ├── utils/                   # Motor matemático, sintetizador de som e templates
│   ├── App.tsx                  # Aplicação principal
│   └── main.tsx                 # Ponto de entrada React
├── package.json
└── README.md
```

---

## 💡 Dica de Python da Pytchula

No Python:
* **Divisão (`/`)**: Sempre retorna um número de ponto flutuante (`float`). Exemplo: `10 / 2` resulta em `5.0`.
* **ZeroDivisionError**: No Python, dividir qualquer número por `0` dispara a exceção `ZeroDivisionError`.
* **Multiplicação**: O símbolo matemático `×` é representado pelo asterisco `*`.

Feito com 💚 e alegria!
