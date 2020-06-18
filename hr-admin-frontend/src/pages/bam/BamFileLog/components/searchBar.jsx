/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker } from 'antd';

const FormItem = Form.Item;

class BamFileLogSearchBar extends Component {
  state = {
    formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
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
            <FormItem label="文件名称">
              {getFieldDecorator('fileName')(<Input placeholder="文件名称" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
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

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="文件名称">
              {getFieldDecorator('fileName')(<Input placeholder="文件名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件类型">
              {getFieldDecorator('fileType')(<Input placeholder="文件类型" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件状态">
              {getFieldDecorator('fileStatus')(<Input placeholder="文件状态" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="操作码">
              {getFieldDecorator('operateCode')(<Input placeholder="操作码" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('sTime')(<DatePicker placeholder="开始时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('eTime')(<DatePicker placeholder="结束时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="操作描述">
              {getFieldDecorator('description')(<Input placeholder="操作描述" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
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

export default BamFileLogSearchBar;
