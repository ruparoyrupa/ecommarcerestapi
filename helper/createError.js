// create a error
const createError = (msg, status) => {
  const err = new Error();
  err.message = msg;
  err.status = status;
  return err;
};

export default createError;
