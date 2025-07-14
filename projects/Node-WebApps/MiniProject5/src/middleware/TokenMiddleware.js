const crypto = require('crypto');
const Buffer = require('buffer').Buffer;

const SECRET_KEY = 'your-secret-key-here';
const TOKEN_COOKIE_NAME = 'SuperToken';

function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) {
        str += '=';
    }
    return Buffer.from(str, 'base64').toString();
}

function createJWT(payload) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
        .createHmac('sha256', SECRET_KEY)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJWT(token) {
    try {
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        
        // Verify signature
        const expectedSignature = crypto
            .createHmac('sha256', SECRET_KEY)
            .update(`${encodedHeader}.${encodedPayload}`)
            .digest('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        if (signature !== expectedSignature) {
            return null;
        }

        const payload = JSON.parse(base64UrlDecode(encodedPayload));

        // Check expiration
        if (payload.exp && Date.now() >= payload.exp * 1000) {
            return null;
        }

        return payload;
    } catch (err) {
        return null;
    }
}

function TokenMiddleware(req, res, next) {
    const token = req.cookies[TOKEN_COOKIE_NAME];
    
    if (!token) {
        return res.status(401).json({ error: 'Not Authenticated' });
    }

    const payload = verifyJWT(token);
    if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = payload.user;
    next();
}

function generateToken(res, user) {
    const payload = {
        user: user,
        exp: Math.floor(Date.now() / 1000) + 3600
    };

    const token = createJWT(payload);

    res.cookie(TOKEN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });
}

function removeToken(res) {
    res.clearCookie(TOKEN_COOKIE_NAME);
}

module.exports = {
    TokenMiddleware,
    generateToken,
    removeToken
};