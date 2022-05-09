const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

require('./init/errorHandler')();
require('./init/jwt')(app);
require('./init/routes')(app);
require('./init/warnings')();

// app.use(express.static('client/build'));

// app.get('*', (req, res) => {
//   res.sendFile(
//     path.resolve(path.resolve(__dirname, 'client', 'build', 'index.html'))
//   );
// });

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`listening at port ${PORT}`));
