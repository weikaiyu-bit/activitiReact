import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Row, Col } from 'antd';
import InputColor from 'react-input-color';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { TextArea } = Input;
class Addmodal extends Component {
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
    const { title, visible, record } = this.props;
    const { name, age, jigou, pxzt, pxdz, pxnr, pxsj, pfdw } = record;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <Modal
          title={title}
          width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form
            horizontal="true"
            style={{ marginLeft: 50, marginRight: 50, lineHeight: '39px' }}
            onSubmit={this.okHandler}
          >
            {/* <Row style={{ marginTop: 12 }}>
              <Col span={24} pull={3}>
                <FormItem label="培训主题" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {
                    getFieldDecorator('pxzt', {
                      initialValue: pxzt || '',
                      rules: [{
                        required: true, message: '培训主题',
                      }],
                    })(<Input />)
                  }
                </FormItem>
              </Col>
            </Row> */}
            <Row style={{ marginTop: 12 }}>
              <Col span={12} pull={1}>
                <FormItem label="名字" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="年龄" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('age', {
                    initialValue: age || '',
                  })(<Input style={{ width: '260px' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={12} pull={1}>
                <FormItem label="机构" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('jigou', {
                    initialValue: jigou || '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="考勤时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('pxdz', {
                    initialValue: pxdz || '',
                  })(<Input style={{ width: '260px' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={12} pull={1}>
                <FormItem label="考勤地点" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('jigou', {
                    initialValue: jigou || '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="是否缺勤" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('pxdz', {
                    initialValue: pxdz || '',
                  })(<Input style={{ width: '260px' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={24} pull={3}>
                <FormItem label="缺勤原因" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
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
        </Modal>
      </>
    );
  }
}

export default Form.create()(Addmodal);
