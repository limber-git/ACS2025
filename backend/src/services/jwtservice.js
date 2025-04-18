const jwt = require('jsonwebtoken');
const { User } = require('../dbContext');
const {
    JWT_KEY_MASTER
} = process.env

module.exports = {
    signIn: async (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                let payload = {
                    userId: user.userId,
                    fullName: user.fullName,
                    role: user.role
                }
                const token = await jwt.sign(payload, JWT_KEY_MASTER)
                resolve(token)
            } catch (error) {
                reject(error)
            }
        })
    },
    validToken: async (req, res) => {
        try {
            if (req.cookies.token) {
                const token = req.cookies.token;
                jwt.verify(token, JWT_KEY_MASTER, async (error, decoded) => {
                    if (decoded) {
                        const currentTime = Math.floor(Date.now() / 1000);
                        const userLogin = await User.findByPk(decoded.userId)
                        if (!userLogin) {
                            return res.status(404).json({
                                success: false,
                                messageError: "Username does not exist"
                            })
                        }
                        return res.status(200).json({
                            success: true,
                            userLogin: {
                                userId: userLogin.userId,
                                fullName: userLogin.fullName,
                                role: userLogin.role,
                                token: token
                            }
                        });
                    }
                    else {
                        res.clearCookie('token', {
                            httpOnly: true,
                        })
                        res.status(500).json({
                            success: false,
                            message: 'The session has been closed.'
                        })
                    }
                });
            }
            else {
                return res.status(200).json({ success: false, message: 'You must log in' });
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },
    isAdmin: async (req, res, next) => {
        try {
            if (!req.cookies.token) {
                return res.status(401).json({ messageError: "Usuario no autorizado" });
            }
            const token = req.cookies.token;
            jwt.verify(token, JWT_KEY_MASTER, async (error, decoded) => {
                const usLogin = await User.findByPk(decoded.userId);
                if (usLogin) {
                    if (usLogin.rol == "Admin") {
                        return next();
                    }
                    return res
                        .status(401)
                        .json({ messageError: "Usuario no autorizado" });
                }
                return res.status(404).json({ messageError: "Usuario no encontrado" });
            });
        } catch (error) {
            return res.status(401).json({ messageError: error.message });
        }
    },
}