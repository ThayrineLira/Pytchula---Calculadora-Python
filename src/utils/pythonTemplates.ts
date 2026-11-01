/**
 * Full, clean, standalone Python scripts for Pytchula Calculator.
 * Users can run these directly on their computer with python3!
 */

export const PYTHON_GUI_SCRIPT = `"""
🐍 Pytchula - Calculadora Python Alegre & Divertida 🐍
Interface Gráfica usando Tkinter (Biblioteca padrão do Python, não precisa instalar nada!)
Suporta as 4 Operações Básicas: Soma (+), Subtração (-), Multiplicação (*) e Divisão (/)
"""

import tkinter as tk
from tkinter import messagebox

class PytchulaCalculadora:
    def __init__(self, root):
        self.root = root
        self.root.title("🐍 Pytchula - Calculadora Python Divertida")
        self.root.geometry("380x560")
        self.root.resizable(False, False)
        self.root.configure(bg="#F0FDF4") # Verde menta suave e alegre

        self.expressao = ""
        self.texto_visor = tk.StringVar(value="0")

        self.criar_interface()

    def criar_interface(self):
        # Cabeçalho alegre
        topo = tk.Frame(self.root, bg="#F0FDF4", pady=10)
        topo.pack(fill="x")

        titulo = tk.Label(
            topo,
            text="🐍 Pytchula Calculadora",
            font=("Arial Rounded MT Bold", 18, "bold"),
            bg="#F0FDF4",
            fg="#15803D"
        )
        titulo.pack()

        subtitulo = tk.Label(
            topo,
            text="As 4 operações básicas com alegria!",
            font=("Arial", 10),
            bg="#F0FDF4",
            fg="#166534"
        )
        subtitulo.pack()

        # Visor
        frame_visor = tk.Frame(self.root, bg="#FFFFFF", bd=2, relief="solid")
        frame_visor.pack(padx=20, pady=10, fill="x")

        visor = tk.Label(
            frame_visor,
            textvariable=self.texto_visor,
            font=("Arial", 28, "bold"),
            bg="#FFFFFF",
            fg="#0F172A",
            anchor="e",
            padx=15,
            pady=15
        )
        visor.pack(fill="both")

        # Teclado alegre
        teclado = tk.Frame(self.root, bg="#F0FDF4")
        teclado.pack(padx=20, pady=10, fill="both", expand=True)

        botoes = [
            ('C', '#F87171', '#FFFFFF', self.limpar),
            ('⌫', '#FCA5A5', '#7F1D1D', self.apagar),
            ('%', '#E2E8F0', '#334155', self.porcentagem),
            ('÷', '#F59E0B', '#FFFFFF', lambda: self.adicionar_operador('/')),

            ('7', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('7')),
            ('8', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('8')),
            ('9', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('9')),
            ('×', '#3B82F6', '#FFFFFF', lambda: self.adicionar_operador('*')),

            ('4', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('4')),
            ('5', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('5')),
            ('6', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('6')),
            ('-', '#EC4899', '#FFFFFF', lambda: self.adicionar_operador('-')),

            ('1', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('1')),
            ('2', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('2')),
            ('3', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('3')),
            ('+', '#10B981', '#FFFFFF', lambda: self.adicionar_operador('+')),

            ('0', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('0')),
            ('.', '#E2E8F0', '#334155', self.adicionar_ponto),
            ('±', '#E2E8F0', '#334155', self.inverter_sinal),
            ('=', '#22C55E', '#FFFFFF', self.calcular),
        ]

        for i, (texto, bg_color, fg_color, comando) in enumerate(botoes):
            linha = i // 4
            coluna = i % 4
            btn = tk.Button(
                teclado,
                text=texto,
                font=("Arial Rounded MT Bold", 16, "bold"),
                bg=bg_color,
                fg=fg_color,
                activebackground="#CBD5E1",
                bd=0,
                relief="flat",
                command=comando,
                cursor="hand2"
            )
            btn.grid(row=linha, column=coluna, padx=4, pady=4, sticky="nsew")

        for r in range(5):
            teclado.rowconfigure(r, weight=1)
        for c in range(4):
            teclado.columnconfigure(c, weight=1)

    def adicionar_numero(self, num):
        if self.texto_visor.get() == "0" or self.texto_visor.get() == "Erro":
            self.expressao = num
        else:
            self.expressao += num
        self.texto_visor.set(self.expressao)

    def adicionar_operador(self, op):
        if not self.expressao and self.texto_visor.get() != "0":
            self.expressao = self.texto_visor.get()
        if self.expressao and self.expressao[-1] in "+-*/":
            self.expressao = self.expressao[:-1] + op
        else:
            self.expressao += op
        self.texto_visor.set(self.expressao)

    def adicionar_ponto(self):
        if not self.expressao:
            self.expressao = "0."
        elif self.expressao[-1] in "+-*/":
            self.expressao += "0."
        else:
            self.expressao += "."
        self.texto_visor.set(self.expressao)

    def inverter_sinal(self):
        try:
            val = float(self.texto_visor.get())
            val = -val
            if val.is_integer():
                val = int(val)
            self.expressao = str(val)
            self.texto_visor.set(self.expressao)
        except Exception:
            pass

    def porcentagem(self):
        try:
            val = float(self.texto_visor.get()) / 100
            self.expressao = str(val)
            self.texto_visor.set(self.expressao)
        except Exception:
            pass

    def limpar(self):
        self.expressao = ""
        self.texto_visor.set("0")

    def apagar(self):
        self.expressao = self.expressao[:-1]
        self.texto_visor.set(self.expressao if self.expressao else "0")

    def calcular(self):
        try:
            # Avalia a expressão matemática
            resultado = eval(self.expressao)
            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
            self.texto_visor.set(str(resultado))
            self.expressao = str(resultado)
        except ZeroDivisionError:
            self.texto_visor.set("Ops! /0")
            messagebox.showwarning(
                "ZeroDivisionError 🐍",
                "No Python não é possível dividir por zero! 🐍🚫\\nTente com outro número!"
            )
            self.expressao = ""
        except Exception:
            self.texto_visor.set("Erro")
            self.expressao = ""

if __name__ == "__main__":
    janela = tk.Tk()
    app = PytchulaCalculadora(janela)
    janela.mainloop()
`;

