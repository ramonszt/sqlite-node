const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  db.all('SELECT * FROM usuarios', [], (err, rows) => {
    if (err) throw err;
    res.render('index', { usuarios: rows });
  });
});

app.post('/add', (req, res) => {
  const { nome, email } = req.body;
  db.run('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email], err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

app.get('/delete/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM usuarios WHERE id = ?', id, err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

app.get('/edit/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM usuarios WHERE id = ?', id, (err, row) => {
    if (err) throw err;
    res.render('edit', { usuario: row });
  });
});

app.post('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  db.run('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, id], err => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
