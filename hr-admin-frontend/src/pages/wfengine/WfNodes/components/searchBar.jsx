import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select } from 'antd';
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
class WfNodesSearchBar extends Component {
  state = {
    expandForm: false,
    pageNumber: 1,
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
    //  const cc=this.hebing(fieldsValue.exitNodeIds)
    //  const rr=this.hebing(fieldsValue.entryNodeIds)
    //   fieldsValue={...fieldsValue,exitNodeIds:cc,entryNodeIds:rr}
    //   console.log(fieldsValue)
      const { pageNumber } = this.state;
      this.props.onFind(pageNumber, pagination.pageSize,
        { ...fieldsValue,
          nodeName: fieldsValue.nameNode,
        });
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  emptyCondition = () => {
    const { form } = this.props;
    this.props.onFind();
    form.resetFields();
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline"{...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="流程名称">
              {getFieldDecorator('flowName')(<Input placeholder="流程名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="节点名称">
              {getFieldDecorator('nameNode')(<Input placeholder="节点名称" />)}
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
          <Col md={6} sm={24}>
            <FormItem label="流程名称">
              {getFieldDecorator('flowName')(<Input placeholder="流程名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="节点名称">
              {getFieldDecorator('nameNode')(<Input placeholder="节点名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="入口节点">
                {getFieldDecorator('entryNodeIds')(<Input placeholder="入口节点" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="出口节点">
              {getFieldDecorator('exitNodeIds')(<Input placeholder="出口节点" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" >
                查找
              </Button>
               <Button style={{ marginLeft: 8 }} onClick={this.emptyCondition}>
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

export default WfNodesSearchBar;
