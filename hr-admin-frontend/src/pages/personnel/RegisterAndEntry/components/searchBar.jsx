import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, InputNumber, Row, Select, Checkbox, Radio, Switch } from 'antd';
import '../css/style.css';
import { connect } from 'dva';
import utils from '@/dtsea/common/utils';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 10 },
};
const educationOptions = ['研究生', '本科', '专科', '中专', '中技', '高中', '初中', '小学'];
const plainOptions = ['中央管理干部', '省级党委管理干部', '市级党委管理干部', '县级党委管理干部', '其他'];

const defaultCheckedList = [];
const defaultCheckedList2 = [];

@connect(({ bamDictDataModel, loading }) => ({
  bamDictDataModel,
  loading,
}))
class ResgisterAndEntrySearchBar extends Component {
  state = {
    formValues: {},
    checkedList: defaultCheckedList,
    checkedList2: defaultCheckedList2,
    indeterminate: false,
    indeterminate2: false,
    checkAll: false,
    checkAll2: false,
    PeopleState: 1,
    radioNum: 1,
    positionLevel: [],
    rankTree: [],
    personnelCategoryTree: [],
  };

  componentDidMount() {
    const { findDictData } = this.props;
    // 职务层级
    findDictData({
      dataId: 95,
    }, response => {
      this.setState({
        positionLevel: utils.dataToTree(response.data),
      });
    });

    // 职级层级
    findDictData({
      dataId: 96,
    }, response => {
      this.setState({
        rankTree: utils.dataToTree(response.data),
      });
    });

    // 人员类别
    findDictData({
      dataId: 99,
    }, response => {
      this.setState({
        personnelCategoryTree: utils.dataToTree(response.data),
      });
    })
  }

  handleSearch = e => {
    e.preventDefault();
    const { form, pagination } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      this.props.onFind(pagination.current, pagination.pageSize, fieldsValue);
    });
  };

  onChangeStart = num => {
    this.setState({
      PeopleState: num,
    })
  };

  onChangeRadio = e => {
    this.setState({
      radioNum: e.target.value,
    });
  };

  onChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < plainOptions.length,
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  onChange2 = checkedList2 => {
    this.setState({
      checkedList2,
      indeterminate2: !!checkedList2.length && checkedList2.length < educationOptions.length,
      checkAll2: checkedList2.length === educationOptions.length,
    });
  };

  onCheckAllChange2 = e => {
    this.setState({
      checkedList2: e.target.checked ? educationOptions : [],
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

  renderSimpleForm() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
        <Row>
          <Col md={8} sm={24}>
            <FormItem label="姓名" labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}>
              {getFieldDecorator('name')(<Input placeholder="请输入姓名/拼音缩写/身份证号码" />)}
            </FormItem>
          </Col>
          <Col md={9} sm={24} style={{ top: '8px' }}>
            <Checkbox onClick={() => this.onChangeStart(1)} checked={this.state.PeopleState === 1}>在职人员</Checkbox>
            <Checkbox onClick={() => this.onChangeStart(2)} checked={this.state.PeopleState === 2}>非在职人员</Checkbox>
            <Radio.Group onChange={this.onChangeRadio} defaultValue={this.state.radioNum} >
              <Radio value={1}>追加查询</Radio>
              <Radio value={2}>在结果中查</Radio>
              <Radio value={3}>在全库中查</Radio>
            </Radio.Group>
          </Col>
          <Col md={7} sm={24} style={{ top: '4px' }}>
            <span>
              <Button icon="search" type="primary" htmlType="submit">
                查找
              </Button>
              <Button style={{ marginLeft: 12 }}>
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
    const { rankTree, positionLevel, personnelCategoryTree } = this.state;
    const rankData = {
      tree: rankTree,
      type: 'disableParent',
    };
    const positionLevelData = {
      tree: positionLevel,
      type: 'disableParent',
    };

    const personnelCategoryTreeData = {
      tree: personnelCategoryTree,
      type: 'disableParent',
    };
    return (
      <div className="personnelSearchBar" style={{ width: '100%' }}>
        <Form onSubmit={this.handleSearch} layout="horizontal" {...formItemLayout}>
          <Row>
            <Col md={8} sm={24}>
              <FormItem label="姓名" labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}>
                {getFieldDecorator('name')(<Input placeholder="请输入姓名/拼音缩写/身份证号码" />)}
              </FormItem>
            </Col>
            <Col md={9} sm={24} style={{ top: '8px' }}>
              <Checkbox onClick={() => this.onChangeStart(1)} checked={this.state.PeopleState === 1}>在职人员</Checkbox>
              <Checkbox onClick={() => this.onChangeStart(2)} checked={this.state.PeopleState === 2}>非在职人员</Checkbox>
              <Radio.Group onChange={this.onChangeRadio} defaultValue={this.state.radioNum} >
                <Radio value={1}>追加查询</Radio>
                <Radio value={2}>在结果中查</Radio>
                <Radio value={3}>在全库中查</Radio>
              </Radio.Group>
            </Col>
            <Col md={7} sm={24} style={{ top: '4px' }}>
              <span>
                <Button icon="search" type="primary" htmlType="submit">
                  查找
              </Button>
                <Button style={{ marginLeft: 12 }}>
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
                {getFieldDecorator('state')(
                  <Switch style={{ marginLeft: 7 }} />,
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24}>
              <FormItem label="处级以上" labelCol={{ span: 12 }}
              >
                {getFieldDecorator('sex')(
                  <Switch style={{ marginLeft: 7 }} />,
                )}
              </FormItem>
            </Col>
            <Col md={2} sm={24}>
              <FormItem label="女性" labelCol={{ span: 12 }}
              >
                {getFieldDecorator('sex')(
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
                  value={this.state.checkedList}
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
                      value={this.state.checkedList2}
                      onChange={this.onChange2}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={4} sm={24} offset={1}>
              <FormItem label="人员类别" labelCol={{ span: 7 }}>
                {getFieldDecorator('personnelCategory')(
                  <DictionaryTree width="150px" {...personnelCategoryTreeData} />,
                )}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
              <FormItem label="职级层次" labelCol={{ span: 7 }}
                wrapperCol={{ span: 10 }}>
                {getFieldDecorator('rank')(
                  <DictionaryTree width="150px" {...rankData} />,
                )}
              </FormItem>
            </Col>
            <Col md={4} sm={24}>
              <FormItem label="职务层次" labelCol={{ span: 7 }}
                wrapperCol={{ span: 10 }}>
                {getFieldDecorator('positionLevel')(
                  <DictionaryTree width="150px" {...positionLevelData} />,
                )}
              </FormItem>
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

export default ResgisterAndEntrySearchBar;
