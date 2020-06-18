/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {Button, Col, Form, Icon, Input, Row, Select, DatePicker} from 'antd';
import styles from '../css/style.less';
import moment from "moment";
import { connect } from "dva";
import DictionaryTree from '@/pages/components/dictionaryTree';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ organizationGovModel, }) => ({
  organizationGovModel
  }))

class TrainingRsMemberSearchBar extends Component {
  modelName = 'organizationGovModel';
  state = {
    formValues: {},
  };

  componentDidMount() {
    this.findByFilter({ });
  }

  findByFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      /* 查询所有的组织机构名称 */
      type: `${this.modelName}/fetchByFilter`,
      payload: {
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      /* 经办单位格式转换 */
      if(fieldsValue.handlingOrgName){
        fieldsValue.handlingOrgName = fieldsValue.handlingOrgName.label;
      }
      fieldsValue.trainingTime=fieldsValue.trainingTime!=null
        ?moment(fieldsValue.trainingTime).format("YYYY-MM-DD 00:00:00")
        :null;
      fieldsValue.publishTime=fieldsValue.publishTime!=null
        ?moment(fieldsValue.publishTime).format("YYYY-MM-DD 00:00:00")
        :null;
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

  /* 一键重置form表单中的所有参数 */
  onReset = () => this.props.form.resetFields();

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <div className={styles.searchBar}>
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="标题" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('title')(<Input placeholder="请输入培训计划标题" />)}
              </FormItem>
            </Col>
            <Col md={7} sm={24}>
              <span >
                <Button icon="search" type="primary" htmlType="submit" >
                  查找
                </Button>
                <Button onClick={this.onReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  展开 <Icon type="down" />
                </a>
              </span>
            </Col>
          </Row>
        </div>
      </Form >
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;
    const { organizationGovModel:{tree = []}, } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <div className={styles.searchBar}>
          <Row>
            <Col md={6} sm={24}>
              <FormItem label="标题" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('title')(<Input placeholder="请输入培训计划标题" />)}
              </FormItem>
            </Col>
            <Col md={7} sm={24}>
              <span >
                <Button icon="search" type="primary" htmlType="submit" >
                  查找
                </Button>
                <Button onClick={this.onReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                  收起 <Icon type="up" />
                </a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={24}>
              <FormItem label="培训时间" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('trainingTime')(<DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="培训地点" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('address')(<Input placeholder="培训地点" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="培训对象" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('trainingObjects')(<Input placeholder="培训对象" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={24}>
              <FormItem label="经办单位" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('handlingOrgName')(
                  <DictionaryTree
                    dataName="orgName" labelInValue tree={tree} type="tree"
                  />
                  )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="经办人" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('handler')(<Input placeholder="经办人" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="联系电话" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('tel')(<Input placeholder="联系电话" />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col md={6} sm={24}>
              <FormItem label="计划状态" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('state')(
                  <Select allowClear={true} placeholder="请选择状态">
                    <Option value="待发布" >待发布</Option>
                    <Option value="已发布">已发布</Option>
                    <Option value="已撤下">已撤下</Option>
                    <Option value="已关闭">已关闭</Option>
                  </Select>
                  )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="发布人" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('publisher')(<Input placeholder="发布人" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="发布时间" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('publishTime')(<DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
          </Row>
        </div>
        {/* <Col md={4} sm={24}>
            <FormItem label="所在单位id">
              {getFieldDecorator('orgId')(<Input placeholder="所在单位id" />)}
            </FormItem>
          </Col> */}
      </Form>
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default TrainingRsMemberSearchBar;
