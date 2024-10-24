// Importações e configurações iniciais
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const crypto = require('crypto');

const algorithm = 'aes-256-cbc'; // Algoritmo de criptografia
const iv = Buffer.from('1234567890123456');
const key = crypto.randomBytes(32);

const API_KEY = '1234567890abcdef';

app.use(express.json());
app.use(cors());

// Middleware de autenticação de chave de API
const authenticateAPIKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        return res.status(401).json({ message: 'Chave de API ausente.' });
    }
    if (apiKey !== API_KEY) {
        return res.status(403).json({ message: 'Chave de API inválida.' });
    }
    next();
};

app.use(authenticateAPIKey);

// Endpoint para criptografar a mensagem
app.post('/encrypt', (req, res) => {
    const { message } = req.body;
    console.log('Requisição para criptografar:', message);

    // Cria o cifrador usando a chave e o IV fixo
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(message, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    // Retorna os dados criptografados
    res.json({ encrypted: { iv: iv.toString('base64'), encryptedData } });
});

// Endpoint para descriptografar a mensagem
app.post('/decrypt', (req, res) => {
    const { encryptedData } = req.body;


    console.log('Requisição para descriptografar:', { encryptedData, });


    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    // Retorna a mensagem descriptografada
    res.json({ decrypted });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
