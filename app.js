const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const { cardRouter, userRouter } = require('./routes');
const { login, createUser } = require('./controllers/users');
const { NotFoundError } = require('./errors');
const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected');
  })
  .catch((err) => {
    console.log('Error connect');
    console.log(err);
  });
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);

app.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === HTTP_STATUS_INTERNAL_SERVER_ERROR
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
