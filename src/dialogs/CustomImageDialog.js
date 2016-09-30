import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { Dialog, DialogTitle, DialogContent, DialogActions, Textfield, Button } from 'react-mdl';
import { Card, CardTitle, CardActions, Icon } from 'react-mdl';

const cardStyles = {
  'float'           : 'left',
  'width'           : 256,
  'height'          : 256,
  'backgroundColor' : '#f4f4f4',
  'cursor'          : 'pointer',
};

const actionStyles = {
  'height'          : 52,
  'padding'         : 16,
};

const captionStyles = {
  'color'           : '#a4a4a4',
  'fontSize'        : 14,
  'fontWeight'      : '500',
};

const iconStyles = {
  'position'        : 'absolute',
  'margin'          : 100,
  'fontSize'        : 60,
};

export default React.createClass({
  getInitialState() {
    const { data } = this.props;

    return {
      'showUrl': !!data.src,
    };
  },

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    if (this.props.show) return;

    this.setState({
      'showUrl': !!data.src,
    });
  },

  onUploadImage() {
    const { file } = this.refs;
    ReactDOM.findDOMNode(file.inputRef).click();
  },

  onAddImage() {
    this.setState({
      'showUrl': true,
    }, () => {
      const { src } = this.refs;
      ReactDOM.findDOMNode(src.inputRef).focus();
    });
  },

  onSubmit() {
    this.setState({
      'showUrl': false,
    }, this.props.onSubmit);
  },

  onCancel() {
    this.setState({
      'showUrl': false,
    }, this.props.onCancel);
  },

  render() {
    const { onUploadImage, onAddImage } = this;
    const { showUrl } = this.state;
    const { show, data, onChange } = this.props;
    const { onSubmit, onCancel } = this;

    return (
      <Dialog open={show} style={{ 'width': 600 }}>
        <DialogTitle>Insert/Edit image</DialogTitle>
        <DialogContent>
          <Card shadow={0} style={cardStyles} onClick={onUploadImage}>
            <CardTitle expand />
            <Icon name="photo" style={iconStyles} />

            <CardActions style={actionStyles}>
              <span style={captionStyles}>
                Upload an image
              </span>
            </CardActions>
          </Card>

          <Card shadow={0} style={cardStyles} onClick={onAddImage}>
            <CardTitle expand />
            <Icon name="language" style={iconStyles} />

            <CardActions style={actionStyles}>
              <span style={captionStyles}>
                Add an image from the web
              </span>
            </CardActions>
          </Card>

          <Textfield
            style={{ 'display': 'none' }}
            ref="file"
            label=""
            type="file"
            onChange={(e) => onChange('file', e.target.value)}
          />
          <Textfield
            style={{ 'visibility': showUrl ? '' : 'hidden', 'width': '100%' }}
            ref="src"
            label="Paste a URL:"
            value={data.src}
            onChange={(e) => onChange('src', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onSubmit}>Ok</Button>
          <Button type="button" onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  },

});
