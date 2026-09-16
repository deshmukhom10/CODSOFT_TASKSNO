# 🧮 Smart Calculator - Advanced Version
# Made with ❤️ in Python

import math
from colorama import Fore, Style, init

# Initialize colorama
init(autoreset=True)

def show_menu():
    print(Fore.CYAN + "\n====== SMART CALCULATOR ======")
    print(Fore.YELLOW + """
Available operations:
  ➕ add        → Addition
  ➖ sub        → Subtraction
  ✖️ mul        → Multiplication
  ➗ div        → Division
  🔢 power      → Exponent (x^y)
  🧮 sqrt       → Square Root
  📊 log        → Logarithm (base 10)
  🎯 sin, cos, tan → Trigonometric functions
  % percent     → Find percentage
  ❌ exit       → Quit program
""")
    print(Style.RESET_ALL)

while True:
    show_menu()
    operation = input(Fore.GREEN + "Enter operation: ").lower()

    if operation == "exit":
        print(Fore.MAGENTA + "\nGoodbye! 👋 Stay smart!")
        break

    try:
        # For single-number operations
        if operation in ["sqrt", "sin", "cos", "tan", "log"]:
            num = float(input("Enter number: "))
            if operation == "sqrt":
                print("Result =", math.sqrt(num))
            elif operation == "sin":
                print("Result =", math.sin(math.radians(num)))
            elif operation == "cos":
                print("Result =", math.cos(math.radians(num)))
            elif operation == "tan":
                print("Result =", math.tan(math.radians(num)))
            elif operation == "log":
                print("Result =", math.log10(num))

        # For two-number operations
        elif operation in ["add", "sub", "mul", "div", "power", "percent"]:
            a = float(input("Enter first number: "))
            b = float(input("Enter second number: "))

            if operation == "add":
                print("Result =", a + b)
            elif operation == "sub":
                print("Result =", a - b)
            elif operation == "mul":
                print("Result =", a * b)
            elif operation == "div":
                if b == 0:
                    print(Fore.RED + "❌ Error: Division by zero not allowed.")
                else:
                    print("Result =", a / b)
            elif operation == "power":
                print("Result =", math.pow(a, b))
            elif operation == "percent":
                print(f"{b}% of {a} =", (a * b) / 100)

        else:
            print(Fore.RED + "❌ Invalid operation. Try again.")

    except ValueError:
        print(Fore.RED + "⚠️ Error: Please enter valid numbers only.")
    except Exception as e:
        print(Fore.RED + f"⚠️ Unexpected error: {e}")

