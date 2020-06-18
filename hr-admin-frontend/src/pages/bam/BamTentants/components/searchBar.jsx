/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';

const FormItem = Form.Item;

class BamTentantsSearchBar extends Component {
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
      this.props.onFind(1, pagination.pageSize, fieldsValue);
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
        <Row>
          <Col md={8} sm={24}>
            <FormItem label="租户名称">
              {getFieldDecorator('tentantName')(<Input placeholder="租户名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联&#8197;&#8197;系&#8197;&#8197;人">
              {getFieldDecorator('contacts')(<Input placeholder="联系人" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={8} sm={24}>
            <FormItem label="租户名称">
              {getFieldDecorator('tentantName')(<Input placeholder="租户名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联&#8197;&#8197;系&#8197;&#8197;人">
              {getFieldDecorator('contacts')(<Input placeholder="联系人" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="联系电话">
              {getFieldDecorator('phone')(<Input placeholder="联系电话" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状&#12288;&#12288;态">
              {getFieldDecorator('status')(
                <Select placeholder="全部" style={{ width: 150 }}>
                  <Select.Option value="">全部</Select.Option>
                  <Select.Option value="ENABLED">启用</Select.Option>
                  <Select.Option value="DISABLE">停用</Select.Option>
                  <Select.Option value="IN_REVIEW">审核中</Select.Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所在国家">
              {getFieldDecorator('country')(<Input placeholder="所在国家" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所在州省">
              {getFieldDecorator('province')(<Input placeholder="所在州省" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所在城市">
              {getFieldDecorator('city')(<Input placeholder="所在城市" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="所在地址">
              {getFieldDecorator('address')(<Input placeholder="所在地址" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="电子邮箱">
              {getFieldDecorator('email')(<Input placeholder="电子邮箱" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="备&#12288;&#12288;注">
              {getFieldDecorator('remark')(<Input placeholder="备注" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default BamTentantsSearchBar;
