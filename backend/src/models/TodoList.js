import { v4 as uuidv4 } from 'uuid';
import database from '../data/database.js';

/*
* Represents a new TodoList.
   * @typdef {Object} TodoList
   * @param {string} id - The unique identifier for the Todo item.
   * @param {string} title - The title of the Todo item.
   * @param {boolean} isCompleted - The completion status of the TodoList.
   * @param {Date} createdAt - The date when the Todo item was created.
*/

class TodoList {
  constructor(data) {
    this.id = data.id ?? uuidv4()
    this.title = data.title ?? 'My New List'
    this.isCompleted = data.isCompleted ?? false
    this.createdAt = data.createdAt ?? Date.now()
  }

  get fileName() {
    return `${this.id}.json`
  }

  static get folderName() {
    return 'todo-lists'
  }

  static find() {
    const objects = database.read(this.folderName)
    return objects.map((data) => {
      const json = JSON.parse(data)
      return new TodoList(json)
    })
      .sort((a, b) => a.createdAt - b.createdAt)
  }

  save() {
    // Save a TodoList to database
    database.save(TodoList.folderName, this.fileName, this)
  }

  remove() {
    // Remove a TodoList from the database
    database.remove(TodoList.folderName, this.fileName)
  }
}

export default TodoList;