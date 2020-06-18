import React, { Component } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Dropdown,
  Tag,
  Menu,
  Row,
  Col,
  DatePicker,
  message,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY年MM月DD日';
const FormItem = Form.Item;
const { Option } = Select;
const project = new Map();
class JobTasksAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: 0,
      projectName: '',
      projectLogo: '',
      logoColor: '',
      executorId: '',
      executorName: '',
      tagsValus: '',
      tagsVisible: false,
      tags: '',
      planBeginDate: null,
      planEndDate: null,
    };
  }

  componentDidMount() {
    const { projectData, projectId } = this.props;
    for (let i = 0; projectData != null && i < projectData.length; i += 1) {
      project.set(projectData[i].id, projectData[i]);
      if (projectData[i].id === projectId) {
        this.setState({
          projectId,
          projectName: projectData[i].projectName,
          projectLogo: projectData[i].projectLogo,
        });
      }
    }
  }

  okHandler = () => {
    const {
      onOk,
      form: { validateFields },
      type,
      pidData,
      productId,
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
        const { tags } = this.state;
        const description = values.description.toHTML();
        const memberIds = `${values.memberIds.toString()}`;
        onOk({
          ...values,
          projectId,
          projectName,
          projectLogo,
          logoColor,
          description,
          memberIds,
          appId: productId,
          taskStatus: 'planning',
          pid: type === 'root' ? 0 : pidData.id,
          tags,
          planBeginDate: planBeginDate
            ? moment(planBeginDate).format('YYYY-MM-DD HH:mm:ss')
            : planBeginDate,
          planEndDate: planEndDate
            ? moment(planEndDate).format('YYYY-MM-DD HH:mm:ss')
            : planEndDate,
        });
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    project.clear;
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

  memberChange = e => {
    const { jobMembers } = this.props;
    const executorId = jobMembers[e].id;
    const executorName = jobMembers[e].name;
    this.setState({ executorId, executorName });
  };

  changeData = datas => {
    if (datas.length < 2) return false;
    this.setState({
      planBeginDate: datas[0].format('YYYY-MM-DD HH:mm:ss'),
      planEndDate: datas[1].format('YYYY-MM-DD HH:mm:ss'),
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

  handleActionTheSame = (rule, value, callback) => {
    const fx = value.length;
    if (fx === 0) {
      callback('开始或结束时间不能为空');
    } else {
      callback();
    }
  };

  render() {
    const { title, visible, record, productId, jobMembers } = this.props;
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
    const { tagsVisible, tagsValus, planBeginDate, planEndDate, tags } = this.state;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
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
              <RangePicker format={dateFormat} style={{ width: 391 }} onChange={this.changeData} />
            </FormItem>
            {/* <FormItem label="关联产品" {...formItemLayout}> */}
            {/* { */}
            {/* getFieldDecorator('appId', { */}
            {/* initialValue: appId || '', */}
            {/* rules: [{ */}
            {/* required: true, message: '关联产品不能为空', */}
            {/* }], */}
            {/* })( */}
            {/* <Select */}
            {/* placeholder="请选择关联产品" */}
            {/* showSearch */}
            {/* style={{ width: 390 }} */}
            {/* optionFilterProp="children" */}
            {/* dropdownMatchSelectWidth={false} */}
            {/* optionLabelProp="label" */}
            {/* > */}
            {/* {findData !== null && findData !== undefined ? ( */}
            {/* findData.map(item => */}
            {/* <Option value={item.id} key={item.id} label={item.applicationName}>{item.applicationName}</Option> */}
            {/* ) */}
            {/* ) : (<Option value=""></Option>)} */}
            {/* </Select>) */}
            {/* } */}
            {/* </FormItem> */}
            <FormItem label="任务成员" {...formItemLayout}>
              {getFieldDecorator('memberIds', {
                initialValue: memberIds || [],
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
            <FormItem label="执行人id" {...formItemLayout}>
              {getFieldDecorator('executorName', {
                initialValue: executorName || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="任务描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                initialValue: BraftEditor.createEditorState(''),
              })(
                <BraftEditor
                  style={{ border: '1px solid #E8E8E8' }}
                  media={{ uploadFn: this.uploadFn }}
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
            {getFieldDecorator('id', {
              initialValue: 0,
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(JobTasksAddModal);
