const express = require('express');
const bodyParser = require('body-parser');
const login = require('./middlewares/login');
const talkers = require('./middlewares/talkers');

const app = express();
app.use(bodyParser.json());
app.use('/login', login);
app.use('/talker', talkers);

const HTTP_OK_STATUS = 200;
const PORT = '3000';

app.post('/login', login);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
