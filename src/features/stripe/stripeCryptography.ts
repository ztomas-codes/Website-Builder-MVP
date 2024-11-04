const cryptos = require('crypto');

export function encrypt(text : any) {

    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string ; // Mělo by být 32 bajtů
    const IV_LENGTH = 16;

    let iv = cryptos.randomBytes(IV_LENGTH);
    let cipher = cryptos.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: any) {

    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string; // Mělo by být 32 bajtů
    const IV_LENGTH = 16;

    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = cryptos.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export function generateEncryptionKey() {
    return cryptos.randomBytes(32).toString('hex');
}  