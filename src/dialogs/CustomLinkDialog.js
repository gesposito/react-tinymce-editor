import React, { PropTypes } from 'react';

import { Modal, FormGroup, FormControl, Button } from 'react-bootstrap';

export default React.createClass({
  render() {
    const { show, data, onChange, onSubmit, onCancel } = this.props;

    return (
      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Custom Link (Custom Dialog)</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup>
            <FormControl
              type="text"
              placeholder="Text to display:"
              value={data.text}
              onChange={(e) => onChange('text', e.target.value)}
            />
            <FormControl
              type="text"
              placeholder="Link to:"
              value={data.href}
              onChange={(e) => onChange('href', e.target.value)}
            />
           </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle="default" onClick={onCancel}>Close</Button>
          <Button bsStyle="primary" onClick={onSubmit}>Save changes</Button>
        </Modal.Footer>

      </Modal>
    );
  },

});
