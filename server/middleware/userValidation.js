export const validateUserData = (req, res, next) => {
    const allowedFields = ['name', 'surname', 'age', 'email', 'favorite_color', 'contact_preference'];
    
    const unknownFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (unknownFields.length > 0) {
        return res.status(400).json({ 
            message: `Unknown field(s): ${unknownFields.join(', ')}`,
            allowedFields
        });
    }

    const { name, surname, email, age, favorite_color, contact_preference } = req.body;

    if (name && typeof name !== 'string') {
        return res.status(400).json({ message: 'Name must be a string' });
    }

    if (surname && typeof surname !== 'string') {
        return res.status(400).json({ message: 'Surname must be a string' });
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ message: 'Valid email is required' });
    }

    if (!age || typeof age !== 'number' || age < 0 || age > 120) {
        return res.status(400).json({ message: 'Age is required and must be a number between 0 and 120' });
    }

    if (favorite_color && typeof favorite_color !== 'string') {
        return res.status(400).json({ message: 'Invalid color' });
    }

    if (!contact_preference || !Array.isArray(contact_preference) || contact_preference.length === 0) {
        return res.status(400).json({ message: 'At least one contact preference is required' });
    }

    const validPreferences = ['email', 'phone_call', 'sms'];
    
    const uniquePreferences = new Set(contact_preference);
    if (uniquePreferences.size !== contact_preference.length) {
        return res.status(400).json({ 
            message: 'Duplicate contact preferences are not allowed'
        });
    }

    const invalidPreferences = contact_preference.filter(pref => !validPreferences.includes(pref));
    if (invalidPreferences.length > 0) {
        return res.status(400).json({ 
            message: `Invalid contact preference(s): ${invalidPreferences.join(', ')}. Must be one of: ${validPreferences.join(', ')}`
        });
    }

    next();
};

export const validateUserId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }
    
    next();
};