import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Radio } from 'antd';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
class DailyAttendanceSearchBar extends Component {
  state = {
    formValues: {},
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, paginationProps } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      this.props.onFind(paginationProps.current, paginationProps.pageSize, fieldsValue);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否缺勤">
              {getFieldDecorator('isAbsenteeism')(
                <Radio.Group defaultValue="">
                  <Radio key={1} value="" defaultChecked>
                    全部
                  </Radio>
                  <Radio key={2} value="true">
                    是
                  </Radio>
                  <Radio key={3} value="false">
                    否
                  </Radio>
                </Radio.Group>,
              )}
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
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(<Input placeholder="姓名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否缺勤">
              {getFieldDecorator('isAbsenteeism')(
                <Radio.Group defaultValue="">
                  <Radio key={1} value="" defaultChecked>
                    全部
                  </Radio>
                  <Radio key={2} value="true">
                    是
                  </Radio>
                  <Radio key={3} value="false">
                    否
                  </Radio>
                </Radio.Group>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="考勤地点">
              {getFieldDecorator('attendancePlace')(<Input placeholder="考勤地点" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="缺勤原因">
              {getFieldDecorator('absenteeismReason')(<Input placeholder="缺勤原因" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ marginTop: 4 }}>
            <span>
              <Button type="primary" htmlType="submit">
                查找
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
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

export default DailyAttendanceSearchBar;
