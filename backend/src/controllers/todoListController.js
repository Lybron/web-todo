import TodoList from '../models/TodoList.js';
import Todo from '../models/Todo.js';

const saveOrUpdate = (req, res) => {
  const listData = req.body;
  const list = new TodoList(listData);
  list.save();

  res.status(204).send();
};

const getLists = (req, res) => {
  const todos = TodoList.find();
  res.status(200).json(todos);
};

const deleteList = (req, res) => {
  const list = new TodoList(req.body);

  Todo.removeByListId(list.id);
  list.remove();

  res.status(204).send();
};

export default {
  saveOrUpdate,
  getLists,
  delete: deleteList
};