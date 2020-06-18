import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, message, Row, Select } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import moment from 'moment';
import DictionaryTree from '../../../components/dictionaryTree';

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
const { Option } = Select;
@connect(({ organizationGovModel, bamDictDataModel, loading }) => ({
  organizationGovModel,
  bamDictDataModel,
  loading: loading.models.fetch,
}))
class PassportCertificateSearchBar extends Component {
  modelName = 'organizationGovModel';

  modeDict = 'bamDictDataModel';

  state = {
    expandForm: false,
    pageNumber: 1,
  };

  componentDidMount() {
    this.findByFilter({ });
    // 数字字典证件类型查询
    this.findDictZj();
    this.findDictBz();
  }

  findDictZj = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modeDict}/fetch`,
      payload: {
        dataId: 101,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            // 将数据存起来
            break;
          case ErrorCode.FAILURE:
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  findDictBz = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modeDict}/fetch`,
      payload: {
        dataId: 102,
      },
    });
    const {
      bamDictDataModel,
    } = this.props;
  };

  findByFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchByFilter`,
      payload: {
      },
    });
  };

  callbackDefault = response => {
    const msg = (response.msg) ? response.msg : '发生未知错误！';
    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // 登记时间
      fieldsValue.registrationTime = fieldsValue.registrationTime
        ? moment(fieldsValue.registrationTime).format('YYYY-MM-DD 00:00:00')
        : fieldsValue.beginTime;
        // 所在单位
      if (fieldsValue.applicantOrgName) {
        fieldsValue.applicantOrgId = fieldsValue.applicantOrgName.value
        fieldsValue.applicantOrgName = fieldsValue.applicantOrgName.label
      }
       // 编制类型
       if (fieldsValue.posistionCategory) {
        fieldsValue.posistionCategoryId = fieldsValue.posistionCategory.value
        fieldsValue.posistionCategory = fieldsValue.posistionCategory.label
      }
      // 证件类型
      if (fieldsValue.certificateType) {
        if (fieldsValue.certificateType.label === '全部') {
          fieldsValue.certificateType = null
        } else {
          fieldsValue.certificateTypeId = fieldsValue.certificateType.key
          fieldsValue.certificateType = fieldsValue.certificateType.label
        }
      }

      this.props.onFind(pagination.current, pagination.pageSize, fieldsValue);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  // 重置按钮
  onReset = () => {
    this.props.form.resetFields();
  }

  emptyCondition = () => {
    const { form } = this.props;
    this.props.onFind();
    form.resetFields();
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;

    return (
    <div className={styles.tableListForm}>
      <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="证件编号" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('certificateCode')(<Input placeholder="请输入证件编号/身份证号码/姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span >
              <Button icon="search" type="primary" htmlType="submit" >
                查找
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form >
    </div>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      bamDictDataModel, data, organizationGovModel: { tree = [] },
    } = this.props;
    // 判断获取多种类型下拉
    const bzType = [];
    const zjType = [];/*
    for (let i = 0; i < 36; +i) {
      bzType.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    } */

    return (
      <div className={styles.tableListForm}>
      <Form onSubmit={this.handleSearch} layout="inline" {...formItemLayout}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="证件编号">
              {getFieldDecorator('certificateCode')(<Input placeholder="请输入证件编号/身份证号码/姓名" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="证件名称">
              {getFieldDecorator('certificateName')(<Input placeholder="证件名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="证件类型">
              {/* {getFieldDecorator('certificateType')(<Input placeholder="证件类型" />)} */}
              {getFieldDecorator('certificateType')(<Select
                  showSearch
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="label"
                  placeholder="请选择证件类型"
                  labelInValue
                ><Option value="" label="全部">全部</Option>
                  {bamDictDataModel.data !== undefined ? (bamDictDataModel.data.map(item =>
                    <Option value={item.id} key={item.id}
                            label={item.dataName} >{item.dataName}</Option>,
                  )) : (<Option value=""></Option>)
                  }
                </Select>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="身份证号">
              {getFieldDecorator('idCard')(<Input placeholder="身份证号" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="编制类型">
              {getFieldDecorator('posistionCategory')(<DictionaryTree type="list" tree={ data } labelInValue />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="持有人">
              {getFieldDecorator('owner')(<Input placeholder="持有人" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="持有人所在单位">
              {/* {getFieldDecorator('ownerOrgName')(<Input placeholder="持有人所在单位" />)} */}
                {
                  getFieldDecorator('applicantOrgName')(<DictionaryTree dataName="orgName" labelInValue tree={tree} type="tree" />)
                }
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="证件状态">
              {getFieldDecorator('state')(<Select placeholder = "请选择">
                        <Option value="已领取">已领取</Option>
                        <Option value="保管中">保管中</Option>
                      </Select>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="保管人">
              {getFieldDecorator('keeper')(<Input placeholder="保管人" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="登记时间">
              {getFieldDecorator('registrationTime')(<DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span >
              <Button icon="search" type="primary" htmlType="submit" >
                查找
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onReset}>
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

export default PassportCertificateSearchBar;
