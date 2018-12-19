import CssBaseline from '@material-ui/core/CssBaseline';
import * as React from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import registerServiceWorker from 'src/index/registerServiceWorker';
import Root from 'src/index/RootRoutes';
import './global';
import './index/index.css';

hydrate(
  <AppContainer><><CssBaseline /><Root /></></AppContainer>,
  document.getElementById('root') as HTMLElement
);
if ((module as any).hot) {
  (module as any).hot.accept();
}
registerServiceWorker();