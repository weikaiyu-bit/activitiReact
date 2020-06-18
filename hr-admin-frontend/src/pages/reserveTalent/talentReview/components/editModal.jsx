import React, { Component } from 'react';
import { Modal, Form, Input, Select, DatePicker, Upload, Avatar } from 'antd';
import moment from 'moment';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import DictionaryTree from '../../../components/dictionaryTree';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';
class TalentReviewEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    imageUrl: '',
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
    const { title, visible, record, nationData } = this.props;
    const { id, categoryId, fileId, name, sex, birth, national,
      nativePlace, workTime, maritalStatus, health, education,
      educationMajor, orgName, positionName, politicalOrientation,
      phone, workExperience, reason, recommenderOpinion, recommenderId,
      recommender, recommendedTime, photoUrl, remark, state, creatorId,
      createTime, } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const nation = {
      tree: nationData,
      type: 'list',
      labelInValue: true,
    };
    console.log("national",national)
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
          <Form horizontal="true" onSubmit={this.okHandler}>
            <table align="center" valign="center" border="true">
              <tr>
                <td rowSpan="2">被推荐人姓名</td>
                <td rowSpan="2">
                  {
                    getFieldDecorator('name', {
                      initialValue: name || '',
                    })(<Input />)
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
                    initialValue: birth ? moment(birth, dateFormat) : '',
                  })(<DatePicker />)
                }</td>
                <td rowSpan="3" style={{ padding: 0, margin: 0, height: '110px'}} >
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
                    {imageUrl ? uploadButton : <Avatar shape="square" size={90} src={photoUrl} /> }
                  </Upload>
                </td>
              </tr>
              <tr>
                <td>民族</td>
                <td>
                  {
                    getFieldDecorator('national', {
                      initialValue: { label: national } || '',
                    })(<DictionaryTree {...nation} />)
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
                  })(<Select >
                    <Option value="已婚">已婚</Option>
                    <Option value="未婚">未婚</Option>
                    <Option value="丧偶">丧偶</Option>
                  </Select>)
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
                  <FormItem>
                    {
                      getFieldDecorator('workTime', {
                        initialValue: workTime ? moment(workTime, 'YYYY-MM-DD') : '',
                      })(<DatePicker />)
                    }
                  </FormItem>
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
                <td>主要工作经历</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('workExperience', {
                      initialValue: workExperience || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
              <tr>
                <td>推荐理由（包括被推荐人德菜表现、突出特点）</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('reason', {
                      initialValue: reason || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
              <tr>
                <td>推荐意见</td>
                <td colSpan="6" style={{ height: '200px' }}>
                  {
                    getFieldDecorator('recommenderOpinion', {
                      initialValue: recommenderOpinion || '',
                    })(<TextArea style={{ height: '200px' }} />)
                  }
                </td>
              </tr>
            </table>

          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(TalentReviewEditModal);
