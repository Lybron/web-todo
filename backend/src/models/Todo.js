import { v4 as uuidv4 } from 'uuid';
import database from '../data/database.js';

/*
* Represents a new Todo item.
   * @typdef {Object} Todo
   * @param {string} id - The unique identifier for the Todo item.
   * @param {string} listId - The unique identifier for the TodoList the item belongs to.
   * @param {string} title - The title of the Todo item.
   * @param {boolean} isCompleted - The completion status of the Todo item.
   * @param {Date} dueDate - The date when the Todo item should be completed.
   * @param {Date} createdAt - The date when the Todo item was created.
*/

class Todo {
  constructor(data) {
    this.id = data.id ?? uuidv4()
    this.listId = data.listId
    this.title = data.title ?? 'New Todo'
    this.isCompleted = data.isCompleted ?? false
    this.dueDate = data.dueDate ?? null
    this.createdAt = data.createdAt ?? Date.now()
  }

  get fileName() {
    return `${this.listId}_${this.id}.json`
  }

  static get folderName() {
    return 'todos'
  }

  static findByListId(listId) {
    const objects = database.readWithFilter(Todo.folderName, listId)
    return objects.map((data) => {
      const json = JSON.parse(data)
      return new Todo(json)
    })
      .sort((a, b) => a.createdAt - b.createdAt)
  }

  save() {
    // Save a Todo to the database
    database.save(Todo.folderName, this.fileName, this)
  }

  remove() {
    // Remove a Todo from the database
    database.remove(Todo.folderName, this.fileName)
  }
}

export default Todo;