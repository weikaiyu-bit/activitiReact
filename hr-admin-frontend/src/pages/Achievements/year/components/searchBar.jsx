import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Checkbox, Select } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class SearchBar extends Component {
  state = {
    expandForm: true,
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="任务名称" {...formItemLayout}>
                {getFieldDecorator('taskName')(<Input placeholder="任务名称" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="标签" {...formItemLayout}>
                {getFieldDecorator('tags')(<Input placeholder="标签" />)}
              </FormItem>
            </Col>
            <Col md={4} sm={24} style={{ marginTop: 4 }}>
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
      </div>
    );
  }

  renderAdvancedForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div>
        <Form onSubmit={this.handleSearch} layout="horizontal">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="主题" {...formItemLayout}>
                {getFieldDecorator('taskName')(<Input placeholder="主题" />)}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="年度" {...formItemLayout}>
                {getFieldDecorator('taskName')(<Input placeholder="年度" />)}
              </FormItem>
            </Col>
            {/* <Col md={8} sm={24}>
              <FormItem label="标签" {...formItemLayout}>
                {getFieldDecorator('tags')(<Input placeholder="标签" />)}
              </FormItem>
            </Col> */}
            <Col md={4} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">
                  查找
                </Button>
                {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a> */}
              </span>
            </Col>
          </Row>
          {/* <Row gutter={{ md: 8, lg: 24, xl: 48 }} align="middle">
            <Col md={4} sm={24}>
              <span>
                <Button type="primary" htmlType="submit" >
                  查找
                </Button>
                {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a> */}
          {/* </span>
            </Col>
          </Row > * /} */}
        </Form>
      </div>
    );
  };

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default SearchBar;
