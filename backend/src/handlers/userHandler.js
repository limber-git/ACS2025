const { postUser, authLogin, getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

module.exports = {
    postUser: async (req, res) => {
        try {
            const user = req.body;
            const response = await postUser(user);
            res.status(200).json({
                message: 'The user was registered correctly',
                success: response
            });
        } catch (error) {
            res.status(500).json({
                message: 'Registration could not be completed',
                success: false,
                error: error.message || error
            });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            const users = await getAllUsers();
            res.status(200).json({
                users: users,
                success: true
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },
    getUserById: async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await getUserById(userId);
            res.status(200).json({
                // message: 'The operation was correctly',
                success: true,
                data: user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || error
            });
        }
    },
    authLogin: async (req, res) => {
        try {
            const user = req.body;
            const login = await authLogin(user);
            if (login.success) {
                res.cookie('token', login.token, {
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    httpOnly: true
                });
                res.status(200).json({
                    success: true,
                    userLogin: login.userLogin
                });
            } else {
                res.status(404).json(login);
            }
        } catch (error) {
            res.status(500).json({
                message: 'An error occurred while logging in',
                success: false,
                error: error.message || error
            });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const userData = req.body;
            const updatedUser = await updateUser(userId, userData);
            res.status(200).json({
                message: 'User updated successfully',
                success: true,
                data: updatedUser
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating user',
                success: false,
                error: error.message || error
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { userId } = req.params;
            const deletedUser = await deleteUser(userId);
            res.status(200).json({
                message: 'User deleted successfully',
                success: true,
                data: deletedUser
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting user',
                success: false,
                error: error.message || error
            });
        }
    }
};
