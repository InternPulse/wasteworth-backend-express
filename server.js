require('dotenv').config({ path: '.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app listening on port: ${port}.....`);
});
