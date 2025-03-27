const express = require('express');
const router = express.Router();

// Lấy tất cả task {to_do, doing, done} theo người dùng
router.get('/all', require('./controller').getAllTask);
// Lấy tất cả task theo ngày kết thúc
router.get('/due-date', require('./controller').getTaskByDueDate);
// Thêm task mới
router.post('/create', require('./controller').createTask);
// Đổi status của task
router.patch('/change-status', require('./controller').changeStatus);
// Xóa task
router.delete('/delete', require('./controller').deleteTask);
// Cập nhật task
router.put('/update', require('./controller').updateTask);

module.exports = router;