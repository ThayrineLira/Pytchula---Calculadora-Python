"""
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
        self.root.configure(bg="#F0FDF4") # Fundo verde menta suave e alegre

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
            ('÷', '#8B5CF6', '#FFFFFF', lambda: self.adicionar_operador('/')),

            ('7', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('7')),
            ('8', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('8')),
            ('9', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('9')),
            ('×', '#3B82F6', '#FFFFFF', lambda: self.adicionar_operador('*')),

            ('4', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('4')),
            ('5', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('5')),
            ('6', '#FFFFFF', '#1E293B', lambda: self.adicionar_numero('6')),
            ('-', '#F59E0B', '#FFFFFF', lambda: self.adicionar_operador('-')),

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
            resultado = eval(self.expressao)
            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
            self.texto_visor.set(str(resultado))
            self.expressao = str(resultado)
        except ZeroDivisionError:
            self.texto_visor.set("Ops! /0")
            messagebox.showwarning(
                "ZeroDivisionError 🐍",
                "No Python não é possível dividir por zero! 🐍🚫\nTente outro divisor!"
            )
            self.expressao = ""
        except Exception:
            self.texto_visor.set("Erro")
            self.expressao = ""

if __name__ == "__main__":
    janela = tk.Tk()
    app = PytchulaCalculadora(janela)
    janela.mainloop()
