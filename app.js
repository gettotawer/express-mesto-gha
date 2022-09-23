const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '632b1719067371d1b907f8d7',
  };

  next();
});
app.use('/cards', routerCards);

app.use('/users', routerUsers);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Page Not Found' });
});
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
