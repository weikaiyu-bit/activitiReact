import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input, Select, DatePicker, Slider } from 'antd';
import moment from 'moment';

const { Option } = Select;

@Form.create()
export default class taskAttributeView extends Component {
  componentDidMount() {
    console.log('componentDidMount');
  }

  okHandler = () => {
    const {
      onUpdateTask,
      onCancel,
      data,
      form: { validateFields },
    } = this.props;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    validateFields((error, values) => {
      console.log('data', data.appId);
      if (error) return;
      onUpdateTask(data.id, {
        ...data,
        ...values,
        beginDate: moment(values.beginDate).format(dateFormat),
        endDate: moment(values.endDate).format(dateFormat),
      });
      onCancel();
    });
  };

  render() {
    const {
      title,
      visible,
      onCancel,
      form: { getFieldDecorator },
      data,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const twoColumnFormItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const colLayout = {
      md: 12,
      sm: 24,
    };
    if (!data) return false;
    return (
      <Modal
        destroyOnClose
        title={title}
        visible={visible}
        onOk={this.okHandler}
        onCancel={onCancel}
        width={1024}
      >
        <Form layout="horizontal" onSubmit={this.okHandler}>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="项目" {...twoColumnFormItemLayout}>
                {getFieldDecorator('projectName', {
                  initialValue: data.projectName || '',
                })(
                  <Select
                    showSearch
                    optionFilterProp="children"
                    dropdownMatchSelectWidth={false}
                    optionLabelProp="label"
                    onChange={this.selectChange}
                  ></Select>,
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="优先级" {...twoColumnFormItemLayout}>
                {getFieldDecorator('priority', {
                  initialValue: data.priority || '',
                  rules: [
                    {
                      transform: val => parseInt(val, 10),
                      type: 'number',
                      min: 0,
                      max: 999999999,
                      message: '最多输入九位整数！',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="任务悬赏" {...twoColumnFormItemLayout}>
                {getFieldDecorator('reward', {
                  initialValue: data.reward ? data.reward.toString() : '',
                  rules: [
                    {
                      pattern: '^(?:0|[0-9]{0,8})(\\.\\d{0,2})?$',
                      message: '最多输入八位整数，并保留两位小数',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="应用id" {...twoColumnFormItemLayout}>
                {getFieldDecorator('appId', {
                  initialValue: data.appId ? data.appId.toString() : '',
                  rules: [
                    {
                      pattern: '^[0-9]{0,9}$',
                      message: '最多输入九位整数',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="开始时间" {...twoColumnFormItemLayout}>
                {getFieldDecorator('beginDate', {
                  initialValue: data.beginDate ? moment(data.beginDate) : moment(),
                })(<DatePicker showTime format="YYYY-MM-DD" style={{ width: 244 }} />)}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="结束时间" {...twoColumnFormItemLayout}>
                {getFieldDecorator('endDate', {
                  initialValue: data.endDate ? moment(data.endDate) : moment(),
                })(<DatePicker showTime format="YYYY-MM-DD" style={{ width: 244 }} />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="计划工作量" {...twoColumnFormItemLayout}>
                {getFieldDecorator('planWorkload', {
                  initialValue: data.planWorkload ? data.planWorkload.toString() : '0',
                  rules: [
                    {
                      pattern: '^[0-9]{0,9}$',
                      message: '最多输入九位整数',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="实际工作量" {...twoColumnFormItemLayout}>
                {getFieldDecorator('workload', {
                  initialValue: data.workload ? data.workload.toString() : '0',
                  rules: [
                    {
                      pattern: '^[0-9]{0,9}$',
                      message: '最多输入九位整数',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col {...colLayout}>
              <Form.Item label="工作量单位" {...twoColumnFormItemLayout}>
                {getFieldDecorator('workloadUnits', {
                  initialValue: data.workloadUnits || '',
                  rules: [
                    {
                      min: 0,
                      max: 6,
                      message: '最多输入6个字符！',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="任务时长" {...twoColumnFormItemLayout}>
                {getFieldDecorator('duration', {
                  initialValue: data.duration ? data.duration.toString() : '',
                  rules: [
                    {
                      pattern: '^[0-9]{0,9}$',
                      message: '最多输入九位整数',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="任务类型" {...twoColumnFormItemLayout}>
                {getFieldDecorator('taskType', {
                  initialValue: data.taskType || '',
                  rules: [
                    {
                      min: 0,
                      max: 8,
                      message: '最多输入8个字符串',
                    },
                  ],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col {...colLayout}>
              <Form.Item label="任务进度" {...twoColumnFormItemLayout}>
                {getFieldDecorator('progress', {
                  initialValue: typeof data.progress === 'number' ? data.progress : 0,
                })(
                  <Slider
                    min={0}
                    max={100}
                    tipFormatter={value => `${value}%`}
                    marks={{ 0: '0%', 100: '100%' }}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="关联表单" {...formItemLayout}>
            {getFieldDecorator('pageUrl', {
              initialValue: data.pageUrl || '',
              rules: [
                {
                  min: 0,
                  max: 125,
                  message: '最多输入125个字符！',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="未完成原因" {...formItemLayout}>
            {getFieldDecorator('reason', {
              initialValue: data.reason || '',
              rules: [
                {
                  min: 0,
                  max: 125,
                  message: '最多输入125个字符！',
                },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item label="补救措施" {...formItemLayout}>
            {getFieldDecorator('rescue', {
              initialValue: data.rescue || '',
              rules: [
                {
                  min: 0,
                  max: 125,
                  message: '最多输入125个字符！',
                },
              ],
            })(<Input />)}
          </Form.Item>
          {getFieldDecorator('id', {
            initialValue: data.id || '',
          })(<Input type="hidden" />)}
        </Form>
      </Modal>
    );
  }
}
