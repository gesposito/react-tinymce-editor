/*
	PoC for React-TinyMCE integration inspired by
	https://github.com/Automattic/wp-calypso/
	https://github.com/instructure-react/react-tinymce
*/

import React from 'react';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';

import 'tinymce/skins/lightgray/skin.min.css';

// Plugins
import 'tinymce/plugins/autolink/plugin';
import 'tinymce/plugins/autoresize/plugin';
import 'tinymce/plugins/fullscreen/plugin';
import 'tinymce/plugins/image/plugin';
import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/tabfocus/plugin';

let _instance = 1;

export default React.createClass({
	_editor: null,

  componentWillMount() {
    this._id = 'tinymce-' + _instance;
    _instance++;
  },

  componentDidMount() {
		const { init, onChange, setContent } = this;
		const { content } = this.props;

    // Initialize
    tinymce.init({
      'selector'    			: `#${this._id}`,
      'skin'        			: false,
      'inline'      			: false,
      'menubar'     			: false,
      'plugins'     			:
				[
		                        'autolink',
		                        'autoresize',
		                        'fullscreen',
		                        'image',
		                        'link',
		                        'media',
		                        'paste',
		                        'tabfocus',
		                        // custom plugins

				],
	    'toolbar'     			:
				`
														| bold, italic, underline |
		                        | link |
		                        | bullist, numlist, blockquote |
		                        | alignleft, aligncenter, alignright, alignjustify |
		                        | indent, outdent |
		                        | formatselect, fontselect, fontsizeselect |
		                        | cut, copy, paste, undo, redo, removeformat |
		                        | image media |
		                        | fullscreen |
				`,
      'content_css' 			: [
        // test configurability
        // 'https://tleunen.github.io/react-mdl/styles.css'
      ],
			'browser_spellcheck': true,
			'setup'							: (editor) => {
				this._editor = editor;

				if (content) { editor.on('init', () => setContent(content)); }

				// change doesn't handle direct changes
				editor.on('blur', 	onChange);
				editor.on('change', onChange);
				editor.on('keyup', 	onChange);
				editor.on('paste', 	onChange);
				editor.on('cut', 		onChange);
				editor.on('undo',		onChange);
			}
    });
  },

	componentWillUnmount() {
		if ( this._editor ) {
			tinymce.remove( this._editor );
		}
	},

	onChange() {
		const content = this._editor.getContent();
		this.props.onChange(content);
	},

	setContent(content) {
		this._editor.setContent(content);
	},

	getContent() {
		return this._editor.getContent();
	},

  render() {
    return (
      <textarea
        id={ this._id }
        ref="editor"
				className="tinymce"
      />
    );
  }
});
