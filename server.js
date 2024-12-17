const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const cors = require('cors');  // Importando o CORS

const app = express();
const port = 3000;

// Permitir CORS para todas as origens (apenas para fins de desenvolvimento)
app.use(cors());  // Adiciona o middleware CORS

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para upload e conversão
app.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("Por favor, envie um arquivo PDF.");
    }

    try {
        const apiKey = process.env.CLOUDMERSIVE_API_KEY;

        // Solicitação para a API do Cloudmersive
        const response = await axios.post('https://api.cloudmersive.com/convert/pdf/to/docx', req.file.buffer, {
            headers: {
                'Apikey': apiKey,
                'Content-Type': 'application/pdf'
            },
            responseType: 'arraybuffer'
        });

        if (response.data && response.data.length > 0) {
            console.log("Arquivo convertido com sucesso.");

            // Enviar o arquivo convertido para o cliente
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
            res.send(response.data);
        } else {
            console.error("Erro: A API não retornou dados válidos.");
            res.status(500).send("Erro ao converter o arquivo.");
        }
    } catch (error) {
        console.error("Erro na conversão:", error);
        res.status(500).send("Erro ao converter o arquivo.");
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
