/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, InputNumber, Row, Select, Checkbox, Radio, Switch } from 'antd';
import styles from '../css/searchBar.less'
import { connect } from 'dva';
import utils from '@/dtsea/common/utils';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};
const educationOptions = ['博士', '研究生', '本科', '专科', '中专', '中技', '高中', '初中', '小学'];
const plainOptions = ['中央管理干部', '省级党委管理干部', '市级党委管理干部', '县级党委管理干部', '其他']; // 管理类别id从 7110开始  -> 中央管理干部：7110  省级党委管理干部： 7111 ...  暂时用名字查询
const defaultCheckedList = [];
const defaultCheckedList2 = [];
@connect(({ bamDictDataModel, loading }) => ({
  bamDictDataModel,
  loading,
}))
class PPersonnelFilesSearchBar extends Component {
  modelName = 'bamDictDataModel'

  state = {
    formValues: {},
    manageCategorys: defaultCheckedList,
    heducations: defaultCheckedList2,
    indeterminate: false,
    indeterminate2: false,
    checkAll: false,
    checkAll2: false,
    state: 1,
    radioNum: 1,
    rankTree: [],
    positionLevel: [],
    personnelCategoryTree: [],
    iconToggle: true,
  };

  componentDidMount() {
    this.rank({ dataId: 95 }); // 职级层级
    this.positionLevels({ dataId: 96 }) // 职务层级
    this.personnelCategory({ dataId: 99 }) // 人员类别
  }

