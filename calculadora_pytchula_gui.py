"""
🐍 Pytchula - Calculadora Python Alegre & Divertida 🐍
Interface Gráfica usando Tkinter (Biblioteca padrão do Python, não precisa instalar nada!)
Suporta as 4 Operações Básicas: Soma (+), Subtração (-), Multiplicação (*) e Divisão (/)
"""

import ast
import math
import operator
import re
import tkinter as tk
from pathlib import Path
from tkinter import messagebox


OPERADORES = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
}
MASCOT_IMAGE_DATA_URL = "MASCOT_IMAGE_DATA_URL_PLACEHOLDER"


def calcular_expressao(expressao: str) -> int | float:
    """Calcula apenas expressões aritméticas com números e operadores básicos."""
    arvore = ast.parse(expressao, mode="eval")

    def avaliar(no: ast.expr) -> int | float:
        if isinstance(no, ast.Constant) and type(no.value) in (int, float):
            if isinstance(no.value, float) and not math.isfinite(no.value):
                raise ValueError("O número precisa ser finito.")
            return no.value
        if isinstance(no, ast.UnaryOp) and isinstance(no.op, (ast.UAdd, ast.USub)):
            valor = avaliar(no.operand)
            return valor if isinstance(no.op, ast.UAdd) else -valor
        if isinstance(no, ast.BinOp) and type(no.op) in OPERADORES:
            return OPERADORES[type(no.op)](avaliar(no.left), avaliar(no.right))
        raise ValueError("A expressão contém uma operação não permitida.")

    resultado = avaliar(arvore.body)
    if isinstance(resultado, float) and not math.isfinite(resultado):
        raise ValueError("O resultado precisa ser finito.")
    return resultado


def localizar_operando_atual(expressao: str) -> tuple[int, float] | None:
    numero = re.search(r"\d+(?:\.\d*)?$", expressao)
    if not numero:
        return None

    inicio = numero.start()
    sinal = 1
    if inicio > 0 and expressao[inicio - 1] == "-":
        operador = inicio - 1
        if operador == 0 or expressao[operador - 1] in "+-*/":
            inicio = operador
            sinal = -1

    return inicio, sinal * float(numero.group())


