/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import {
  Tag,
  Form,
  Tabs,
  Row,
  Col,
  Progress,
  Menu,
  Button,
  Input,
  DatePicker,
  Dropdown,
  Icon,
  Modal,
  Slider,
  InputNumber,
} from 'antd';
import BraftEditor from 'braft-editor';
import moment from 'moment';
import ProjectChartView from './projectChartView';
import ProjectTimelineView from './projectTimelineView';
import ProjectAttributeView from './projectAttributeView';
import 'braft-editor/dist/index.css';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserSelector from './selectors/userSelector';
import PauseModal from './pauseModal';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY年MM月DD日';
const { TabPane } = Tabs;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};
const { confirm } = Modal;
/**
 * 项目信息
 * @author b__c<br> bc@dtsea.net<br>2019-01-11 02:26:52
 */
@Form.create()
export default class ProjectView extends PureComponent {
  state = {
    fileList: [],
    editVisible: false,
    hoverMenu: false,
    onFocusProjectName: false,
    onFocusProjectTime: false,
    onFocusCategoryId: false,
    onFocusExecutorName: false,
    onFocusProgress: false,
    projectAttributeData: {
      visible: false,
      record: {},
    },
    tagsVisible: false,
    tagsValus: '',
    transferData: {
      visible: false,
    },
    pauseData: {
      visible: false,
    },
  };

  showEditModal = () => {
    const { dataSource, updateProject, onFindByProjectId, jobProductsModel, treeData } = this.props;
    const { dispatch } = this.props;
    this.setState({
      projectAttributeData: {
        dispatch,
        title: '编辑产品信息',
        visible: true,
        confirmLoading: false,
        record: dataSource,
        onOk: updateProject,
        onClose: this.hideEditModal,
        jobProductsModel,
        treeData,
      },
    });
  };

