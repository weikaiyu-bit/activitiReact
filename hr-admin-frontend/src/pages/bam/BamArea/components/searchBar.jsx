/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class BamAreaSearchBar extends Component {
  state = {
    formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (
        (fieldsValue.areaName !== undefined && fieldsValue.areaName !== '') ||
        (fieldsValue.areaCode !== undefined && fieldsValue.areaCode !== '')
      ) {
        this.props.onFind(fieldsValue);
      } else {
        this.props.onFind({ pid: 0 });
      }
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
            <FormItem label="区域名称">
              {getFieldDecorator('areaName')(<Input placeholder="区域名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="区域代码">
              {getFieldDecorator('areaCode')(<Input placeholder="区域代码" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查看
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
            <FormItem label="区域名称">
              {getFieldDecorator('areaName')(<Input placeholder="区域名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="区域代码">
              {getFieldDecorator('areaCode')(<Input placeholder="区域代码" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                查看
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

export default BamAreaSearchBar;
