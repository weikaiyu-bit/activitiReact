import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Radio, DatePicker } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import moment from 'moment';

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
class WfWorkflowsSearchBar extends Component {
  state = {
    expandForm: true,
    pageNumber: 1,
    pageSize: 10,
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    const pageNumber = 1;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.createTime = fieldsValue.createTime
        ? moment(fieldsValue.createTime).format('YYYY-MM-DD 00:00:00')
        : fieldsValue.createTime;
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
          {/* <Col md={8} sm={24}>
            <FormItem label="流程类别">
              {getFieldDecorator('categoryName')(<Input placeholder="流程类别" />)}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <FormItem label="流程名称">
              {getFieldDecorator('flowName')(<Input placeholder="流程名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
          <Col md={8} sm={24}>
            <FormItem label="流程类别">
              {getFieldDecorator('categoryName')(<Input placeholder="流程类别" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="流程名称">
              {getFieldDecorator('flowName')(<Input placeholder="流程名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="开始节点">
              {getFieldDecorator('beginNodeId')(<Input placeholder="开始节点" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="驱动类型">
              {getFieldDecorator('flowType')(
                <Radio.Group>
                  <Radio value="">全部</Radio>
                  <Radio value="manual">人工</Radio>
                  <Radio value="auto">自动</Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="终止节点">
              {getFieldDecorator('endNodeId')(<Input placeholder="终止节点" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('createTime')(
                <DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入创建时间"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" >
                查找
              </Button>
               <Button style={{ marginLeft: 8 }} onClick={this.emptyCondition}>
                  重置
                </Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a> */}
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

export default WfWorkflowsSearchBar;
