import { useState, useEffect } from "react";
import DateTimePicker from "react-datetime-picker";

import { addEventToGoogleCalendar } from "./api/api";
import "./App.css";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [todoEditing, setTodoEditing] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    const json = localStorage.getItem("todos");
    const loadedTodos = JSON.parse(json);
    if (loadedTodos) {
      setTodos(loadedTodos);
    }
  }, []);

  useEffect(() => {
    const json = JSON.stringify(todos);
    localStorage.setItem("todos", json);
  }, [todos]);

  function clearInputs() {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newTodo = {
      id: new Date().getTime(),
      summary: title,
      description: description,
      start: {
        dateTime: startDate,
      },
      end: {
        dateTime: endDate,
      },
      completed: false,
    };
    setTodos([newTodo, ...todos]);

    try {
      await addEventToGoogleCalendar(title, description, startDate, endDate);
    } catch (err) {
      console.log(err)
    }

      clearInputs();
  }

  function deleteTodo(id) {
    let updatedTodos = [...todos].filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  }

  function toggleComplete(id) {
    let updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(updatedTodos);
  }

  function submitEdits(id) {
    const updatedTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.summary = editingTitle;
        todo.description = editingDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
    setTodoEditing(null);
  }

  return (
    <>
      <div className="todo-list">
        <h1>Todo List + Google Calendar</h1>
        <form onSubmit={handleSubmit}>
          <input
            className="todo-input"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Name..."
            required
          />
          <input
            className="todo-input"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Description..."
            required
          />
          <div style={{ margin: '10px 0' }}>
          <span style={{ margin: '0 10px' }}>Starting date:</span>
          <DateTimePicker
            onChange={(date) => setStartDate(date)}
            value={startDate}
            required
          />
          </div>
          <div style={{ margin: '10px 0' }}>
          <span style={{ margin: '0 10px' }}>Due date:</span> 
          <DateTimePicker
            onChange={(date) => setEndDate(date)}
            value={endDate}
            required
            />
          </div>
          <button className="todo-button" type="submit">
            Add Todo
          </button>
        </form>
      </div>
      <div>
        {todos.map((todo) => (
          <div className="todo-container">
            <div key={todo.id} className="todo-row">
              <div className="todo">
                <input
                  type="checkbox"
                  id="completed"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />

                <div>{todo.summary}</div>
                <div>{todo.description}</div>
                <div>{todo.start.startDate}</div>
                <div>{todo.start.endDate}</div>
              </div>
              <div className="todo-actions">
                {todo.id === todoEditing ? (
                  <form onSubmit={() => submitEdits(todo.id)}>
                    <input
                      className="todo-input"
                      type="text"
                      value={editingTitle ? editingTitle : todo.summary}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      required
                    />
                    <input
                      className="todo-input"
                      type="text"
                      value={editingDescription ? editingDescription : todo.description}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      required
                    />
                    <button type="submit">Submit</button>
                  </form>
                ) : (
                  <button onClick={() => setTodoEditing(todo.id)}>Edit</button>
                )}
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;
