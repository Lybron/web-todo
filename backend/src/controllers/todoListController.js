import TodoList from '../models/TodoList.js';
import Todo from '../models/Todo.js';
import errorHandler from './errorHandler.js';

const saveOrUpdate = errorHandler(async (req, res) => {
  const listData = req.body;
  const list = new TodoList(listData);
  list.save();
  res.status(204).send();
});

const getLists = errorHandler(async (req, res) => {
  const todos = await TodoList.find();
  res.status(200).json(todos);
});

const deleteList = errorHandler(async (req, res) => {
  const list = new TodoList(req.body);
  Todo.removeByListId(list.id);
  list.remove();
  res.status(204).send();
});

export default {
  saveOrUpdate,
  getLists,
  delete: deleteList
};