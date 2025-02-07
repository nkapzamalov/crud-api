import User from '../models/User.js';

class MongooseUserRepository {
    async findAll() {
        return await User.find();
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async update(id, userData) {
        return await User.findByIdAndUpdate(id, userData, { 
            new: true,
            runValidators: true 
        });
    }

    async delete(id) {
        await User.findByIdAndDelete(id);
        return true;
    }
}

export default new MongooseUserRepository(); 