const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      title: 'Library'
    }
  );
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
