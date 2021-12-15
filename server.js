const express = require('express');
require('dotenv').config();

const app = express();

require('./init/errorHandler')();
require('./init/jwt')(app);
require('./init/routes')(app);
require('./init/warnings')();

const PORT = process.env.PORT || 4000;
app.listen(PORT, console.log(`listening at port ${PORT}`));
