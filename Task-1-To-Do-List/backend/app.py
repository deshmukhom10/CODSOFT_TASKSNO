import os
from datetime import datetime

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

CORS(app)

database_url = (
    f"mysql+pymysql://"
    f"{os.getenv('DB_USER')}:"
    f"{os.getenv('DB_PASSWORD')}@"
    f"{os.getenv('DB_HOST')}:"
    f"{os.getenv('DB_PORT')}/"
    f"{os.getenv('DB_NAME')}"
)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


# =========================
# Task Model
# =========================

class Task(db.Model):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    priority = db.Column(db.String(20), default="Medium", nullable=False)
    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    def __repr__(self):
        return f"<Task {self.id}: {self.title}>"


# =========================
# Home Route
# =========================

@app.route("/")
def home():
    return "To-Do List Backend is Running!"


# =========================
# Get All Tasks
# =========================

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.order_by(Task.id.desc()).all()

    return jsonify([
        {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "priority": task.priority,
            "created_at": task.created_at.isoformat()
        }
        for task in tasks
    ])


# =========================
# Create Task
# =========================

@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400
    
    task = Task(
    title=data["title"],
    description=data.get("description", ""),
    completed=False,
    priority=data.get("priority", "Medium")
)
    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created successfully",
        "task": {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "priority": task.priority,
            "created_at": task.created_at.isoformat()
        }
    }), 201


# =========================
# Update Task
# =========================

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    data = request.get_json()

    if "title" in data:
        task.title = data["title"]

    if "description" in data:
        task.description = data["description"]

    if "completed" in data:
      task.completed = data["completed"]

    if "priority" in data:
     task.priority = data["priority"]

    db.session.commit()


    return jsonify({
        "message": "Task updated successfully"
    })


# =========================
# Delete Task~
# =========================

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = db.session.get(Task, task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted successfully"
    })


# =========================
# Run App
# =========================

if __name__ == "__main__":
    app.run(debug=True)