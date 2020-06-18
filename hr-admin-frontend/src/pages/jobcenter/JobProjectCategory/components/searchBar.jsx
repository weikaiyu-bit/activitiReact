import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';
const FormItem = Form.Item;
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
class JobProjectCategorySearchBar extends Component {
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
      <div>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="类别名称">
                {getFieldDecorator('categoryName')(<Input placeholder="类别名称" />)}
              </FormItem>
            </Col>
            <Col md={1} sm={24}></Col>
            <Col md={4} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                {/*<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>*/}
                {/*展开 <Icon type="down" />*/}
                {/*</a>*/}
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="类别id">
                {getFieldDecorator('id')(<Input placeholder="类别id" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="类别名称">
                {getFieldDecorator('categoryName')(<Input placeholder="类别名称" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="备注">
                {getFieldDecorator('remark')(<Input placeholder="备注" />)}
              </FormItem>
            </Col>
            <Col md={1} sm={24}></Col>
            <Col md={6} sm={24}>
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
      </div>
    );
  }

  render() {
    const { expandForm } = this.state;
    return this.renderSimpleForm();
  }
}

export default JobProjectCategorySearchBar;
