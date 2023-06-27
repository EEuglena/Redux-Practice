// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<App />);

import { legacy_createStore } from "redux";

const form = document.querySelector("form");
const input = form.querySelector("input");
const ul = document.querySelector("ul");

const ADD_TODO = "ADD_TODO";
const DEL_TODO = "DEL_TODO";

const addTodoObj = (text) => {
	return { type: ADD_TODO, newTodo: { text, id: Date.now() } };
};

const todoStore = legacy_createStore(
	(
		state = localStorage.getItem("todoList")
			? JSON.parse(localStorage.getItem("todoList"))
			: [],
		action
	) => {
		switch (action.type) {
			case ADD_TODO:
				return [action.newTodo, ...state];
			case DEL_TODO:
				return state.filter((item) => item.id !== action.id);
			default:
				return state;
		}
	}
);

todoStore.subscribe(() => {
	localStorage.setItem("todoList", JSON.stringify(todoStore.getState()));
});

const delTodoObj = (id) => {
	return { type: DEL_TODO, id };
};

const dispatchAdd = (text) => {
	todoStore.dispatch(addTodoObj(text));
};

const dispatchDel = (id) => {
	todoStore.dispatch(delTodoObj(id));
};

const paintTodos = () => {
	const list = todoStore.getState();
	ul.innerHTML = "";
	list.forEach((item) => {
		const li = document.createElement("li");
		const btn = document.createElement("button");
		li.id = item.id;
		li.innerText = item.text;
		btn.innerText = "X";
		btn.addEventListener("click", (event) => {
			dispatchDel(parseInt(event.target.parentNode.id));
			paintTodos();
		});
		li.appendChild(btn);
		ul.appendChild(li);
	});
};

form.addEventListener("submit", (event) => {
	event.preventDefault();
	dispatchAdd(input.value);
	input.value = "";
	paintTodos();
});

paintTodos();
