import React, { Component } from 'react';
import { Timeline, Button, Input, Row, Col, Form } from 'antd';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;

@Form.create()
export default class ProductTimelineView extends Component {
  state = {
    controlVisible: false,
  };

  // 是否显示富文本组件
  showBraftEditor = () => {
    this.setState({ controlVisible: true });
  };

  hideBraftEditor = () => {
    this.setState({ controlVisible: false });
  };

  saveLog = () => {
    const { onSaveProductLog, onUpdate, data, onGetById } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onSaveProductLog({
          id: 0,
          ...values,
          description: values.description.toHTML(),
          productId: data.id,
        });
        onUpdate(data.id, {
          ...data,
          version: values.version,
        });
        onGetById(data.id);
        this.props.form.resetFields(['version', 'versionType', 'description']);
      }
    });
  };

  renderDynamic = item => (
    <Timeline.Item key={item.id}>
      <span style={{ fontSize: 40 }}>{item.version}</span>
      <br></br>
      <span style={{ background: '#DDDDDD' }}>{item.createTime}</span>
      {item.description !== null ? (
        <div dangerouslySetInnerHTML={{ __html: `${item.description}` }}></div>
      ) : null}
    </Timeline.Item>
  );

  render() {
    const { data, jobProductsModel } = this.props;
    console.log('产品日志', this.props);
    if (!data) return false;
    const { controlVisible } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 14 },
    };
    const { productLogData } = jobProductsModel;
    console.log('productLogData', productLogData);
    return (
      <div>
        <Button
          style={{ marginTop: 12, marginBottom: 20 }}
          type="primary"
          onClick={this.showBraftEditor}
          htmlType="submit"
        >
          增加日志
        </Button>
        {controlVisible ? (
          <Form horizontal="true">
            <Row>
              <Col span={24}>
                <FormItem label="版本号" {...formItemLayout}>
                  {getFieldDecorator('version', {
                    initialValue: '',
                  })(<Input style={{ width: '150px' }} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="版本类型" {...formItemLayout}>
                  {getFieldDecorator('versionType', {
                    initialValue: '',
                  })(<Input style={{ width: '150px' }} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="日志描述">
                  {getFieldDecorator('description', {
                    initialValue: BraftEditor.createEditorState(''),
                  })(
                    <BraftEditor
                      style={{ border: '1px solid #E8E8E8' }}
                      media={this.uploadFn}
                      contentStyle={{ height: '400px' }}
                    />,
                  )}
                </FormItem>
                <div style={{ width: 158, margin: '0 auto' }}>
                  <Button
                    style={{ marginTop: 12 }}
                    type="primary"
                    htmlType="submit"
                    onClick={this.saveLog}
                  >
                    保存
                  </Button>
                  <Button
                    style={{ marginTop: 12, marginLeft: 12 }}
                    htmlType="submit"
                    onClick={this.hideBraftEditor}
                  >
                    取消
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        ) : null}
        <Timeline style={{ marginTop: 24 }}>
          {productLogData !== null && productLogData !== undefined
            ? productLogData.map(item => this.renderDynamic(item))
            : null}
        </Timeline>
      </div>
    );
  }
}
