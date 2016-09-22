import React, { PropTypes } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import { Tabs, Tab } from 'react-mdl';
import { Textfield, Button } from 'react-mdl';

export default React.createClass({
  getInitialState() {
    return {
      'activeTab': 0,
    };
  },

  render() {
    const { activeTab } = this.state;
    const { show, data, onChange, onSubmit, onCancel } = this.props;

    return (
      <Dialog open={show} style={{ 'width': 400 }}>
        <DialogTitle>Insert/Edit Video</DialogTitle>
        <DialogContent>
          <div>
            <Tabs activeTab={activeTab} onChange={(tabId) => this.setState({ 'activeTab': tabId })}>
              <Tab>
                Source
              </Tab>
              <Tab>
                Embed code
              </Tab>
            </Tabs>
            <section>
              <div className="content">
                <Textfield
                  style={{ 'display': activeTab === 0 ? '' : 'none' }}
                  label="Source:"
                  value={data.source}
                  onChange={(e) => onChange('source', e.target.value)}
                />
                <Textfield
                  style={{ 'display': activeTab === 1 ? '' : 'none' }}
                  label="Embed code:"
                  value={data.embed}
                  onChange={(e) => onChange('embed', e.target.value)}
                  rows={5}
                />
              </div>
            </section>
          </div>

        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onSubmit}>Ok</Button>
          <Button type="button" onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  },

});
