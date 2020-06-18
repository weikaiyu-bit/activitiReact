import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';
import styles from '@/dtsea/common/styles/style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 12,
    },
    md: {
      span: 9,
    },
  },
};

class WfNodeTemplatesSearchBar extends Component {
  state = {
    expandForm: true,
    pageNumber: 1,
  };

  componentDidMount() {
    this.props.onRef(this)
  }

  myName = () => alert('xiaoming')

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    console.log(pagination.current)
    const { pageNumber } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.onFind(pageNumber, pagination.pageSize, fieldsValue);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 清空查询条件
  emptyCondition = () => {
    const { form } = this.props;
  //  console.log(dispatch)
    const { pageNumber, pageSize } = this.state;
    this.props.resFindPage(pageNumber, pageSize, {});
    form.resetFields();
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="模板名称">
              {getFieldDecorator('templateName')(<Input placeholder="模板名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span >
              <Button type="primary" htmlType="submit" >
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

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <div className={styles.tableListForm}>
      <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={6} sm={24}>
            <FormItem label="流程类别">
              {getFieldDecorator('categoryName')(<Input placeholder="流程类别" />)}
            </FormItem>
          </Col> */}
          <Col md={6} sm={24}>
            <FormItem label="模板名称">
              {getFieldDecorator('templateName')(<Input placeholder="模板名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="关联表单">
              {getFieldDecorator('pageUrl')(<Input placeholder="关联表单" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span>
              <Button type="primary" htmlType="submit" >
                查找
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.emptyCondition}>
                  重置
                </Button>
            </span>
          </Col>
        </Row>
      </Form>
      </div>
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default WfNodeTemplatesSearchBar;
