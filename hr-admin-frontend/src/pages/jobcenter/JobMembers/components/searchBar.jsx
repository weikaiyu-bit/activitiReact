import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class JobMembersSearchBar extends Component {
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
      this.props.onFind(pagination.current, pagination.pageSize, fieldsValue);
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
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="璇疯緭鍏d" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                鏌ユ壘
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                灞曞紑 <Icon type="down" />
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
            <FormItem label="ID">{getFieldDecorator('id')(<Input placeholder="ID" />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="项目id">
              {getFieldDecorator('projectId')(<Input placeholder="项目id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="用户id">
              {getFieldDecorator('uid')(<Input placeholder="用户id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(<Input placeholder="名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="用户名" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="头像">
              {getFieldDecorator('avatarUrl')(<Input placeholder="头像" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="成员类型">
              {getFieldDecorator('memberType')(<Input placeholder="成员类型" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
                鏌ユ壘
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                鏀惰捣 <Icon type="up" />
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

export default JobMembersSearchBar;
