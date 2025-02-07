import express from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/usersController.js';
import { validateUserData, validateUserId } from '../middleware/userValidation.js';


const router = express.Router();

router.get('/', getUsers);
router.post('/', validateUserData, createUser);
router.put('/:id', validateUserId, validateUserData, updateUser);
router.delete('/:id', validateUserId, deleteUser);

export default router;  