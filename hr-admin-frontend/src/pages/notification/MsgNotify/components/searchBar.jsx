import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from '../style.less';

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
      span: 16,
    },
    sm: {
      span: 7,
    },
    md: {
      span: 7,
    },
  },
};
const { Option } = Select;
@connect(({ msgTargetTypesModel, msgNotifyConfigModel, loading }) => ({
  msgTargetTypesModel,
  msgNotifyConfigModel,
  loading: loading.models.fetch,
}))

class MsgNotifySearchBar extends Component {
  msgTargetTypesModelName = 'msgTargetTypesModel';

  msgNotifyConfigModelModeName = 'msgNotifyConfigModel';

  state = {
    expandForm: false,
  };

  componentDidMount () {
    // 查找全部
    this.findTargetTypesAll();
    this.findNotifyConfigAll();
  }

  findTargetTypesAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.msgTargetTypesModelName}/findAll`,
      payload: {},
    });
  }

  findNotifyConfigAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.msgNotifyConfigModelModeName}/findAll`,
      payload: {},
    });
  }


  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    console.log(pagination);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.createAt = fieldsValue.createAt
        ? moment(fieldsValue.createAt).format('YYYY-MM-DD 00:00:00')
        : fieldsValue.createAt;
      this.props.onSetPageFilter({ ...fieldsValue })
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

  renderSimpleForm () {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={5} sm={24}>
              <FormItem label="发送者名称">
                {getFieldDecorator('senderName')(<Input placeholder="发送者名称" />)}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
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

  renderAdvancedForm () {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const {
      msgTargetTypesModel: { data },
    } = this.props;
    const {
      msgNotifyConfigModel,
    } = this.props;

    return (
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={5} sm={24}>
              <FormItem label="发送者名称">
                {getFieldDecorator('senderName')(<Input placeholder="发送者名称" />)}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem label="消息类型">
                {getFieldDecorator('notifyType')(<Input placeholder="消息类型" />)}
              </FormItem>
            </Col>

            <Col md={5} sm={24}>
              <FormItem label="动作类型">
                {getFieldDecorator('action')(
                  <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.handleProvinceChange}>
                    <Option value="">全部</Option>
                    {msgNotifyConfigModel.data.map(item => {
                      if (item.action) {
                        return <Option value={item.action} key={item.id} >{item.action}</Option>
                      } return null
                    })
                    }
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem label="目标名称">
                {getFieldDecorator('targetName')(<Input placeholder="目标名称" />)}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem label="目标类型">
                {getFieldDecorator('targetType')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="">全部</Option>
                    {data.map(item => {
                      if (item.targetType) {
                        return <Option value={item.targetType}
                          key={item.id} >{item.targetType}</Option>
                      } return null
                    })}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem label="消息内容">
                {getFieldDecorator('content')(<Input placeholder="消息内容" />)}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem label="发送者类型">
                {getFieldDecorator('senderType')(<Input placeholder="发送者类型" />)}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
              <FormItem label="发送时间">
                {getFieldDecorator('createAt')(<DatePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder="请输入创建时间"
                />)}
              </FormItem>
            </Col>
            <Col md={5} sm={24}>
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

  render () {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default MsgNotifySearchBar;
