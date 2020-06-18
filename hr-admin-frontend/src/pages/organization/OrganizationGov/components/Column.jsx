/* eslint-disable no-alert */
import React, { Component } from 'react';
import { Modal, Form, Table, Button, Row, Col, Transfer } from 'antd';

const mockData = [];
for (let i = 0; i < 20; i += 1) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    // disabled: i % 3 < 1,
  });
}

const oriTargetKeys = mockData.filter(item => +item.key % 3 > 1).map(item => item.key);

class Column extends Component {
  state = {
    targetKeys: oriTargetKeys,
    selectedKeys: [],
    disabled: false,
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });

    console.log('targetKeys: ', nextTargetKeys);
    console.log('direction: ', direction);
    console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

    console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  };

  handleDisable = disabled => {
    this.setState({ disabled });
  };

  okHandler = () => {
    // const { onOk, record } = this.props;
    // this.props.form.validateFields((err, values) => {
    //   if (!err) {
    // onOk(record.id, { ...record, ...values });
    this.hideModel();
    //   }
    // });
  };

  hideModel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render () {
    const { visible, title, record, tableValue } = this.props;
    const { targetKeys, selectedKeys, disabled } = this.state;
    console.log(record)
    return (
      <>
        <Modal
          title={title}
          width={480}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModel}
        >
          {/* <Row style={{ marginBottom: 20 }}>
            <Col span={2} offset={22}>
              <Button type="primary" onClick={() => alert('导出')}>导出</Button>
            </Col>
          </Row> */}
          <div style={{ marginBottom: 20 }}>
            <Transfer
              dataSource={mockData}
              titles={['Source', 'Target']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={this.handleChange}
              onSelectChange={this.handleSelectChange}
              onScroll={this.handleScroll}
              render={item => item.title}
              disabled={disabled}
            />
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(Column);
