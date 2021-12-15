module.exports = () => {
  process.on('unhandledRejection', (err) => {
    throw err;
  });

  process.on('uncaughtException', (err) => {
    console.log('Error:', err.message);
  });
};
