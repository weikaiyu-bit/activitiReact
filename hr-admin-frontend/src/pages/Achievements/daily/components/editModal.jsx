import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker, Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
class DailyAttendanceEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      const { attendanceTime } = values;
      if (!err) {
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime
            ? moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : values.updateTime,
          attendanceTime: attendanceTime
            ? moment(attendanceTime).format('YYYY-MM-DD HH:mm:ss')
            : attendanceTime,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record } = this.props;
    const {
      id,
      tenantId,
      appId,
      fileId,
      name,
      sex,
      orgName,
      department,
      attendanceTime,
      attendancePlace,
      isAbsenteeism,
      absenteeismReason,
      createTime,
      creatorId,
    } = record;
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
          <Form horizontal="true" onSubmit={this.okHandler}>
            <Row>
              <Col span={24}>
                <FormItem label="姓名" {...{ labelCol: { span: 3 }, wrapperCol: { span: 17 } }}>
                  {getFieldDecorator('name', {
                    initialValue: name || '',
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="性别" {...formItemLayout}>
                  {getFieldDecorator('sex', {
                    initialValue: sex || '',
                  })(
                    <Radio.Group>
                      <Radio value="man">男</Radio>
                      <Radio value="woman">女</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="统计关系所在单位"
                  {...{ labelCol: { span: 6 }, wrapperCol: { span: 10 } }}
                >
                  {getFieldDecorator('orgName', {
                    initialValue: orgName || '',
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="是否缺勤" {...formItemLayout}>
                  {getFieldDecorator('isAbsenteeism', {
                    initialValue: isAbsenteeism || '',
                  })(
                    <Radio.Group>
                      <Radio value="true">是</Radio>
                      <Radio value="false">否</Radio>
                    </Radio.Group>,
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="部门" {...{ labelCol: { span: 6 }, wrapperCol: { span: 10 } }}>
                  {getFieldDecorator('department', {
                    initialValue: department || '',
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <FormItem label="考勤时间" {...formItemLayout}>
                  {getFieldDecorator('attendanceTime', {
                    initialValue:
                      attendanceTime === undefined || attendanceTime === null
                        ? attendanceTime || ''
                        : moment(attendanceTime, 'YYYY-MM-DD HH:mm:ss') || '',
                  })(<DatePicker />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="考勤地点" {...{ labelCol: { span: 6 }, wrapperCol: { span: 10 } }}>
                  {getFieldDecorator('attendancePlace', {
                    initialValue: attendancePlace || '',
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <FormItem label="缺勤原因" {...{ labelCol: { span: 3 }, wrapperCol: { span: 17 } }}>
                  {getFieldDecorator('absenteeismReason', {
                    initialValue: absenteeismReason || '',
                  })(<TextArea />)}
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

export default Form.create()(DailyAttendanceEditModal);