export const PYTHON_CLI_SCRIPT = `"""
🐍 Pytchula - Calculadora Python Fácil & Divertida (Linha de Comando)
As 4 Operações Básicas: Soma (+), Subtração (-), Multiplicação (*) e Divisão (/)
"""

def somar(a: float, b: float) -> float:
    """Realiza a adição de dois números"""
    return a + b

def subtrair(a: float, b: float) -> float:
    """Realiza a subtração de dois números"""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Realiza a multiplicação de dois números"""
    return a * b

def dividir(a: float, b: float) -> float:
    """Realiza a divisão de dois números com tratamento de ZeroDivisionError"""
    if b == 0:
        raise ZeroDivisionError("Divisão por zero não é permitida!")
    return a / b

def menu_principal():
    print("=" * 45)
    print("  🐍 BEM-VINDO À PYTCHULA CALCULADORA 🐍  ")
    print("       As 4 Operações Básicas em Python   ")
    print("=" * 45)
    print(" [1] ➕ Adição (Soma)")
    print(" [2] ➖ Subtração")
    print(" [3] ✖️ Multiplicação")
    print(" [4] ➗ Divisão")
    print(" [5] 🚪 Sair")
    print("=" * 45)

def main():
    while True:
        menu_principal()
        opcao = input(" Escolha uma opção alegre (1-5): ").strip()

        if opcao == '5':
            print("\\n🐍 Obrigado por usar a Pytchula! Até a próxima! 👋✨\\n")
            break

        if opcao not in ['1', '2', '3', '4']:
            print("\\n⚠️ Ops! Opção inválida. Escolha entre 1 e 5.\\n")
            continue

        try:
            num1 = float(input(" Digite o primeiro número: "))
            num2 = float(input(" Digite o segundo número: "))
        except ValueError:
            print("\\n❌ Por favor, digite apenas números válidos!\\n")
            continue

        print("-" * 45)
        if opcao == '1':
            res = somar(num1, num2)
            print(f"🎉 Resultado da Soma: {num1} + {num2} = {res}")
            print(f"💡 Em Python: {num1} + {num2}")

        elif opcao == '2':
            res = subtrair(num1, num2)
            print(f"🎉 Resultado da Subtração: {num1} - {num2} = {res}")
            print(f"💡 Em Python: {num1} - {num2}")

        elif opcao == '3':
            res = multiplicar(num1, num2)
            print(f"🎉 Resultado da Multiplicação: {num1} * {num2} = {res}")
            print(f"💡 Em Python: {num1} * {num2}")

        elif opcao == '4':
            try:
                res = dividir(num1, num2)
                print(f"🎉 Resultado da Divisão: {num1} / {num2} = {res}")
                print(f"💡 Em Python: {num1} / {num2} (sempre resulta em float!)")
            except ZeroDivisionError:
                print("🐍💥 Ops! ZeroDivisionError: Não é possível dividir por 0!")

        print("-" * 45)
        input("\\nPressione ENTER para fazer outra conta...")

if __name__ == "__main__":
    main()
`;

export function downloadFile(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
