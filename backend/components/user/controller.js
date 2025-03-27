const db = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = db.User;

module.exports = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log(req.body);
            const existingUser = await userModel.findOne({ where: { username } });
            if(existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            const hashedPassword = await bcript.hash(password, 10);
            const user = await userModel.create({ username, password: hashedPassword });

            res.status(201).json({ message: "User registered successfully", user });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await userModel.findOne({ where: { username } });
            if(!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "User logged in successfully", token });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}