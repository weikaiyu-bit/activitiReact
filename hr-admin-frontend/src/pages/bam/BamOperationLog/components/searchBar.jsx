/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-undef */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker } from 'antd';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

class BamOperationLogSearchBar extends Component {
  state = {
    formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(fieldsValue.sTime);
      if (fieldsValue.sTime != null) {
        moment().format('yyyy-MM-dd');
      }
      if (err) return;
      const values = {
        ...fieldsValue,
        sTime: fieldsValue.sTime != null ? fieldsValue.sTime.format('YYYY-MM-DD') : null,
        eTime: fieldsValue.eTime != null ? fieldsValue.eTime.format('YYYY-MM-DD 23:59:59') : null,
      };
      this.setState({
        formValues: fieldsValue,
      });
      this.props.onFind(pagination.current, pagination.pageSize, values);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="用户名" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" style={{ marginTop: 42 }}>
                查询
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
    const dateFormat = 'YYYY-MM-DD';
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username', { initialValue: '' })(<Input placeholder="用户名" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="操作">
              {getFieldDecorator('action', { initialValue: '' })(<Input placeholder="操作" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="请求方式">
              {getFieldDecorator('method', { initialValue: '' })(<Input placeholder="请求方式" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="User-Agent">
              {getFieldDecorator('userAgent', { initialValue: '' })(
                <Input placeholder="User-Agent" />,
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="机器ip">
              {getFieldDecorator('ip', { initialValue: '' })(<Input placeholder="机器ip" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', { initialValue: '' })(<Input placeholder="状态" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="操作时间">
              {getFieldDecorator('sTime')(<DatePicker placeholder="开始时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="操作时间">
              {getFieldDecorator('eTime')(<DatePicker placeholder="结束时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" style={{ marginTop: 42 }}>
                查询
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

export default BamOperationLogSearchBar;
