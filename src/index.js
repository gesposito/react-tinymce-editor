import React from 'react';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';

import 'tinymce/skins/lightgray/skin.min.css';

// Plugins
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/autoresize/plugin';

let _instance = 1;

export default React.createClass({
  componentWillMount: function() {
    this._id = 'tinymce-' + _instance;
    _instance++;
  },

  componentDidMount() {
    // Initialize
    tinymce.init({
      'selector': `#${this._id}`,
      'skin'    : false,
      'plugins' : ['paste', 'link', 'autoresize']
    });
  },

  render() {
    return (
      <section
        id={ this._id }
        ref="editor"
      />
    );
  }
});
