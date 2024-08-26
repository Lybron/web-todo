import Todo from '../models/Todo.js';
import errorHandler from './errorHandler.js';

const saveOrUpdate = errorHandler(async (req, res) => {
  const todo = new Todo(req.body);
  if (!todo.listId) {
    res.status(400).json({ message: 'List ID is required' });
    return;
  }
  if (!todo.title) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }
  todo.save();
  res.json(todo);
});

const deleteTodo = errorHandler(async (req, res) => {
  const todo = new Todo(req.body);
  todo.remove();
  res.status(204).send();
});

const getByListId = errorHandler(async (req, res) => {
  const { listId } = req.params;
  const list = Todo.findByListId(listId);
  res.status(200).json(list);
});

export default {
  saveOrUpdate,
  getByListId,
  delete: deleteTodo,
};