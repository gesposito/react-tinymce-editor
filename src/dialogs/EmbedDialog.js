import React, { PropTypes } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions } from 'react-mdl';
import { MDLComponent, Tabs, Tab } from 'react-mdl';
import { Textfield, Button } from 'react-mdl';

export default React.createClass({
  getInitialState() {
    return {
      'activeTab': 0,
    };
  },

  setActiveTab(activeTab) {
    this.setState({
      activeTab,
    }, () => {
      const { source, embed } = this.refs;
      switch (activeTab) {
        case 1:
          embed.inputRef.focus();
          break;
        case 0:
        default:
          source.inputRef.focus();
      }
    });
  },

  render() {
    const { activeTab } = this.state;
    const { show, data, onChange, onSubmit, onCancel } = this.props;
    const { setActiveTab } = this;

    return (
      <Dialog open={show} style={{ 'width': 400 }}>
        <DialogTitle>Insert/Edit Embeddable content</DialogTitle>
        <DialogContent>

          <MDLComponent>
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <Tab>Source</Tab>
              <Tab>Embed code</Tab>
            </Tabs>
          </MDLComponent>
          <section>
            <div className="content">
              <div style={{ 'display': activeTab === 0 ? '' : 'none' }}>
                <Textfield
                  ref="source"
                  label="Source:"
                  value={data.source}
                  onChange={(e) => onChange('source', e.target.value)}
                />
                <Textfield
                  pattern="-?[0-9]*(\.[0-9]+)?"
                  error="Please insert a number"
                  label="Width"
                  style={{ 'width': '200px' }}
                  value={data.width}
                  onChange={(e) => onChange('width', e.target.value)}
                />
                <Textfield
                  pattern="-?[0-9]*(\.[0-9]+)?"
                  error="Please insert a number"
                  label="Height"
                  style={{ 'width': '200px' }}
                  value={data.height}
                  onChange={(e) => onChange('height', e.target.value)}
                />
              </div>

              <div style={{ 'display': activeTab === 1 ? '' : 'none' }}>
                <Textfield
                  ref="embed"
                  label="Embed code:"
                  value={data.embed}
                  onChange={(e) => onChange('embed', e.target.value)}
                  rows={5}
                />
              </div>

            </div>
          </section>

        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onSubmit}>Ok</Button>
          <Button type="button" onClick={onCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  },

});
