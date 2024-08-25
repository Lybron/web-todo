import TodoList from '../models/TodoList.js';

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
  list.remove();
  res.status(204).send();
};

export default {
  saveOrUpdate,
  getLists,
  delete: deleteList
};