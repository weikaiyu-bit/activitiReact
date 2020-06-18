import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 16,
    },
  },
};
class JobRecordsSearchBar extends Component {
  state = {
    formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      fieldsValue.operateTime = fieldsValue.operateTime
        ? moment(fieldsValue.operateTime).format('YYYY-MM-DD 00:00:00')
        : fieldsValue.operateTime;
      this.props.onFind(pagination.current, pagination.pageSize, fieldsValue);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  emptyCondition = () => {
    const { form } = this.props;
    form.resetFields();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="任务ID">
              {getFieldDecorator('taskId')(<Input placeholder="任务ID" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="任务ID">
              {getFieldDecorator('taskId')(<Input placeholder="任务ID" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="之前状态">
              {getFieldDecorator('preStatus')(<Input placeholder="之前状态" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="当前状态">
              {getFieldDecorator('curStatus')(<Input placeholder="当前状态" />)}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="操作码">
              {getFieldDecorator('operatCode')(<Input placeholder="操作码" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="操作描述">
              {getFieldDecorator('description')(<Input placeholder="操作描述" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="操作时间">
              {getFieldDecorator('operateTime')(
                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="操作人">
              {getFieldDecorator('operatorUid')(<Input placeholder="操作人" />)}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="操作人名称">
              {getFieldDecorator('operatorName')(<Input placeholder="操作人名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查找
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={this.emptyCondition}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default JobRecordsSearchBar;
