import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Radio ,Select  } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import { connect } from 'dva';

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
@connect(({ wfWorkflowCategoriesModel }) => ({
  wfWorkflowCategoriesModel,
}))
class WfWorkflowCategoriesSearchBar extends Component {
  state = {
    expandForm: false,
  };

  componentDidMount() {
    this.findAll();
  }

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/fetch',
      payload: {
        ...filter,
      },
    });
  };

  findAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wfWorkflowCategoriesModel/findAll',
      payload: {
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
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
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="类别名称">
              {getFieldDecorator('categoryName')(<Input placeholder="类别名称" />)}
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
    const {
      wfWorkflowCategoriesModel: { alldata = [] },
    } = this.props;
    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="类别名称">
              {getFieldDecorator('categoryName')(<Input placeholder="类别名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
          <Col md={6} sm={24}>
            <span >
              <Button type="primary" htmlType="submit" >
                查找
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
      </div>
    );
  }
              /*
<a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收回 <Icon type="up" />
              </a>
              */
  render() {
    const { expandForm } = this.state;
    return this.renderAdvancedForm();
  }
}

export default WfWorkflowCategoriesSearchBar;
