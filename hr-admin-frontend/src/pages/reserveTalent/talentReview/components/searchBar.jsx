import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import utils from '@/dtsea/common/utils';
import DictionaryTree from '@/pages/components/dictionaryTree';
import moment from 'moment';
import styles from '../css/style.less';

const { Option } = Select;
const SelectOption = Option;
const { MonthPicker } = DatePicker;

const FormItem = Form.Item;
@connect(({ bamDictDataModel, loading }) => ({
  bamDictDataModel,
  loading,
}))
class TalentReviewSearchBar extends Component {
  modelName = 'bamDictDataModel'

  state = {
    formValues: {},
    sexs: ['男', '女'],
    nationalTree: [],
    maritalStatus: ['已婚', '未婚', '丧偶'],
    politicalOrientationTree: [],
    healthTree: [],
    educationTree: [],
    states: ['审核中', '已收录', '编辑中'],
  };

  componentDidMount() {
    this.national({ dataId: 97 }); // 民族
    this.politicalOrientation({ dataId: 100 }); // 政治面貌
    this.health({ dataId: 28 }); // 健康状况
    this.education({ dataId: 90 }); // 学历
  }

  national = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: response => {
        this.setState({
          nationalTree: utils.dataToTree(response.data),
        })
      },
    })
  }

  politicalOrientation = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: response => {
        this.setState({
          politicalOrientationTree: utils.dataToTree(response.data),
        })
      },
    })
  }

  health = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: response => {
        this.setState({
          healthTree: utils.dataToTree(response.data),
        })
      },
    })
  }

  education = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: response => {
        this.setState({
          educationTree: utils.dataToTree(response.data),
        })
      },
    })
  }

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.recommendedTime = fieldsValue.recommendedTime ? moment(fieldsValue.recommendedTime).format('YYYY-MM-DD 00:00:00') : fieldsValue.recommendedTime;
      fieldsValue.workTime = fieldsValue.workTime ? moment(fieldsValue.workTime).format('YYYY-MM-DD 00:00:00') : fieldsValue.workTime;
      this.setState({
        formValues: fieldsValue,
      });
      console.log('fieldsValue', fieldsValue)
      const filter = {
        ...fieldsValue,
        national: fieldsValue.national ? fieldsValue.national.label : '',
        politicalOrientation: fieldsValue.politicalOrientation ? fieldsValue.politicalOrientation.label : '',
        health: fieldsValue.health ? fieldsValue.health.label : '',
      }
      console.log('filter', filter)
      this.props.onFind(pagination.current, pagination.pageSize, filter);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <Row>
          <Col md={5} sm={24}>
            <FormItem label="被推荐人姓名">
              {getFieldDecorator('name')(<Input placeholder="被推荐人姓名" />)}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <span style={{ marginLeft: 8 }} >
              <Button icon="search" type="primary" htmlType="submit" >
                查找
              </Button>
              <Button style={{ marginLeft: 12 }} onClick={this.handleReset}>
                  重置
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
    const { form: { getFieldDecorator } } = this.props;
    // eslint-disable-next-line max-len
    const { sexs, nationalTree, maritalStatus, politicalOrientationTree, healthTree, educationTree, states } = this.state;
    const nationalData = {
      tree: nationalTree,
      type: 'list',
      labelInValue: true,
    }
    const politicalOrientationData = {
      tree: politicalOrientationTree,
      type: 'disableParent',
      labelInValue: true,
    }
    const healthData = {
      tree: healthTree,
      type: 'list',
      labelInValue: true,
    }
    const educationData = {
      tree: educationTree,
      type: 'disableParent',
      labelInValue: true,
    }
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <div className={styles.searchBar}>
          <Row>
            <Col md={6} sm={24}>
              <FormItem label="被推荐人姓名" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('name')(<Input placeholder="被推荐人姓名" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24} labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}>
              <span style={{ marginLeft: 8 }} >
                <Button icon="search" type="primary" htmlType="submit" >
                  查找
              </Button>
                <Button style={{ marginLeft: 12 }} onClick={this.handleReset}>
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
              <FormItem label="性别" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('sex')(
                  <Select placeholder="性别">
                  {sexs.map(sex => (
                      <SelectOption key={sex}>{sex}</SelectOption>
                    ))}
                  </Select>,
                  )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="民族" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('national')(
                  <DictionaryTree width="150px" {...nationalData} />,
                )}
              </FormItem>
            </Col>

            <Col md={6} sm={24}>
              <FormItem label="参加工作时间" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('workTime')(
                  <DatePicker format="YYYY-MM-DD" style={{width: '100%'}}/>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="婚姻状况" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('maritalStatus')(
                  <Select placeholder="婚姻状况">
                    {maritalStatus.map(maritalStatu => (
                      <SelectOption key={maritalStatu}>{maritalStatu}</SelectOption>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="健康状况" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('health')(
                  <DictionaryTree width="150px" {...healthData} />,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="学历" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('education')(
                  <DictionaryTree width="150px" {...educationData} />,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="所在单位" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('orgName')(<Input placeholder="所在单位" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="政治面貌" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('politicalOrientation')(
                  <DictionaryTree width="150px" {...politicalOrientationData} />,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="推荐人" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('recommender')(<Input placeholder="推荐人" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="推荐时间" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('recommendedTime')(
                  <DatePicker format="YYYY-MM-DD" style={{width: "100%"}} />,
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="推荐表状态" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('state')(
                  <Select placeholder="推荐表状态">
                    {states.map(state => (
                      <SelectOption key={state}>{state}</SelectOption>
                    ))}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default TalentReviewSearchBar;
