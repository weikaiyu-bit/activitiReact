import React from 'react';
import { Button } from 'antd';

class Index extends React.PureComponent{
  render() {
    return (
      <>
        <div>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="link">Link</Button>
        </div>
      </>
    )
  }
}
export default Index;
