module.exports = {
  'plugins': [
    'autolink',
    'autoresize',
    'fullscreen',
    // 'image',
    // 'link',
    // 'media',
    'paste',
    'preview',
    'tabfocus',
    'textcolor',
    'wordcount',
    // custom plugins
    'image',
    'link',
    'media',
  ],

  'toolbar': [
    'bold, italic, underline',
    'link',
    'bullist, numlist, blockquote',
    'alignleft, aligncenter, alignright, alignjustify',
    'indent, outdent',
    'formatselect, fontselect, fontsizeselect forecolor',
    'cut, copy, paste, undo, redo, removeformat',
    'image media',
    'preview fullscreen',

  ].join(' | '),

  'style': {
    'formats': [
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
  },

};
