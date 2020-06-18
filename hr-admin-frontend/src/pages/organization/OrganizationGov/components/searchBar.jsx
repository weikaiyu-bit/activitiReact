/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, TreeSelect } from 'antd';
import { FolderAddOutlined, FileTextOutlined } from '@ant-design/icons';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const { Option } = Select;

class OrgOrganizationSearchBar extends Component {
  state = {
    searchValue: '',
  };

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    console.log(this.props);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('fieldsValue', fieldsValue);
      this.props.onFind(fieldsValue);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  /*renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="horizontal">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col xl={8} md={12} sm={24}>
            <FormItem label="机构名称song" {...formItemLayout}>
              {getFieldDecorator('name')(<Input placeholder="请输入机构名称/机构简称" />)}
            </FormItem>
          </Col>
          <Col xl={16} md={12} sm={24} style={{ marginTop: 3 }}>
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
      </Form>
    );
  }*/

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      orgLevel,
      orgCategoryTree,
      area,
    } = this.props;
    const areaData = {
      tree: area ? [area] : [],
      type: 'tree',
      dataName: 'areaName',
    };
    const orgData = {
      tree: orgCategoryTree,
      type: 'disableParent',
      dataName: 'dataName',
    };
    const datas = {
      tree: orgLevel,
      type: 'list',
      dataName: 'dataName',
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <Form onSubmit={this.handleSearch} layout="horizontal">
        <Row>
          <Col xl={5}>
            <FormItem label="机构名称" {...formItemLayout}>
              {getFieldDecorator('name')(<Input placeholder="请输入机构名称/机构简称" />)}
            </FormItem>
          </Col>
          <Col xl={5}>
            <FormItem label="机构级别" {...formItemLayout}>
              {getFieldDecorator('level')(
                <DictionaryTree {...datas} />
              )}
            </FormItem>
          </Col>
          <Col xl={5}>
            <FormItem label="机构类别" {...formItemLayout}>
              {getFieldDecorator('orgCategory')(
                <DictionaryTree {...orgData}/>
              )}
            </FormItem>
          </Col>
          <Col xl={7}>
            <FormItem label="所在政区代码" {...formItemLayout}>
              {getFieldDecorator('areaId')(
                <DictionaryTree {...areaData}/>
              )}
            </FormItem>
          </Col>
          <Col xl={2} style={{ marginTop: 3 }}>
            <span>
              <Button icon="search" type="primary" htmlType="submit">
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

  render() {
    const { expandForm } = this.state;
    // return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderAdvancedForm()
  }
}

export default OrgOrganizationSearchBar;
