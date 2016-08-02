import React from 'react';
import { render } from 'react-dom';

import { Button } from 'react-mdl';

import TinyMCE from '../../src';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

let Demo = React.createClass({
  getInitialState() {
    return {
      'content': JSON.parse(
        localStorage.getItem('content')
      )
    }
  },

  onChange(content) {
    this.setState({
      content
    });
  },

  onSave() {
    localStorage.setItem('content', JSON.stringify(this.state.content));
  },

  render() {
    const { onChange, onSave } = this;
    const { content } = this.state;

    return (
      <div style={{ 'width': 1202, 'margin': '10px auto' }}>
        <TinyMCE
          content={content}
          onChange={onChange}
        />

        <div style={{ 'marginTop': 10, 'float': 'right' }}>
          <Button colored raised ripple onClick={onSave}>Save to local storage</Button>
        </div>
      </div>
    );
  }
});

render(
  <Demo/>,
  document.querySelector('#demo')
);
