/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class PersonnelSystemFileSearchBar extends Component {
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
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="id" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
          </Col>
          <Col md={4} sm={24} style={{ marginTop: 42 }}>
            <span >
              <Button type="primary" htmlType="submit" >
              查询
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              更多 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="租户id">
              {getFieldDecorator('tentantId')(<Input placeholder="租户id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="应用id">
              {getFieldDecorator('appId')(<Input placeholder="应用id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文章id">
              {getFieldDecorator('articleId')(<Input placeholder="文章id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件名">
              {getFieldDecorator('fileName')(<Input placeholder="文件名" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件后缀名">
              {getFieldDecorator('fileSuffix')(<Input placeholder="文件后缀名" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件url">
              {getFieldDecorator('fileUrl')(<Input placeholder="文件url" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件大小">
              {getFieldDecorator('fileSize')(<Input placeholder="文件大小" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="上传人">
              {getFieldDecorator('uploadName')(<Input placeholder="上传人" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="上传时间">
              {getFieldDecorator('uploadTime')(<Input placeholder="上传时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文件加密">
              {getFieldDecorator('hashCode')(<Input placeholder="文件加密" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
          </Col>
          <Col md={4} sm={24} style={{ marginTop: 42 }}>
            <span >
              <Button type="primary" htmlType="submit" >
                查询
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              更多 <Icon type="up" />
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

export default PersonnelSystemFileSearchBar;
