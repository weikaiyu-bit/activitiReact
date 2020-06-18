import React, { Component } from 'react';
import {Button, Col, Form, Icon, Input, Row, Select, DatePicker } from 'antd';
import DictionaryTree from '@/pages/components/dictionaryTree';
import styles from '../css/style.less';
import { connect } from "dva";
import utils from "@/dtsea/common/utils";
import moment from "moment";

const FormItem = Form.Item;
const SelectOption = Select.Option;

@connect(({ bamDictDataModel, loading }) => ({
  bamDictDataModel,
  loading,
}))
class RtPerformanceSearchBar extends Component {
  modelName = 'bamDictDataModel';
  state = {
    formValues: {},
    stateArrays: ['投票中', '编辑中', '已关闭'],
    sexs: ['男', '女'],
    nationalTree: [],
    maritalStatus: ['已婚', '未婚', '丧偶'],
    healths: ['健康', '一般', '慢性病'],
    politicalOrientationTree: [],
  };

  componentDidMount() {
    this.national({dataId: 97}); // 民族
    this.politicalOrientation({dataId: 100}); // 政治面貌
  }

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      fieldsValue.workTime = fieldsValue.workTime ? moment(fieldsValue.workTime).format("YYYY-MM-DD 00:00:00") : fieldsValue.workTime
      fieldsValue.recommendedTime = fieldsValue.recommendedTime ? moment(fieldsValue.recommendedTime).format("YYYY-MM-DD 00:00:00") : fieldsValue.recommendedTime
      this.setState({
        formValues: fieldsValue,
      });
      const filter = {
        ...fieldsValue,
        politicalOrientation: fieldsValue.politicalOrientation ? fieldsValue.politicalOrientation.label : '',
      }
      this.props.onFind(pagination.current, pagination.pageSize, filter);
    });
  };

  national = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: response => {
        this.setState({
          nationalTree: utils.dataToTree(response.data)
        })
      }
    })
  }

  politicalOrientation= filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload:{
        ...filter,
      },
      callback: response =>{
        this.setState({
          politicalOrientationTree: utils.dataToTree(response.data)
        })
      },
    })
  }

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const { stateArrays } = this.state;
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
            <FormItem label="状态">
              {getFieldDecorator('state')(
                <Select placeholder="状态">
                  {stateArrays.map(stateArray => (
                    <SelectOption value={stateArray}>{stateArray}</SelectOption>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <span style={{ marginLeft: 8 }} >
              <Button icon="search" type="primary" htmlType="submit" >
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
    const { form: { getFieldDecorator } } = this.props;
    const { stateArrays, sexs, nationalTree, maritalStatus, politicalOrientationTree, healths, } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
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
            <Col md={6} sm={24}>
              <FormItem label="状态" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('state')(
                  <Select placeholder="状态">
                    {stateArrays.map(stateArray => (
                      <SelectOption value={stateArray}>{stateArray}</SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24} labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}>
              <span style={{ marginLeft: 8 }} >
                <Button icon="search" type="primary" htmlType="submit" >
                  查找
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
                      <SelectOption value={sex}>{sex}</SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="民族" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('national')(
                  <DictionaryTree width="100%" {...nationalData}/>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="籍贯" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('nativePlace')(<Input placeholder="籍贯" />)}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="健康状况" labelCol={{ span: 6 }}
                        wrapperCol={{ span: 16 }}>
                {getFieldDecorator('health')(
                  <Select placeholder="健康状况">
                    {healths.map(health => (
                      <SelectOption value={health}>{health}</SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={24}>
              <FormItem label="参加工作时间" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('workTime')(
                  <DatePicker format="YYYY-MM-DD" style={{width: "100%"}}/>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="婚姻状况" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('maritalStatus')(
                  <Select placeholder="婚姻状况">
                    {maritalStatus.map(maritalStatu => (
                      <SelectOption value={maritalStatu}>{maritalStatu}</SelectOption>
                    ))}
                  </Select>
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
              <FormItem label="职务名称" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('positionName')(<Input placeholder="职务名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={6} sm={24}>
              <FormItem label="政治面貌" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('politicalOrientation')(
                  <DictionaryTree width="100%" {...politicalOrientationData}/>
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
                  <DatePicker format="YYYY-MM-DD" style={{width: "100%"}}/>
                )}
              </FormItem>
            </Col>
            <Col md={6} sm={24}>
              <FormItem label="联系电话" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('phone')(<Input placeholder="联系电话" />)}
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

export default RtPerformanceSearchBar;
