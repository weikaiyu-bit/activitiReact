/* eslint-disable max-len */
/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, message, Select, InputNumber } from 'antd';

const { Option } = Select;
const FormItem = Form.Item;

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

class CmsCategoryEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    picUrlTemp: '',
  };

  /** ********************************************************************************************* */

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 图片上传成功！`);
      getBase64(info.file.originFileObj, picUrlTemp =>
        this.setState({
          picUrlTemp,
          loading: false,
        }),
      );
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 图片上传失败!`);
    }
  };

  okHandler = () => {
    const {
      onOk,
      record,
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        // 处理图片路径。
        if (values.picUrl.file !== undefined) {
          const picUrl = `/api/v1/minio/oss/file/${values.picUrl.file.response.data.fileId}`;
          values.picUrl = picUrl;
        }
        onOk(record.id, {
          ...record,
          ...values,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /* ********************************************************************************************** */

  render() {
    const { title, visible, record } = this.props;
    const {
      categoryName,
      seoTitle,
      categoryCode,
      picUrl,
      categoryType,
      modelId,
      pageSize,
      sortNo,
      urlRule,
      categoryList,
      categoryShow,
      keywords,
      description,
      createTime,
      creatorUid,
      updateTime,
      updatorUid,
    } = record;
    const { getFieldDecorator } = this.props.form;
    const { picUrlTemp } = this.state;
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

    console.log('editRecordModal', record);

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
                initialValue: categoryName || '',
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
                initialValue: categoryCode || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="优化标题" {...formItemLayout}>
              {getFieldDecorator('seoTitle', {
                initialValue: seoTitle || '',
              })(<Input />)}
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
                  {picUrlTemp ? (
                    <img src={picUrlTemp} alt="picUrl" style={{ width: '100%' }} />
                  ) : picUrl ? (
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
                    message: '栏目编码不能为空',
                  },
                ],
                initialValue: categoryType || '',
              })(
                <Select style={{ width: 200 }}>
                  <Option value="内部栏目">内部栏目</Option>
                  <Option value="内部网页">内部网页</Option>
                  <Option value="外部链接">外部链接</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="所属模型" {...formItemLayout}>
              {getFieldDecorator('modelId', {
                initialValue: modelId || '',
              })(
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
            <FormItem label="分页大小" {...formItemLayout}>
              {getFieldDecorator('pageSize', {
                initialValue: pageSize || '',
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="排序" {...formItemLayout}>
              {getFieldDecorator('sortNo', {
                initialValue: sortNo || '',
              })(<InputNumber />)}
            </FormItem>
            <FormItem label="内容页规则" {...formItemLayout}>
              {getFieldDecorator('urlRule', {
                initialValue: urlRule || '',
              })(
                <Select style={{ width: 200 }}>
                  <Option value="自动编号">自动编号</Option>
                  <Option value="日期+编号">日期+编号</Option>
                </Select>,
              )}
            </FormItem>
            <FormItem label="列表模板" {...formItemLayout}>
              {getFieldDecorator('categoryList', {
                initialValue: categoryList || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="内容模板" {...formItemLayout}>
              {getFieldDecorator('categoryShow', {
                initialValue: categoryShow || '',
              })(<Input />)}
            </FormItem>
            <FormItem label="关键字" {...formItemLayout}>
              {getFieldDecorator('keywords', {
                initialValue: keywords || '',
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

export default Form.create()(CmsCategoryEditModal);
