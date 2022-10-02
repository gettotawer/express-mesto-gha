const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '632b1719067371d1b907f8d7',
//   };

//   next();
// });
app.use('/cards', routerCards);

app.use('/users', routerUsers);
app.post('/signin', login);
app.post('/signup', createUser);

app.all('*', (req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
