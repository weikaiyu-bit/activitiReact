/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker } from 'antd';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
class PersonnelSystemArticleSearchBar extends Component {
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
            <FormItem label="文章制度标题">
              {getFieldDecorator('articleTitle')(<Input placeholder="文章制度标题" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="发布时间">
              {getFieldDecorator('publisherTime')(<RangePicker format="YYYY-MM-DD" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文章制度说明">
              {getFieldDecorator('articleExplain')(<Input placeholder="文章制度说明" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
          </Col>
          <Col md={4} sm={24} style={{ marginTop: 40 }}>
            <span >
              <Button type="primary" htmlType="submit" >
                查询
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                更多 <Icon type="down" />
              </a> */}
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
            <FormItem label="文章制度标题">
              {getFieldDecorator('articleTitle')(<Input placeholder="文章制度标题" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="父节点">
              {getFieldDecorator('pid')(<Input placeholder="父节点" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="文章制度说明">
              {getFieldDecorator('articleExplain')(<Input placeholder="文章制度说明" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('type')(<Input placeholder="类型" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('state')(<Input placeholder="状态" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建人ID">
              {getFieldDecorator('creatorId')(<Input placeholder="创建人ID" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('creator')(<Input placeholder="创建人" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('creatorTime')(<Input placeholder="创建时间" />)}
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

export default PersonnelSystemArticleSearchBar;
