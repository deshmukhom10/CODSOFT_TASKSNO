import { useState } from "react";
import "./App.css";

const singleNumberOperations = ["sqrt", "log", "sin", "cos", "tan"];

const operationSymbols = {
  add: "+",
  sub: "−",
  mul: "×",
  div: "÷",
  power: "^",
  percent: "%",
  sqrt: "√",
  log: "log",
  sin: "sin",
  cos: "cos",
  tan: "tan",
};

function App() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [operation, setOperation] = useState("add");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const calculateResult = async () => {
    setError("");
    setResult(null);

    if (a === "") {
      setError("Please enter the first number.");
      return;
    }

    if (!singleNumberOperations.includes(operation) && b === "") {
      setError("Please enter the second number.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation,
          a,
          b: singleNumberOperations.includes(operation) ? null : b,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Calculation failed.");
        return;
      }

      setResult(data.result);
    } catch (error) {
      setError(
        "Unable to connect to the backend. Make sure Flask is running."
      );
    }
  };

  const clearCalculator = () => {
    setA("");
    setB("");
    setResult(null);
    setError("");
    setOperation("add");
  };

  return (
    <div className="app">
      <div className="calculator-card">

        <div className="header">
          <div className="icon">🧮</div>
          <div>
            <h1>Smart Calculator</h1>
            <p>Advanced Calculator</p>
          </div>
        </div>

        <div className="display">
          {result !== null ? (
            <>
              <span>Result</span>
              <strong>{result}</strong>
            </>
          ) : (
            <>
              <span>Ready to calculate</span>
              <strong>0</strong>
            </>
          )}
        </div>

        <div className="form">

          <div className="input-group">
            <label>First Number</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="Enter first number"
            />
          </div>

          <div className="input-group">
            <label>Operation</label>

            <select
              value={operation}
              onChange={(e) => {
                setOperation(e.target.value);
                setResult(null);
                setError("");
              }}
            >
              <option value="add">Addition (+)</option>
              <option value="sub">Subtraction (−)</option>
              <option value="mul">Multiplication (×)</option>
              <option value="div">Division (÷)</option>
              <option value="power">Power (^)</option>
              <option value="percent">Percentage (%)</option>
              <option value="sqrt">Square Root (√)</option>
              <option value="log">Logarithm (log)</option>
              <option value="sin">Sine (sin)</option>
              <option value="cos">Cosine (cos)</option>
              <option value="tan">Tangent (tan)</option>
            </select>
          </div>

          {!singleNumberOperations.includes(operation) && (
            <div className="input-group">
              <label>Second Number</label>

              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="Enter second number"
              />
            </div>
          )}

          <div className="selected-operation">
            <span>Selected operation</span>
            <strong>
              {operationSymbols[operation]}{" "}
              {operation.replace("percent", "Percentage")}
            </strong>
          </div>

          <div className="buttons">
            <button className="calculate-btn" onClick={calculateResult}>
              Calculate
            </button>

            <button className="clear-btn" onClick={clearCalculator}>
              Clear
            </button>
          </div>

          {error && (
            <div className="error">
              ⚠️ {error}
            </div>
          )}

        </div>

        <div className="footer">
          Powered by React + Flask + Python
        </div>

      </div>
    </div>
  );
}

export default App;