/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Checkbox, Input, Row, Radio } from 'antd';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class ChgRecordSearchBar extends Component {
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
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout} >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="姓名" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('name')(<Input placeholder="请输入姓名/拼音缩写/身份证号码" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span>
              <Button icon="search" type="primary" htmlType="submit">
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
    const { form: { getFieldDecorator } } = this.props;
    const plainOptions = ['已审批', '未审批', '已驳回'];
    const personnelStatus = ['在职', '离职'];
    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout} >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="姓名" >
              {getFieldDecorator('name')(<Input placeholder="请输入姓名/拼音缩写/身份证号码" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span>
              <Button icon="search" type="primary" htmlType="submit">
                查找
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="人员状态" >
              <Checkbox.Group options={personnelStatus} defaultValue={['在职']} />
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审批状态">
              <Checkbox.Group options={plainOptions} defaultValue={['已审批']} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="异动前单位" >
              {getFieldDecorator('beforeOrgName')(<Input placeholder="异动前单位" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="异动前职务" >
              {getFieldDecorator('beforePosition')(<Input placeholder="异动前职务" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="异动前职级" >
              {getFieldDecorator('beforeRank')(<Input placeholder="异动前职级" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="职务变动事由" >
              {getFieldDecorator('chgReason')(<Input placeholder="异动原因" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={5} sm={24}>
            <FormItem label="异动后单位" >
              {getFieldDecorator('afterOrgName')(<Input placeholder="异动后单位" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="异动后职务" >
              {getFieldDecorator('afterPosition')(<Input placeholder="异动后职务" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="异动后职级" >
              {getFieldDecorator('afterRank')(<Input placeholder="异动后职级" />)}
            </FormItem>
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

export default ChgRecordSearchBar;
