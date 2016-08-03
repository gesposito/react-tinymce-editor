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
// import 'tinymce/plugins/link/plugin';
import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/tabfocus/plugin';

import './plugins/link/plugin';

let _instance = 1;

const EVENT_HANDLERS = {
	'change': 'onChange',
	// change doesn't handle direct changes
	'keyup'	:	'onChange',
	'blur'	:	'onChange',
	'paste'	:	'onChange',
	'cut'		:	'onChange',
	'undo'	:	'onChange',

};

const PLUGINS = [
	'autolink',
	'autoresize',
	'fullscreen',
	'image',
	'link',
	'media',
	'paste',
	'tabfocus',
	// custom plugins

];

const TOOLBAR = [
	'bold, italic, underline',
	'link',
	'bullist, numlist, blockquote',
	'alignleft, aligncenter, alignright, alignjustify',
	'indent, outdent',
	'formatselect, fontselect, fontsizeselect',
	'cut, copy, paste, undo, redo, removeformat',
	'image media',
	'fullscreen',

].join(' | ');

export default React.createClass({
  componentWillMount() {
    this._id = `tinymce-${_instance}`;
    _instance++;
  },

  componentDidMount() {
		const { setContent, bindEditorEvents } = this;
		const { content } = this.props;

    // Initialize
    tinymce.init({
      'selector'    			: `#${this._id}`,
      'skin'        			: false,
      'inline'      			: false,
      'menubar'     			: true,
      'plugins'     			: PLUGINS,
			'toolbar'						: TOOLBAR,
      'content_css' 			: [
        // test configurability
        // 'https://tleunen.github.io/react-mdl/styles.css'
      ],
			'browser_spellcheck': true,
			'setup'							: (editor) => {
				this._editor = editor;

				if (content) { editor.on('init', () => setContent(content)); }

				// change doesn't handle direct changes
				bindEditorEvents();
			},
			'style_formats': [
				{
					'title'		: 'Image Left',
					'selector': 'img',
					'styles': {
						'float' : 'left',
						'margin': '0 10px 0 10px',
					},
				},
				{
					'title'		: 'Image Right',
					'selector': 'img',
					'styles': {
						'float' : 'right',
						'margin': '0 10px 0 10px',
					},
				},
			],

    });
  },

	componentWillUnmount() {
		const editor = this._editor;
		if (editor) {
			this.unbindEditorEvents();
			tinymce.remove(editor);
		}
	},

	onChange() {
		const content = (this._editor).getContent();
		this.props.onChange(content);
	},

	setContent(content) {
		(this._editor).setContent(content);
	},

	getContent() {
		return (this._editor).getContent();
	},

	_editor: null,

	bindEditorEvents() {
		Object.keys(EVENT_HANDLERS).map((eventName) => {
			const eventHandler = EVENT_HANDLERS[eventName];
			(this._editor).on(eventName, this[eventHandler]);
		});
	},

	unbindEditorEvents() {
		// TODO DRY
		Object.keys(EVENT_HANDLERS).map((eventName) => {
			const eventHandler = this[EVENT_HANDLERS[eventName]];
			(this._editor).off(eventName, this[eventHandler]);
		});
	},

  render() {
    return (
      <textarea
				id={this._id}
				ref="editor"
				className="tinymce"
      />
    );
  },

});
