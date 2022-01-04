import './global.css';
import React from 'react';
import ReactDOM from 'react-dom';
import 'popper.js';
import 'jquery';

import App from '../src/pages/app';

ReactDOM.render(<App />, document.querySelector('#root'));
