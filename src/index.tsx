import CssBaseline from '@material-ui/core/CssBaseline';
import React, { useState } from 'react';
import { hydrate } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import registerServiceWorker from 'src/index/registerServiceWorker';
import Root from 'src/index/RootRoutes';
import './global';
import './index/index.css';

const Cbutton = (props: any) => {
  const [app, setApp] = useState(0);
  const test = {
      app,
      setApp: () => { setApp(app+1) }
  }
  return <button {...props} onClick={test.setApp}>{{ app }}</button>;
}
hydrate(
  <AppContainer><div><Cbutton /><CssBaseline /><Root /></div></AppContainer>,
  document.getElementById('root') as HTMLElement
);
if ((module as any).hot) {
  (module as any).hot.accept();
}
registerServiceWorker();