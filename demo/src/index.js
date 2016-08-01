import React from 'react';
import { render } from 'react-dom';

import Component from '../../src';

let Demo = React.createClass({
  render() {
    return (
      <div>
        <h1>App Demo</h1>
        <hr />

        <h2>React component 1:</h2>
        <Component />
        
        <hr />

        <h2>React component 2:</h2>
        <Component />

      </div>
    );
  }
})

render(
  <Demo/>,
  document.querySelector('#demo')
);
