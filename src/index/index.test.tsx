import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
// import { it } from "ts-jest";
import Index from './RootRoutes';

declare const it: any;
it('renders without crashing', () => {
  const div = document.createElement('div');
  render(<Index />, div);
  unmountComponentAtNode(div);
});