import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import App from './containers/App';
//import registerServiceWorker from './serviceworker/registerServiceWorker';
import './styles/index.css';

const renderApp = Component =>
	ReactDOM.render(
      <BrowserRouter>
          <Component />
      </BrowserRouter>,
		document.getElementById("root")
	);

renderApp(App);
//registerServiceWorker();
