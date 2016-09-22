import React, { PropTypes } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import { Textfield, Button } from 'react-mdl';

export default React.createClass({
  render() {
    const { show, data, onChange, onSubmit, onCancel } = this.props;

    return (
      <Dialog open={show}>
        <DialogTitle>Insert/Edit Link</DialogTitle>
        <DialogContent>
          <Textfield
            label="Text to display:"
            value={data.text}
            onChange={(e) => onChange('text', e.target.value)}
          />
          <Textfield
            label="Link to:"
            value={data.href}
            onChange={(e) => onChange('href', e.target.value)}
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
