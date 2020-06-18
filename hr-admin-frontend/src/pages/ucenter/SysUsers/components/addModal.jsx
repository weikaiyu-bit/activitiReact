import React, { Component } from 'react';
import { Modal, Form, Input, Upload, Icon, Radio, message } from 'antd';

const FormItem = Form.Item;
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

class SysUsersAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   previewVisible: false,
      loading: false,
    };
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, avatarUrl =>
        this.setState({
          avatarUrl,
          loading: false,
        }),
      );
    }
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(record.id, values);
        this.cancelHandel();
      }
    });
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div>上传</div>
      </div>
    );
    const { avatarUrl } = this.state;
    const {
      title,
      visible,
      record: { uid, userName, nickname, realName, mobile, areaName, status, signature },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

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
            <FormItem label="用户头像" {...formItemLayout}>
              {<Upload
                    name="avatarUrl"
                    listType="picture-card"
                    showUploadList={false}
                    action="http://localhost:8050/api/v1/minio/oss/upload"
                    beforeUpload={beforeUpload}
                    onChange={this.handleChange}
                  >
                    {avatarUrl ? <img src={avatarUrl} alt="avatarUrl" style={{ width: '100%' }} /> : uploadButton}
                  </Upload>}
            </FormItem>
            <FormItem label="用户名" {...formItemLayout}>
              {getFieldDecorator('userName', {
                initialValue: userName || '',
                rules: [
                  {
                    required: true,
                    message: '用户名不能为空',
                  },
                  {
                    min: 2,
                    max: 20,
                    message: '长度为2到10个字',
                  },
                ],
              })(<Input
                placeholder="请输入用户名"/>)}
            </FormItem>
            <FormItem label="昵称" {...formItemLayout}>
              {getFieldDecorator('nickname', {
                initialValue: nickname || '',
                rules: [
                  {
                    required: true,
                    message: '昵称不能为空',
                  },
                  {
                    min: 2,
                    max: 20,
                    message: '长度为2到10个字',
                  },
                ],
              })(<Input
                placeholder="请输入昵称"/>)}
            </FormItem>
            <FormItem label="真实姓名" {...formItemLayout}>
              {getFieldDecorator('realName', {
                initialValue: realName || '',
                rules: [
                  {
                    required: true,
                    message: '真实姓名不能为空',
                  },
                  {
                    min: 2,
                    max: 10,
                    message: '长度为2到10个字',
                  },
                ],
              })(<Input
                placeholder="请输入真实姓名"/>)}
            </FormItem>
            <FormItem label="手机号码" {...formItemLayout}>
              {getFieldDecorator('mobile', {
                initialValue: mobile || '',
                rules: [
                  {
                    required: true,
                    message: '手机号码不能为空',
                  },
                  {
                    min: 1,
                    max: 20,
                    message: '长度为1到10个字',
                  },
                  {
                    pattern: /^[0-9]*$/, // new RegExp('^\\w+$', 'g'),
                    message: '用户名必须为数字',
                  },
                ],
              })(<Input
                placeholder="请输入手机号码"/>)}
            </FormItem>
            <FormItem label="地区" {...formItemLayout}>
              {getFieldDecorator('areaName', {
                initialValue: areaName || '',
              })(<Input
                placeholder="请输入地区"/>)}
            </FormItem>
            <FormItem label="个人签名" {...formItemLayout}>
              {getFieldDecorator('signature', {
                initialValue: signature || '',
              })(<TextArea
                placeholder="请输入个人签名"
                rows={4} />)}
            </FormItem>
            <FormItem label="用户状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: status || 'DISABLE',
              })(
                <Radio.Group>
                  <Radio value="ENABLED">启用</Radio>
                  <Radio value="DISABLE">停用</Radio>
                  <Radio value="IN_REVIEW">审核中</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            {getFieldDecorator('uid', {
              initialValue: uid || '',
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(SysUsersAddModal);
