const jwt = require('jsonwebtoken')
const generateTokenAndSetCookie = (userId, res) => {
    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign({ userId }, process.env.JWT_SECRET,{
                expiresIn: '15d'
            });

            res.cookie("jwt", token, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.MODE_ENV !== "development"
            });

            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = generateTokenAndSetCookie;