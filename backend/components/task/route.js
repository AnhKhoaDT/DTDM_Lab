const express = require('express');
const router = express.Router();

// Lấy tất cả task {to_do, doing, done} theo người dùng
router.get('/all', require('./controller').getAllTask);
// Lấy task theo id
router.get('/id/:id', require('./controller').getTaskById);
// Lấy tất cả task theo ngày kết thúc
router.get('/due-date', require('./controller').getTaskByDueDate);
// Thêm task mới
router.post('/create', require('./controller').createTask);
// Xóa task
router.delete('/delete', require('./controller').deleteTask);
// Cập nhật task
router.put('/update', require('./controller').updateTask);

module.exports = router;