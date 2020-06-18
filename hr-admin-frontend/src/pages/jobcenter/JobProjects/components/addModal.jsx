import React, { Component } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Slider,
  InputNumber,
  Row,
  Col,
  Dropdown,
  Tag,
  Menu,
  message,
} from 'antd';
import InputColor from 'react-input-color';
import { DownOutlined } from '@ant-design/icons';
import UserSelector from '@/pages/jobcenter/components/selectors/userSelector';

const FormItem = Form.Item;
const { Search } = Input;
const { Option } = Select;
class JobProjectsAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      tagsValus: '',
      tagsVisible: false,
      tags: '',
      membersData: {
        visible: false,
      },
      executorData: {
        visible: false,
      },
      color: '',
    };
  }

  okHandler = () => {
    const { onOk, record } = this.props;
    const { tags } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { color } = this.state;
        onOk(record.id, {
          ...values,
          logoColor: color,
          taskStatus: 'planning',
          tags,
        });
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  // 移除标签
  removeTags = index => {
    const { tags } = this.state;
    const words = tags.split(',');
    words.splice(index, 1);
    const word = `${words.toString()}`;
    this.setState({ tags: word });
  };

  // 增加标签
  addTags = value => {
    const { tags } = this.state;
    const words = tags.split(',');
    const flag = words.findIndex(item => item === value);
    if (flag > -1) {
      message.warning('已有相同标签');
      return false;
    }
    this.setState({
      tags: tags === null || tags === undefined || tags.length === 0 ? value : `${tags},${value}`,
    });
  };

  setTagsInput = () => {
    const { tagsVisible } = this.state;
    this.setState({ tagsVisible: !tagsVisible });
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  handleInputChange = e => {
    this.setState({ tagsValus: e.target.value });
  };

  // 增加自定义标签
  customizeTags = e => {
    this.setState({ tagsValus: '' });
    const { value } = e.target;
    const { tags } = this.state;
    const words = tags.split(',');
    const flag = words.findIndex(item => item === value);
    if (flag > -1) {
      message.warning('已有相同标签');
      return false;
    }
    this.setState({
      tags: tags === null || tags === undefined || tags.length === 0 ? value : `${tags},${value}`,
    });
  };

  renderTagsColor = item => {
    switch (item) {
      case '日常任务':
        return 'orange';
      case '重要任务':
        return 'lime';
      case '学习发展':
        return 'blue';
      default:
        return '#b53fa1';
    }
  };

  renderTags = tags => {
    if (!tags) return false;
    const words = tags.split(',');
    const loop = words =>
      words.map((item, index) => (
        <Tag
          key={item}
          color={this.renderTagsColor(item)}
          closable
          onClose={() => this.removeTags(index)}
        >
          {item}
        </Tag>
      ));
    return <span>{loop(words)}</span>;
  };

  showMemberSelector = () => {
    const {
      record,
      form: { getFieldValue },
    } = this.props;
    const memberIds = getFieldValue('memberIds');
    let memberNames = getFieldValue('memberNames');
    let selectedRowKeys = [];
    const selectedRows = [];
    if (memberIds && memberIds !== '' && memberNames && memberNames !== '') {
      selectedRowKeys = memberIds.split(',').map(Number);
      memberNames = memberNames.split(',');
      memberNames.forEach((value, index) => {
        selectedRows.push({ userId: selectedRowKeys[index], userName: value });
      });
    }

    this.setState({
      membersData: {
        title: '选择项目成员',
        visible: true,
        onOk: this.onBindMemberOk,
        onCancel: this.hideMemberSelector,
        showOrganization: true,
        showContacts: true,
        showProjectMembers: false,
        selectedRowKeys,
        selectedRows,
        data: record,
      },
    });
  };

  hideMemberSelector = () => {
    this.setState({
      membersData: {
        visible: false,
      },
    });
  };
  changeColor = e => {
    this.setState({ color: e.hex });
  };
  render() {
    const { title, visible, record, treeData, jobProductsModel, categoryId } = this.props;
    const { findData } = jobProductsModel;
    const {
      id,
      tenantId,
      productId,
      projectCode,
      projectName,
      projectLogo,
      logoColor,
      taskName,
      description,
      priority,
      reward,
      pageUrl,
      taskStatus,
      progress,
      reason,
      rescue,
      planBeginDate,
      planEndDate,
      beginDate,
      endDate,
      planWorkload,
      workload,
      workloadUnits,
      duration,
      taskType,
      longitude,
      latitude,
      executorId,
      executorName,
      memberIds,
      memberNames,
      memberType,
      runId,
      currentNodeId,
      createTime,
      creatorUid,
      updateTime,
      updaterUid,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const { tagsVisible, tagsValus, tags, membersData } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={() => this.addTags('日常任务')}>
          <Tag className="site-tag-plus" color="orange">
            日常任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="1" onClick={() => this.addTags('重要任务')}>
          <Tag className="site-tag-plus" color="lime">
            重要任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => this.addTags('紧急任务')}>
          <Tag className="site-tag-plus" color="cyan">
            紧急任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="3" onClick={() => this.addTags('学习发展')}>
          <Tag className="site-tag-plus" color="blue">
            学习发展
          </Tag>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
          {tagsVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={tagsValus}
              onChange={this.handleInputChange}
              onBlur={this.setTagsInput}
              onPressEnter={this.customizeTags}
            />
          ) : (
            <Tag className="site-tag-plus" color="#b53fa1" onClick={this.setTagsInput}>
              自定义
            </Tag>
          )}
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <Modal
          title={title}
          width={720}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="产品" {...formItemLayout}>
              {getFieldDecorator('productId', {
                initialValue: parseInt(productId) || '',
                rules: [
                  {
                    required: true,
                    message: '关联产品不能为空',
                  },
                ],
              })(
                <Select
                  showSearch
                  style={{ width: 390 }}
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="label"
                >
                  {findData !== undefined ? (
                    findData.map(item => (
                      <Option value={item.id} key={item.id} label={item.applicationName}>
                        {item.applicationName}
                      </Option>
                    ))
                  ) : (
                    <Option value=""></Option>
                  )}
                </Select>,
              )}
            </FormItem>
            <FormItem label="项目类别" {...formItemLayout}>
              {getFieldDecorator('categoryId', {
                initialValue: parseInt(categoryId) || '',
                rules: [
                  {
                    required: true,
                    message: '项目类别不能为空',
                  },
                ],
              })(
                <Select
                  showSearch
                  style={{ width: 390 }}
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="label"
                >
                  {treeData !== undefined ? (
                    treeData.map(item => (
                      <Option value={item.id} key={item.id} label={item.categoryName}>
                        {item.categoryName}
                      </Option>
                    ))
                  ) : (
                    <Option value=""></Option>
                  )}
                </Select>,
              )}
            </FormItem>
            <FormItem label="项目名称" {...formItemLayout}>
              {getFieldDecorator('projectName', {
                initialValue: projectName || '',
                rules: [
                  {
                    required: true,
                    message: '项目名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="项目logo" {...formItemLayout}>
              {getFieldDecorator('projectLogo', {
                initialValue: projectLogo || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="Logo底色" {...formItemLayout}>
              <InputColor initialHexColor="#FFFFFF" onChange={this.changeColor} />
            </FormItem>
            <Row>
              <Col span={24}>
                <FormItem label="任务成员" {...formItemLayout}>
                  {getFieldDecorator('memberNames', {
                    initialValue: memberNames || '',
                  })(<Search readOnly enterButton="绑定成员" onSearch={this.showMemberSelector} />)}
                </FormItem>
                {getFieldDecorator('memberIds', {
                  initialValue: memberIds || '',
                })(<Input type="hidden" />)}
                {membersData.visible && <UserSelector {...membersData} />}
              </Col>
            </Row>
            <FormItem label="标签" {...formItemLayout}>
              {this.renderTags(tags)}
              <Dropdown
                overlay={menu}
                trigger={['click']}
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.visible}
              >
                <Tag className="site-tag-plus" color="#00CCFF">
                  添加标签
                  <DownOutlined />
                </Tag>
              </Dropdown>
            </FormItem>
            <Row>
              <Col span={16}>
                <FormItem label="任务进度" {...{ labelCol: { span: 9 }, wrapperCol: { span: 15 } }}>
                  {getFieldDecorator('progress', {
                    initialValue: parseInt(progress) || 0,
                  })(
                    <Slider
                      min={0}
                      max={100}
                      tipFormatter={value => `${value}%`}
                      marks={{ 0: '0%', 100: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4} push={0}>
                <FormItem {...{ labelCol: { span: 1 }, wrapperCol: { span: 10 } }}>
                  {getFieldDecorator('progress', {
                    initialValue: parseInt(progress) || 0,
                  })(
                    <InputNumber
                      min={0}
                      max={100}
                      style={{ marginLeft: 20 }}
                      formatter={value => `${value}%`}
                      parser={value => value.replace('%', '')}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem label="责任人id" {...formItemLayout}>
              {getFieldDecorator('executorId', {
                initialValue: executorId || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="责任人" {...formItemLayout}>
              {getFieldDecorator('executorName', {
                initialValue: executorName || '',
              })(<Input />)}
            </FormItem>
            {getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(JobProjectsAddModal);
