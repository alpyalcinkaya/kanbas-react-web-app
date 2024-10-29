import React from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";
import { useSelector } from "react-redux";

export default function TodoList() {
    const { todos } = useSelector((state: any) => state.todosReducer);
    return (
      <div id="wd-todo-list-redux" className="container mt-5">
        <h2 className="mb-4">Todo List</h2>
        <ul className="list-group">
          <TodoForm />
          {todos.map((todo: any) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
        <hr className="mt-4"/>
      </div>
    );
}
