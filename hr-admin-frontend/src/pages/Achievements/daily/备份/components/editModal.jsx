import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;

class Editmodal extends Component {
  state = {
    color: '',
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, record } = this.props;
    const { name, age, jigou, kqdd, kqsj, sfqq, qqyy } = record;
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
                    initialValue: kqsj || '',
                  })(<Input style={{ width: '260px' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={12} pull={1}>
                <FormItem label="考勤地点" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('jigou', {
                    initialValue: kqdd || '',
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="是否缺勤" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('pxdz', {
                    initialValue: sfqq || '',
                  })(<Input style={{ width: '260px' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={24} pull={3}>
                <FormItem label="缺勤原因" {...{ labelCol: { span: 4 }, wrapperCol: { span: 20 } }}>
                  {getFieldDecorator('pxnr', {
                    initialValue: qqyy || '',
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

export default Form.create()(Editmodal);
