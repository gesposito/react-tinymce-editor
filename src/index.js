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
// import 'tinymce/plugins/image/plugin';
// import 'tinymce/plugins/link/plugin';
// import 'tinymce/plugins/media/plugin';
import 'tinymce/plugins/paste/plugin';
import 'tinymce/plugins/preview/plugin';
import 'tinymce/plugins/tabfocus/plugin';
import 'tinymce/plugins/textcolor/plugin';
import 'tinymce/plugins/wordcount/plugin';

// Customized plugins
import './plugins/image/plugin';
import './plugins/link/plugin';
import './plugins/media/plugin';

import config from './config/config';

import BundledLinkDialog from './dialogs/LinkDialog';
import BundledImageDialog from './dialogs/ImageDialog';
import BundledMediaDialog from './dialogs/MediaDialog';

let _instance = 1;

const EVENT_HANDLERS = {
	'change': 'onChange',
	// change event doesn't trigger changes immediately
	'keyup'	:	'onChange',
	'blur'	:	'onChange',
	'paste'	:	'onChange',
	'cut'		:	'onChange',
	'undo'	:	'onChange',

};

export default React.createClass({
	getDefaultProps() {
		return {
      'linkDialog'	: BundledLinkDialog,
      'imageDialog'	: BundledImageDialog,
      'mediaDialog'	: BundledMediaDialog,
			'plugins'			: config.plugins,
			'toolbar'			: config.toolbar,

    };
	},

	getInitialState() {
		return {
			'link': {
				'dialog': false,
				'text'	: '',
				'href'	: '',
			},
			'image': {
				'dialog': false,
				'src'		: '',
				'file'	: null,
			},
			'media': {
				'dialog': false,
				'source': '',
				'embed'	: '',
			},

		};
	},

  componentWillMount() {
    this._id = `tinymce-${_instance}`;
    _instance++;
  },

  componentDidMount() {
		const { setContent, bindEditorEvents } = this;
		const { showLinkDialog, showImageDialog, showMediaDialog } = this;
		const { mode, content } = this.props;
		const { plugins, toolbar } = this.props;

		const isReadOnly = mode === 'readonly';

    // Initialize
    tinymce.init({
      'selector'    			: `#${this._id}`,
      'skin'        			: false,
      'inline'      			: false,
      'menubar'     			: false,
      'plugins'     			: !isReadOnly ? plugins : [],
			'toolbar'						: !isReadOnly ? toolbar : false,
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

				// tinymce.PluginManager.get('name') ?
				editor.namespaced = editor.namespaced || {};
				editor.namespaced.showLinkDialog = showLinkDialog;
				editor.namespaced.showImageDialog = showImageDialog;
				editor.namespaced.showMediaDialog = showMediaDialog;

				bindEditorEvents();
			},
			'style_formats'									: config.style.formats,
			'paste_as_text'									: false,
			'paste_remove_styles'						: false,
			'paste_remove_styles_if_webkit'	: false,

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
		data.text 	= anchorElm ? (anchorElm.innerText || anchorElm.textContent) : editor.selection.getContent({ format: 'text' });
		data.href 	= anchorElm ? editor.dom.getAttrib(anchorElm, 'href') : '';
		data.target = '_blank';

		this.setState({
			'link': Object.assign(
				this.state.link,
				{
					'dialog'	: true,
					'text'		: data.text,
					'href'		: data.href,
					'target'	: data.target,
					'onSubmit': params.onSubmit,
				}
			),
		});
	},

	showImageDialog(params) {
		const editor = this._editor;

		let imgElm = editor.selection.getNode();
		const figureElm = editor.dom.getParent(imgElm, 'figure.image');

		if (figureElm) {
			imgElm = editor.dom.select('img', figureElm)[0];
		}
		if (imgElm && (imgElm.nodeName != 'IMG' || imgElm.getAttribute('data-mce-object') || imgElm.getAttribute('data-mce-placeholder'))) {
			imgElm = null;
		}

		this.setState({
			'image': Object.assign(
				this.state.image,
				{
					'dialog'	: true,
					'src'			: imgElm ? editor.dom.getAttrib(imgElm, 'src') : '',
					'onSubmit': params.onSubmit,
				}
			),
		});
	},

	showMediaDialog(params) {
		const editor = this._editor;

		const mediaElm = editor.selection.getNode()
		const data = editor.namespaced.getMediaData(mediaElm);
		const isFrame = data.type === 'iframe';

		if (data.type === 'iframe') {
			data.embed = editor.namespaced.getMediaHTML(data);
		}

		this.setState({
			'media': Object.assign(
				this.state.media,
				{
					'dialog'	: true,
					'source' 	: isFrame ? '' : data.source1,
					'embed' 	: isFrame ? data.embed : '',
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

	handleImageChange(key, value) {
		const { image } = this.state;

		this.setState({
			'image': Object.defineProperty(
				image,
				key,
				{
					'enumerable': true,
					value,
				}
			),
		});
	},

	handleMediaChange(key, value) {
		const { media } = this.state;

		this.setState({
			'media': Object.defineProperty(
				media,
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

	handleImageSubmit() {
		this.hideImageDialog(() => {
			const { image } = this.state;
			(this._editor).focus();

			image.onSubmit({ 'data': image });
		});
	},

	handleMediaSubmit() {
		this.hideMediaDialog(() => {
			const { media } = this.state;
			(this._editor).focus();

			media.onSubmit({ 'data': media });
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

	hideImageDialog(callback) {
		this.setState({
			'image': Object.assign(
				this.state.image,
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

	hideMediaDialog(callback) {
		this.setState({
			'media': Object.assign(
				this.state.media,
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
		const { handleImageChange, handleImageSubmit, hideImageDialog } = this;
		const { handleMediaChange, handleMediaSubmit, hideMediaDialog } = this;
		const { link, image, media } = this.state;
		const { linkDialog, imageDialog, mediaDialog } = this.props;

		const LinkDialog = (linkDialog);
		const ImageDialog = (imageDialog);
		const MediaDialog = (mediaDialog);

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

				<ImageDialog
					show={image.dialog}
					data={image}
					onChange={handleImageChange}
					onSubmit={handleImageSubmit}
					onCancel={hideImageDialog}
				/>

				<MediaDialog
					show={media.dialog}
					data={media}
					onChange={handleMediaChange}
					onSubmit={handleMediaSubmit}
					onCancel={hideMediaDialog}
				/>
			</section>
    );
  },

});
