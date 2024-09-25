import express from "express";
const router = express.Router();

router.post('/create', protectRoute, isAdminRoute, createTask)
router.post('/duplicate/:id',)


export default router;
