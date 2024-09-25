import express from "express";
import { duplicateTask, postTaskActivity } from "../controllers/taskController";
const router = express.Router();

router.post('/create', protectRoute, isAdminRoute, createTask)
router.post('/duplicate/:id',protectRoute,isAdminRoute,duplicateTask)
router.post('activity/:id', protectRoute, postTaskActivity)

export default router;
