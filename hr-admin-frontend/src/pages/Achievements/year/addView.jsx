import React, { Component } from 'react';
import { Card, Form, Input, Button, Row, Col, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import InputColor from 'react-input-color';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { TextArea } = Input;
class AddView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      color: '',
    };
  }

  okHandler = () => {
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible } = this.props;
    const record = {};
    const { name, age, jigou, pxzt, pxdz, pxnr, pxsj, pfdw } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <>
        <PageHeaderWrapper title="新增绩效考核计划">
          <Card>
            <Form
              horizontal="true"
              style={{ marginLeft: 50, marginRight: 50, lineHeight: '39px' }}
              onSubmit={this.okHandler}
            >
              <Row style={{ marginTop: 12 }}>
                <Col span={24}>
                  <FormItem label="计划类型" {...formItemLayout}>
                    {getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label="对应模板" {...formItemLayout}>
                    {getFieldDecorator('age', {
                      initialValue: age || '',
                    })(
                      <Radio.Group>
                        <Radio style={radioStyle} value={1}>
                          Option A
                        </Radio>
                        <Radio style={radioStyle} value={2}>
                          Option B
                        </Radio>
                        <Radio style={radioStyle} value={3}>
                          Option C
                        </Radio>
                        <Radio style={radioStyle} value={4}>
                          Option D
                        </Radio>
                      </Radio.Group>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={24}>
                  <FormItem label="标题" {...formItemLayout}>
                    {getFieldDecorator('jigou', {
                      initialValue: jigou || '',
                    })(<Input />)}
                  </FormItem>
                </Col>
                <Col span={24}>
                  <FormItem label="考核季度" {...formItemLayout}>
                    {getFieldDecorator('pxdz', {
                      initialValue: pxdz || '',
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={24}>
                  <FormItem label="描述" {...formItemLayout}>
                    {getFieldDecorator('pxnr', {
                      initialValue: pxnr || '',
                    })(<Input />)}
                  </FormItem>
                </Col>
              </Row>
              {getFieldDecorator('id', {
                initialValue: record.id || '',
              })(<Input type="hidden" />)}
            </Form>
            <Row>
              <Col span={4} offset={8}>
                <Button type="primary" onClick={() => router.push('/Achievements/year')}>
                  保存
                </Button>
              </Col>
              <Col span={4}>
                <Button onClick={() => router.push('/Achievements/year')}>返回</Button>
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>
      </>
    );
  }
}

export default Form.create()(AddView);
