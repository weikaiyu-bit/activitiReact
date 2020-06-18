/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class BamDictDataSearchBar extends Component {
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

  //   toggleForm = () => {
  //     const { expandForm } = this.state;
  //     this.setState({
  //       expandForm: !expandForm,
  //     });
  //   };

  //   renderSimpleForm() {
  //     const { form: { getFieldDecorator } } = this.props;

  //     return (
  //       <Form onSubmit={this.handleSearch} layout="inline">
  //         <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //           <Col md={4} sm={24}>
  //             <FormItem label="id">
  //               {getFieldDecorator('数据id')(<Input placeholder="数据id" />)}
  //             </FormItem>
  //           </Col>
  //           <Col md={1} sm={24}>
  //           </Col>
  //           <Col md={4} sm={24}>
  //             <span >
  //               <Button type="primary" htmlType="submit" >
  //                 查询
  //               </Button>
  //               <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //                 展开 <Icon type="down" />
  //               </a>
  //             </span>
  //           </Col>
  //         </Row>
  //       </Form>
  //     );
  //   }

  //   renderAdvancedForm() {
  //     const { form: { getFieldDecorator } } = this.props;

  //     return (
  //       <Form onSubmit={this.handleSearch} layout="inline">
  //         <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
  //           <Col md={4} sm={24}>
  //             <FormItem label="数据名称">
  //               {getFieldDecorator('dataName')(<Input placeholder="数据名称" />)}
  //             </FormItem>
  //           </Col>
  //           <Col md={4} sm={24}>
  //             <FormItem label="数据值">
  //               {getFieldDecorator('dataValue')(<Input placeholder="数据值" />)}
  //             </FormItem>
  //           </Col>
  //           <Col md={4} sm={24}>
  //             <FormItem label="数据标签">
  //               {getFieldDecorator('tags')(<Input placeholder="数据标签" />)}
  //             </FormItem>
  //           </Col>
  //           <Col md={4} sm={24}>
  //             <FormItem label="备注">
  //               {getFieldDecorator('remark')(<Input placeholder="备注" />)}
  //             </FormItem>
  //           </Col>
  //           <Col md={4} sm={24}>
  //             <FormItem label="排序">
  //               {getFieldDecorator('sortNo')(<Input placeholder="排序" />)}
  //             </FormItem>
  //           </Col>
  //           <Col md={4} sm={24}>
  //             <span >
  //               <Button type="primary" htmlType="submit" >
  //                 查询
  //               </Button>
  //               <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
  //                 收起 <Icon type="up" />
  //               </a>
  //             </span>
  //           </Col>
  //         </Row>
  //       </Form>
  //     );
  //   }

  //   render() {
  //     const { expandForm } = this.state;
  //     return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  //   }

  render() {
    const {
      form: { getFieldDecorator },
      square,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Icon type={square} theme="twoTone" onClick={() => this.props.leftDisplay()} />
        <Row>
          <Col md={4} sm={24}>
            <FormItem label="数据名称" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('dataName')(<Input placeholder="数据名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="数据值" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('dataValue')(<Input placeholder="数据值" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="数据标签" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('tags')(<Input placeholder="数据标签" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="备注" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('remark')(<Input placeholder="备注" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
            <span>
              <Button type="primary" htmlType="submit">
                查询
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

export default BamDictDataSearchBar;
