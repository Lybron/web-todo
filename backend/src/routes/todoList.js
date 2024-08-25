import express from "express";
const todoListRouter = express.Router();

import todoListController from "../controllers/todoListController.js";

todoListRouter.get("/", todoListController.getLists);
todoListRouter.post("/save", todoListController.saveOrUpdate);
todoListRouter.post("/delete", todoListController.delete);

export default todoListRouter;