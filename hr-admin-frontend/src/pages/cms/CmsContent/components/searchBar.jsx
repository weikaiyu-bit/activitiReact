/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import {
  Card,
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  Icon,
  Radio,
  Checkbox,
  TreeSelect,
} from 'antd';

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const SearchInput = Input.Search;

class CmsContentSearchBar extends Component {
  state = {
    expandForm: false,
    checkAllStatus: false,
    checkAllProperty: false,
    indeterminateStatus: false,
    indeterminateProperty: false,
    // keywords: "",
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

  categoryId;

  statusCheckeds = [];

  propertyCheckeds = [];

  sortBy = '1';

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
  }

  /** 搜索 */
  onSearch = e => {
    e.preventDefault();
    const filters = {
      keywords: this.keywords,
      statusCheckeds: this.statusCheckeds,
      propertyCheckeds: this.propertyCheckeds,
      sortBy: this.sortBy,
      categoryId: this.categoryId,
    };

    filters.isThumbnail = null;
    if (this.propertyCheckeds.indexOf('有缩略图') >= 0) {
      if (this.propertyCheckeds.indexOf('无缩略图') < 0) {
        filters.isThumbnail = true;
      }
    } else if (this.propertyCheckeds.indexOf('无缩略图') >= 0) {
      if (this.propertyCheckeds.indexOf('有缩略图') < 0) {
        filters.isThumbnail = false;
      }
    }
    filters.isGood = null;
    if (this.propertyCheckeds.indexOf('已推荐') >= 0) {
      if (this.propertyCheckeds.indexOf('未推荐') < 0) {
        filters.isGood = true;
      }
    } else if (this.propertyCheckeds.indexOf('未推荐') >= 0) {
      if (this.propertyCheckeds.indexOf('已推荐') < 0) {
        filters.isGood = false;
      }
    }
    filters.onTop = null;
    if (this.propertyCheckeds.indexOf('已置顶') >= 0) {
      if (this.propertyCheckeds.indexOf('未置顶') < 0) {
        filters.onTop = true;
      }
    } else if (this.propertyCheckeds.indexOf('未置顶') >= 0) {
      if (this.propertyCheckeds.indexOf('已置顶') < 0) {
        filters.onTop = false;
      }
    }
    filters.allowComment = null;
    if (this.propertyCheckeds.indexOf('允许评论') >= 0) {
      if (this.propertyCheckeds.indexOf('禁止评论') < 0) {
        filters.allowComment = true;
      }
    } else if (this.propertyCheckeds.indexOf('禁止评论') >= 0) {
      if (this.propertyCheckeds.indexOf('允许评论') < 0) {
        filters.allowComment = false;
      }
    }
    filters.isUrl = null;
    if (this.propertyCheckeds.indexOf('是外部链接') >= 0) {
      if (this.propertyCheckeds.indexOf('否外部链接') < 0) {
        filters.isUrl = true;
      }
    } else if (this.propertyCheckeds.indexOf('否外部链接') >= 0) {
      if (this.propertyCheckeds.indexOf('是外部链接') < 0) {
        filters.isUrl = false;
      }
    }

    console.log('onSearch.filters', filters);
    this.props.onFind(1, this.props.pagination.pageSize, filters);
  };

