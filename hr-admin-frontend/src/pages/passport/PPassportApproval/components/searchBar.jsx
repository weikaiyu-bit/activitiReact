import React, { Component } from 'react';
import { Button, Col, DatePicker, Form, Icon, Input, Row, Select } from 'antd';
import styles from '@/dtsea/common/styles/style.less';
import { connect } from 'dva';
import moment from 'moment';
import DictionaryTree from '@/pages/components/dictionaryTree';

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
@connect(({ organizationGovModel, bamDictDataModel, loading }) => ({
  organizationGovModel,
  bamDictDataModel,
  loading: loading.models.fetch,
}))
class PPassportApprovalSearchBar extends Component {
  modelName = 'organizationGovModel';

  modeDict = 'bamDictDataModel';

  state = {
    expandForm: false,
    pageNumber: 1,
    pageSize: 10,
  };

  componentDidMount() {
    this.findByFilter({ });
    // 数字字典证件类型查询
    this.findDictAll();
  }

  findDictAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modeDict}/fetch`,
      payload: {
        dataId: 101,
      },
    });
  };

  findByFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchByFilter`,
      payload: {
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    const pageNumber = 1;
    form.validateFields((err, values) => {
      if (err) return;
      values.beginTime = values.beginTime
        ? moment(values.beginTime).format('YYYY-MM-DD 00:00:00')
        : values.beginTime;// 开始时间
      values.endTime = values.endTime
        ? moment(values.endTime).format('YYYY-MM-DD 00:00:00')
        : values.endTime; // 结束时间
      values.applicationTime = values.applicationTime
        ? moment(values.applicationTime).format('YYYY-MM-DD 00:00:00')
        : values.applicationTime; // 申请时间
      if (values.applicantOrgName) {
        values.applicantOrgId = values.applicantOrgName.value
        values.applicantOrgName = values.applicantOrgName.label
      }
      // 证件类型
      if (values.certificateType) {
        if (values.certificateType.label === '全部') {
          values.certificateType = null
        } else {
          values.certificateType = values.certificateType.label
          values.certificateTypeId = values.certificateType.key
        }
      }
      this.props.onFind(pageNumber, pagination.pageSize, values);
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

  // 清空查询条件
  emptyCondition = () => {
    const { form } = this.props;
    const { pageNumber, pageSize } = this.state;
    this.props.resFindPage(pageNumber, pageSize, {});
    form.resetFields();
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;

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
        </Form>
      </div>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;
    const {
      organizationGovModel: { tree = [] },
    } = this.props;
    const {
      bamDictDataModel,
    } = this.props;
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
              <FormItem label="证件类型">
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
              <FormItem label="证件状态">
              {getFieldDecorator('state')(<Select placeholder = "请选择">
                        <Option value="已领取">已领取</Option>
                        <Option value="保管中">保管中</Option>
                      </Select>)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="目的地">
                {getFieldDecorator('destination')(<Input placeholder="目的地" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }} >
            <Col md={6} sm={24}>
              <FormItem label="开始时间">
                {getFieldDecorator('beginTime')(<DatePicker format="YYYY-MM-DD" style={{
                  width: '100%',
                }}/>)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="结束时间">
                {getFieldDecorator('endTime')(<DatePicker format="YYYY-MM-DD" style={{
                  width: '100%',
                }}/>)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="申请人所在单位">
                {
                  getFieldDecorator('applicantOrgName')(<DictionaryTree dataName="orgName" labelInValue tree={tree} type="tree" />)
                }
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="申请时间">
                {getFieldDecorator('applicationTime')(<DatePicker format="YYYY-MM-DD" style={{
                  width: '100%',
                }}/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={24}>
              <FormItem label="申请原因">
                {getFieldDecorator('reason')(<Input placeholder="申请原因" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="保管人">
                {getFieldDecorator('keeper')(<Input placeholder="保管人" />)}
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
export default PPassportApprovalSearchBar;
