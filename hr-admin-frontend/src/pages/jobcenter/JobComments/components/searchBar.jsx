import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class JobCommentsSearchBar extends Component {
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
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="horizontal">
        <Row gutter={12}>
          <Col xl={6} md={8} sm={24}>
            <FormItem label="评论ID" {...formItemLayout}>
              {getFieldDecorator('id')(<Input placeholder="评论ID" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={8} sm={24}>
            <FormItem label="任务ID" {...formItemLayout}>
              {getFieldDecorator('taskId')(<Input placeholder="任务ID" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
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

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="horizontal">
        <Row gutter={12}>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="评论ID" {...formItemLayout}>
              {getFieldDecorator('id')(<Input placeholder="评论ID" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="任务ID" {...formItemLayout}>
              {getFieldDecorator('taskId')(<Input placeholder="任务ID" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="回复ID" {...formItemLayout}>
              {getFieldDecorator('replyId')(<Input placeholder="回复id" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="回复内容" {...formItemLayout}>
              {getFieldDecorator('replyComments')(<Input placeholder="回复内容" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="评论回复" {...formItemLayout}>
              {getFieldDecorator('comment')(<Input placeholder="评论回复" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="评论时间" {...formItemLayout}>
              {getFieldDecorator('createTime')(<Input placeholder="评论时间" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="评论人ID" {...formItemLayout}>
              {getFieldDecorator('commentatorUid')(<Input placeholder="评论人ID" />)}
            </FormItem>
          </Col>
          <Col xl={6} md={12} sm={24}>
            <FormItem label="评论人名称" {...formItemLayout}>
              {getFieldDecorator('commentatorName')(<Input placeholder="评论人名称" />)}
            </FormItem>
          </Col>
          <Col md={20} sm={18}></Col>
          <Col md={4} sm={18}>
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

export default JobCommentsSearchBar;
