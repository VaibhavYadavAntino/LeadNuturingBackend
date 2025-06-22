const Admin = require('../models/admin');

const createDefaultAdmin = async (email, password) => {
    try {
        const adminExists = await Admin.findOne({ email });
        if (!adminExists) {
            await Admin.create({
                email,
                password,
            });
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating default admin:', error);
    }
};

module.exports = {
    createDefaultAdmin,
}; 