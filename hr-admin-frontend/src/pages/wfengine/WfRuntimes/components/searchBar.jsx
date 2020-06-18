import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, DatePicker, Select, TreeSelect } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import moment from 'moment';
import { connect } from 'dva';

const FormItem = Form.Item;

const { Option } = Select;
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

@connect(({ wfWorkflowCategoriesModel }) => ({
  wfWorkflowCategoriesModel,
}))
class WfRuntimesSearchBar extends Component {
  state = {
    expandForm: false,
  };

  wfWorkflowCategoriesModelName='wfWorkflowCategoriesModel';

  componentDidMount() {
    this.wfWorkflowCategoriesfindAll();
  }

  /* **************流程类别数据****************** */
  wfWorkflowCategoriesfindAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.wfWorkflowCategoriesModelName}/treeMenu`,
      payload: {},
    });
  }

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
        if (err) return;
        fieldsValue.updateTime = fieldsValue.updateTime
          ? moment(fieldsValue.updateTime).format('YYYY-MM-DD 00:00:00')
          : fieldsValue.updateTime;
        fieldsValue.nodeName = fieldsValue.nameNode;
        this.props.onFind(1, pagination.pageSize, fieldsValue);
      });
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  emptyCondition = () => {
    const { form } = this.props;
    const { pageNumber, pageSize } = this.state;
    this.props.onFind(pageNumber, pageSize, {});
    form.resetFields();
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      wfWorkflowCategoriesModel,
    } = this.props;
    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="流程类别">
              {getFieldDecorator('catgId')(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={wfWorkflowCategoriesModel.treeData}
                  treeDefaultExpandAll
                  placeholder="请选择流程类别"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="流程名字">
              {getFieldDecorator('flowName')(<Input placeholder="流程名字" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="实例名称">
              {getFieldDecorator('runtimeName')(<Input placeholder="实例名称" />)}
            </FormItem>
          </Col>
          <Col md={1} sm={24}>
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
    const {
      wfWorkflowCategoriesModel,
    } = this.props;
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
            <FormItem label="流程类别">
              {getFieldDecorator('catgId')(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={wfWorkflowCategoriesModel.treeData}
                  treeDefaultExpandAll
                  placeholder="请选择流程类别"
                />,
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="流程名字">
              {getFieldDecorator('flowName')(<Input placeholder="流程名字" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="实例名称">
              {getFieldDecorator('runtimeName')(<Input placeholder="实例名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="当前节点">
              {getFieldDecorator('TheNodeName')(<Input placeholder="当前节点" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="实例状态">
              {getFieldDecorator('status')(<Select placeholder="请选择状态"
              >
                <Option value="starting">正在发起</Option>
                <Option value="running">运行中</Option>
                <Option value="stopping">已停止</Option>
                <Option value="suspend">暂停</Option>
              </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('updateTime')(
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
            <FormItem label="更新人">
              {getFieldDecorator('updatorUid')(<Input placeholder="更新人" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span >
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

export default WfRuntimesSearchBar;
