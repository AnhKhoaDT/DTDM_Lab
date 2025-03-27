const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const authMiddleware = require('./middwares/auth.mw');

app.use('/api/user', require('./components/user/route'));
app.use('/api/task', authMiddleware, require('./components/task/route'));

const PORT = process.env.SV_PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));