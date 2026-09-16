// App.jsx

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = "http://127.0.0.1:5000";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (response.ok) {
        setTitle("");
        setDescription("");
        setPriority("Medium");
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTask = async (task) => {
    try {
      await fetch(`${API_URL}/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      if (response.ok) {
        cancelEditing();
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Pending" && !task.completed) ||
      (filter === "Completed" && task.completed);

    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="app-container">

      {/* Header */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">✓</div>

          <div>
            <h1>TaskFlow</h1>
            <p>Stay organized. Get things done.</p>
          </div>
        </div>

        <div className="profile">
          <div className="avatar">O</div>

          <div className="profile-info">
            <strong>My Workspace</strong>
            <span>Personal Tasks</span>
          </div>
        </div>
      </header>

      <main className="dashboard">

        {/* Welcome */}

        <section className="welcome">
          <div>
            <span className="welcome-label">
              PRODUCTIVITY DASHBOARD
            </span>

            <h2>Good day! 👋</h2>

            <p>
              Manage your tasks, track your progress,
              and stay productive.
            </p>
          </div>
        </section>

        {/* Statistics */}

        <section className="stats">

          <div className="stat-card">
            <div className="stat-icon purple">✓</div>

            <div>
              <span>Total Tasks</span>
              <strong>{totalTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>

            <div>
              <span>Pending</span>
              <strong>{pendingTasks}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>

            <div>
              <span>Completed</span>
              <strong>{completedTasks}</strong>
            </div>
          </div>

        </section>

        <div className="content-grid">

          {/* Tasks */}

          <section className="tasks-area">

            <div className="section-header">

              <div>
                <h2>My Tasks</h2>
                <p>
                  {totalTasks} task
                  {totalTasks !== 1 ? "s" : ""} in your workspace
                </p>
              </div>

              <div className="search-box">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

            </div>

            {/* Filters */}

            <div className="filters">

              {["All", "Pending", "Completed"].map(
                (item) => (
                  <button
                    key={item}
                    className={
                      filter === item
                        ? "filter active"
                        : "filter"
                    }
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            {/* Task List */}

            <div className="task-list">

              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✓</div>

                  <h3>No tasks found</h3>

                  <p>
                    Add a new task to start organizing
                    your day.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (

                  <article
                    className={
                      task.completed
                        ? "task-card completed-task"
                        : "task-card"
                    }
                    key={task.id}
                  >

                    {editingId === task.id ? (

                      <div className="edit-area">

                        <input
                          value={editTitle}
                          onChange={(e) =>
                            setEditTitle(e.target.value)
                          }
                          placeholder="Task title"
                        />

                        <textarea
                          value={editDescription}
                          onChange={(e) =>
                            setEditDescription(e.target.value)
                          }
                          placeholder="Description"
                        />

                        <div className="edit-actions">

                          <button
                            className="primary-button"
                            onClick={() =>
                              saveEdit(task.id)
                            }
                          >
                            Save Changes
                          </button>

                          <button
                            className="secondary-button"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>

                        </div>

                      </div>

                    ) : (

                      <>

                        <div className="task-main">

                          <button
                            className={
                              task.completed
                                ? "checkbox checked"
                                : "checkbox"
                            }
                            onClick={() =>
                              toggleTask(task)
                            }
                          >
                            {task.completed ? "✓" : ""}
                          </button>

                          <div className="task-content">

                            <div className="task-title-row">

                              <h3
                                className={
                                  task.completed
                                    ? "task-title done"
                                    : "task-title"
                                }
                              >
                                {task.title}
                              </h3>

                              <span
                                className={
                                  task.completed
                                    ? "status-badge completed"
                                    : "status-badge pending"
                                }
                              >
                                {task.completed
                                  ? "Completed"
                                  : "Pending"}
                              </span>

                            </div>

                            {task.description && (
                              <p className="task-description">
                                {task.description}
                              </p>
                            )}

                            <div className="task-meta">

                              <span>
                                📅{" "}
                                {new Date(
                                  task.created_at
                                ).toLocaleDateString()}
                              </span>

                              <span className="priority">
                                {priority}
                              </span>

                            </div>

                          </div>

                        </div>

                        <div className="task-buttons">

                          <button
                            className="complete-action"
                            onClick={() =>
                              toggleTask(task)
                            }
                          >
                            {task.completed
                              ? "Mark Pending"
                              : "Complete"}
                          </button>

                          <button
                            className="edit-action"
                            onClick={() =>
                              startEditing(task)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-action"
                            onClick={() =>
                              deleteTask(task.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </>

                    )}

                  </article>

                ))
              )}

            </div>

          </section>

          {/* Sidebar */}

          <aside className="sidebar">

            {/* Add Task */}

            <div className="add-card">

              <div className="card-heading">
                <div className="heading-icon">+</div>

                <div>
                  <h2>Add New Task</h2>
                  <p>Create a task and stay on track.</p>
                </div>
              </div>

              <form onSubmit={addTask}>

                <label>Task Title</label>

                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

                <label>Description</label>

                <textarea
                  placeholder="Add some details..."
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />

                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <button
                  className="add-task-button"
                  type="submit"
                >
                  + Add Task
                </button>

              </form>

            </div>

            {/* Progress */}

            <div className="progress-card">

              <h2>Today's Progress</h2>

              <div
                className="progress-circle"
                style={{
                  "--progress": `${progress}%`,
                }}
              >
                <div>
                  <strong>{progress}%</strong>
                  <span>Complete</span>
                </div>
              </div>

              <div className="progress-text">
                <strong>
                  {completedTasks} of {totalTasks}
                </strong>

                <span>tasks completed</span>
              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}

export default App;