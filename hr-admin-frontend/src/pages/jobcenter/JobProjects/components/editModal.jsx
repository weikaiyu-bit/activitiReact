import React, { Component } from 'react';
import {
  Modal,
  Form,
  Input,
  Radio,
  Typography,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Tabs,
  Select,
  Slider,
  Dropdown,
  Tag,
  Menu,
  message,
  Button,
} from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import InputColor from 'react-input-color';
import UserSelector from '@/pages/jobcenter/components/selectors/userSelector';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { Title } = Typography;
const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;

class JobProjectsEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    tagsValus: '',
    tagsVisible: false,
    tags: '',
    membersData: {
      visible: false,
    },
    executorData: {
      visible: false,
    },
    color: '#FFFFFF',
  };

  componentDidMount() {
    const { tags } = this.props.record;
    this.setState({ tags });
  }

  /** ********************************************************************************************* */

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        const { tags, color } = this.state;
        onOk(record.id, {
          ...values,
          logoColor: color,
          planBeginDate: values.planBeginDate
            ? moment(values.planBeginDate).format('YYYY-MM-DD HH:mm:ss')
            : values.planBeginDate,
          planEndDate: values.planEndDate
            ? moment(values.planEndDate).format('YYYY-MM-DD HH:mm:ss')
            : values.planEndDate,
          beginDate: values.beginDate
            ? moment(values.beginDate).format('YYYY-MM-DD HH:mm:ss')
            : values.beginDate,
          endDate: values.endDate
            ? moment(values.endDate).format('YYYY-MM-DD HH:mm:ss')
            : values.endDate,
          updateTime: values.updateTime
            ? moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss')
            : values.updateTime,
          tags,
        });
      }
    });
    this.cancelHandel();
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

  /** ********************************************************************************************* */
  // 项目详情页面
  JobProject = values => {
    const { projectData, treeData, jobProductsModel } = this.props;
    const { findData } = jobProductsModel;
    const {
      productId,
      tenantId,
      categoryId,
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
    } = values;
    const { tagsVisible, tagsValus, tags, membersData, executorData } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
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
      <div>
        <Title level={2}>项目详情</Title>
        <Form horizontal="true" onSubmit={this.okHandler}>
          <Row>
            <Col span={12}>
              <FormItem label="产品" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('productId', {
                  initialValue: productId || '',
                })(
                  <Select
                    showSearch
                    style={{ width: 248 }}
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
            </Col>
            <Col span={12}>
              <FormItem label="项目名称" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('projectName', {
                  initialValue: projectName || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="项目Logo" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('projectLogo', {
                  initialValue: projectLogo || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Logo颜色" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('logoColor', {
                  initialValue: logoColor || '',
                })(<InputColor initialHexColor={logoColor} />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="项目类别" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('categoryId', {
                  initialValue: parseInt(categoryId) || '',
                })(
                  <Select
                    showSearch
                    style={{ width: 248 }}
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
            </Col>
            <Col span={12}>
              <FormItem label="项目编码" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('projectCode', {
                  initialValue: projectCode || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="任务名称" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('taskName', {
                  initialValue: taskName || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="优先级" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('priority', {
                  initialValue: priority || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem label="责任人" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('executorName', {
                  initialValue: executorName || '',
                })(
                  <Search readOnly enterButton="绑定责任人" onSearch={this.showExecutorSelector} />,
                )}
              </FormItem>
              {getFieldDecorator('executorId', {
                initialValue: executorId || '',
              })(<Input type="hidden" />)}
              {executorData.visible && <UserSelector {...executorData} />}
            </Col>
            <Col span={12}>
              <FormItem label="任务类型" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('taskType', {
                  initialValue: taskType || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
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
          <Row>
            <Col span={12}>
              <FormItem label="任务悬赏" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('reward', {
                  initialValue: reward || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="任务进度" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('progress', {
                  initialValue: parseInt(progress) || 0,
                })(
                  <InputNumber
                    min={0}
                    max={100}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    style={{ width: 240 }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="计划开始时间"
                {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('planBeginDate', {
                  initialValue:
                    planBeginDate === undefined || planBeginDate === null
                      ? planBeginDate || ''
                      : moment(planBeginDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
            <Col span={12} pull={1}>
              <FormItem
                label="计划完成时间"
                {...{ labelCol: { span: 6 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('planEndDate', {
                  initialValue:
                    planEndDate === null || planEndDate === undefined
                      ? planEndDate || ''
                      : moment(planEndDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem label="开始时间" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('beginDate', {
                  initialValue:
                    beginDate === null || beginDate === undefined
                      ? beginDate || ''
                      : moment(beginDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="结束时间" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('endDate', {
                  initialValue:
                    endDate === null || endDate === undefined
                      ? endDate || ''
                      : moment(endDate, 'YYYY-MM-DD HH:mm:ss') || '',
                })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: 240 }} />)}
              </FormItem>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <FormItem
                label="计划工作量"
                {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('planWorkload', {
                  initialValue: planWorkload || '0',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="实际工作量" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('workload', {
                  initialValue: workload || '0',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label="工作量单位"
                {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}
              >
                {getFieldDecorator('workloadUnits', {
                  initialValue: workloadUnits || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="任务时长" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('duration', {
                  initialValue: duration || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="流程ID" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('runId', {
                  initialValue: runId || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="当前节点" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('currentNodeId', {
                  initialValue: currentNodeId || '',
                })(<Input />)}
              </FormItem>
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
          <FormItem label="任务状态" {...formItemLayout}>
            {getFieldDecorator('taskStatus', {
              initialValue: taskStatus || '',
            })(
              <Radio.Group>
                <Radio value="editing">编辑中</Radio>
                <Radio value="planning">计划中</Radio>
                <Radio value="doing">进行中</Radio>
                <Radio value="completed">已完成</Radio>
                <Radio value="delay">已逾期</Radio>
                <Radio value="pause">暂停</Radio>
                <Radio value="undone">已撤销</Radio>
              </Radio.Group>,
            )}
          </FormItem>
          <FormItem label="任务描述" {...formItemLayout}>
            {getFieldDecorator('description', {
              initialValue:
                BraftEditor.createEditorState(description) || BraftEditor.createEditorState(''),
            })(
              <BraftEditor
                style={{ border: '1px solid BraE8E8' }}
                contentStyle={{ height: '300px' }}
                excludeControls={[
                  'undo',
                  'redo',
                  'separator',
                  'font-size',
                  'line-height',
                  'letter-spacing',
                  'separator',
                  'text-color',
                  'bold',
                  'italic',
                  'underline',
                  'strike-through',
                  'separator',
                  'superscript',
                  'subscript',
                  'remove-styles',
                  'emoji',
                  'separator',
                  'text-indent',
                  'text-align',
                  'separator',
                  'headings',
                  'list-ul',
                  'list-ol',
                  'blockquote',
                  'code',
                  'separator',
                  'link',
                  'separator',
                  'hr',
                  'separator',
                  'media',
                  'separator',
                  'clear',
                  'fullscreen',
                ]}
              />,
            )}
          </FormItem>

          <FormItem label="关联表单" {...formItemLayout}>
            {getFieldDecorator('pageUrl', {
              initialValue: pageUrl || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="未完成原因" {...formItemLayout}>
            {getFieldDecorator('reason', {
              initialValue: reason || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="补救措施" {...formItemLayout}>
            {getFieldDecorator('rescue', {
              initialValue: rescue || '',
            })(<Input />)}
          </FormItem>

          <FormItem label="任务类型" {...formItemLayout}>
            {getFieldDecorator('taskType', {
              initialValue: taskType || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="执行人id" {...formItemLayout}>
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
            initialValue: values.id || '',
          })(<Input type="hidden" />)}
        </Form>
      </div>
    );
  };

  onBindMemberOk = (keysStr, memberNames, memberUserNames) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      memberNames,
      memberIds: keysStr,
      memberUserNames,
    });
  };

  onBindExecutorOk = (keysStr, executorName, executorUserName) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      executorId: parseInt(keysStr, 10),
      executorName,
      executorUserName,
    });
  };

  hideExecutorSelector = () => {
    this.setState({
      executorData: {
        visible: false,
      },
    });
  };

  showExecutorSelector = () => {
    const {
      record,
      form: { getFieldValue },
    } = this.props;
    const executorId = getFieldValue('executorId');
    const executorName = getFieldValue('executorName');
    const executorUserName = getFieldValue('executorUserName');
    const selectedRowKeys = [];
    const selectedRows = [];
    if (
      executorId &&
      executorId !== '' &&
      executorName &&
      executorName !== '' &&
      executorUserName &&
      executorUserName !== ''
    ) {
      selectedRowKeys.push(executorId);
      selectedRows.push({ userId: executorId, name: executorName, userName: executorUserName });
    }

    this.setState({
      executorData: {
        title: '请选择负责人',
        visible: true,
        onOk: this.onBindExecutorOk,
        onCancel: this.hideExecutorSelector,
        showOrganization: true,
        showContacts: true,
        showProjectMembers: false,
        checkedType: 'radio',
        selectedRowKeys,
        selectedRows,
        data: record,
      },
    });
  };

  showMemberSelector = () => {
    const {
      record,
      form: { getFieldValue },
    } = this.props;
    const memberIds = getFieldValue('memberIds');
    let memberNames = getFieldValue('memberNames');
    let memberUserNames = getFieldValue('memberUserNames');
    let selectedRowKeys = [];
    const selectedRows = [];
    if (
      memberIds &&
      memberIds !== '' &&
      memberNames &&
      memberNames !== '' &&
      memberUserNames &&
      memberUserNames !== ''
    ) {
      selectedRowKeys = memberIds.split(',').map(Number);
      memberUserNames = memberUserNames.split(',');
      memberNames = memberNames.split(',');
      memberNames.forEach((value, index) => {
        selectedRows.push({
          userId: selectedRowKeys[index],
          name: value,
          userName: memberUserNames[index],
        });
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
    const { title, visible, record, treeData, jobProductsModel } = this.props;
    const { findData } = jobProductsModel;
    const {
      executorUserName,
      tenantId,
      categoryId,
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
      memberUserNames,
      runId,
      currentNodeId,
      createTime,
      creatorUid,
      updateTime,
      updaterUid,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const { tagsVisible, tagsValus, tags, membersData, executorData } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Tag className="site-tag-plus" color="orange" onClick={() => this.addTags('日常任务')}>
            日常任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="1">
          <Tag className="site-tag-plus" color="lime" onClick={() => this.addTags('重要任务')}>
            重要任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="2">
          <Tag className="site-tag-plus" color="cyan" onClick={() => this.addTags('紧急任务')}>
            紧急任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="3">
          <Tag className="site-tag-plus" color="blue" onClick={() => this.addTags('学习发展')}>
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
                initialValue: productId || '',
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
              <InputColor initialHexColor={logoColor} onChange={this.changeColor} />
            </FormItem>
            <FormItem label="责任人" {...formItemLayout}>
              {getFieldDecorator('executorName', {
                initialValue: executorName || '',
              })(<Search readOnly enterButton="绑定责任人" onSearch={this.showExecutorSelector} />)}
            </FormItem>
            {getFieldDecorator('executorId', {
              initialValue: executorId || '',
            })(<Input type="hidden" />)}
            {getFieldDecorator('executorUserName', {
              initialValue: executorUserName || '',
            })(<Input type="hidden" />)}
            {executorData.visible && <UserSelector {...executorData} />}
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
                {getFieldDecorator('memberUserNames', {
                  initialValue: memberUserNames || '',
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
                    initialValue: progress || '0',
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
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(JobProjectsEditModal);
