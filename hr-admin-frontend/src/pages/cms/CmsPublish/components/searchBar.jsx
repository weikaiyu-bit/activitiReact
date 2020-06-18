/* eslint-disable react/no-unused-state */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/no-access-state-in-setstate */
import React, { Component } from 'react';
import { Card, Form, Row, Col, Input, Select, Button, Icon, Radio, Checkbox } from 'antd';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const SearchInput = Input.Search;

class CmsPublishSearchBar extends Component {
  state = {
    categoryId: '',
    expandForm: false,
    checkAllStatus: false,
    checkAllProperty: false,
    keywords: '',
  };

  statusOptions = ['草稿', '已投稿', '已接收', '废稿', '已发布'];

  propertyOptions = [
    '有缩略图',
    '无缩略图',
    '已推荐',
    '未推荐',
    '已置顶',
    '未置顶',
    '允许评论',
    '禁止评论',
    '有外部链接',
    '无外部链接',
  ];

  keywords = '';

  statusCheckeds = [];

  propertyCheckeds = [];

  sortBy = '1';

  /** 搜索 */
  onSearch = e => {
    e.persist ? e.persist() : e.preventDefault();
    const {
      onFind,
      filter,
      pagination: { pageSize },
    } = this.props;
    const filters = {
      keywords: this.state.keywords,
      statusCheckeds: null,
      sortBy: null,
      isThumbnail: null,
      isGood: null,
      onTop: null,
      allowComment: null,
      isUrl: null,
    };
    filters.statusCheckeds = this.statusCheckeds;
    filters.sortBy = this.sortBy;
    if (this.propertyCheckeds.indexOf('有缩略图') >= 0) {
      if (this.propertyCheckeds.indexOf('无缩略图') < 0) {
        filters.isThumbnail = true;
      }
    } else if (this.propertyCheckeds.indexOf('无缩略图') >= 0) {
      if (this.propertyCheckeds.indexOf('有缩略图') < 0) {
        filters.isThumbnail = false;
      }
    }
    if (this.propertyCheckeds.indexOf('已推荐') >= 0) {
      if (this.propertyCheckeds.indexOf('未推荐') < 0) {
        filters.isGood = true;
      }
    } else if (this.propertyCheckeds.indexOf('未推荐') >= 0) {
      if (this.propertyCheckeds.indexOf('已推荐') < 0) {
        filters.isGood = false;
      }
    }
    if (this.propertyCheckeds.indexOf('已置顶') >= 0) {
      if (this.propertyCheckeds.indexOf('未置顶') < 0) {
        filters.onTop = true;
      }
    } else if (this.propertyCheckeds.indexOf('未置顶') >= 0) {
      if (this.propertyCheckeds.indexOf('已置顶') < 0) {
        filters.onTop = false;
      }
    }
    if (this.propertyCheckeds.indexOf('允许评论') >= 0) {
      if (this.propertyCheckeds.indexOf('禁止评论') < 0) {
        filters.allowComment = true;
      }
    } else if (this.propertyCheckeds.indexOf('禁止评论') >= 0) {
      if (this.propertyCheckeds.indexOf('允许评论') < 0) {
        filters.allowComment = false;
      }
    }
    if (this.propertyCheckeds.indexOf('有外部链接') >= 0) {
      if (this.propertyCheckeds.indexOf('无外部链接') < 0) {
        filters.isUrl = true;
      }
    } else if (this.propertyCheckeds.indexOf('无外部链接') >= 0) {
      if (this.propertyCheckeds.indexOf('有外部链接') < 0) {
        filters.isUrl = false;
      }
    }
    onFind(1, pageSize, { ...filter, ...filters });
  };

  /** 重置 */
  onReset = e => {
    this.statusCheckeds = [];
    this.propertyCheckeds = [];
    this.sortBy = '1';
    this.setState(
      {
        checkAllStatus: false,
        checkAllProperty: false,
        keywords: '',
      },
      () => {
        this.onSearch(e);
      },
    );
  };

  onChangeKeywords = e => {
    this.setState({
      keywords: e.target.value,
    });
  };