class PytchulaCalculadora:
    def __init__(self, root):
        self.root = root
        self.root.title("🐍 Pytchula - Calculadora Python Divertida")
        self.root.geometry("380x600")
        self.root.resizable(False, False)
        self.root.configure(bg="#F0FDF4") # Fundo verde menta suave e alegre

        self.expressao = ""
        self.aguardando_operando = False
        self.resultado_final = False
        self.texto_visor = tk.StringVar(value="0")

        self.criar_interface()

    def criar_interface(self):
        # Cabeçalho alegre
        topo = tk.Frame(self.root, bg="#F0FDF4", pady=10)
        topo.pack(fill="x")

        conteudo_topo = tk.Frame(topo, bg="#F0FDF4")
        conteudo_topo.pack()

        caminho_mascote = (
            Path(__file__).resolve().parent
            / "src"
            / "assets"
            / "images"
            / "pytchula_mascot.png"
        )
        if MASCOT_IMAGE_DATA_URL != "MASCOT_IMAGE_DATA_URL_PLACEHOLDER":
            image_data = MASCOT_IMAGE_DATA_URL.partition(",")[2]
            self.imagem_mascote = tk.PhotoImage(data=image_data)
        else:
            self.imagem_mascote = tk.PhotoImage(file=str(caminho_mascote))
        tk.Label(
            conteudo_topo,
            image=self.imagem_mascote,
            bg="#F0FDF4",
        ).pack(side="left", padx=(0, 10))

        textos_topo = tk.Frame(conteudo_topo, bg="#F0FDF4")
        textos_topo.pack(side="left")

        titulo = tk.Label(
            textos_topo,
            text="🐍 Pytchula Calculadora",
            font=("Arial Rounded MT Bold", 18, "bold"),
            bg="#F0FDF4",
            fg="#15803D"
        )
        titulo.pack(anchor="w")

        subtitulo = tk.Label(
            textos_topo,
            text="As 4 operações básicas com alegria!",
            font=("Arial", 10),
            bg="#F0FDF4",
            fg="#166534"
        )
        subtitulo.pack(anchor="w")

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
        if (
            self.resultado_final
            or self.texto_visor.get() in ("0", "Erro", "Ops! /0")
        ):
            self.expressao = num
            self.resultado_final = False
        else:
            self.expressao += num
        self.aguardando_operando = False
        self.texto_visor.set(self.expressao)

    def adicionar_operador(self, op):
        if self.texto_visor.get() in ("Erro", "Ops! /0"):
            self.limpar()
        if self.resultado_final:
            self.expressao += op
            self.resultado_final = False
        elif self.aguardando_operando and self.expressao:
            self.expressao = self.expressao[:-1] + op
        elif not self.expressao:
            self.expressao = self.texto_visor.get()
            self.expressao += op
        elif self.expressao and self.expressao[-1] in "+-*/":
            self.expressao = self.expressao[:-1] + op
        else:
            self.expressao += op
        self.aguardando_operando = True
        self.texto_visor.set(self.expressao)

    def adicionar_ponto(self):
        if self.texto_visor.get() in ("Erro", "Ops! /0"):
            self.limpar()
        if self.resultado_final:
            self.expressao = "0."
            self.aguardando_operando = False
            self.resultado_final = False
        elif self.aguardando_operando:
            self.expressao += "0."
            self.aguardando_operando = False
        elif not self.expressao or self.texto_visor.get() in ("Erro", "Ops! /0"):
            self.expressao = "0."
        else:
            if self.expressao[-1] in "+-*/":
                self.expressao += "0."
            else:
                operando = re.search(r"\d+(?:\.\d*)?$", self.expressao)
                if operando and "." not in operando.group():
                    self.expressao += "."
            self.texto_visor.set(self.expressao)
            return
        self.texto_visor.set(self.expressao)

    def inverter_sinal(self):
        if self.resultado_final:
            operando = localizar_operando_atual(self.expressao)
            if operando:
                inicio, valor = operando
                valor = -valor
                texto = str(int(valor) if valor.is_integer() else valor)
                self.expressao = self.expressao[:inicio] + texto
            elif not self.expressao:
                self.expressao = "-0"
            self.resultado_final = False
            self.aguardando_operando = False
        elif self.aguardando_operando and self.expressao:
            self.expressao += "-"
            self.aguardando_operando = False
        else:
            operando = localizar_operando_atual(self.expressao)
            if operando:
                inicio, valor = operando
                valor = -valor
                texto = str(int(valor) if valor.is_integer() else valor)
                self.expressao = self.expressao[:inicio] + texto
            elif not self.expressao or self.expressao in ("Erro", "Ops! /0"):
                self.expressao = "-0"
            else:
                return
            self.aguardando_operando = False
        self.resultado_final = False
        self.texto_visor.set(self.expressao)

    def porcentagem(self):
        operando = localizar_operando_atual(self.expressao)
        if not operando:
            return
        inicio, valor = operando
        self.expressao = self.expressao[:inicio] + str(valor / 100)
        self.aguardando_operando = False
        self.resultado_final = False
        self.texto_visor.set(self.expressao)

    def limpar(self):
        self.expressao = ""
        self.aguardando_operando = False
        self.resultado_final = False
        self.texto_visor.set("0")

    def apagar(self):
        if self.aguardando_operando and self.expressao:
            self.expressao = self.expressao[:-1]
            self.aguardando_operando = False
        else:
            self.expressao = self.expressao[:-1]
        self.resultado_final = False
        self.texto_visor.set(self.expressao if self.expressao else "0")

    def calcular(self):
        try:
            resultado = calcular_expressao(self.expressao)
            if isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
            self.texto_visor.set(str(resultado))
            self.expressao = str(resultado)
            self.aguardando_operando = True
            self.resultado_final = True
        except ZeroDivisionError:
            self.texto_visor.set("Ops! /0")
            messagebox.showwarning(
                "ZeroDivisionError 🐍",
                "No Python não é possível dividir por zero! 🐍🚫\nTente outro divisor!"
            )
            self.expressao = ""
            self.aguardando_operando = True
            self.resultado_final = True
        except (SyntaxError, ValueError, OverflowError):
            self.texto_visor.set("Erro")
            self.expressao = ""
            self.aguardando_operando = True
            self.resultado_final = True

if __name__ == "__main__":
    janela = tk.Tk()
    app = PytchulaCalculadora(janela)
    janela.mainloop()
