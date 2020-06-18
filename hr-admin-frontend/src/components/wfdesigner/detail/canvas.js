import React from 'react';
import { withPropsAPI } from 'gg-editor';
import { Card, Form, Typography, Input, Checkbox, Select } from 'antd';

const options = [
  { label: '创建', value: 0x01 },
  { label: '开始', value: 0x03 },
  { label: '完成', value: 0x04 },
  { label: '关闭', value: 0x06 },
  { label: '归档', value: 0x05 },
  { label: '跳转', value: 0x07 },
];

class Canvas extends React.PureComponent {
  __listenChange = values => {
    let listen = 0;
    values.forEach(item => {
      listen = (1 << (item - 1)) | listen;
    });
  };

  render() {
    const { data } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title="Canvas">
        <Form layout="vertical">
          <Form.Item label="事件">
            {getFieldDecorator('listen', { initialValue: [] })(
              <Checkbox.Group options={options} onChange={this.__listenChange} />,
            )}
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default Form.create()(withPropsAPI(Canvas));
