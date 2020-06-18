import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

class SysFunctionsSearchBar extends Component {
  state = {
    // formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        // formValues: fieldsValue,
      });
      this.props.onFind(fieldsValue);
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
          <Col md={6} sm={24}>
            <FormItem label="功能名称">
              {getFieldDecorator('functionName')(<Input placeholder="请输入功能名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="功能类型">
              {getFieldDecorator('functionType')(
                <Select placeholder="请选择功能类型" style={{ width: '150px' }}>
                  <Option value="FUNC">功能</Option>
                  <Option value="MENU">菜单</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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

    // <Col md={6} sm={24}>
    //  <FormItem label="功能类型">
    //   {getFieldDecorator('functionType')(
    //     <Radio.Group>
    //      <Radio value="ELEMENT">系统</Radio>
    //      <Radio value="MODULE">模块</Radio>
    //    <Radio value="FUNCTION">功能</Radio>
    //    </Radio.Group>,
    //  )}
    //  </FormItem>
    //  </Col>;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="功能名称">
              {getFieldDecorator('functionName')(<Input placeholder="请输入功能名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="功能类型">
              {getFieldDecorator('functionType')(
                <Select placeholder="请选择功能类型" style={{ width: '150px' }}>
                  <Option value="FUNC">功能</Option>
                  <Option value="MENU">菜单</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="路由">
              {getFieldDecorator('routing')(<Input placeholder="请输入路由" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="标签">
              {getFieldDecorator('tag')(<Input placeholder="请输入标签" />)}
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

export default SysFunctionsSearchBar;
