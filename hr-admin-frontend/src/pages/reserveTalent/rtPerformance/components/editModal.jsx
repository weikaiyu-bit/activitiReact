import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, Select, Upload, Avatar, DatePicker, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../css/style.less';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
const { TextArea } = Input;


class RtPerformanceEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    imageUrl: null,
    // imageUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2268196029,3623117752&fm=26&gp=0.jpg',
  };

  /************************************************************************************************/

  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        onOk(record.id, {
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
          birth: values.birth ? moment(values.birth).format('YYYY-MM-DD HH:mm:ss') :'',
          workTime: values.workTime ? moment(values.workTime).format('YYYY-MM-DD HH:mm:ss') : '',
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  /************************************************************************************************/

  render() {
    const { title, visible, record } = this.props;
    const { id, categoryId, fileId, name, sex, birth, national, nativePlace, workTime, maritalStatus, health, education, educationMajor, orgName, positionName, politicalOrientation, phone, performanceProfile, leaderEvaluation, reason, recommenderOpinion, recommenderId, recommender, recommendedTime, resume, photoUrl, remark, voteCount, state, creatorId, createTime, } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <>
        <Modal
          title={title}
          width={1200}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <div className={styles.addModal} >
            <Form horizontal="true" onSubmit={this.okHandler} >
              <table align="center" valign="center" border="true">
                <tr>
                  <td rowSpan="2">被推荐人姓名</td>
                  <td rowSpan="2" style={{ padding: 0, margin: 0 }}>
                    {
                      getFieldDecorator('name', {
                        initialValue: name || '',
                      })(<Input style={{ height: '70px' }} />)
                    }
                  </td>
                  <td>性别</td>
                  <td>{
                    getFieldDecorator('sex', {
                      initialValue: sex || '',
                    })(<Select >
                      <Option value="男">男</Option>
                      <Option value="女">女</Option>
                    </Select>)
                  }</td>
                  <td>出生年月</td>
                  <td>{
                    getFieldDecorator('birth', {
                      initialValue: moment(birth, dateFormat) || '',
                    })(<DatePicker />)
                  }</td>
                  <td rowSpan="3" style={{ padding: 0, margin: 0 }}>
                    <Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={this.beforeUpload}
                      onChange={this.handleChange}
                      style={{ width: '100%' }}
                    >
                      {imageUrl ? <Avatar shape="square" size={90} src={imageUrl} /> : uploadButton}
                    </Upload>
                  </td>
                </tr>
                <tr>
                  <td>民族</td>
                  <td>
                    {
                      getFieldDecorator('national', {
                        initialValue: national || '',
                      })(<Input />)
                    }
                  </td>
                  <td>籍贯</td>
                  <td>{
                    getFieldDecorator('nativePlace', {
                      initialValue: nativePlace || '',
                    })(<Input />)
                  }</td>
                </tr>
                <tr>
                  <td>婚姻状况</td>
                  <td>{
                    getFieldDecorator('maritalStatus', {
                      initialValue: maritalStatus || '',
                    })(<Input />)
                  }</td>
                  <td>健康状况</td>
                  <td>{
                    getFieldDecorator('health', {
                      initialValue: health || '',
                    })(<Input />)
                  }</td>
                  <td>政治面貌</td>
                  <td>{
                    getFieldDecorator('politicalOrientation', {
                      initialValue: politicalOrientation || '',
                    })(<Input />)
                  }</td>
                </tr>
                {/* 第三行 */}
                <tr>
                  <td>参加工作时间</td>
                  <td>
                    {
                      getFieldDecorator('workTime', {
                        initialValue: moment(workTime, dateFormat) || '',
                        // initialValue: '',
                      })(<DatePicker />)
                    }
                  </td>
                  <td>所在单位</td>
                  <td colSpan="2">
                    {
                      getFieldDecorator('orgName', {
                        initialValue: orgName || '',
                      })(<Input />)
                    }
                  </td>
                  <td>联系电话</td>
                  <td>{
                    getFieldDecorator('phone', {
                      initialValue: phone || '',
                    })(<Input />)
                  }</td>
                </tr>
                <tr>
                  <td>业绩简介</td>
                  <td colSpan="6" style={{ height: '200px' }}>{
                    getFieldDecorator('performanceProfile', {
                      initialValue: performanceProfile || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }</td>
                </tr>
                <tr>
                  <td>推荐人意见</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('recommenderOpinion', {
                        initialValue: recommenderOpinion || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>
                <tr>
                  <td>推荐理由</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('reason', {
                        initialValue: reason || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>
                <tr>
                  <td>领导评价</td>
                  <td colSpan="6" style={{ height: '200px' }}>
                    {
                      getFieldDecorator('leaderEvaluation', {
                        initialValue: leaderEvaluation || '',
                      })(<TextArea style={{ height: '200px' }} />)
                    }
                  </td>
                </tr>
              </table>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(RtPerformanceEditModal);
