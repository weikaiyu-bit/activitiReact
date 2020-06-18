import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class RtCategorySearchBar extends Component {
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
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="分类名称">
              {getFieldDecorator('categoryName')(<Input placeholder="分类名称" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
          </Col>
          <Col md={4} sm={24}>
            <span >
              <Button icon="search" type="primary" htmlType="submit" >
                查找
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { expandForm } = this.state;
    return this.renderSimpleForm();
  }
}

export default RtCategorySearchBar;
