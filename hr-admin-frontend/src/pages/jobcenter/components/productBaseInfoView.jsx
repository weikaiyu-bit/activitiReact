import React, { Component } from 'react';
import { Avatar, Button, Col, Input, Row, Tag, Form, Tabs, message } from 'antd';

import BraftEditor from 'braft-editor';
import ProductTimelineView from './productTimelineView';
// 引入编辑器组件
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import ErrorCode from '../../../dtsea/common/ErrorCode';

const { TabPane } = Tabs;

const FormItem = Form.Item;

@Form.create()
export default class ProductBaseInfoView extends Component {
  state = {
    onFocusApplicationName: false,
    onFocusVersion: false,
    onFocusStatus: false,
    controlVisible: false,
  };

  componentDidMount() {}

  // 是否显示富文本组件
  showBraftEditor = () => {
    this.setState({ controlVisible: true });
  };

  hideBraftEditor = () => {
    this.setState({ controlVisible: false });
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

  renderStatus = text => {
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

  renderContext = (value, componentName) => {
    const { onFocusApplicationName, onFocusVersion, onFocusStatus } = this.state;
    const { getFieldDecorator } = this.props.form;
    switch (componentName) {
      case 'applicationName':
        if (onFocusApplicationName) {
          this.inputContext = value;
          return (
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator('applicationName', {
                initialValue: value || '',
              })(
                <Input
                  style={{ fontSize: 24, width: 400 }}
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
            {getFieldDecorator('applicationName', {
              initialValue: value || '',
            })(
              <span
                style={{ fontSize: 24, width: 400 }}
                onClick={() => this.onClickSpan(componentName)}
              >
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
      case 'version':
        if (onFocusVersion) {
          this.inputContext = value;
          return (
            <FormItem label="版本号：">
              {getFieldDecorator('version', {
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
            <span>版本号：</span>
            <span
              style={{ fontSize: 24, marginLeft: 10 }}
              onClick={() => this.onClickSpan(componentName)}
            >
              {value}
            </span>
          </>
        );
      case 'status':
        if (onFocusStatus) {
          this.inputContext = value;
          return (
            <div>
              <FormItem>
                {getFieldDecorator('status', {
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
        return <>{this.renderStatus(value)}</>;
      default:
        this.inputContext = '';
        break;
    }
    return false;
  };

  onClickSpan = componentName => {
    switch (componentName) {
      case 'applicationName':
        this.setState(
          {
            onFocusApplicationName: true,
          },
          () => {
            const { input } = this.applicationNameRef;
            input.focus();
            input.setSelectionRange(0, input.value.length);
          },
        );
        break;
      case 'version':
        this.setState(
          {
            onFocusVersion: true,
          },
          () => {
            const { input } = this.versionRef;
            input.focus();
            input.setSelectionRange(0, input.value.length);
          },
        );
        break;
      case 'status':
        this.setState(
          {
            onFocusStatus: true,
          },
          () => {
            const { input } = this.statusRef;
            input.focus();
            input.setSelectionRange(0, input.value.length);
          },
        );
        break;
      default:
        break;
    }
  };

  onInputBlur = componentName => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((errors, value) => {
      if (errors) return;
      const { onUpdate, onGetById, data } = this.props;
      const htmlContent = value.remark.toHTML();
      onUpdate(data.id, { ...data, ...value, remark: htmlContent });
      onGetById(data.id);
    });
    if (componentName === 'applicationName') {
      this.setState({
        onFocusApplicationName: false,
      });
      this.inputContext = '';
    }
    if (componentName === 'version') {
      this.setState({
        onFocusVersion: false,
      });
      this.inputContext = '';
    }
    if (componentName === 'status') {
      this.setState({
        onFocusStatus: false,
      });
      this.inputContext = '';
    }
    this.hideBraftEditor();
  };

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  renderProduct = data => {
    const { getFieldDecorator } = this.props.form;
    const hooks = {
      'insert-medias': (a, b, c) => {
        console.log('a', a);
        console.log('b', b);
        console.log('c', c);
      },
    };
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 10 },
    };
    return (
      <div>
        <Form layout="horizontal" style={{ lineHeight: '39px' }} {...formItemLayout}>
          <Row style={{ marginTop: 12, height: 32 }}>
            <Col span={1}>
              <Avatar
                shape="square"
                style={{
                  backgroundColor: data.logoColor,
                  verticalAlign: 'middle',
                  marginRight: '20px',
                }}
              >
                {data.logoName}
              </Avatar>
            </Col>
            <Col span={20} push={1}>
              {this.renderContext(data.applicationName, 'applicationName')}
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              {/* <span>版本号:</span> */}
              {this.renderContext(data.version, 'version')}
            </Col>
            <Col span={12}>
              <span style={{ marginRight: '5px' }}>状态:</span>
              {this.renderContext(data.status, 'status')}
            </Col>
          </Row>
        </Form>
        <Form>
          <Row>
            <Col span={24}>
              <span>
                产品描述:
                {this.state.controlVisible ? (
                  <a style={{ marginLeft: '10px' }} onClick={this.hideBraftEditor}>
                    取消
                  </a>
                ) : (
                  <a style={{ marginLeft: '10px' }} onClick={this.showBraftEditor}>
                    编辑
                  </a>
                )}
              </span>
              <br></br>
              <FormItem>
                {getFieldDecorator('remark', {
                  initialValue: BraftEditor.createEditorState(data.remark),
                })(
                  this.state.controlVisible ? (
                    <BraftEditor
                      style={{ border: '1px solid #E8E8E8' }}
                      media={{ uploadFn: this.uploadFn }}
                      contentStyle={{ height: 'auto', maxHeight: '600px' }}
                    />
                  ) : (
                    <BraftEditor
                      style={{ border: '1px solid BraE8E8' }}
                      media={{ uploadFn: this.uploadFn }}
                      contentStyle={{ height: 'auto', maxHeight: '600px' }}
                      readOnly
                      hooks={hooks}
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
                    />
                  ),
                )}
              </FormItem>
              {this.state.controlVisible ? (
                <div style={{ width: 158, margin: '0 auto' }}>
                  <Button
                    style={{ marginTop: 12 }}
                    type="primary"
                    onClick={this.onInputBlur}
                    htmlType="submit"
                  >
                    保存
                  </Button>
                  <Button
                    style={{ marginTop: 12, marginLeft: 12 }}
                    htmlType="submit"
                    onClick={this.hideBraftEditor}
                  >
                    取消
                  </Button>
                </div>
              ) : null}
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  render() {
    console.log('productBaseInfoView', this.props);
    const {
      data,
      onFindProductLog,
      onSaveProductLog,
      jobProductsModel,
      onUpdate,
      onGetById,
    } = this.props;
    if (!data) return false;
    const productLog = {
      data,
      onFindProductLog,
      onSaveProductLog,
      jobProductsModel,
      onUpdate,
      onGetById,
    };
    return (
      <div>
        {this.renderProduct(data)}
        <Row>
          <Col span={24}>
            <Tabs defaultActiveKey="1" onChange={this.onChangeTab}>
              <TabPane tab="更新日志" key="1">
                <ProductTimelineView {...productLog} />
              </TabPane>
              <TabPane tab="功能模块" key="2"></TabPane>
              <TabPane tab="应用接口" key="3"></TabPane>
              <TabPane tab="源代码" key="4"></TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    );
  }
}
