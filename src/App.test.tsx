import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App';

declare const it: any;

it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />, div);
  unmountComponentAtNode(div);
});