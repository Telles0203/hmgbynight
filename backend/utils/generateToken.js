function generateEmailToken(length = 10) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * chars.length);
        token += chars[index];
    }

    return token;
}

module.exports = generateEmailToken;