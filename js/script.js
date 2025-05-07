// SELEÇÃO DE ELEMENTOS
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const filterSelect = document.querySelector("#filter-select");
const searchInput = document.querySelector("#search-input");
const eraseButton = document.querySelector("#erase-button");

let oldInputValue;

// FUNÇÕES
const saveTodo = (text, done = false) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");
  if (done) todo.classList.add("done");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  todoList.appendChild(todo);
  todoInput.value = "";
  todoInput.focus();

  saveToLocalStorage();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
      todoTitle.innerText = text;
    }
  });

  saveToLocalStorage();
};

const saveToLocalStorage = () => {
  const todos = [];
  document.querySelectorAll(".todo").forEach((todoEl) => {
    const title = todoEl.querySelector("h3").innerText;
    const done = todoEl.classList.contains("done");
    todos.push({ title, done });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
};

const loadFromLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((todo) => {
    saveTodo(todo.title, todo.done);
  });
};

// EVENTOS
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = todoInput.value;
  if (inputValue) {
    saveTodo(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");
    saveToLocalStorage();
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();
    saveToLocalStorage();
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    editInput.value = todoTitle;
    oldInputValue = todoTitle;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;

  if (editInputValue) {
    updateTodo(editInputValue);
  }

  toggleForms();
});

// FILTRO
filterSelect.addEventListener("change", (e) => {
  const todos = document.querySelectorAll(".todo");
  const filter = e.target.value;

  todos.forEach((todo) => {
    switch (filter) {
      case "all":
        todo.style.display = "flex";
        break;
      case "done":
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none");
        break;
      case "todo":
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none");
        break;
    }
  });
});

// BUSCA
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value.toLowerCase();
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    const title = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = title.includes(search) ? "flex" : "none";
  });
});

// LIMPAR BUSCA
eraseButton.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

// INICIAR COM LOCALSTORAGE
document.addEventListener("DOMContentLoaded", loadFromLocalStorage);
