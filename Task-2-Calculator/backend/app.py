from flask import Flask, request, jsonify
from flask_cors import CORS

from calculator import calculate


app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Smart Calculator Backend is Running!"
    })


@app.route("/calculate", methods=["POST"])
def perform_calculation():

    try:
        data = request.get_json()

        operation = data.get("operation")
        a = data.get("a")
        b = data.get("b")

        # Check operation
        if not operation:
            return jsonify({
                "error": "Operation is required."
            }), 400

        # Check first number
        if a is None:
            return jsonify({
                "error": "First number is required."
            }), 400

        a = float(a)

        # Convert second number if provided
        if b is not None:
            b = float(b)

        # Perform calculation
        result = calculate(operation, a, b)

        return jsonify({
            "operation": operation,
            "result": result
        })

    except ValueError as e:
        return jsonify({
            "error": str(e)
        }), 400

    except Exception as e:
        return jsonify({
            "error": f"Unexpected error: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(debug=True)