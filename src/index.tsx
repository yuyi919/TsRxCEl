import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Root from './RootRoutes';

ReactDOM.render(
  <><CssBaseline /><AppContainer><Root /></AppContainer></>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();