  personnelCategory = filter => {
    // 人员类别
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: res => {
        this.setState({
          personnelCategoryTree: utils.dataToTree(res.data),
        })
      },
    });
  }

  positionLevels = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: res => {
        this.setState({
          positionLevel: utils.dataToTree(res.data),
        })
      },
    });
  }

  rank = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetch`,
      payload: {
        ...filter,
      },
      callback: res => {
        this.setState({
          rankTree: utils.dataToTree(res.data),
        })
      },
    });
  }

  handleSearch = e => {
    e.preventDefault();
    // manageCategorys
    const { form, pagination } = this.props;
    const { heducations, manageCategorys } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      const filter = {
        ...fieldsValue, heducations, manageCategorys,
        rank: fieldsValue.rank ? fieldsValue.rank.label : '',
        positionLevel: fieldsValue.positionLevel ? fieldsValue.positionLevel.label : ''
      };
      this.props.onFind(pagination.current, pagination.pageSize, filter);
    });
  };

  onChangeStart = num => {
    this.setState({
      state: num,
    })
  }

  onChangeRadio = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      radioNum: e.target.value,
    });
  };

  onChange = manageCategorys => {
    this.setState({
      manageCategorys,
      indeterminate: !!manageCategorys.length && manageCategorys.length < plainOptions.length,
      checkAll: manageCategorys.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      manageCategorys: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  onChange2 = heducations => {
    this.setState({
      heducations,
      indeterminate2: !!heducations.length && heducations.length < educationOptions.length,
      checkAll2: heducations.length === educationOptions.length,
    });
  };

  onCheckAllChange2 = e => {
    this.setState({
      heducations: e.target.checked ? educationOptions : [],
      indeterminate2: false,
      checkAll2: e.target.checked,
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  toggleFormTree = () => {
    const { toggleForms } = this.props;
    toggleForms();
  };

  handleReset = () => {
    this.setState({
      educationOptions:[],
      plainOptions:[],
    })
    this.props.form.resetFields();
  };

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;
    const { iconToggle } = this.state;
    return (

      <div className={styles.searchBar} style={{ width: '100%' }}>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row>
            <Col md={1} sm={24} style={{ top: '8px' }}>
              {iconToggle ? <><a style={{ marginLeft: 8 }} onClick={() => this.toggleFormTree(false)}>
                <Icon type="left" />
              </a></> : <><a style={{ marginLeft: 8 }} onClick={() => this.toggleFormTree(true)}>
                <Icon type="right" />
              </a></>
              }
            </Col>
            <Col md={4} sm={24}>
              <FormItem label="姓名" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('name')(<Input placeholder="姓名/拼音缩写/身份证号码" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24} style={{ top: '8px' }}>
              <Checkbox onClick={() => this.onChangeStart(1)} checked={this.state.state === 1}>在职人员</Checkbox>
              <Checkbox onClick={() => this.onChangeStart(2)} checked={this.state.state === 2}>非在职人员</Checkbox>
              <Radio.Group onChange={this.onChangeRadio} defaultValue={this.state.radioNum} >
                <Radio value={1}>在全库中查</Radio>
                <Radio value={2}>在结果中查</Radio>
                <Radio value={3}>追加查询</Radio>
              </Radio.Group>
            </Col>
            <Col md={6} sm={24} style={{ top: '4px' }}>
              <span>
                <Button icon="search" type="primary" htmlType="submit">
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
      </div>
    );
  }

  renderAdvancedForm() {
    const { form: { getFieldDecorator } } = this.props;
    const { iconToggle, rankTree, positionLevel, personnelCategoryTree } = this.state;
    const rankData = {
      tree: rankTree,
      type: 'disableParent',
      labelInValue: true
    };
    const positionLevelData = {
      tree: positionLevel,
      type: 'disableParent',
      labelInValue: true
    };
    const personnelCategoryData = {
      tree: personnelCategoryTree,
      type: 'disableParent',
    };
    return (
      <div className={styles.searchBar} style={{ width: '100%' }}>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row>
            <Col md={1} sm={24} style={{ top: '8px' }}>
              {iconToggle ? <><a style={{ marginLeft: 8 }} onClick={() => this.toggleFormTree(false)}>
                <Icon type="left" />
              </a></> : <><a style={{ marginLeft: 8 }} onClick={() => this.toggleFormTree(true)}>
                <Icon type="right" />
              </a></>
              }
            </Col>
            <Col md={4} sm={24}>
              <FormItem label="姓名" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('name')(<Input placeholder="请输入姓名/拼音缩写/身份证号码" />)}
              </FormItem>
            </Col>
            <Col md={12} sm={24} style={{ top: '8px' }}>
              <Checkbox onClick={() => this.onChangeStart(1)} checked={this.state.state === 1}>在职人员</Checkbox>
              <Checkbox onClick={() => this.onChangeStart(2)} checked={this.state.state === 2}>非在职人员</Checkbox>
              <Radio.Group onChange={this.onChangeRadio} defaultValue={this.state.radioNum} >
                <Radio value={1}>追加查询</Radio>
                <Radio value={2}>在结果中查</Radio>
                <Radio value={3}>在全库中查</Radio>
              </Radio.Group>
            </Col>
            <Col md={6} sm={24} style={{ top: '4px' }}>
              <span>
                <Button icon="search" type="primary" htmlType="submit">
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
            <Col md={4} sm={24}>
              <FormItem label="领导职务" labelCol={{ span: 12 }}
              >
                {getFieldDecorator('positionLevel')(
                  <Switch style={{ marginLeft: 7 }} />,
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24}>
              <FormItem label="处级以上" labelCol={{ span: 12 }}
              >
                {getFieldDecorator('level')(
                  <Switch style={{ marginLeft: 7 }} />,
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24}>
              <FormItem label="少数民族" labelCol={{ span: 12 }}
              >
                {getFieldDecorator('national')(
                  <Switch style={{ marginLeft: 7 }} />,
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24}>
              <FormItem label="非中共党员" labelCol={{ span: 14 }}
              >
                {getFieldDecorator('partyTime')(
                  <Switch style={{ marginLeft: '7px' }} />,
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24}>
              <FormItem label="全日制" labelCol={{ span: 12 }}
              >
                {getFieldDecorator('partyTime')(
                  <Switch defaultChecked style={{ marginLeft: 14 }} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={24}>
              <FormItem label="管理类别" labelCol={{ span: 12 }}
                wrapperCol={{ span: 10 }}>
                <Checkbox
                  indeterminate={this.state.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkAll}
                >
                  全部
                  </Checkbox>
              </FormItem>
            </Col>
            <Col md={20} sm={24}>
              <FormItem wrapperCol={{ span: 24 }}>
                <CheckboxGroup
                  options={plainOptions}
                  value={this.state.manageCategorys}
                  onChange={this.onChange}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Row>
                <Col span={4}>
                  <FormItem label="学历" labelCol={{ span: 12 }}
                    wrapperCol={{ span: 10 }}>
                    <Checkbox
                      indeterminate={this.state.indeterminate2}
                      onChange={this.onCheckAllChange2}
                      checked={this.state.checkAll2}
                    >
                      全部
                     </Checkbox>
                  </FormItem>
                </Col>
                <Col span={18}>
                  <FormItem wrapperCol={{ span: 24 }}>
                    <CheckboxGroup
                      options={educationOptions}
                      value={this.state.heducations}
                      onChange={this.onChange2}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={24}>
              <FormItem label="人员类别" labelCol={{ span: 12 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('personnelCategoryId')(
                  <DictionaryTree width="150px" {...personnelCategoryData} />,
                )}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
              <FormItem label="职级层次" labelCol={{ span: 12 }} wrapperCol={{ span: 10 }} >
                {getFieldDecorator('rank')(
                  <DictionaryTree width="150px" {...rankData} />,
                )}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
              <FormItem label="职务层次" labelCol={{ span: 12 }} wrapperCol={{ span: 10 }}>
                {getFieldDecorator('positionLevel')(
                  <DictionaryTree width="150px" {...positionLevelData} />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div >
    );
  }

  render() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
}

export default PPersonnelFilesSearchBar;
