/* global document */
/* global localStorage */

import React from 'react';
import { render } from 'react-dom';

import { Button } from 'react-mdl';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

import TinyMCE from '../../src';

let Demo = React.createClass({
  getInitialState() {
    return {
      'editing': true,
      'content': JSON.parse(
        localStorage.getItem('content')
      ),
    };
  },

  onChange(content) {
    this.setState({
      content,
    });
  },

  onEdit() {
    this.setState({
      'editing': true,
    });
  },

  onSave() {
    localStorage.setItem('content', JSON.stringify(this.state.content));

    this.setState({
      'editing': false,
    });
  },

  render() {
    const { onChange, onEdit, onSave } = this;
    const { content, editing } = this.state;

    return (
      <div style={{ 'width': 1202, 'margin': '10px auto' }}>
        <TinyMCE
          mode={editing ? '' : 'readonly'}
          content={content}
          onChange={onChange}
        />

        {/*
          <div style={{ 'marginTop': 10, 'float': 'left' }}>
            <Button colored raised ripple onClick={onEdit}>Edit</Button>
          </div>
        */}
        <div style={{ 'marginTop': 10, 'float': 'right' }}>
          <Button colored raised ripple onClick={onSave}>Save (local storage)</Button>
        </div>
      </div>
    );
  },

});

render(
  <Demo />,
  document.querySelector('#demo')
);
