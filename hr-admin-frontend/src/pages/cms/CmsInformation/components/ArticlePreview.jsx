import React, { Component } from 'react';
import { Modal } from 'antd';
import ArticleView from './ArticleView';

class CmsArticlePreview extends Component {
  cancelHandel = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { title, visible, dataSource, categoryData } = this.props;
    return (
      <>
        <Modal
          title={title}
          width={1024}
          visible={visible}
          footer={null}
          onCancel={this.cancelHandel}
        >
          <ArticleView dataSource={dataSource} categoryData={categoryData} />
        </Modal>
      </>
    );
  }
}
export default CmsArticlePreview;
