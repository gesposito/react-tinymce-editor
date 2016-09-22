import React, { PropTypes } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import { Textfield, Button } from 'react-mdl';

export default React.createClass({
  render() {
    const { show, data, onChange, onSubmit, onCancel } = this.props;

    return (
      <Dialog open={show}>
        <DialogTitle>Insert/Edit image</DialogTitle>
        <DialogContent>
          <Textfield
            label="Paste a URL:"
            value={data.src}
            onChange={(e) => onChange('src', e.target.value)}
          />
        {/*
          Not supported yet
          <Textfield
            label=""
            type="file"
            onChange={(e) => onChange('file', e.target.value)}
          />
        */}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onSubmit}>Ok</Button>
          <Button type="button" onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  },

});
