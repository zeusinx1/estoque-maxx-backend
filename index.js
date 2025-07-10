require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://kneitpgeftmyonxozbhq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint para receber webhook da Last Link
app.post('/api/lastlink-webhook', async (req, res) => {
  console.log('Webhook recebido:', req.body);
  
  const { email, status } = req.body;

  if (status === 'paid' && email) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'ativo' })
        .eq('email', email);

      if (error) {
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).send('Erro ao atualizar usuário');
      }
      
      console.log(`Usuário ${email} ativado com sucesso`);
      return res.status(200).send('Usuário ativado');
    } catch (error) {
      console.error('Erro:', error);
      return res.status(500).send('Erro interno');
    }
  }

  res.status(400).send('Dados inválidos');
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Backend EstoqueMaxx funcionando!');
});

// Rota para testar conexão com Supabase
app.get('/test-supabase', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      return res.status(500).send(`Erro Supabase: ${error.message}`);
    }
    
    res.send('Conexão com Supabase OK!');
  } catch (error) {
    res.status(500).send(`Erro: ${error.message}`);
  }
});

// Porta (Railway define automaticamente)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Teste: http://localhost:${PORT}`);
}); 
