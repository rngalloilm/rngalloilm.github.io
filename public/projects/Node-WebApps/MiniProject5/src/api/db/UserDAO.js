const crypto = require('crypto');
const users = require('./data/users.json');

function getFilteredUser(user) {
    return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        email: user.email,
        avatar: user.avatar
    };
}

module.exports = {
    getUserByCredentials: (email, password) => {
        return new Promise((resolve, reject) => {
            // Find user by email (convert users object to array first)
            const user = Object.values(users).find(user => user.email === email);
            if (!user) {
                reject({ code: 401, message: "No such user" });
                return;
            }

            crypto.pbkdf2(
                password,
                user.salt,
                100000,
                64,
                'sha512',
                (err, derivedKey) => {
                    if (err) {
                        reject({ code: 500, message: "Error hashing password" });
                        return;
                    }

                    const hashedAttempt = derivedKey.toString('hex');
                    if (crypto.timingSafeEqual(
                        Buffer.from(user.password, 'hex'),
                        Buffer.from(hashedAttempt, 'hex')
                    )) {
                        resolve(getFilteredUser(user));
                    } else {
                        reject({ code: 401, message: "Invalid password" });
                    }
                }
            );
        });
    }
};