import express from "express";
import { duplicateTask } from "../controllers/taskController";
const router = express.Router();

router.post('/create', protectRoute, isAdminRoute, createTask)
router.post('/duplicate/:id',protectRoute,isAdminRoute,duplicateTask)


export default router;
