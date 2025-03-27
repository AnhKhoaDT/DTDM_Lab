const db = require('../../models');
const { Op } = require('sequelize');
const taskModel = db.Task;

module.exports = {
    getAllTask: async (req, res) => {
        try {
            const user_id = req.user_id;
            const tasks = await taskModel.findAll({ where: { user_id } });

            const toDoTasks = tasks.filter(task => task.status === "to_do");
            const doingTasks = tasks.filter(task => task.status === "doing");
            const doneTasks = tasks.filter(task => task.status === "done");

            res.status(200).json({ toDoTasks, doingTasks, doneTasks });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getTaskByDueDate: async (req, res) => {
        try {
            const user_id = req.user_id;
            const { due_date } = req.body;
            const tasks = await taskModel.findAll({ where: { user_id, due_date: { [Op.lte]: due_date } } });

            const toDoTasks = tasks.filter(task => task.status === "to_do");
            const doingTasks = tasks.filter(task => task.status === "doing");
            const doneTasks = tasks.filter(task => task.status === "done");

            res.status(200).json({ toDoTasks, doingTasks, doneTasks });
        } 
        catch(error) {
            res.status(500).json({ message: error.message });
        }
    },
    createTask: async (req, res) => {
        try {
            const { name, description, due_date } = req.body;
            const user_id = req.user_id;
            const task = await taskModel.create({ user_id, name, description, due_date, status: "to_do" });
            res.status(201).json({ message: "Task added successfully", task });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    changeStatus: async (req, res) => {
        try {
            const { id, status } = req.body;
            await taskModel.update({ status }, { where: { id } });
            res.status(200).json({ message: "Task status updated successfully" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    deleteTask: async (req, res) => {
        try {
            const { id } = req.body;
            await taskModel.destroy({ where: { id } });
            res.status(200).json({ message: "Task deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    updateTask: async (req, res) => {
        try {
            const { id, name, description, due_date } = req.body;

            await taskModel.update({ name, description, due_date }, { where: { id } });
            res.status(200).json({ message: "Task updated successfully" });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}
