const axios = require('axios');
require('dotenv').config();

const verifyMoltbookAgent = async (req, res, next) => {
  try {
    const token = req.header('X-Moltbook-Identity');
    
    // Se não tiver token, bloqueia
    if (!token) {
      return res.status(401).json({ error: 'Acesso Negado: Falta Token' });
    }

    // Valida com o Moltbook
    const resp = await axios.post(
      'https://moltbook.com/api/v1/agents/verify-identity',
      { token: token },
      {
        headers: { 'X-Moltbook-App-Key': process.env.MOLTBOOK_APP_KEY }
      }
    );

    if (!resp.data.valid) {
      return res.status(401).json({ error: 'Token Inválido ou Expirado' });
    }
    
    // Se passou, anexa o agente ao pedido
    req.agent = resp.data.agent;
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro de Autenticação' });
  }
};

module.exports = verifyMoltbookAgent;
