/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Select, Input, Row } from 'antd';

const FormItem = Form.Item;

class BamApplicationSearchBar extends Component {
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

  // renderSimpleForm() {
  //   const { form: { getFieldDecorator } } = this.props;

  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={4} sm={24}>
  //           <FormItem label="应用id">
  //             {getFieldDecorator('id')(<Input placeholder="应用id" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={4} sm={24}>
  //           <span>
  //             <Button type="primary" htmlType="submit" style = {{ marginTop: 42 }} >
  //               查找
  //             </Button>
  //             <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //               展开 <Icon type="down" />
  //             </a>
  //           </span>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }

  // renderAdvancedForm() {
  //   const { form: { getFieldDecorator } } = this.props;

  //   return (
  //     <Form onSubmit={this.handleSearch} layout="inline">
  //       <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //         <Col md={4} sm={24}>
  //           <FormItem label="应用id">
  //             {getFieldDecorator('id')(<Input placeholder="应用id" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={4} sm={24}>
  //           <FormItem label="应用名称">
  //             {getFieldDecorator('applicationName')(<Input placeholder="应用名称" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={4} sm={24}>
  //           <FormItem label="版本">
  //             {getFieldDecorator('version')(<Input placeholder="版本" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={4} sm={24}>
  //           <FormItem label="备注">
  //             {getFieldDecorator('remark')(<Input placeholder="备注" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={4} sm={24}>
  //           <FormItem label="状态">
  //             {getFieldDecorator('status')(<Input placeholder="状态" />)}
  //           </FormItem>
  //         </Col>
  //         <Col md={4} sm={24}>
  //           <span >
  //             <Button type="primary" htmlType="submit" style = {{ marginTop: 42 }} >
  //               查找
  //             </Button>
  //             <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //               收起 <Icon type="up" />
  //             </a>
  //           </span>
  //         </Col>
  //       </Row>
  //     </Form>
  //   );
  // }

  // render() {
  //   const { expandForm } = this.state;
  //   return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  // }
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}>
            <FormItem label="应用id">
              {getFieldDecorator('id')(<Input placeholder="应用id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="应用名称">
              {getFieldDecorator('applicationName')(<Input placeholder="应用名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="logo名称">
              {getFieldDecorator('logoName')(<Input placeholder="logo名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="备&#12288;&#12288;注">
              {getFieldDecorator('remark')(<Input placeholder="备注" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
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
          <Col md={4} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" style={{ marginTop: 42 }}>
                查找
              </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default BamApplicationSearchBar;
