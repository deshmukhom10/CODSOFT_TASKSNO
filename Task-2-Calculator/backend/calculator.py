import math


def calculate(operation, a, b=None):

    # Two-number operations
    if operation == "add":
        return a + b

    elif operation == "sub":
        return a - b

    elif operation == "mul":
        return a * b

    elif operation == "div":
        if b == 0:
            raise ValueError("Division by zero is not allowed.")
        return a / b

    elif operation == "power":
        return math.pow(a, b)

    elif operation == "percent":
        return (a * b) / 100

    # Single-number operations
    elif operation == "sqrt":
        if a < 0:
            raise ValueError("Square root of a negative number is not allowed.")
        return math.sqrt(a)

    elif operation == "log":
        if a <= 0:
            raise ValueError("Logarithm requires a positive number.")
        return math.log10(a)

    elif operation == "sin":
        return math.sin(math.radians(a))

    elif operation == "cos":
        return math.cos(math.radians(a))

    elif operation == "tan":
        return math.tan(math.radians(a))

    else:
        raise ValueError("Invalid operation.")