import React, { Component } from 'react';
import { Avatar, Button, Col, Input, Select, Row, Tag, Icon, DatePicker, Form, Breadcrumb, Menu, Dropdown, Spin, Modal } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { connect } from 'dva';
import UserSelector from './selectors/userSelector';
import TaskAttModalData from './taskAttributeView';
import DeleteTaskModal from './deleteTaskModal';
import PauseModal from './pauseModal';

const { RangePicker } = DatePicker;
const { confirm } = Modal;
const dateFormat = 'YYYY年MM月DD日';
const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@connect(({ myJobsModel, jobTasksModel, loading }) => ({
  myJobsModel,
  jobTasksModel,
  loading,
}))
export default class TaskBaseInfoView extends Component {
  state = {
    hoverMenu: false,
    onFocusTaskName: false,
    onFocusTaskTime: false,
    onFocusDescription: false,
    onFocusMembers: false,
    onSelectedId: -1,
    tagsVisible: false,
    tagsValus: '',
    taskAttModalData: {},
    deleteData: {},
    transferData: {
      visible: false,
    },
    pauseData: {
      visible: false,
    },
  };

  inputContext = '';

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;
    const { onSelectedId } = this.state;
    if (data.id !== onSelectedId) {
      this.setState({
        hoverMenu: false,
        onFocusTaskName: false,
        onFocusTaskTime: false,
        onFocusDescription: false,
        onFocusMembers: false,
        onSelectedId: data.id,
      });
    }
  }

  handleExecutorOk = (executorId, executorName) => {
    const { onUpdateTask, data } = this.props;
    onUpdateTask(data.id, { ...data, executorId, executorName });
  };

  renderMaster = data => {
    const name = data.executorName.substr(0, 1);
    return (
      <>
        <Avatar shape="square" style={{ marginBottom: 6 }}>
          {name}
        </Avatar>
      </>
    );
  };

  renderTagsColor = (item) => {
    switch (item) {
      case '紧急任务':
        return '#f50';
      case '重要任务':
        return '#108ee9';
      case '日常任务':
        return '#2db7f5';
      case '学习发展':
        return '#87d068';
      case 'BUG':
        return 'red';
      case '需求变更':
        return 'orange';
      case '新需求':
        return 'green';
      default:
        return 'default';
    }
  };

  renderTags = text => {
    const { tags } = text;
    if (!tags) return false;
    const words = tags.split(',');
    const loop = words => words.map((item, index) => <Tag key={item} color={this.renderTagsColor(item)} closable onClose={() => this.removeTags(text, index)}>{item}</Tag>);
    return (
      <span>
        {loop(words)}
    </span>
    );
  };

  // 传入希望变成的状态
  showConfirm = taskStatus => {
    const { onUpdateTask, data } = this.props;
    let title = '';
    switch (taskStatus) {
      case 'planning':
        title = '请确认是否重新计划任务';
        break;
      case 'doing':
        title = data.taskStatus === 'completed' ? '请确认是否重新打开任务' : '请确认是否开始任务?';
        break;
      case 'completed':
        title = '请确认是否完成任务?';
        break;
      default:
        break;
    }
    confirm({
      title,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if (taskStatus === 'completed') {
          onUpdateTask(data.id, { ...data, taskStatus, progress: 100 });
        } else {
          onUpdateTask(data.id, { ...data, taskStatus });
        }
      },
    });
  };

  renderButtons = taskStatus => {
    const { transferData, pauseData } = this.state;
    switch (taskStatus) {
      case 'planning':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('doing')}>开始</Button>
            <Button onClick={this.showTransferModal}>指派</Button>
            {transferData.visible && <UserSelector {...transferData}/>}
          </div>
        );
      case 'doing':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={this.showTransferModal}>指派</Button>
            {transferData.visible && <UserSelector {...transferData}/>}
            <Button style={{ marginRight: 12 }} onClick={this.showPauseModal}>延后</Button>
            {pauseData.visible && <PauseModal {...pauseData}/>}
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('completed')}>完成</Button>
            <Button>提醒</Button>
          </div>
        );
      case 'completed':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => this.showConfirm('doing')}>重新打开</Button>
          </div>
        );
      case 'pause':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={this.showTransferModal}>指派</Button>
            {transferData.visible && <UserSelector {...transferData}/>}
            <Button style={{ marginRight: 12 }} onClick={this.showPauseModal}>继续</Button>
            {pauseData.visible && <PauseModal {...pauseData}/>}
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('completed')}>完成</Button>
            <Button>提醒</Button>
          </div>
        );
      case 'undone':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => this.showConfirm('planning')}>重新计划</Button>
          </div>
        );
      case 'delay':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => this.showConfirm('planning')}>重新计划</Button>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={this.showTransferModal}>指派</Button>
            {transferData.visible && <UserSelector {...transferData}/>}
            <Button style={{ marginRight: 12 }} onClick={this.showPauseModal}>延后</Button>
            {pauseData.visible && <PauseModal {...pauseData}/>}
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('completed')}>完成</Button>
            <Button>提醒</Button>
          </div>
        )
    }
  };

  onMouseLeave = () => {
    this.setState({ hoverMenu: false });
  };

  onMouseEnter = () => {
    this.setState({ hoverMenu: true });
  };

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
      })
    };
    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };
    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败，请重试。',
      })
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

  cancelDescriptionEdit = () => {
    this.setState({ onFocusDescription: false });
    this.inputContext = '';
  };

  showTaskAttModal = () => {
    const { data, onUpdateTask } = this.props;
    this.setState({
      taskAttModalData: {
        title: '编辑任务属性',
        visible: true,
        onCancel: this.hideTaskAttModal,
        data,
        onUpdateTask,
      },
    });
  };

  showDeleteModal = () => {
    const { data: { id }, onRemoveTask } = this.props;
    this.setState({
      deleteData: {
        visible: true,
        onCancel: this.hideDeleteModal,
        onRemoveTask,
        id,
      },
    });
  };

  hideDeleteModal = () => {
    this.setState({
      deleteData: {
        visible: false,
      },
    })
  };

  hideTaskAttModal = () => {
    this.setState({
      taskAttModalData: {
        visible: false,
      },
    });
  };

  renderTaskPropertiesMenu = () => {
    const parentStyle = { color: '#595959', display: 'inline-block', height: 39, width: 39, textAlign: 'center', lineHeight: '38px', borderRadius: '50%' };
    let style = { ...parentStyle };
    const { hoverMenu } = this.state;
    if (hoverMenu) {
      style = { ...parentStyle, background: '#f0f0f0' };
    }
    const menu = (
      <Menu
        style={{ textAlign: 'center' }}
      >
        <Menu.Item key="0">
          <a onClick={this.showTaskAttModal}>任务属性</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a>关联项目</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a onClick={this.showDeleteModal}>删除任务</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Col span={1} style={{ float: 'right', fontSize: 20 }}>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <a title="任务属性" style={style} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
            <Icon type="menu"/>
          </a>
        </Dropdown>
      </Col>
    );
  };

  renderTaskTime = (beginDate, endDate) => {
    const { onFocusTaskTime } = this.state;
    const componentName = 'taskTime';
    if (onFocusTaskTime) {
      this.inputContext = beginDate + endDate;
      return (
        <>
          <span>时间：</span>
          <RangePicker
            defaultValue={
              this.inputContext.length > 0
                ?
                [moment(beginDate || new Date(), dateFormat),
                  moment(endDate || new Date(), dateFormat)]
                :
                null
            }
            format={dateFormat}
            style={{ width: 260 }}
            onChange={dates => this.onInputBlur(componentName, dates)}
            autoFocus
          />
        </>
      )
    }
    return (
      <>
        <span onClick={() => this.onClickSpan(componentName)}>时间：</span>
        <span onClick={() => this.onClickSpan(componentName)}>{beginDate ? `${moment(beginDate).format(dateFormat)} ~ ${moment(endDate).format(dateFormat)}` : ''}</span>
      </>
    );
  };

  renderContext = (value, componentName) => {
    const {
      onFocusTaskName,
      onFocusDescription,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    switch (componentName) {
      case 'taskName':
        if (onFocusTaskName) {
          this.inputContext = value;
          return (
            <FormItem style={{ margin: 0, marginTop: 3, marginLeft: 3 }}>
              {getFieldDecorator('taskName', {
                initialValue: value || '',
                rules: [
                  {
                    required: true,
                    message: '任务名不能为空！',
                  },
                  {
                    validator: (rule, text, callback) => {
                      if (text.length < 40) {
                        callback();
                      } else {
                        callback('长度不能超过40个字符！');
                      }
                    },
                  },
                ],
              })(<Input
                style={{ fontSize: 24 }}
                placeholder="请输入任务名"
                autoFocus
                onBlur={() => this.onInputBlur(componentName)}
                onPressEnter={() => this.onInputBlur(componentName)}
              />)
              }
            </FormItem>
          )
        }
        return (
          <span
            style={{ fontSize: 24, marginLeft: 10 }}
            onClick={() => this.onClickSpan(componentName)}
          >
          {value}
        </span>
        );
      case 'description':
        if (onFocusDescription) {
          this.inputContext = value;
          return (
            <div>
              <span>任务描述：</span>
              <FormItem>
                {getFieldDecorator('description', {
                  validateTrigger: 'onBlur',
                  rules: [{
                    type: 'object',
                    validator: (_, context, callback) => {
                      if (context.isEmpty()) {
                        callback('请输入任务描述')
                      } else {
                        callback()
                      }
                    },
                  }],
                  initialValue: value ? BraftEditor.createEditorState(value) : BraftEditor.createEditorState(''),
                })(
                  <BraftEditor
                    style={{ border: '1px solid #E8E8E8' }}
                    media={{ uploadFn: this.uploadFn }}
                  />)}
              </FormItem>
              <div style={{ width: 158, margin: '0 auto' }}>
                <Button type="primary" onClick={() => this.onInputBlur(componentName)}>保存</Button>
                <Button style={{ marginLeft: '30px' }} onClick={this.cancelDescriptionEdit}>取消</Button>
              </div>
            </div>
          )
        }
        return (
          <>
          <span onClick={() => this.onClickSpan(componentName)}>
            任务描述：
            <a title="点击编辑任务描述">编辑</a>
          </span>
            <div dangerouslySetInnerHTML={{ __html: value }}>
            </div>
          </>
        );
      default:
        this.inputContext = '';
        break;
    }
    return false;
  };

  onClickSpan = componentName => {
    switch (componentName) {
      case 'taskName':
        this.setState({
          onFocusTaskName: true,
        });
        break;
      case 'taskTime':
        this.setState({
          onFocusTaskTime: true,
        });
        break;
      case 'description':
        this.setState({ onFocusDescription: true });
        break;
      case 'members':
        this.setState({ onFocusMembers: true });
        break;
      default:
        break;
    }
  };

  onInputBlur = (componentName, dates) => {
    const { data } = this.props;
    const { id } = data;
    const { form: { validateFields }, onUpdateTask } = this.props;
    const { inputContext } = this;
    switch (componentName) {
      case 'taskName':
        validateFields((errors, { taskName }) => {
          if (errors) return;
          this.setState({
            onFocusTaskName: false,
          });
          this.inputContext = '';
          if (inputContext === taskName) return;
          onUpdateTask(id, { ...data, taskName });
        });
        break;
      case 'taskTime':
        this.inputContext = '';
        this.setState({
          onFocusTaskTime: false,
        });
      {
        const planBeginDate = moment(dates[0]).format('YYYY-MM-DD HH:mm:ss');
        const planEndDate = moment(dates[1]).format('YYYY-MM-DD HH:mm:ss');
        if (planBeginDate + planEndDate === inputContext) return;
        onUpdateTask(id, { ...data, planBeginDate, planEndDate });
      }
        break;
      case 'description':
        this.inputContext = '';
        validateFields((errors, { description }) => {
          if (errors) return;
          this.setState({ onFocusDescription: false });
          const descriptionHTML = description.toHTML();
          if (descriptionHTML === inputContext) return;
          onUpdateTask(id, { ...data, description: descriptionHTML });
        });
        break;
      case 'members':
        this.inputContext = '';
        validateFields((error, { members }) => {
          if (error) return;
          this.setState({ onFocusMembers: false });
          let memberIds = [];
          let memberNames = [];
          members.forEach(item => {
            memberIds.push(item.key);
            memberNames.push(item.label);
          });
          memberIds = memberIds.join('，');
          memberNames = memberNames.join('，');
          if (memberIds === inputContext) return;
          onUpdateTask(id, { ...data, memberIds, memberNames });
        });
        break;
      default:
        break;
    }
  };

// 移除标签
  removeTags= (record, index) => {
    const { onUpdateTask, data } = this.props;
    const { tags } = record;
    const words = tags.split(',');
    words.splice(index, 1);
    const word = `${words.toString()}`;
    console.log(word);
    onUpdateTask(data.id, {
      ...data,
      tags: word,
    })
  };

// 增加标签
  addTags=value => {
    const { onUpdateTask, data } = this.props;
    onUpdateTask(data.id, {
      ...data,
      tags: (data.tags === null || data.tags === undefined || data.tags.length === 0) ? (
        value
      ) : (
        `${data.tags},${value}`
      ),
    })
  };

  setTagsInput=() => {
    const { tagsVisible } = this.state;
    this.setState({ tagsVisible: !tagsVisible })
  };

  handleInputChange = e => {
    this.setState({ tagsValus: e.target.value });
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  // 增加自定义标签
  customizeTags=e => {
    this.setState({ tagsValus: '' });
    const { value } = e.target;
    const { onUpdateTask, data } = this.props;
    onUpdateTask(data.id, {
      ...data,
      tags: (data.tags === null || data.tags === undefined || data.tags.length === 0) ? (
        value
      ) : (
        `${data.tags},${value}`
      ),
    })
  };

  showTransferModal = () => {
    const { data } = this.props;
    let selectedRowKeys = [];
    let selectedRows = [];
    if (data.executorId && data.executorId !== '' && data.executorName && data.executorName !== '') {
      selectedRowKeys = [data.executorId];
      selectedRows = [{ userId: data.executorId, userName: data.executorName }];
    }
    this.setState({
      transferData: {
        title: '选择所需指派的人员',
        visible: true,
        onOk: this.handleExecutorOk,
        onCancel: this.hideTransferModal,
        showOrganization: true,
        showContacts: true,
        showProjectMembers: true,
        checkedType: 'radio',
        selectedRowKeys,
        selectedRows,
        data,
      },
    });
  };

  hideTransferModal = () => {
    this.setState({
      transferData: {
        visible: false,
      },
    });
  };

  handlePauseOk = (reason, rescue) => {
    const { onUpdateTask, data } = this.props;
    onUpdateTask(data.id, { ...data, reason, rescue, taskStatus: 'pause' });
  };

  showPauseModal = () => {
    const { data } = this.props;
    this.setState({
      pauseData: {
        title: '请填写相关延后信息',
        visible: true,
        data,
        onOk: this.handlePauseOk,
        onCancel: this.hidePauseModal,
      },
    });
  };

  hidePauseModal = () => {
    this.setState({
      pauseData: {
        visible: false,
      },
    });
  };

  renderMembers = (ids, names) => {
    const { onFocusMembers } = this.state;
    const componentName = 'members';
    if (!onFocusMembers) {
      return (
        <>
          <span onClick={() => this.onClickSpan(componentName)}>人员：{names}</span>
        </>
      )
    }
    const { myJobsModel: { membersEditData }, form: { getFieldDecorator } } = this.props;
    // 中文逗号
    const idsArr = ids ? ids.split('，') : [];
    const namesArr = names ? names.split('，') : [];
    const defaultValue = [];
    idsArr.forEach((item, index) => {
      defaultValue.push({ key: item, label: namesArr[index] });
    });
    const option = [];
    membersEditData.forEach(item => {
      option.push(<Option key={item.userId}>{item.userName}</Option>);
    });
    this.inputContext = ids;
    return (
      <>
        <span style={{ float: 'left' }}>人员：</span>
        <FormItem style={{ margin: 0, float: 'left', width: '80%' }}>
          {getFieldDecorator('members', {
            initialValue: defaultValue || '',
          })(<Select
            labelInValue
            mode="multiple"
            placeholder="请选择任务成员"
            onBlur={() => this.onInputBlur(componentName)}
            autoFocus
          >
            {option}
          </Select>)
          }
        </FormItem>
      </>
    )
  };


  
  renderTagsColor = (item) => {
    switch (item) {
      case '紧急任务':
        return '#f50';
      case '重要任务':
        return '#108ee9';
      case '日常任务':
        return '#2db7f5';
      case '学习发展':
        return '#87d068';
      case 'BUG':
        return 'red';
      case '需求变更':
        return 'orange';
      case '新需求':
        return 'green';
      default:
        return 'default';
    }
  };

  renderTask = data => {
    const {
      tagsVisible,
      tagsValus,
      taskAttModalData,
      deleteData,
    } = this.state;
    const { loading: { effects }, isParentTask } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <Tag className="site-tag-plus" color="#f50" onClick={() => this.addTags('紧急任务')}>
            紧急任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="1">
          <Tag className="site-tag-plus" color="#108ee9" onClick={() => this.addTags('重要任务')}>
            重要任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="2">
          <Tag className="site-tag-plus" color="#2db7f5" onClick={() => this.addTags('日常任务')}>
            日常任务
          </Tag>
        </Menu.Item>
        <Menu.Item key="3">
          <Tag className="site-tag-plus" color="#87d068" onClick={() => this.addTags('学习发展')}>
            学习发展
          </Tag>
        </Menu.Item>
        <Menu.Item key="4">
          <Tag className="site-tag-plus" color="red" onClick={() => this.addTags('BUG')}>
          BUG
          </Tag>
        </Menu.Item>
        <Menu.Item key="5">
          <Tag className="site-tag-plus" color="orange" onClick={() => this.addTags('需求变更')}>
          需求变更
          </Tag>
        </Menu.Item>
        <Menu.Item key="6">
          <Tag className="site-tag-plus" color="green" onClick={() => this.addTags('新需求')}>
          新需求
          </Tag>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="4">
          {
            tagsVisible ? (
              <Input
                type="text"
                size="small"
                style={{ width: 78 }}
                value={tagsValus}
                onChange={this.handleInputChange}
                onBlur={this.setTagsInput }
                onPressEnter={this.customizeTags}
              />
            ) : (
              <Tag className="site-tag-plus" color="blue" onClick={this.setTagsInput}>
                自定义
              </Tag>
            )
          }
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Spin spinning={isParentTask ? effects['myJobsModel/fetch'] : effects['jobTasksModel/fetch']}>
          <Breadcrumb>
            <Breadcrumb.Item>根级任务</Breadcrumb.Item>
            <Breadcrumb.Item>父级任务</Breadcrumb.Item>
          </Breadcrumb>
          <Form layout="horizontal" style={{ lineHeight: '39px' }}>
            <Row style={{ marginTop: 12 }}>
              <Col span={1}>
                {this.renderMaster(data)}
              </Col>
              <Col span={20}>
                {this.renderContext(data.taskName, 'taskName')}
              </Col>
              {this.renderTaskPropertiesMenu()}
              <TaskAttModalData {...taskAttModalData}/>
              <DeleteTaskModal {...deleteData}/>
            </Row>
            <Row style={{ marginTop: 12, height: 32 }}>
              <Col span={12}>
                {this.renderTaskTime(data.planBeginDate, data.planEndDate)}
              </Col>
              <Col span={12}>
                <span>关联产品：</span>
                <a onClick={this.onShowAppDrawer}>{data.appId}</a>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={12}>
                {this.renderMembers(data.memberIds, data.memberNames)}
              </Col>
              <Col span={12}>
                <span>关联项目：</span>
                <a onClick={this.onShowProjectDrawer}>{data.projectName}</a>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col span={12}>
                <span>标签：</span>{this.renderTags(data)}
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  onVisibleChange={this.handleVisibleChange}
                  visible={this.state.visible}>
                  <Tag className="site-tag-plus" >
                    添加标签
                    <DownOutlined />
                  </Tag>
                </Dropdown>
              </Col>
              <Col span={12}>
                <span>关联工单：</span>
                <a>{data.orderId}</a>
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col>
                {this.renderContext(data.description, 'description')}
              </Col>
            </Row>
            <Row style={{ marginTop: 12 }}>
              <Col>
                {this.renderButtons(data.taskStatus)}
              </Col>
            </Row>
          </Form>
        </Spin>
      </div>
    );
  };

  render() {
    const { data } = this.props;
    if (!data) return false;
    return (
      <>
        {this.renderTask(data)}
      </>
    );
  }
}
