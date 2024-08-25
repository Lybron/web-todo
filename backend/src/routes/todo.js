import express from "express";
const todoRouter = express.Router();

import todoController from "../controllers/todoController.js";

todoRouter.get("/:listId", todoController.getByListId);
todoRouter.post("/save", todoController.saveOrUpdate);
todoRouter.post("/delete", todoController.delete);

export default todoRouter;