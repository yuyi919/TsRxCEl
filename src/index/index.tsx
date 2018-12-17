import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Root from './RootRoutes';

hydrate(
  <AppContainer><><CssBaseline /><Root /></></AppContainer>,
  document.getElementById('root') as HTMLElement
);
if ((module as any).hot) {
  (module as any).hot.accept();
}
registerServiceWorker();