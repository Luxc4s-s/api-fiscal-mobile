const express = require('express');
const verify = require('./auth');
const calcular = require('./index');
const app = express();

app.use(express.json());

// Rota pública para testar se o site está no ar
app.get('/', (req, res) => {
  res.send('✅ API Fiscal Online! Use POST /api/v1/calculate para cálculos.');
});

// Rota protegida (Só robôs entram aqui)
app.post('/api/v1/calculate', verify, async (req, res) => {
  try {
    const resultado = await calcular(req.body);
    
    // Devolve o cálculo + Recibo de quem pediu
    res.json({
      ...resultado,
      meta: {
        cliente: req.agent.name,
        karma_cliente: req.agent.karma
      }
    });

  } catch (e) {
    res.status(500).json({ error: "Erro interno no cálculo fiscal." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Rodando na porta ${PORT}`));
