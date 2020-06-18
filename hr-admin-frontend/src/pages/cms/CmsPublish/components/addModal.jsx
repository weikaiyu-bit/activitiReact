/* eslint-disable max-len */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
import React, { Component } from 'react';
import { Modal, Form, Input, Select, Button, Upload, message } from 'antd';

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import CmsArticlePreview from '../../components/ArticlePreview';

const FormItem = Form.Item;
const { TextArea } = Input;

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传 JPG/PNG 的格式图片');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小不超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class CmsPublishAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewData: {
        visible: false,
        record: {},
      },
      fileList: [],
      previewVisible: false,
      previewImage: '',
      quoteVisible: false,
    };
  }

  onPreview = () => {
    const {
      categoryData,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        values.intro = values.intro.toHTML();
        this.setState({
          previewData: {
            title: '文章预览',
            visible: true,
            onClose: this.hidePerview,
            dataSource: values,
            categoryData,
          },
        });
      }
    });
  };

  hidePerview = () => {
    this.setState({
      previewData: {
        visible: false,
      },
    });
  };

  okHandler = (contentStatus, msg) => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    const { fileList } = this.state;
    validateFields((err, values) => {
      if (!err) {
        if (fileList.length > 0 && fileList[0].uid !== '-1' && fileList[0].status === 'done') {
          // 处理图片路径
          values.thumbnail = `/api/v1/minio/oss/file/${fileList[0].response.data.fileId}`;
          values.isThumbnail = true;
          // eslint-disable-next-line max-len
        } else if (
          fileList.length > 0 &&
          fileList[0].uid === '-1' &&
          fileList[0].status === 'done'
        ) {
          values.thumbnail = fileList[0].url;
          values.isThumbnail = true;
        } else {
          values.thumbnail = null;
          values.isThumbnail = false;
        }
        values.intro = values.intro.toHTML();
        onOk(record.id, { ...values, contentStatus, clicks: 0, comments: 0 }, msg);
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  uploadFn = param => {
    const serverURL = '/api/v1/minio/oss/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();

    const successFn = response => {
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log('response', response);
      let str = response.target.response;
      // 截取地址
      str = str.match(/"fileId":"(\S*)","fileName":"/)[1];
      const fileUrl = `/api/v1/minio/oss/file/${str}`;
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

  handleImagePreview = file => {
    console.log('file', file);
    if (!file.url && !file.preview) {
      file.preview = `/api/v1/minio/oss/file/${file.response.data.fileId}`;
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleImageCancel = () => {
    this.setState({
      previewImage: '',
      previewVisible: false,
    });
  };

  handleQuoteOk = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields(['quoteUrl'], (error, values) => {
      if (!error && values.quoteUrl.length > 0) {
        this.setState({
          quoteVisible: false,
          fileList: [
            {
              uid: '-1',
              name: '已引用缩略图',
              status: 'done',
              url: values.quoteUrl,
            },
          ],
        });
      } else if (!error && values.quoteUrl.length === 0) {
        this.setState({
          quoteVisible: false,
          fileList: [],
        });
      }
    });
  };

  handleQuoteCancel = () => {
    this.setState({
      quoteVisible: false,
    });
  };

  onClickQuote = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['quoteUrl']);
    this.setState({
      quoteVisible: true,
    });
  };

  render() {
    const { visible, record, categoryData, windowTitle, selectedKey } = this.props;
    const { categoryId, title, thumbnail, tags, keywords, description, intro } = record;
    const { getFieldDecorator } = this.props.form;
    const { previewData, fileList, previewVisible, previewImage, quoteVisible } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <>
        <Modal
          title={windowTitle}
          width={1024}
          visible={visible}
          footer={null}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
          maskClosable={false}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="栏目" {...formItemLayout}>
              {getFieldDecorator('categoryId', {
                rules: [
                  {
                    required: true,
                    message: '请选择栏目',
                  },
                ],
                initialValue: categoryId,
              })(
                <Select
                  style={{ width: 500 }}
                  getPopupContainer={triggerNode => triggerNode.parentNode}
                >
                  {categoryData.map(item => {
                    if (item.allowSubmit === 'true') {
                      return (
                        <Select.Option value={item.id} key={item.id}>
                          {item.categoryName}
                        </Select.Option>
                      );
                    }
                  })}
                </Select>,
              )}
            </FormItem>
            <FormItem label="标题" {...formItemLayout}>
              <div>
                {getFieldDecorator('title', {
                  rules: [
                    {
                      required: true,
                      message: '请输入标题',
                    },
                  ],
                  initialValue: title,
                })(<Input style={{ width: 500 }} />)}
                <Button.Group style={{ marginLeft: 8 }}>
                  <Button icon="bold">粗体</Button>
                  <Button icon="italic">斜体</Button>
                  <Button icon="font-colors">颜色</Button>
                </Button.Group>
              </div>
            </FormItem>
            <FormItem label="缩略图" {...formItemLayout}>
              <div>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={this.onClickQuote}
                  disabled={fileList.length > 0}
                >
                  引用
                </Button>
                <Modal
                  title="引用图片地址"
                  visible={quoteVisible}
                  onOk={this.handleQuoteOk}
                  onCancel={this.handleQuoteCancel}
                  width={500}
                >
                  <FormItem label="图片地址" {...formItemLayout}>
                    <div>
                      {getFieldDecorator('quoteUrl', {
                        rules: [
                          {
                            pattern: /[a-zA-z]+:\/\/[^\s]*(.+?.(?:bmp|jpg|png))/,
                            message: '请输入正确图片地址',
                          },
                        ],
                        initialValue: '',
                      })(<Input style={{ width: 350 }} />)}
                    </div>
                  </FormItem>
                </Modal>
                {getFieldDecorator('thumbnail', {
                  rules: [
                    {
                      type: 'object',
                    },
                  ],
                })(
                  <Upload
                    listType="picture"
                    action="/api/v1/minio/oss/upload"
                    fileList={fileList}
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                    onPreview={this.handleImagePreview}
                  >
                    <Button icon="upload" style={{ marginLeft: 8 }} disabled={fileList.length > 0}>
                      上传
                    </Button>
                  </Upload>,
                )}
                <Modal visible={previewVisible} footer={null} onCancel={this.handleImageCancel}>
                  <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>
            </FormItem>
            <FormItem label="内容" {...formItemLayout}>
              {getFieldDecorator('intro', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    type: 'object',
                    required: true,
                    validator: (_, value, callback) => {
                      if (value.isEmpty()) {
                        callback('请输入正文内容');
                      } else {
                        callback();
                      }
                    },
                  },
                ],
                initialValue: BraftEditor.createEditorState(''),
              })(<BraftEditor media={{ uploadFn: this.uploadFn }} />)}
            </FormItem>
            <FormItem label="标签" {...formItemLayout}>
              <div>
                {getFieldDecorator('tags', {
                  rules: [{}],
                  initialValue: tags,
                })(<Input placeholder="支持空格和英文逗号分隔" style={{ width: 500 }} />)}
                <Button style={{ marginLeft: 8 }}>根据标题提取</Button>
              </div>
            </FormItem>
            <FormItem label="关键字" {...formItemLayout}>
              {getFieldDecorator('keywords', {
                rules: [
                  {
                    required: false,
                  },
                ],
                initialValue: keywords,
              })(<Input placeholder="META关键字" />)}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: false,
                  },
                ],
                initialValue: description,
              })(<TextArea placeholder="META描述" />)}
            </FormItem>
            <FormItem {...submitFormLayout}>
              <div>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.onPreview();
                  }}
                >
                  预览
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  icon="save"
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    this.okHandler('DRAFT', '新建草稿成功！');
                  }}
                >
                  保存
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.okHandler('SUBMITTED', '投稿成功！');
                  }}
                >
                  投稿
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.cancelHandel();
                  }}
                >
                  返回
                </Button>
              </div>
            </FormItem>
            {getFieldDecorator('id', {
              initialValue: record.id || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
        {previewData.visible && <CmsArticlePreview {...previewData} />}
      </>
    );
  }
}

export default Form.create()(CmsPublishAddModal);
