import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, Row } from 'antd';
import moment from 'moment';
import styles from '../style.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 6,
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
      span: 8,
    },
  },
};
class MsgSubscriptionConfigSearchBar extends Component {
  state={
    expandForm: false,
  }


  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.createAt = fieldsValue.createAt
      ? moment(fieldsValue.createAt).format('YYYY-MM-DD 00:00:00')
      : fieldsValue.createAt;
        this.props.onFind(pagination.current, pagination.pageSize, fieldsValue);
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
    form.resetFields();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="订阅用户">
                {getFieldDecorator('subscriberUid')(<Input placeholder="订阅用户" />)}
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
      </div>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="订阅用户">
                {getFieldDecorator('subscriberUid')(<Input placeholder="订阅用户" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="目标类型">
                {getFieldDecorator('targetType')(<Input placeholder="目标类型" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="动作类型">
                {getFieldDecorator('action')(<Input placeholder="动作类型" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="创建时间">
                {getFieldDecorator('createAt')(
                  <DatePicker
                    style={{
                      width: '100%',
                    }}
                    placeholder="请输入创建时间"
                  />,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <span>
                <Button type="primary" htmlType="submit">
                  查找
                </Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={this.emptyCondition}>
                  重置
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
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default MsgSubscriptionConfigSearchBar;
