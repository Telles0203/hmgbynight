const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const publicDir = path.join(__dirname, '..', 'frontend', 'public');
const srcDir = path.join(__dirname, '..', 'frontend', 'src');

app.use('/src', express.static(srcDir));
app.use(express.static(publicDir));

app.use((req, res, next) => {
  if (path.extname(req.path)) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
