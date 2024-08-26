import express from 'express'
import cors from 'cors'
import todoRouter from './routes/todo.js';
import todoListRouter from './routes/todoList.js';

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

app.use('/todo', todoRouter);
app.use('/todo-lists', todoListRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send('There was an error.');
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))

export default app;