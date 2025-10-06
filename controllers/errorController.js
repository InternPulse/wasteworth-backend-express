const sendErrDev = (err, req, res) => {
  //During Development we can return the entire error object
  return res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrProd = (err, req, res) => {
  //operational, trusted error : send message to client(basically error created ourselves)
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
    });
  }
  //PROGRAMMING OR UNKNOWN ERROR : DONT LEAK DETAILS TO THE CLIENT
  //1) LOG ERROR
  console.error('ERROR 💥', err);
  //2) SEND GENERIC RESPONSE
  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong ',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail ';

  if (process.env.NODE_ENV === 'development') sendErrDev(err, req, res);

  if (process.env.NODE_ENV === 'production') sendErrProd(err, req, res);
};
