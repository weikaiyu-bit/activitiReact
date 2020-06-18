import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Checkbox } from 'antd';
import moment from 'moment';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const statusOptions = [
  { label: '计划中', value: 'planning' },
  { label: '进行中', value: 'doing' },
  { label: '延后', value: 'pause' },
  { label: '已完成', value: 'completed' },
  { label: '已撤销', value: 'undone' },
  { label: '已逾期', value: 'delay' },
];

class JobTasksSearchBar extends Component {
  state = {
    formValues: {},
    statusChecked: ['planning', 'doing', 'pause', 'delay'],
    checkAllStatus: false,
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, selectTreeKey, hideSwitch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { statusChecked } = this.state;
      this.setState({
        formValues: fieldsValue,
      });
      fieldsValue.beginDate = fieldsValue.beginDate
        ? moment(fieldsValue.beginDate).format('YYYY-MM-DD 00:00:00')
        : fieldsValue.beginDate;
      fieldsValue.endDate = fieldsValue.endDate
        ? moment(fieldsValue.endDate).format('YYYY-MM-DD 00:00:00')
        : fieldsValue.endDate;
      fieldsValue.statusList = statusChecked;
      this.props.onFind({ ...fieldsValue, projectId: selectTreeKey, hideSwitch });
    });
  };

  emptyCondition = () => {
    const { form } = this.props;
    form.resetFields();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  onChangeStatus = statusChecked => {
    this.setState({ statusChecked });
  };

  onCheckAllStatus = () => {
    const { checkAllStatus } = this.state;
    const checkAll = !checkAllStatus;
    const allStatus = ['planning', 'doing', 'pause', 'completed', 'undone', 'delay'];
    this.setState({
      checkAllStatus: checkAll,
      statusChecked: checkAll ? allStatus : [],
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="任务名称">
                {getFieldDecorator('taskName')(<Input placeholder="任务名称" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="标签">
                {getFieldDecorator('tags')(<Input placeholder="标签" />)}
              </FormItem>
            </Col>
            <Col md={4} sm={24} style={{ marginTop: 4 }}>
              <span>
                <Button type="primary" htmlType="submit">
                  查找
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { statusChecked } = this.state;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="horizontal">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="任务名称" {...formItemLayout}>
                {getFieldDecorator('taskName')(<Input placeholder="任务名称" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="标签" {...formItemLayout}>
                {getFieldDecorator('tags')(<Input placeholder="标签" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="责任人" {...formItemLayout}>
                {getFieldDecorator('executorName')(<Input placeholder="责任人" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} align="middle">
            <Col md={20} sm={24}>
              <span
                style={{ verticalAlign: 'middle', float: 'left', marginLeft: 3, color: '#262626' }}
              >
                任务状态：
              </span>
              <Col md={20} sm={24} style={{ paddingLeft: 0, textAlign: 'left' }}>
                <div>
                  <Button size="small" style={{ marginRight: 18 }} onClick={this.onCheckAllStatus}>
                    全部
                  </Button>
                  <CheckboxGroup
                    value={statusChecked}
                    options={statusOptions}
                    onChange={this.onChangeStatus}
                  />
                </div>
              </Col>
            </Col>
            <Col md={4} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">
                  查找
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default JobTasksSearchBar;