  onChangeStatus = checkedValues => {
    this.statusCheckeds = checkedValues;
    this.setState({
      checkAllStatus: this.statusOptions.length === checkedValues.length,
    });
  };

  onChangeProperty = checkedValues => {
    this.propertyCheckeds = checkedValues;
    this.setState({
      checkAllProperty: this.propertyOptions.length === checkedValues.length,
    });
  };

  onChangeSortBy = e => {
    this.sortBy = e.target.value;
    // 触发渲染
    this.setState({});
    this.onSearch(e);
  };

  onCheckAllStatus = () => {
    const checkAll = !this.state.checkAllStatus;
    this.statusCheckeds = checkAll ? this.statusOptions : [];
    this.setState({
      checkAllStatus: checkAll,
    });
  };

  onCheckAllProperty = () => {
    const checkAll = !this.state.checkAllProperty;
    this.propertyCheckeds = checkAll ? this.propertyOptions : [];
    this.setState({
      checkAllProperty: checkAll,
    });
  };

  /** 展开/收起 */
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  renderSimpleForm() {
    return (
      <Form onSubmit={this.onSearch} layout="inline">
        <Row style={{ marginBottom: 16 }}>
          <Col span={2} style={{ textAlign: 'right' }}>
            <label style={{ verticalAlign: 'middle' }}>关键字：</label>
          </Col>
          <Col span={6}>
            <Input
              placeholder="请输入关键字"
              value={this.state.keywords}
              onChange={this.onChangeKeywords}
            />
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button icon="search" type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
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
    );
  }

  renderAdvancedForm() {
    return (
      <Form onSubmit={this.onSearch} layout="inline">
        <Row style={{ marginBottom: 16 }}>
          <Col span={2} style={{ textAlign: 'right' }}>
            <label style={{ verticalAlign: 'middle' }}>关键字：</label>
          </Col>
          <Col span={6}>
            <Input
              placeholder="请输入关键字"
              value={this.state.keywords}
              onChange={this.onChangeKeywords}
            />
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button icon="search" type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
                查找
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={e => this.onReset(e)}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col span={2} style={{ textAlign: 'right' }}>
            <label style={{ verticalAlign: 'middle' }}>按状态：</label>
          </Col>
          <Col>
            <div>
              <Button size="small" style={{ marginRight: 32 }} onClick={this.onCheckAllStatus}>
                全部
              </Button>
              <CheckboxGroup
                value={this.statusCheckeds}
                options={this.statusOptions}
                onChange={this.onChangeStatus}
              />
            </div>
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col span={2} style={{ textAlign: 'right' }}>
            <label style={{ verticalAlign: 'middle' }}>按属性：</label>
          </Col>
          <Col>
            <div>
              <Button size="small" style={{ marginRight: 32 }} onClick={this.onCheckAllProperty}>
                全部
              </Button>
              <CheckboxGroup
                value={this.propertyCheckeds}
                options={this.propertyOptions}
                onChange={this.onChangeProperty}
              />
            </div>
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col span={2} style={{ textAlign: 'right' }}>
            <label style={{ verticalAlign: 'middle' }}>按排序：</label>
          </Col>
          <Col>
            <Radio.Group
              value={this.sortBy}
              size="small"
              buttonStyle="solid"
              onChange={this.onChangeSortBy}
            >
              <Radio.Button value="1">正常排序</Radio.Button>
              <Radio.Button value="2">
                访问人气
                <Icon type="arrow-up" />
              </Radio.Button>
              <Radio.Button value="3">
                访问人气
                <Icon type="arrow-down" />
              </Radio.Button>
              <Radio.Button value="4">
                发布时间
                <Icon type="arrow-up" />
              </Radio.Button>
              <Radio.Button value="5">
                发布时间
                <Icon type="arrow-down" />
              </Radio.Button>
              <Radio.Button value="6">
                评论数量
                <Icon type="arrow-up" />
              </Radio.Button>
              <Radio.Button value="7">
                评论数量
                <Icon type="arrow-down" />
              </Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    return <div>{this.renderForm()}</div>;
  }
}

export default CmsPublishSearchBar;
