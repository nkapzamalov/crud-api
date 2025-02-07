import userRepository from '../repositories/mongooseUserRepository.js';

export const getUsers = async () => {
    return await userRepository.findAll();
};

export const createUser = async (userData) => {
    return await userRepository.create(userData);
};

export const getUserById = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) {
        return null;
    }
    return user;
};

export const getUserByEmail = async (email) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        return null;
    }
    return user;
};

export const updateUser = async (id, userData) => {
    return await userRepository.update(id, userData);
};

export const deleteUser = async (id) => {
    return await userRepository.delete(id);
}; 