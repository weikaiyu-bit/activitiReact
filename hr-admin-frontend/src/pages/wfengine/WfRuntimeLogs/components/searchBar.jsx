import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row } from 'antd';

const FormItem = Form.Item;

class WfRuntimeLogsSearchBar extends Component {
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
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={4} sm={24}>
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="璇疯緭鍏d" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
          </Col>
          <Col md={4} sm={24}>
            <span >
              <Button type="primary" htmlType="submit" >
                查找
              </Button>
              <a style={{marginLeft: 8,}} onClick={this.toggleForm}>
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

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={4} sm={24}>
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="log_id">
              {getFieldDecorator('logId')(<Input placeholder="log_id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="run_id">
              {getFieldDecorator('runId')(<Input placeholder="run_id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="catg_id">
              {getFieldDecorator('catgId')(<Input placeholder="catg_id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="flow_id">
              {getFieldDecorator('flowId')(<Input placeholder="flow_id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="node_id">
              {getFieldDecorator('nodeId')(<Input placeholder="node_id" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="节点名称">
              {getFieldDecorator('activityNodeName')(<Input placeholder="节点名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="实例名称">
              {getFieldDecorator('runtimeName')(<Input placeholder="实例名称" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="备注">
              {getFieldDecorator('remark')(<Input placeholder="备注" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="进入时间">
              {getFieldDecorator('entryTime')(<Input placeholder="进入时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="进入更新人">
              {getFieldDecorator('entryUid')(<Input placeholder="进入更新人" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="离开时间">
              {getFieldDecorator('exitTime')(<Input placeholder="离开时间" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label="离开更新人">
              {getFieldDecorator('exitUid')(<Input placeholder="离开更新人" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
          </Col>
          <Col md={4} sm={24}>
            <span >
              <Button type="primary" htmlType="submit" >
                查找
              </Button>
              <a style={{marginLeft: 8,}} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
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

export default WfRuntimeLogsSearchBar;
