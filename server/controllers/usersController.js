import * as usersService from '../services/usersService.js';

export const getUsers = async (req, res) => {
    const users = await usersService.getUsers();
    res.json(users);
};

export const createUser = async (req, res) => {
    const userData = req.body;
    const existingUser = await usersService.getUserByEmail(userData.email);
    if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }
    const newUser = await usersService.createUser(userData);
    res.status(201).json(newUser);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const userData = req.body;
    const updatedUser = await usersService.updateUser(id, userData);
    res.json(updatedUser);
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await usersService.getUserById(id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    await usersService.deleteUser(id);
    res.status(204).send();
}; 