  hideEditModal = () => {
    this.setState({
      projectAttributeData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  uploadFn = param => {
    const serverURL = '/api/v1/minio/oss/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = response => {
      // 上传成功后调用param.success并传入上传后的文件地址
      let str = response.target.response;
      // 截取地址
      str = str.match(/"fileId":"(\S*)","fileName":"/);
      const fileUrl = `/api/v1/minio/oss/file/${str[1]}`;
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

  componentDidMount() {
    document.onclick = this.mousClick;
  }

  mousClick = e => {
    if (this.state.onFocusProgress) {
      this.onInputBlur('progress');
    }
  };

  componentWillReceiveProps(nextProps) {
    const { jobProjectsModel } = nextProps;
    const { listAnnex } = jobProjectsModel;
    if (!listAnnex) return;
    const fileList = [];
    const reg = /\.(png|jpg|gif|jpeg|webp)$/;
    const fileIcon =
      'M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM761 656h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-23.1-31.9a7.92 7.92 0 0 0-6.5-3.3H573c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.9-5.3.1-12.7-6.4-12.7zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z';
    for (let i = 0; i < listAnnex.length; i += 1) {
      const list = listAnnex[i].data;
      const file = [];
      if (list !== undefined && list.length !== null && list.length > 0) {
        for (let j = 0; j < list.length; j++) {
          file.push({
            uid: list[j].id,
            name: list[j].fileName,
            status: 'done',
            url: `/api/v1/minio/oss/file/${list[j].fileId}`,
            thumbUrl: reg.test(list[j].fileName)
              ? `/api/v1/minio/oss/file/${list[j].fileId}`
              : fileIcon,
          });
        }
      }

      fileList.push(file);
    }
    this.setState({ fileList });
  }

  renderProjectStatus = text => {
    let color = '';
    switch (text) {
      case 'editing':
        text = '编辑中';
        color = 'orange';
        break;
      case 'planning':
        text = '计划中';
        color = 'lime';
        break;
      case 'doing':
        text = '进行中';
        color = 'cyan';
        break;
      case 'completed':
        text = '已完成';
        color = 'blue';
        break;
      case 'delay':
        text = '已逾期';
        color = 'magenta';
        break;
      case 'pause':
        text = '暂停';
        color = '#CCCCCC';
        break;
      case 'undone':
        text = '已撤销';
        color = '#666666';
        break;
      case 'refuse':
        text = '已驳回';
        color = '#666666';
        break;
      default:
        break;
    }
    return <Tag color={color}>{text}</Tag>;
  };

  onInputBlur = componentName => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((errors, value) => {
      if (errors) return;
      const { dataSource, updateProject, onFindByProjectId } = this.props;
      const htmlContent = value.description.toHTML();
      updateProject(dataSource.id, { ...dataSource, ...value, description: htmlContent });
      onFindByProjectId(dataSource.id);
    });
    if (componentName === 'projectName') {
      this.setState({
        onFocusProjectName: false,
      });
    }
    if (componentName === 'description') {
      this.setState({
        editVisible: false,
      });
    }
    if (componentName === 'categoryId') {
      this.setState({
        onFocusCategoryId: false,
      });
    }
    if (componentName === 'executorName') {
      this.setState({
        onFocusExecutorName: false,
      });
    }
    if (componentName === 'progress') {
      this.setState({
        onFocusProgress: false,
      });
    }
  };

  onMouseLeave = () => {
    this.setState({ hoverMenu: false });
  };

  onMouseEnter = () => {
    this.setState({ hoverMenu: true });
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

  renderProjectPropertiesMenu = () => {
    const parentStyle = {
      color: '#595959',
      display: 'inline-block',
      height: 39,
      width: 39,
      textAlign: 'center',
      lineHeight: '38px',
      borderRadius: '50%',
    };
    let style = { ...parentStyle };
    const { hoverMenu } = this.state;
    if (hoverMenu) {
      style = { ...parentStyle, background: '#f0f0f0' };
    }
    const menu = (
      <Menu style={{ textAlign: 'center' }}>
        <Menu.Item key="0">
          <a onClick={this.showEditModal}>项目属性</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a>项目成员</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a>删除项目</a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Col span={1} style={{ float: 'right', fontSize: 20 }}>
        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
          <a
            title="任务属性"
            style={style}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <Icon type="menu" />
          </a>
        </Dropdown>
      </Col>
    );
  };

  onClickSpan = componentName => {
    switch (componentName) {
      case 'projectName':
        this.setState(
          {
            onFocusProjectName: true,
          },
          () => {
            const { input } = this.applicationNameRef;
            input.focus();
            input.setSelectionRange(0, input.value.length);
          },
        );
        break;
      case 'projectTime':
        this.setState(
          {
            onFocusProjectTime: true,
          },
          () => {},
        );
        break;
      case 'categoryId':
        this.setState(
          {
            onFocusCategoryId: true,
          },
          () => {
            const { input } = this.statusRef;
            input.focus();
            input.setSelectionRange(0, input.value.length);
          },
        );
        break;
      case 'executorName':
        this.setState(
          {
            onFocusExecutorName: true,
          },
          () => {
            const { input } = this.statusRef;
            input.focus();
            input.setSelectionRange(0, input.value.length);
          },
        );
        break;
      case 'progress':
        this.setState(
          {
            onFocusProgress: true,
          },
          () => {},
        );
        break;
      default:
        break;
    }
  };

  onChangeTime = dates => {
    const { dataSource, updateProject, onFindByProjectId } = this.props;
    updateProject(dataSource.id, {
      ...dataSource,
      planBeginDate: moment(dates[0]).format('YYYY-MM-DD HH:mm:ss'),
      planEndDate: moment(dates[1]).format('YYYY-MM-DD HH:mm:ss'),
    });
    onFindByProjectId(dataSource.id);
    this.setState({
      onFocusProjectTime: false,
    });
  };

  renderProjectTime = (planBeginDate, planEndDate) => {
    const { onFocusProjectTime } = this.state;
    if (onFocusProjectTime) {
      const date = planBeginDate + planBeginDate;
      return (
        <>
          <span>时间：</span>
          <RangePicker
            defaultValue={
              date.length > 0
                ? [
                    moment(planBeginDate || new Date(), dateFormat),
                    moment(planBeginDate || new Date(), dateFormat),
                  ]
                : null
            }
            format={dateFormat}
            style={{ width: 260 }}
            onChange={dates => this.onChangeTime(dates)}
            autoFocus
          />
        </>
      );
    }
    return (
      <>
        <span onClick={() => this.onClickSpan('projectTime')}>时间：</span>
        <span onClick={() => this.onClickSpan('projectTime')}>
          {planBeginDate
            ? `${moment(planBeginDate).format(dateFormat)} ~ ${moment(planEndDate).format(
                dateFormat,
              )}`
            : ''}
        </span>
      </>
    );
  };

  renderContext = (value, componentName) => {
    const {
      onFocusCategoryId,
      onFocusExecutorName,
      onFocusProjectCode,
      onFocusProjectName,
      onFocusProgress,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    switch (componentName) {
      case 'projectName':
        if (onFocusProjectName) {
          this.inputContext = value;
          return (
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator('projectName', {
                initialValue: value || '',
              })(
                <Input
                  style={{ fontSize: 24 }}
                  ref={input => {
                    this.applicationNameRef = input;
                  }}
                  onBlur={() => this.onInputBlur(componentName)}
                />,
              )}
            </FormItem>
          );
        }
        return (
          <FormItem style={{ margin: 0 }}>
            {getFieldDecorator('projectName', {
              initialValue: value || '',
            })(
              <span style={{ fontSize: 24 }} onClick={() => this.onClickSpan(componentName)}>
                {value}
              </span>,
            )}
          </FormItem>
          //   <span
          //     style={{ fontSize: 24, marginLeft: 10 }}
          //     onClick={() => this.onClickSpan(componentName)}
          //   >
          //   {value}
          // </span>
        );
      case 'projectCode':
        if (onFocusProjectCode) {
          this.inputContext = value;
          return (
            <FormItem label="编号：">
              {getFieldDecorator('projectCode', {
                initialValue: value || '',
              })(
                <Input
                  style={{ fontSize: 24, width: 150, float: 'left' }}
                  ref={input => {
                    this.versionRef = input;
                  }}
                  onBlur={() => this.onInputBlur(componentName)}
                />,
              )}
            </FormItem>
          );
        }
        return (
          <>
            <span>编号：</span>
            <span
              style={{ fontSize: 24, marginLeft: 10 }}
              onClick={() => this.onClickSpan(componentName)}
            >
              {value}
            </span>
          </>
        );
      case 'categoryId':
        if (onFocusCategoryId) {
          this.inputContext = value;
          return (
            <div>
              <FormItem label="分类：">
                {getFieldDecorator('categoryId', {
                  initialValue: value || '',
                })(
                  <Input
                    style={{ fontSize: 24, width: 300 }}
                    ref={input => {
                      this.statusRef = input;
                    }}
                    onBlur={() => this.onInputBlur(componentName)}
                  />,
                )}
              </FormItem>
            </div>
          );
        }
        return (
          <>
            <span>分类：</span>
            <span
              style={{ fontSize: 24, marginLeft: 10 }}
              onClick={() => this.onClickSpan(componentName)}
            >
              {value}
            </span>
          </>
        );
      case 'executorName':
        if (onFocusExecutorName) {
          this.inputContext = value;
          return (
            <div>
              <FormItem label="负责人：">
                {getFieldDecorator('executorName', {
                  initialValue: value || '',
                })(
                  <Input
                    style={{ fontSize: 24, width: 300 }}
                    ref={input => {
                      this.statusRef = input;
                    }}
                    onBlur={() => this.onInputBlur(componentName)}
                  />,
                )}
              </FormItem>
            </div>
          );
        }
        return (
          <>
            <span>负责人：</span>
            <span
              style={{ fontSize: 24, marginLeft: 10 }}
              onClick={() => this.onClickSpan(componentName)}
            >
              {value}
            </span>
          </>
        );
      case 'progress':
        if (onFocusProgress) {
          return (
            <Row onClick={this.clickProgress}>
              <Col span={16}>
                <FormItem label="进度" {...formItemLayout}>
                  {getFieldDecorator('progress', {
                    initialValue: parseInt(value) || '0',
                  })(
                    <Slider
                      min={0}
                      max={100}
                      tipFormatter={values => `${values}%`}
                      marks={{ 0: '0%', 100: '100%' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={4} push={0}>
                <FormItem {...formItemLayout}>
                  {getFieldDecorator('progress', {
                    initialValue: parseInt(value) || '0',
                  })(
                    <InputNumber
                      min={0}
                      max={100}
                      style={{ marginLeft: 20 }}
                      formatter={values => `${values}%`}
                      parser={values => values.replace('%', '')}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
          );
        }
        return (
          <>
            <span onClick={this.clickProgress}>进度：</span>
            <Progress
              onClick={this.clickProgress}
              style={{ width: '80%' }}
              percent={parseInt(value)}
            />
          </>
        );
      default:
        this.inputContext = '';
        break;
    }
    return false;
  };

  clickProgress = e => {
    e.nativeEvent.stopImmediatePropagation();
    this.onClickSpan('progress');
  };

  // 移除标签
  removeTags = (record, index) => {
    const { updateProject, dataSource } = this.props;
    const { tags } = record;
    const words = tags.split(',');
    words.splice(index, 1);
    const word = `${words.toString()}`;
    updateProject(dataSource.id, {
      ...dataSource,
      tags: word,
    });
  };

  // 增加标签
  addTags = value => {
    const { updateProject, dataSource } = this.props;
    updateProject(dataSource.id, {
      ...dataSource,
      tags:
        dataSource.tags === null || dataSource.tags === undefined || dataSource.tags.length === 0
          ? value
          : `${dataSource.tags},${value}`,
    });
  };

  setTagsInput = () => {
    const { tagsVisible } = this.state;
    this.setState({ tagsVisible: !tagsVisible });
  };

  handleInputChange = e => {
    this.setState({ tagsValus: e.target.value });
  };

  handleVisibleChange = flag => {
    this.setState({ visible: flag });
  };

  // 增加自定义标签
  customizeTags = e => {
    this.setState({ tagsValus: '' });
    const { value } = e.target;
    const { updateProject, dataSource } = this.props;
    updateProject(dataSource.id, {
      ...dataSource,
      tags:
        dataSource.tags === null || dataSource.tags === undefined || dataSource.tags.length === 0
          ? value
          : `${dataSource.tags},${value}`,
    });
  };

  renderTags = text => {
    const { tags } = text;
    if (!tags) return false;
    const words = tags.split(',');
    const loop = words =>
      words.map((item, index) => (
        <Tag
          key={item}
          color={this.renderTagsColor(item)}
          closable
          onClose={() => this.removeTags(text, index)}
        >
          {item}
        </Tag>
      ));
    return <span>{loop(words)}</span>;
  };

  showTransferModal = () => {
    const { dataSource } = this.props;
    let selectedRowKeys = [];
    let selectedRows = [];
    if (
      dataSource.executorId &&
      dataSource.executorId !== '' &&
      dataSource.executorName &&
      dataSource.executorName !== ''
    ) {
      selectedRowKeys = [dataSource.executorId];
      selectedRows = [{ userId: dataSource.executorId, userName: dataSource.executorName }];
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
        data: dataSource,
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
    const { updateProject, dataSource } = this.props;
    updateProject(dataSource.id, { ...dataSource, reason, rescue, taskStatus: 'pause' });
  };

  showPauseModal = () => {
    const { dataSource } = this.props;
    this.setState({
      pauseData: {
        title: '请填写相关延后信息',
        visible: true,
        dataSource,
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

  // 传入希望变成的状态
  showConfirm = taskStatus => {
    const { updateProject, dataSource } = this.props;
    let title = '';
    switch (taskStatus) {
      case 'planning':
        title = '请确认是否重新计划任务';
        break;
      case 'doing':
        title = '请确认是否开始任务?';
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
        updateProject(dataSource.id, { ...dataSource, taskStatus });
      },
    });
  };

  renderButtons = taskStatus => {
    const { transferData, pauseData } = this.state;
    switch (taskStatus) {
      case 'planning':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('doing')}>
              开始
            </Button>
            <Button onClick={this.showTransferModal}>指派</Button>
            {transferData.visible && <UserSelector {...transferData} />}
          </div>
        );
      case 'doing':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={this.showTransferModal}>
              指派
            </Button>
            {transferData.visible && <UserSelector {...transferData} />}
            <Button style={{ marginRight: 12 }} onClick={this.showPauseModal}>
              延后
            </Button>
            {pauseData.visible && <PauseModal {...pauseData} />}
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('completed')}>
              完成
            </Button>
            <Button>提醒</Button>
          </div>
        );
      case 'completed':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button>重新打开</Button>
          </div>
        );
      case 'pause':
        return (
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 12 }} onClick={this.showTransferModal}>
              指派
            </Button>
            {transferData.visible && <UserSelector {...transferData} />}
            <Button style={{ marginRight: 12 }} onClick={this.showPauseModal}>
              继续
            </Button>
            {pauseData.visible && <PauseModal {...pauseData} />}
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('completed')}>
              完成
            </Button>
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
            <Button style={{ marginRight: 12 }} onClick={this.showTransferModal}>
              指派
            </Button>
            {transferData.visible && <UserSelector {...transferData} />}
            <Button style={{ marginRight: 12 }} onClick={this.showPauseModal}>
              延后
            </Button>
            {pauseData.visible && <PauseModal {...pauseData} />}
            <Button style={{ marginRight: 12 }} onClick={() => this.showConfirm('completed')}>
              完成
            </Button>
            <Button>提醒</Button>
          </div>
        );
    }
  };

  renderProject = data => {
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
          {this.state.tagsVisible ? (
            <Input
              type="text"
              size="small"
              style={{ width: 78 }}
              value={this.state.tagsValus}
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
        <Form layout="horizontal" style={{ lineHeight: '39px' }} {...formItemLayout}>
          <Row style={{ marginTop: 12 }}>
            <Col span={20}>{this.renderContext(data.projectName, 'projectName')}</Col>
            {this.renderProjectPropertiesMenu()}
            {this.state.projectAttributeData.visible && (
              <ProjectAttributeView {...this.state.projectAttributeData} />
            )}
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>{this.renderProjectTime(data.planBeginDate, data.planEndDate)}</Col>
            <Col span={12}>{this.renderContext(data.categoryId, 'categoryId')}</Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>{this.renderContext(data.executorName, 'executorName')}</Col>
            <Col span={12}>{this.renderContext(parseInt(data.progress), 'progress')}</Col>
          </Row>
          <Row style={{ marginTop: 12 }}>
            <Col span={12}>
              <label>标签：</label>
              {this.renderTags(data)}
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
            </Col>
            <Col span={12}>
              <label>状态：</label>
              {this.renderProjectStatus(data.taskStatus)}
            </Col>
          </Row>
        </Form>
        <Row style={{ marginTop: 12 }}>
          <Col>
            <div>
              {this.state.editVisible ? (
                <label>
                  项目描述：
                  <a style={{ marginLeft: '15px' }} onClick={() => this.hideVisible('description')}>
                    取消
                  </a>
                </label>
              ) : (
                <label>
                  项目描述：
                  <a style={{ marginLeft: '15px' }} onClick={() => this.showVisible('description')}>
                    编辑
                  </a>
                </label>
              )}
              <Form>
                {this.state.editVisible ? (
                  <FormItem style={{ margin: 0, marginTop: 3, marginLeft: 3 }}>
                    {this.props.form.getFieldDecorator('description', {
                      initialValue: BraftEditor.createEditorState(data.description),
                    })(
                      <BraftEditor
                        style={{ border: '1px solid #E8E8E8' }}
                        media={{ uploadFn: this.uploadFn }}
                        contentStyle={{ height: '600px' }}
                      />,
                    )}
                  </FormItem>
                ) : (
                  <FormItem style={{ margin: 0, marginTop: 3, marginLeft: 3 }}>
                    {this.props.form.getFieldDecorator('description', {
                      initialValue: BraftEditor.createEditorState(data.description),
                    })(
                      <BraftEditor
                        style={{ border: '1px solid BraE8E8' }}
                        media={{ uploadFn: this.uploadFn }}
                        contentStyle={{ height: 'auto', maxHeight: '600px' }}
                        readOnly
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
                )}
              </Form>
              {this.state.editVisible ? (
                <div style={{ width: 158, margin: '0 auto' }}>
                  <Button
                    style={{ marginTop: 12 }}
                    type="primary"
                    onClick={() => this.onInputBlur('description')}
                    htmlType="submit"
                  >
                    保存
                  </Button>
                  <Button
                    style={{ marginTop: 12, marginLeft: 12 }}
                    htmlType="submit"
                    onClick={() => this.hideVisible('description')}
                  >
                    取消
                  </Button>
                </div>
              ) : null}
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: 12 }}>
          <Col>{this.renderButtons(data.taskStatus)}</Col>
        </Row>
      </div>
    );
  };

  showVisible = componentName => {
    if (componentName === 'projectName') {
      this.setState({
        titleVisible: true,
      });
    }
    if (componentName === 'description') {
      this.setState({
        editVisible: true,
      });
    }
  };

  hideVisible = componentName => {
    if (componentName === 'projectName') {
      this.setState({
        titleVisible: false,
      });
    }
    if (componentName === 'description') {
      this.setState({
        editVisible: false,
      });
    }
  };

  removeFile = file => {
    const { onRemoveFile } = this.props;
    onRemoveFile([file.uid]);
  };

  render() {
    const { dataSource } = this.props;
    if (!dataSource) return false;
    const { jobTasksModel, jobProjectsModel, onFindProjectRecord } = this.props;
    return (
      <div>
        <div style={{ maxWidth: 1024 }}>{this.renderProject(dataSource)}</div>

        <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
          <TabPane tab="动态" key="1">
            <ProjectTimelineView
              dataSource={{
                projectId: dataSource.id,
                jobTasksModel,
                jobProjectsModel,
                onFindProjectRecord,
              }}
            />
          </TabPane>
          {/* <TabPane tab="附件" key="2"> */}
          {/* <Collapse defaultActiveKey={['0']}> */}
          {/* { */}
          {/* (listAnnex !== undefined && listAnnex !== null) ? ( */}
          {/* Array.from(listAnnex).map((item, index) => */}
          {/* <Panel header={item.taskName} key={index}> */}
          {/* <p><Upload */}
          {/* listType="picture" */}
          {/* className="upload-list-inline" */}
          {/* action="/api/v1/minio/oss/upload" */}
          {/* fileList={fileList[index]} */}
          {/* onRemove={this.removeFile} */}
          {/* > */}
          {/* </Upload></p> */}
          {/* </Panel>, */}
          {/* ) */}
          {/* ) : ( */}
          {/* null */}
          {/* ) */}
          {/* } */}
          {/* </Collapse> */}
          {/* </TabPane> */}
          <TabPane tab="分析" key="3">
            <ProjectChartView {...jobProjectsModel} {...jobTasksModel} />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
