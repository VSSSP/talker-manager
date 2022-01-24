const crypto = require('crypto');

const MIN_PASSWORD_LENGTH = 6;
 
function emailValidation(email) {
    const emailCheck = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
    return emailCheck.test(email);
    //  https://github.com/VSSSP/trybewallet/blob/master/src/pages/Login.js
}

function token() {
    return crypto.randomBytes(8).toString('hex');
}

const login = (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(400).send({ message: 'O campo "email" é obrigatório' });
    }
    if (!emailValidation(email)) {
        return res.status(400)
            .send({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
    if (!password) {
        return res.status(400).send({ message: 'O campo "password" é obrigatório' });
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
        return res.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    }
    return res.status(200).send({ token: token() });
};

module.exports = login;