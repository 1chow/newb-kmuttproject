import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import {whyDidYouUpdate} from 'why-did-you-update'

if (process.env.NODE_ENV !== 'production') {
    let createClass = React.createClass;
    Object.defineProperty(React, 'createClass', {
      set: (nextCreateClass) => {
        createClass = nextCreateClass;
      }
    });
    whyDidYouUpdate(React)
}

ReactDOM.render(<BrowserRouter>
                     <App />
            </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
