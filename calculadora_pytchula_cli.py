"""
🐍 Pytchula - Calculadora Python Fácil & Divertida (Linha de Comando / Terminal) 🐍
As 4 Operações Básicas: Soma (+), Subtração (-), Multiplicação (*) e Divisão (/)
"""

import math


def somar(a: float, b: float) -> float:
    """Realiza a adição de dois números: a + b"""
    return a + b

def subtrair(a: float, b: float) -> float:
    """Realiza a subtração de dois números: a - b"""
    return a - b

def multiplicar(a: float, b: float) -> float:
    """Realiza a multiplicação de dois números: a * b"""
    return a * b

def dividir(a: float, b: float) -> float:
    """Realiza a divisão de dois números com tratamento de ZeroDivisionError: a / b"""
    if b == 0:
        raise ZeroDivisionError("Divisão por zero não é permitida no Python!")
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
            print("\n🐍 Obrigado por usar a Pytchula! Até a próxima! 👋✨\n")
            break

        if opcao not in ['1', '2', '3', '4']:
            print("\n⚠️ Ops! Opção inválida. Escolha entre 1 e 5.\n")
            continue

        try:
            num1 = float(input(" Digite o primeiro número: ").strip().replace(",", "."))
            num2 = float(input(" Digite o segundo número: ").strip().replace(",", "."))
        except ValueError:
            print("\n❌ Por favor, digite apenas números válidos!\n")
            continue
        if not math.isfinite(num1) or not math.isfinite(num2):
            print("\n❌ Digite números finitos, sem NaN ou infinito.\n")
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
                print(f"💡 Em Python: {num1} / {num2} (no Python '/' sempre resulta em float!)")
            except ZeroDivisionError:
                print("🐍💥 Ops! ZeroDivisionError: Não é possível dividir por 0!")

        print("-" * 45)
        input("\nPressione ENTER para fazer outra conta...")

if __name__ == "__main__":
    main()
