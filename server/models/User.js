import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    surname: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    favorite_color: {
        type: String,   
        required: false
    },
    contact_preference: {
        type: [String],
        required: true
    }
});

const User = mongoose.model('User', userSchema);

export default User; 