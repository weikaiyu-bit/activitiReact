import React from 'react';
import { withPropsAPI } from 'gg-editor';
import { Card } from 'antd';

class Edge extends React.PureComponent {
  get item() {
    const { propsAPI } = this.props;

    return propsAPI.getSelected()[0];
  }

  constructor(props) {
    super(props);
  }

  render() {
    // const {item} = this;
    // const label
    const { source, target } = this.item;

    return (
      <Card title="连线">
        <p>{source.id}</p>
        <p>{target.id}</p>
      </Card>
    );
  }
}

export default withPropsAPI(Edge);
