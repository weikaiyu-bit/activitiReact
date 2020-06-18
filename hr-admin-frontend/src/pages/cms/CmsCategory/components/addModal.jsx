/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { Modal, Form, Input, Switch, Select, InputNumber, Upload, Icon, message } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

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

class CmsCategoryAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      picUrl: '',
    };
  }

  handleChange = info => {
    console.log('info', info);
    if (info.file.status === 'uploading') {
      console.log('uploading:', info.file, info.fileList);
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 图片上传成功！`);
      getBase64(info.file.originFileObj, picUrl =>
        this.setState({
          picUrl,
          loading: false,
        }),
      );
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 图片上传失败!`);
    }
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (record) {
          // 处理图片路径。
          if (values.picUrl.file !== undefined) {
            const picUrl = `/api/v1/minio/oss/file/${values.picUrl.file.response.data.fileId}`;
            values.picUrl = picUrl;
          }
          values.depth = record.depth + 1;
          onOk(record.id, {
            ...values,
            pid: record.id,
          });
        } else {
          // 处理图片路径。
          if (values.picUrl.file !== undefined) {
            const picUrl = `/api/v1/minio/oss/file/${values.picUrl.file.response.data.fileId}`;
            values.picUrl = picUrl;
          }
          values.depth = 1;
          onOk(record, values);
        }
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { title, visible, record } = this.props;
    const { picUrl } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div>上传</div>
      </div>
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
            <FormItem label="栏目名称" {...formItemLayout}>
              {getFieldDecorator('categoryName', {
                rules: [
                  {
                    required: true,
                    message: '栏目名称不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="栏目编码" {...formItemLayout}>
              {getFieldDecorator('categoryCode', {
                rules: [
                  {
                    required: true,
                    message: '栏目编码不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label="优化标题" {...formItemLayout}>
              {getFieldDecorator('seoTitle', {})(<Input />)}
            </FormItem>
            <FormItem label="栏目图片" {...formItemLayout}>
              {getFieldDecorator('picUrl', {
                initialValue: picUrl || '',
              })(
                <Upload
                  listType="picture-card"
                  showUploadList={false}
                  action="/api/v1/minio/oss/upload"
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {picUrl ? (
                    <img src={picUrl} alt="picUrl" style={{ width: '100%' }} />
                  ) : (
                    uploadButton
                  )}
                </Upload>,
              )}
            </FormItem>
            <FormItem label="栏目类型" {...formItemLayout}>
              {getFieldDecorator('categoryType', {
                rules: [
                  {
                    required: true,
                    message: '栏目类型不能为空',
                  },
                ],
                initialValue: record === undefined ? '内部栏目' : record.categoryType,
              })(
                <Select style={{ width: 200 }}>
                  <Option value="内部栏目">内部栏目</Option>
                  <Option value="内部网页">内部网页</Option>
                  <Option value="外部链接">外部链接</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="所属模型" {...formItemLayout}>
              {getFieldDecorator(
                'modelId',
                {},
              )(
                <Select style={{ width: 200 }}>
                  <Option value="文章模型">文章模型</Option>
                  <Option value="图片模型">图片模型</Option>
                  <Option value="视频模型">视频模型</Option>
                  <Option value="下载模型">下载模型</Option>
                  <Option value="产品模型">产品模型</Option>
                  <Option value="案例模型">案例模型</Option>
                  <Option value="附件模型">附件模型</Option>
                  <Option value="多图模型">多图模型</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="导航显示" {...formItemLayout}>
              {getFieldDecorator('isMenu', {
                valuePropName: 'checked',
                initialValue: record === undefined ? false : record.isMenu === 'true',
              })(<Switch />)}
            </FormItem>
            <FormItem label="允许投稿" {...formItemLayout}>
              {getFieldDecorator('allowSubmit', {
                valuePropName: 'checked',
                initialValue: record === undefined ? false : record.allowSubmit === 'true',
              })(<Switch />)}
            </FormItem>
            <FormItem label="分页大小" {...formItemLayout}>
              {getFieldDecorator('pageSize', {
                initialValue: record === undefined ? 10 : record.pageSize,
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sortNo', {})(<InputNumber />)}
            </FormItem>
            <FormItem label="列表模板" {...formItemLayout}>
              {getFieldDecorator('categoryList', {})(<Input />)}
            </FormItem>
            <FormItem label="内容模板" {...formItemLayout}>
              {getFieldDecorator('categoryShow', {})(<Input />)}
            </FormItem>
            <FormItem label="内容页规则" {...formItemLayout}>
              {getFieldDecorator('urlRule', {
                initialValue: record === undefined ? '自动编号' : record.urlRule,
              })(
                <Select style={{ width: 200 }}>
                  <Option value="自动编号">自动编号</Option>
                  <Option value="日期+编号">日期+编号</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="关键字" {...formItemLayout}>
              {getFieldDecorator('keywords', {
                initialValue: '',
                placeholder: 'META标签的keywords内容. 关键字之间使用 "," 分隔，还可输入255 个字符',
              })(<TextArea />)}
            </FormItem>
            <FormItem label="描述信息" {...formItemLayout}>
              {getFieldDecorator('description', {
                placeholder: 'META标签的description内容，还可输入255 个字符',
              })(<TextArea />)}
            </FormItem>
            {getFieldDecorator('id', {})(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(CmsCategoryAddModal);
