const bcrypt = require('bcryptjs');

const getPasswordHash = async (plaintext: string): Promise<string> => {
    const rounds = 12;
    const salt = await bcrypt.genSalt(rounds);
    return await bcrypt.hash(plaintext, salt);
}


const comparePassword = async (plaintext:string, hashedPassword: string) => {
    return await bcrypt.compare(plaintext, hashedPassword);
}

module.exports = getPasswordHash;
module.exports = comparePassword;