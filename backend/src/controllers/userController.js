const { User } = require('../dbContext');
const { signIn } = require('../services/jwtservice');

module.exports = {
    postUser: async (user) => {
        try {
            const newUser = await User.create(user);
            return newUser;
        } catch (error) {
            throw new Error('Error while creating user: ' + error.message);
        }
    },
    getAllUsers: async () => {
        try {
            const users = await User.findAll();
            return users;
        } catch (error) {
            throw new Error('Error while fetching users: ' + error.message);
        }
    },
    getUserById: async (userId) => {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Error while fetching user: ' + error.message);
        }
    },
    authLogin: async (user) => {
        try {
            const userExist = await User.findOne({
                where: { user: user.user },
            });
            if (!userExist) {
                return {
                    success: false,
                    message: 'Username does not exist',
                    status: 400
                };
            }
            if (userExist.password !== user.password) {
                return {
                    success: false,
                    message: 'Password is incorrect',
                    status: 401
                };
            }
            if (!userExist.state) {
                return {
                    success: false,
                    message: 'The user does not have access',
                    status: 401
                };
            }
            const token = await signIn(userExist);
            const userLogin = {
                userId: userExist.userId,
                fullName: userExist.fullName,
                role: userExist.role,
                token: token
            };
            return {
                success: true,
                userLogin,
                token
            };
        } catch (error) {
            throw new Error('Error while authenticating user: ' + error.message);
        }
    },
    updateUser: async (userId, userData) => {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Update user fields
            Object.assign(user, userData);
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error while updating user: ' + error.message);
        }
    },
    deleteUser: async (userId) => {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            // Set state to false for logical delete
            user.state = false;
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error while deleting user: ' + error.message);
        }
    }
};