  handleSearch = e => {
    e.preventDefault();
    const filters = {
      statusCheckeds: this.statusCheckeds,
    };

    filters.isThumbnail = null;
    if (this.propertyCheckeds.indexOf('有缩略图') >= 0) {
      if (this.propertyCheckeds.indexOf('无缩略图') < 0) {
        filters.isThumbnail = true;
      }
    } else if (this.propertyCheckeds.indexOf('无缩略图') >= 0) {
      if (this.propertyCheckeds.indexOf('有缩略图') < 0) {
        filters.isThumbnail = false;
      }
    }
    filters.isGood = null;
    if (this.propertyCheckeds.indexOf('已推荐') >= 0) {
      if (this.propertyCheckeds.indexOf('未推荐') < 0) {
        filters.isGood = true;
      }
    } else if (this.propertyCheckeds.indexOf('未推荐') >= 0) {
      if (this.propertyCheckeds.indexOf('已推荐') < 0) {
        filters.isGood = false;
      }
    }
    filters.onTop = null;
    if (this.propertyCheckeds.indexOf('已置顶') >= 0) {
      if (this.propertyCheckeds.indexOf('未置顶') < 0) {
        filters.onTop = true;
      }
    } else if (this.propertyCheckeds.indexOf('未置顶') >= 0) {
      if (this.propertyCheckeds.indexOf('已置顶') < 0) {
        filters.onTop = false;
      }
    }
    filters.allowComment = null;
    if (this.propertyCheckeds.indexOf('允许评论') >= 0) {
      if (this.propertyCheckeds.indexOf('禁止评论') < 0) {
        filters.allowComment = true;
      }
    } else if (this.propertyCheckeds.indexOf('禁止评论') >= 0) {
      if (this.propertyCheckeds.indexOf('允许评论') < 0) {
        filters.allowComment = false;
      }
    }
    filters.isUrl = null;
    if (this.propertyCheckeds.indexOf('是外部链接') >= 0) {
      if (this.propertyCheckeds.indexOf('否外部链接') < 0) {
        filters.isUrl = true;
      }
    } else if (this.propertyCheckeds.indexOf('否外部链接') >= 0) {
      if (this.propertyCheckeds.indexOf('是外部链接') < 0) {
        filters.isUrl = false;
      }
    }

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log('fieldsValue', fieldsValue);
      if (err) return;
      this.setState({
        formValues: fieldsValue,
      });
      this.props.onFind(1, this.props.pagination.pageSize, { ...filters, ...fieldsValue });
    });
  };

  /** 重置 */
  onReset = () => {
    this.props.form.resetFields();
    this.statusCheckeds = [];
    this.propertyCheckeds = [];
    this.sortBy = '1';
    this.setState({
      checkAllStatus: false,
      checkAllProperty: false,
    });
    this.props.onFind(1, this.props.pagination.pageSize, null);
  };

  onChangeID = e => {
    console.log('onChangeID.value = ', e);
    this.categoryId = e;
  };

  onChangeKeywords = e => {
    console.log('onChangeKeywords.value = ', e.target.value);
    this.keywords = e.target.value;
  };

  onChangeStatus = checkedValues => {
    this.statusCheckeds = checkedValues;
    console.log('onChangeStatus = ', this.statusCheckeds);
    this.setState({
      indeterminateStatus:
        !!checkedValues.length && this.statusCheckeds.length < this.statusOptions.length,
      checkAllStatus: checkedValues.length === this.statusOptions.length,
    });
  };

  onChangeProperty = checkedValues => {
    // console.log('onChangeProperty.checkedValues = ', checkedValues);
    // this.propertyCheckeds = checkedValues;
    this.propertyCheckeds = checkedValues;
    console.log('onChangeProperty = ', this.propertyCheckeds);
    this.setState({
      indeterminateProperty:
        !!checkedValues.length && this.propertyCheckeds.length < this.propertyOptions.length,
      checkAllProperty: checkedValues.length === this.propertyOptions.length,
    });
  };

  onChangeSortBy = e => {
    console.log('onChangeSortBy = ', e.target.value);
    this.sortBy = e.target.value;
    this.setState({});
    this.onSearch(e);
  };

  onCheckAllStatus = e => {
    const checkAll = !this.state.checkAllStatus;
    this.statusCheckeds = checkAll ? this.statusOptions : [];
    this.setState({
      checkAllStatus: checkAll,
      // checkAllStatus: e.target.checked,
      // indeterminateStatus: false,
    });
    console.log('onCheckAllStatus = ', e.target);
  };

  onCheckAllProperty = e => {
    console.log('onCheckAllProperty = ', e.target);
    const checkAll = !this.state.checkAllProperty;
    this.propertyCheckeds = checkAll ? this.propertyOptions : [];
    this.setState({
      checkAllProperty: checkAll,
    });
  };

  // onCheckAllProperty = e => {
  //   console.log('onCheckAllProperty = ', e.target);
  //   this.propertyCheckeds = e.target.checked ? this.propertyOptions : [];
  //   this.setState({
  //     checkAllProperty: e.target.checked,
  //     indeterminateProperty: false,
  //   })
  // };

  /** 展开/收起 */
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  renderCategory(categoryData) {
    return (
      <Select placeholder="全部" onChange={this.onChangeID}>
        <Select.Option value="">全部</Select.Option>
        {categoryData.map(item => (
          <Select.Option value={item.id} key={item.id}>
            {item.categoryName}
          </Select.Option>
        ))}
      </Select>
    );
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      categoryData,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row style={{ marginBottom: 24 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keywords')(
                <Input style={{ width: '250px' }} placeholder="关键字" />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="网站栏目">
              {getFieldDecorator('categoryId')(
                <Select style={{ width: '250px' }} placeholder="全部" onChange={this.onChangeID}>
                  <Select.Option value="">全部</Select.Option>
                  {categoryData.map(item => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.categoryName}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button
                icon="search"
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8, marginTop: 4 }}
              >
                查找
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
              /
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      categoryData,
      tree,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row style={{ marginBottom: 16 }}>
          <Col md={8} sm={24}>
            <FormItem label="关键字">
              {getFieldDecorator('keywords')(
                <Input
                  style={{ width: '250px' }}
                  placeholder="关键字"
                  onChange={this.onChangeKeywords}
                />,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="网站栏目">
              {getFieldDecorator('categoryId')(
                <Select style={{ width: '250px' }} placeholder="全部" onChange={this.onChangeID}>
                  <Select.Option value="">全部</Select.Option>
                  {categoryData.map(item => (
                    <Select.Option value={item.id} key={item.id}>
                      {item.categoryName}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span>
              <Button
                icon="search"
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 8, marginTop: 4 }}
              >
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
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <FormItem label="按状态:">
              {getFieldDecorator('isStatus')(
                <div>
                  <Button size="small" style={{ marginRight: 32 }} onClick={this.onCheckAllStatus}>
                    全部
                  </Button>
                  <CheckboxGroup
                    options={this.statusOptions}
                    value={this.statusCheckeds}
                    onChange={this.onChangeStatus}
                  />
                </div>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginBottom: 24 }}>
          <Col md={24} sm={24}>
            <FormItem label="按属性:">
              {getFieldDecorator('isProperty')(
                <div>
                  <Button
                    size="small"
                    style={{ marginRight: 32 }}
                    onClick={this.onCheckAllProperty}
                  >
                    全部
                  </Button>
                  <CheckboxGroup
                    options={this.propertyOptions}
                    value={this.propertyCheckeds}
                    onChange={this.onChangeProperty}
                  />
                </div>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row style={{ marginBottom: 16 }}>
          <Col md={24} sm={24}>
            <FormItem label="按排序">
              {getFieldDecorator('sortBy')(
                <div>
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
                </div>,
              )}
            </FormItem>
          </Col>
          <Col></Col>
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

export default CmsContentSearchBar;
