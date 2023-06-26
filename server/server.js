const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// global error handler
app.use((err, req, res, next) => {
  const defaultErrObj = {
    status: 400,
    log: "Express error handler caught unknown error"
  };
  const errObj = Object.assign({}, defaultErrObj, err);
  console.log(errObj.log);

  if(err.redirect) return res.redirect(err.redirect);

  return res.status(errObj.status).json(errObj.log);
});

app.listen(3001, () => {
  console.log(`Server listening on port: 3001`);
});
