import React, { Component } from 'react';
import { Modal } from 'antd';

export default class deleteTaskModal extends Component {
  okHandler = () => {
    const { onRemoveTask, onCancel, id } = this.props;
    onRemoveTask([id]);
    onCancel();
  };

  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal title="确认" visible={visible} onOk={this.okHandler} onCancel={onCancel} width={460}>
        <h3 style={{ textAlign: 'center' }}>确定删除此任务？将一并删除子任务且无法恢复!</h3>
      </Modal>
    );
  }
}
