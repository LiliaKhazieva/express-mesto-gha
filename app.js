const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3005 } = process.env;

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

app.use((req, res, next) => {
  req.user = {
    _id: '644232bc422e02e6c372a57c', // id статичный
  };
  next();
});
app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
