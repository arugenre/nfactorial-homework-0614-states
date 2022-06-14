import { useEffect, useState } from "react";
import { v4 as myNewID } from "uuid";

import "./App.css";

// button-group
const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  const getItems = () => {
    let item = localStorage.getItem("user");
    if (item) {
      return JSON.parse(item);
    } else {
      return [];
    }
  }
  const [itemToDo, setItemToDo] = useState("");
  const [items, setItems] = useState(getItems());

  const [filterType, setFilterType] = useState("all");
  const [inputs, setInputs] = useState([]); // fot filter



  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(items))
  },[items])

  const handleToDoChange = (event) => {
    setItemToDo(event.target.value);
  };

  // fot filter
  const handleToSearch = (event) => {
    const find = event.target.value.toLowerCase();
    const delTodo = (items.filter((item) => item.label.toLowerCase().includes(find)));
    setFilterType("search")
    setInputs([...delTodo]);
  };

  const handleAddItem = () => {
    const newItem = { key: myNewID(), label: itemToDo };

    setItems((prevElement) => [newItem, ...prevElement]);

    setItemToDo("");
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleDeleteItem = ({ key }) => {
    const delTodo = items.filter((item) => item.key !== key);
    setItems([...delTodo]);

  }
  const handleFilterChange = ({ type }) => {
    setFilterType(type);
  };

  const exclamationMark = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, exclamation: !item.exclamation };
        } else return item;
      })
    );
  }
  

  const moreToDo = items.filter((item) => !item.done).length;

  const doneToDo = items.length - moreToDo;

  // fot filter
  const filteredArray =
    filterType === "all" ? items
      : filterType === "done"? items.filter((item) => item.done)
      : filterType === "search"? inputs
      : items.filter((item) => !item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {moreToDo} more to do, {doneToDo} done
        </h2>
      </div>

      {/* // fot filter */}
      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleToSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              key={item.type}
              type="button"
              className={`btn btn-info ${
                filterType === item.type ? "" : "btn-outline-info"
              }`}
              onClick={() => handleFilterChange(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {filteredArray.length > 0 &&
          filteredArray.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item ${item.done ? "done" : ""}`}>
                <span
                  className={`todo-list-item-label ${item.exclamation===true ? "exclamation" : ""}`}
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className={`btn ${item.exclamation === true ? "btn-success" : "btn-outline-success"} btn-sm float-right`}
                  onClick={() => exclamationMark(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleDeleteItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      <div className="item-add-form d-flex">
        <input
          value={itemToDo}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleToDoChange}
        />
        <button className="btn btn-outline-secondary" 
        onClick={handleAddItem}
        >
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;