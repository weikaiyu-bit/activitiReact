/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class BamScheduleSearchBar extends Component {
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
            <FormItem label="id">{getFieldDecorator('id')(<Input placeholder="id" />)}</FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="应用id">
              {getFieldDecorator('appId')(<Input placeholder="应用id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="租户id">
              {getFieldDecorator('tenantId')(<Input placeholder="租户id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="调度器名称">
              {getFieldDecorator('scheduleName')(<Input placeholder="调度器名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="JavaBean名称">
              {getFieldDecorator('beanName')(<Input placeholder="JavaBean名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="参数">
              {getFieldDecorator('parameter')(<Input placeholder="参数" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="CRON表达式">
              {getFieldDecorator('cronExpression')(<Input placeholder="CRON表达式" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="备注">
              {getFieldDecorator('remark')(<Input placeholder="备注" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(<Input placeholder="状态" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('updateTime')(<Input placeholder="更新日期" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="更新人id">
              {getFieldDecorator('updatorId')(<Input placeholder="更新人id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createTime')(<Input placeholder="创建时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="创建人id">
              {getFieldDecorator('creatorId')(<Input placeholder="创建人id" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}></Col>
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit">
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

export default BamScheduleSearchBar;
