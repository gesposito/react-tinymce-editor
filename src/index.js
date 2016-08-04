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
import 'tinymce/plugins/preview/plugin';
import 'tinymce/plugins/tabfocus/plugin';
import 'tinymce/plugins/textcolor/plugin';
import 'tinymce/plugins/wordcount/plugin';

// Customized plugins
import './plugins/link/plugin';

import LinkDialog from './dialogs/LinkDialog';

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
	// 'link',
	'media',
	'paste',
	'preview',
	'tabfocus',
	'textcolor',
	'wordcount',
	// custom plugins
	'link',
];

const TOOLBAR = [
	'bold, italic, underline',
	'link',
	'bullist, numlist, blockquote',
	'alignleft, aligncenter, alignright, alignjustify',
	'indent, outdent',
	'formatselect, fontselect, fontsizeselect forecolor',
	'cut, copy, paste, undo, redo, removeformat',
	'image media',
	'preview fullscreen',

].join(' | ');

export default React.createClass({
	getInitialState() {
		return {
			'link': {
				'dialog': false,
				'text'	: '',
				'href'	: '',
			},

		};
	},

  componentWillMount() {
    this._id = `tinymce-${_instance}`;
    _instance++;
  },

  componentDidMount() {
		const { setContent, bindEditorEvents } = this;
		const { showLinkDialog, hideLinkDialog } = this;
		const { mode, content } = this.props;

		const isReadOnly = mode === 'readonly';

    // Initialize
    tinymce.init({
      'selector'    			: `#${this._id}`,
      'skin'        			: false,
      'inline'      			: false,
      'menubar'     			: false,
      'plugins'     			: !isReadOnly ? PLUGINS : [],
			'toolbar'						: !isReadOnly ? TOOLBAR : false,
      'content_css' 			: [
        // test configurability
        // 'https://tleunen.github.io/react-mdl/styles.css'
      ],
			'browser_spellcheck': true,
			'setup'							: (editor) => {
				this._editor = editor;

				if (content) {
					editor.on(
						'init',
						() => {
							if (mode) editor.setMode(mode);
							setContent(content);
						}
					);
				}

				//
				editor.namespaced = editor.namespaced || {};
				editor.namespaced.showLinkDialog = showLinkDialog;

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

	componentWillReceiveProps(nextProps) {
		const { mode } = nextProps;
		if (mode !== this.props.mode) {
			// TODO trigger init
			(this._editor).setMode(mode);
		}
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

	showLinkDialog(params) {
		const editor = this._editor;

		const selectedElm = editor.selection.getNode();
		const anchorElm = editor.dom.getParent(selectedElm, 'a[href]');

		const data = {};
		data.text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : editor.selection.getContent({format: 'text'});
		data.href = anchorElm ? editor.dom.getAttrib(anchorElm, 'href') : '';

		this.setState({
			'link': Object.assign(
				this.state.link,
				{
					'text'		: data.text,
					'href'		: data.href,
					'dialog'	: true,
					'onSubmit': params.onSubmit,
				}
			),
		});
	},

	handleLinkChange(key, value) {
		const { link } = this.state;

		this.setState({
			'link': Object.defineProperty(
				link,
				key,
				{
					'enumerable': true,
					value,
				}
			),
		});
	},

	handleLinkSubmit() {
		this.hideLinkDialog(() => {
			const { link } = this.state;
			(this._editor).focus();

			link.onSubmit({ 'data': link });
		});
	},

	hideLinkDialog(callback) {
		this.setState({
			'link': Object.assign(
				this.state.link,
				{
					'dialog': false,
				}
			),
		}, () => {
			if (typeof callback === 'function') {
				callback();
			} else {
				(this._editor).focus();
			}
		});
	},

  render() {
		const { handleLinkChange, handleLinkSubmit, hideLinkDialog } = this;
		const { link } = this.state;

    return (
      <section>
				<textarea
					id={this._id}
					ref="editor"
					className="tinymce"
					style={{ 'visibility': 'hidden' }}
				/>

				<LinkDialog
					show={link.dialog}
					data={link}
					onChange={handleLinkChange}
					onSubmit={handleLinkSubmit}
					onCancel={hideLinkDialog}
				/>
			</section>
    );
  },

});
