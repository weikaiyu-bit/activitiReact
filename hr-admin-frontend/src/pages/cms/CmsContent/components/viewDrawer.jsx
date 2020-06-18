/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Drawer, Row, Col } from 'antd';
import ArticleView from '../../components/ArticleView';

class CmsContentViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { data = {}, visible, categoryData = {} } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="文章预览">
        <ArticleView dataSource={data} categoryData={categoryData} />
      </Drawer>
    );
  }
}

export default CmsContentViewDrawer;
