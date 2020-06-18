import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Modal,
  Table,
  Button,
  Divider,
  Popconfirm,
  Form,
  Input,
  Select,
  Radio,
  Icon,
  Typography,
  Row,
  Col,
  InputNumber,
  Tabs,
  message,
  notification,
  Slider,
  Dropdown,
  Tag,
  Menu,
  DatePicker,
} from 'antd';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import ErrorCode from '../../../../dtsea/common/ErrorCode';
// 引入编辑器组件
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY年MM月DD日';
const { Title } = Typography;
const FormItem = Form.Item;
const { Option } = Select;
const project = new Map();
const { TabPane } = Tabs;

@connect(({ jobTasksModel, loading }) => ({
  jobTasksModel,
  loading: loading.models.fetch,
}))
class JobTasksEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    projectId: 0,
    projectName: '',
    projectLogo: '',
    logoColor: '',
    member: '',
    memberType: '',
    tags: '',
    planBeginDate: null,
    planEndDate: null,
  };
  /* ********************************************************************************************** */

  componentDidMount() {
    console.log(this.props);
    const { tags, planBeginDate, planEndDate } = this.props.record;
    this.setState({ tags, planBeginDate, planEndDate });
    const { projectData, record } = this.props;
    for (let i = 0; projectData != null && i < projectData.length; i += 1) {
      project.set(projectData[i].id, projectData[i]);
    }
    if (project.has(parseInt(record.projectId, 10))) {
      const pj = project.get(parseInt(record.projectId, 10));
      this.setState({
        projectId: pj.id,
        projectName: pj.projectName,
        projectLogo: pj.projectLogo,
        logoColor: pj.logoColor,
      });
    }
    this.findJobRsTaskUser({ taskId: record.id });
  }

  // 搜索任务成员
  findJobRsTaskUser = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/findJobRsTaskUser',
      payload: {
        ...filter,
      },
    });
  };

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields, getFieldsValue },
    } = this.props;
    const {
      projectId,
      projectName,
      projectLogo,
      logoColor,
      executorId,
      executorName,
      planBeginDate,
      planEndDate,
    } = this.state;
    validateFields((err, values) => {
      if (!err) {
        const htmlContent = values.description.toHTML();
        const { tags } = this.state;
        const memberIds = `${values.memberIds.toString()}`;
        onOk(record.id, {
          ...record,
          ...values,
          projectId,
          projectName,
          projectLogo,
          logoColor,
          description: htmlContent,
          memberIds,
          planBeginDate: planBeginDate
            ? moment(planBeginDate).format('YYYY-MM-DD HH:mm:ss')
            : planBeginDate,
          planEndDate: planEndDate
            ? moment(planEndDate).format('YYYY-MM-DD HH:mm:ss')
            : planEndDate,
          beginDate: values.beginDate
            ? moment(values.beginDate).format('YYYY-MM-DD HH:mm:ss')
            : values.beginDate,
          endDate: values.endDate
            ? moment(values.endDate).format('YYYY-MM-DD HH:mm:ss')
            : values.endDate,
          tags: tags !== undefined ? tags : '',
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  // 上传
  uploadFn = param => {
    const serverURL = '/api/v1/minio/oss/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = response => {
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log('response', response);
      let str = response.target.response;
      // 截取地址
      str = str.match(/"fileId":"(\S*)","fileName":"/);
      const fileUrl = `/api/v1/minio/oss/file/${str[1]}`;
      console.log('fileUrl', fileUrl);
      param.success({
        url: fileUrl,
        meta: {
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
        },
      });
    };

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };

    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败，请重试。',
      });
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

  selectOnChange = id => {
    const pj = project.get(id);
    this.setState({
      projectId: pj.id,
      projectName: pj.projectName,
      projectLogo: pj.projectLogo,
      logoColor: pj.logoColor,
    });
  };

  selectChange = id => {
    const pj = project.get(id);
    this.setState({
      projectId: pj.id,
      projectName: pj.projectName,
      projectLogo: pj.projectLogo,
      logoColor: pj.logoColor,
    });
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
      visible: false,
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
      case '需求':
        return '#a2c2e8';
      case 'BUG':
        return '#a2c2e8';
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
  // 任务详情页面
  JobTask = values => {
    const { projectData } = this.props;
    const {
      id,
      tenantId,
      appId,
      pid,
      projectId,
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
    const { getFieldDecorator } = this.props.form;
    const { tagsVisible, tagsValus, tags } = this.state;
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
        <Menu.Item key="3" onClick={() => this.addTags('需求')}>
          <Tag className="site-tag-plus" color="#a2c2e8">
            需求
          </Tag>
        </Menu.Item>
        <Menu.Item key="3" onClick={() => this.addTags('BUG')}>
          <Tag className="site-tag-plus" color="#a2c2e8">
            BUG
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
        <Title level={2}>任务详情</Title>
        <Form horizontal="true" onSubmit={this.okHandler}>
          <Row>
            <Col span={12}>
              <FormItem label="应用id" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('appId', {
                  initialValue: appId || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="项目" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('projectName', {
                  initialValue: projectName || '',
                })(
                  <Select
                    showSearch
                    style={{ width: 240 }}
                    optionFilterProp="children"
                    dropdownMatchSelectWidth={false}
                    optionLabelProp="label"
                    onChange={this.selectChange}
                  >
                    {projectData !== undefined ? (
                      projectData.map(item => (
                        <Option value={item.id} key={item.id} label={item.projectName}>
                          {item.projectName}
                        </Option>
                      ))
                    ) : (
                      <Option value=""></Option>
                    )}
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="任务名称" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('taskName', {
                  initialValue: taskName || '',
                  rules: [
                    {
                      required: true,
                      message: '任务名称不能为空',
                    },
                  ],
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
              <FormItem label="任务悬赏" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('reward', {
                  initialValue: reward || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="任务进度" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('progress', {
                  initialValue: progress || '0',
                })(<Slider min={0} max={100} tipFormatter={value => `${value}%`} />)}
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
                style={{ border: '1px solid #E8E8E8' }}
                contentStyle={{ height: 'auto', maxHeight: '600px', minHeight: '300px' }}
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

  // 任务成员列表
  columns = [
    {
      title: '成员ID',
      dataIndex: 'memberId',
    },
    {
      title: '成员名称',
      dataIndex: 'memberName',
    },
    {
      title: '标签',
      dataIndex: 'tags',
    },
    {
      title: '成员类型',
      dataIndex: 'memberType',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="您确认删除任务信息吗？"
            onConfirm={() => this.deleteJobRsUser(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 任务成员操作
  openNotification = () => {
    notification.open({
      message: '请选择成员和成员权限',
      description: '任务成员和成员权限不能为空',
      style: {
        width: 600,
        marginLeft: 335 - 600,
      },
    });
  };

  memberChange = e => {
    this.setState({ member: e });
  };

  memberTypeChange = e => {
    this.setState({ memberType: e });
  };

  addMember = () => {
    const { record, jobMembers } = this.props;
    const { member, memberType } = this.state;
    if (member === '' || memberType === '') {
      this.openNotification();
    } else {
      const vlu = { ...record };
      const members = jobMembers[member];
      const { dispatch } = this.props;
      dispatch({
        type: 'jobTasksModel/addJobRsTaskUser',
        payload: {
          memberId: members.uid,
          taskId: vlu.id,
          memberName: members.name,
          memberType,
        },
        callback: response => {
          switch (response.code) {
            case ErrorCode.SUCCESS:
              message.success('新建任务成员成功！');
              console.log(vlu.id);
              this.findJobRsTaskUser({ taskId: vlu.id });
              break;
            case ErrorCode.FAILURE:
              message.error(response.msg);
              break;
            default:
              this.callbackDefault(response);
              break;
          }
        },
      });
    }
  };

  deleteJobRsUser = ids => {
    const { record } = this.props;
    const vlu = { record };
    const { dispatch } = this.props;
    dispatch({
      type: 'jobTasksModel/removeJobRsTaskUser',
      payload: {
        ids,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除任务成员成功！');
            this.findJobRsTaskUser({ taskId: vlu.id });
            break;
          case ErrorCode.FAILURE:
            message.error('删除任务成员失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  // 任务成员界面
  jobMembers = () => {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const {
      loading,
      jobTasksModel: { JobRsTaskUser },
      jobMembers,
    } = this.props;
    return (
      <>
        <Row>
          <Col span={8}>
            <h3>任务成员</h3>
            <Select
              showSearch
              style={{ width: 300 }}
              optionFilterProp="children"
              dropdownMatchSelectWidth={false}
              optionLabelProp="label"
              onChange={this.memberChange}
            >
              {jobMembers != null && jobMembers !== undefined ? (
                jobMembers.map((item, index) => (
                  <Option value={item.id} key={index} label={item.name}>
                    {item.name}
                  </Option>
                ))
              ) : (
                <Option value=""></Option>
              )}
            </Select>
          </Col>
          <Col span={8}>
            <h3>任务成员权限</h3>
            <Select
              showSearch
              style={{ width: 300 }}
              optionFilterProp="children"
              dropdownMatchSelectWidth={false}
              onChange={this.memberTypeChange}
            >
              <Option value="管理员" key={1}>
                管理员
              </Option>
              <Option value="任务所有人" key={2}>
                任务所有人
              </Option>
              <Option value="任务执行人" key={3}>
                任务执行人
              </Option>
              <Option value="任务参与者" key={4}>
                任务参与者
              </Option>
              <Option value="旁观者" key={5}>
                旁观者
              </Option>
            </Select>
          </Col>

          <Col span={8}>
            <Button type="primary" onClick={this.addMember}>
              添加
            </Button>
          </Col>
        </Row>
        <Table
          rowKey="id"
          loading={loading}
          columns={this.columns}
          dataSource={JobRsTaskUser}
          pagination={false}
        />
      </>
    );
  };

  renderWfengine = record => {
    const {
      id,
      tenantId,
      appId,
      pid,
      projectId,
      projectName,
      projectLogo,
      logoColor,
      taskName,
      description,
      priority,
      reward,
      tags,
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
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    return (
      <>
        <Title level={2}>任务详情</Title>
        <Form horizontal="true" onSubmit={this.okHandler}>
          <Row>
            <Col span={12}>
              <FormItem label="流程ID" {...{ labelCol: { span: 10 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('runId', {
                  initialValue: appId || '',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="当前节点" {...{ labelCol: { span: 4 }, wrapperCol: { span: 12 } }}>
                {getFieldDecorator('currentNodeId', {
                  initialValue: appId || '',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </>
    );
  };

  handleActionTheSame = (rule, value, callback) => {
    console.log('时间', value);
    const fx = value.length;
    if (fx === 0) {
      callback('开始或结束时间不能为空');
    } else {
      callback();
    }
  };

  changeData = datas => {
    if (datas.length < 2) return false;
    this.setState({
      planBeginDate: datas[0].format('YYYY-MM-DD HH:mm:ss'),
      planEndDate: datas[1].format('YYYY-MM-DD HH:mm:ss'),
    });
  };

  render() {
    const { title, visible, record, jobMembers } = this.props;
    const {
      id,
      tenantId,
      appId,
      pid,
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
    const { tagsVisible, tagsValus, tags, planBeginDate, planEndDate } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const Date = planBeginDate + planEndDate;
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={() => this.addTags('需求')}>
          <Tag className="site-tag-plus" color="#a2c2e8">
            需求
          </Tag>
        </Menu.Item>
        <Menu.Item key="1" onClick={() => this.addTags('BUG')}>
          <Tag className="site-tag-plus" color="#a2c2e8">
            BUG
          </Tag>
        </Menu.Item>
        <Menu.Item key="2" onClick={() => this.addTags('日常任务')}>
          <Tag className="site-tag-plus" color="orange">
            日常任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="3" onClick={() => this.addTags('重要任务')}>
          <Tag className="site-tag-plus" color="lime">
            重要任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="4" onClick={() => this.addTags('紧急任务')}>
          <Tag className="site-tag-plus" color="cyan">
            紧急任务
          </Tag>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="5">
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
            <FormItem label="任务名称" {...formItemLayout}>
              {getFieldDecorator('taskName', {
                initialValue: taskName || '',
                validateTrigger: ['onChange', 'onSubmit'],
                rules: [
                  {
                    required: true,
                    message: '任务名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="时间" {...formItemLayout}>
              <RangePicker
                defaultValue={
                  Date.length > 0
                    ? [
                        moment(planBeginDate || new Date(), dateFormat),
                        moment(planEndDate || new Date(), dateFormat),
                      ]
                    : null
                }
                format={dateFormat}
                style={{ width: 391 }}
                onChange={this.changeData}
              />
            </FormItem>
            <FormItem label="任务成员" {...formItemLayout}>
              {getFieldDecorator('memberIds', {
                initialValue: memberIds ? memberIds.split(',') : [],
                // rules: [{
                //   required: true, message: '任务成员不能为空',
                // }],
              })(
                <Select
                  mode="multiple"
                  placeholder="请选择任务成员"
                  showSearch
                  style={{ width: 390 }}
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="label"
                >
                  {jobMembers != null && jobMembers !== undefined ? (
                    jobMembers.map((item, index) => (
                      <Option value={item.id} key={index} label={item.name}>
                        {item.name}
                      </Option>
                    ))
                  ) : (
                    <Option value=""></Option>
                  )}
                </Select>,
              )}
            </FormItem>
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
            <FormItem label="责任人" {...formItemLayout}>
              {getFieldDecorator('executorName', {
                initialValue: executorName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="任务描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue:
                  BraftEditor.createEditorState(description) || BraftEditor.createEditorState(''),
              })(
                <BraftEditor
                  media={{ uploadFn: this.uploadFn }}
                  style={{ border: '1px solid #E8E8E8' }}
                  contentStyle={{ height: 'auto', maxHeight: '600px', minHeight: '300px' }}
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
                    'separator',
                    'clear',
                    'fullscreen',
                  ]}
                />,
              )}
            </FormItem>
          </Form>
          {/* <Tabs defaultActiveKey="1" > */}
          {/* <TabPane tab="任务详情" key="1"> */}
          {/* {this.JobTask(record)} */}
          {/* </TabPane> */}
          {/* <TabPane tab="任务成员" key="2"> */}
          {/* {this.jobMembers()} */}
          {/* </TabPane> */}
          {/* <TabPane tab="工作流程" key="3"> */}
          {/* {this.renderWfengine(record)} */}
          {/* </TabPane> */}
          {/* </Tabs> */}
        </Modal>
      </>
    );
  }
}

export default Form.create()(JobTasksEditModal);
