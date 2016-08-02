module.exports = {
  'type'      : 'react-component',

  'build': {
    'externals': {
      'react' : 'React'
    },
    'global'  : 'ReactTinyMCEEditor',
    'jsNext'  : true,
    'umd'     : true
  },

  'webpack': {
    // https://github.com/insin/nwb/blob/master/docs/Configuration.md#extra-object
    'extra': {
      'module': {
        'loaders': [
          {
            'test': require.resolve('tinymce/tinymce'),
            'loaders': [
              'imports?this=>window',
              'exports?window.tinymce'
            ]
          },
          {
            'test': /tinymce\/(themes|plugins)\//,
            'loaders': [
              'imports?this=>window'
            ]
          }
        ]
      }
    }
  }

}
