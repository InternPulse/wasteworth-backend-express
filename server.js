// require('dotenv').config({ path: '.env' });
// const app = require('./app');
// const sequelize = require('./config/db');

// const port = process.env.PORT || 3000;

// const startServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection successful');
//     app.listen(port, () => {
//       console.log(`app listening on port: ${port}.....`);
//     });
//   } catch (err) {
//     console.log('Unable to connect to database', err);
//   }
// };
// startServer();
require('dotenv').config({ path: '.env' });
const app = require('./app');
const sequelize = require('./config/db');

// Initialize database connection (but don't start a server)
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
  } catch (err) {
    console.error('Unable to connect to database:', err);
  }
};

// Initialize the database connection
initializeDatabase();

module.exports = app;
