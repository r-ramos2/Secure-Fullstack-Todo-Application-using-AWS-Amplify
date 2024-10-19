import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

const client = generateClient<Schema>();

function Todo() {
  const [todos, setTodos] = useState<{ id: string, content: string, isDone: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  // Fetch todos for the logged-in user
  const fetchTodos = async () => {
    try {
      const result = await client.models.Todo.list();
      setTodos(result.items);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add a new todo item
  const createTodo = async () => {
    if (newTodo.trim()) {
      try {
        const todo = await client.models.Todo.create({ content: newTodo, isDone: false });
        setTodos((prevTodos) => [...prevTodos, todo]);
        setNewTodo('');
      } catch (error) {
        console.error("Error creating todo:", error);
      }
    }
  };

  // Delete a todo item
  const deleteTodo = async (id: string) => {
    try {
      await client.models.Todo.delete({ id });
      setTodos((prevTodos) => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <main>
      <h1>Your Todos</h1>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New todo"
      />
      <button onClick={createTodo}>+ Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} onClick={() => deleteTodo(todo.id)}>
            {todo.content} {todo.isDone ? '✓' : ''}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Todo;
