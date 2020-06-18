/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class CmsCategorySearchBar extends Component {
  state = {
    formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      this.props.onFind(fieldsValue);
    });
  };
  /* */

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
          <Col md={6} sm={24}>
            <FormItem label="栏目名称">
              {getFieldDecorator('categoryName')(<Input placeholder="栏目名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="栏目编码">
              {getFieldDecorator('categoryCode')(<Input placeholder="栏目编码" />)}
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="栏目名称">
              {getFieldDecorator('categoryName')(<Input placeholder="栏目名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="栏目编码">
              {getFieldDecorator('categoryCode')(<Input placeholder="栏目编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label=" 关  键  字 ">
              {getFieldDecorator('keywords')(
                <Input placeholder="关键字" style={{ marginLeft: '1px' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="优化标题">
              {getFieldDecorator('seoTitle')(<Input placeholder="优化标题" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="栏目类型">
              {getFieldDecorator('categoryType')(
                <Select style={{ width: 173 }} placeholder="全部">
                  <Option value="">全部</Option>
                  <Option value="内部栏目">内部栏目</Option>
                  <Option value="内部网页">内部网页</Option>
                  <Option value="外部链接">外部链接</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属模型">
              {getFieldDecorator('modelId')(
                <Select style={{ width: 173 }} placeholder="全部">
                  <Option value="">全部</Option>
                  <Option value="文章模型">文章模型</Option>
                  <Option value="图片模型">图片模型</Option>
                  <Option value="视频模型">视频模型</Option>
                  <Option value="下载模型">下载模型</Option>
                  <Option value="产品模型">产品模型</Option>
                  <Option value="案例模型">案例模型</Option>
                  <Option value="附件模型">附件模型</Option>
                  <Option value="多图模型">多图模型</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="栏目深度">
              {getFieldDecorator('depth')(<Input placeholder="栏目深度" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="列表模板">
              {getFieldDecorator('categoryList')(<Input placeholder="列表模板" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="内容模板">
              {getFieldDecorator('categoryShow')(<Input placeholder="内容模板" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label=" 创 建 人  ">
              {getFieldDecorator('creatorUid')(
                <Input placeholder="创建人" style={{ marginLeft: '1px' }} />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

export default CmsCategorySearchBar;
