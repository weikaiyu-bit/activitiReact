/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Row, Col, Descriptions, Input, message, Upload, Button, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment'

const { TextArea } = Input;

@connect(({ personnelTransferModal, pfileWorkRecordModel }) => ({
  personnelTransferModal,
  pfileWorkRecordModel,
}))
class TransferApprovalViewDrawer extends Component {
  state = {
    imageUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589450329145&di=34a41beb4639c18b5b050aedb487270e&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F-fo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F38dbb6fd5266d01617f511d2922bd40734fa355f.jpg'
  }


  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  __approval = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      const { managerReview, approvalComments } = values;
      if (!err) {
        this.addAppoval(values);
      }
    })
  }

  addAppoval = values => {
    const { dispatch, onClose, record, findPage, pageNumber, pageSize, filter } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/update',
      payload: {
        ...record,
        ...values,
        birth: moment(values.birth).format('YYYY-MM-DD HH:mm:ss'),
        workTime: moment(values.workTime).format('YYYY-MM-DD HH:mm:ss'),
        approvedState: '已批准',
      },
      callback: () => {
        message.success('批准成功');
        onClose();
        findPage(pageNumber, pageSize, filter);
      },
    });
  }

  render() {
    const { data = {}, viewData, visible, title, record } = this.props;
    const { b4PositionName, b4OrgName, b4Level, name, birth, isUnconventionallyPromote, sex, isMainPosition, docNo,
      isLeader, memberCategory, promotionAppointment, isLeaderMember, heducation, workTime, b4ServicedTime, b4AppointmentTime,
      managerReview, approvalComments, reason, afterOrgName, afterLevel, afterPositionName, afterServicedTime, afterAppointmentTime } = record;
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <>
        {record.approvedState === '已批准' ?

          < Modal visible={visible} footer={null}
            onCancel={this.close} title={title} width={1200} className="add-personnel-modal"
          >
            <Form >
              <Row style={{ marginBottom: '15px' }}>
                <Col span={18}>
                  {/*   第一栏为三列 ：姓名   性别   出生年月  学历 */}
                  <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="文号" span={12}>
                      {docNo}
                    </Descriptions.Item>
                    <Descriptions.Item label="成员类别" span={12}>
                      {memberCategory}
                    </Descriptions.Item>
                    <Descriptions.Item label="姓名" span={12}>
                      {name}
                    </Descriptions.Item>
                    <Descriptions.Item label="选拔任用方式" span={12}>
                      {promotionAppointment}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别" span={12}>
                      {getFieldDecorator('sex', { initialValue: sex || '' })}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否破格提拔" span={12}>
                      {isUnconventionallyPromote}
                    </Descriptions.Item>
                    <Descriptions.Item label="出生年月" span={12}>
                      {birth}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否主职务" span={12}>
                      {isMainPosition}
                    </Descriptions.Item>
                    <Descriptions.Item label="学历" span={12}>
                      {heducation}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否领导职务" span={12}>
                      {isLeader}
                    </Descriptions.Item>
                    <Descriptions.Item label="参加工作时间" span={12}>
                      {workTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否领导成员" span={12}>
                      {isLeaderMember}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={6}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={this.beforeUpload}
                  // onChange={this.handleChange}
                  >
                    {imageUrl ? <Avatar shape="square" style={{ align: 'right', width: 150, height: 212 }} src={imageUrl} /> : uploadButton}
                  </Upload>
                </Col>
              </Row>
              <Row style={{ marginBottom: '15px' }}>
                <Col span={24}>
                  <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="原工作单位" span={24}>
                      {b4OrgName}
                    </Descriptions.Item>
                    <Descriptions.Item label="原职务名称" span={6}>
                      {b4PositionName}
                    </Descriptions.Item>
                    <Descriptions.Item label="原职级" span={6}>
                      {b4Level}
                    </Descriptions.Item>
                    <Descriptions.Item label="原任职时间" span={6}>
                      {b4ServicedTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="原聘任时间" span={6}>
                      {b4AppointmentTime}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row style={{ marginBottom: '15px' }}>
                <Col span={24}>
                  <Descriptions bordered column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="现工作单位" span={24}>
                      {afterOrgName}
                    </Descriptions.Item>
                    <Descriptions.Item label="现职务名称" span={6}>
                      {afterPositionName}
                    </Descriptions.Item>
                    <Descriptions.Item label="现职级" span={6}>
                      {afterLevel}
                    </Descriptions.Item>
                    <Descriptions.Item label="现任职时间" span={6}>
                      {afterServicedTime}
                    </Descriptions.Item>
                    <Descriptions.Item label="现聘任时间" span={6}>
                      {afterAppointmentTime}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row style={{ marginBottom: '15px' }}>
                <Col span={24}>
                  <Descriptions bordered column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="职务变动原因综述" span={24}>
                      <p style={{ height: '150px' }} >{reason}</p>
                    </Descriptions.Item>
                    <Descriptions.Item label="主管部门意见" span={24}>
                      <p style={{ height: '150px' }} >{managerReview}</p>
                    </Descriptions.Item>
                    <Descriptions.Item label="核准意见" span={24}>
                      <p style={{ height: '150px' }} >{approvalComments}</p>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Form>
          </Modal>

          :

          < Modal visible={visible} footer={
            < span > <Button type="dashed" onClick={this.close}>取消</Button> <Button type="danger">驳回</Button> <Button type="primary" onClick={this.__approval}>批准</Button></span >}
            onCancel={this.close} title={title} width={1200} className="add-personnel-modal"
          >
            <Form >
              <Row style={{ marginBottom: '15px' }}>
                <Col span={18}>
                  {/*   第一栏为三列 ：姓名   性别   出生年月  学历 */}
                  <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="文号" span={12}>
                      {getFieldDecorator('docNo', { initialValue: docNo || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="成员类别" span={12}>
                      {getFieldDecorator('memberCategory', { initialValue: memberCategory || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="姓名" span={12}>
                      {getFieldDecorator('name', { initialValue: name || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="选拔任用方式" span={12}>
                      {getFieldDecorator('promotionAppointment', { initialValue: promotionAppointment || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="性别" span={12}>
                      {getFieldDecorator('sex', { initialValue: sex || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否破格提拔" span={12}>
                      {getFieldDecorator('isUnconventionallyPromote', { initialValue: isUnconventionallyPromote === 'true' ? '是' : '否' || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="出生年月" span={12}>
                      {getFieldDecorator('birth', { initialValue: birth || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否主职务" span={12}>
                      {getFieldDecorator('isMainPosition', { initialValue: isMainPosition === 'true' ? '是' : '否' || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="学历" span={12}>
                      {getFieldDecorator('heducation', { initialValue: heducation || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否领导职务" span={12}>
                      {getFieldDecorator('isLeader', { initialValue: isLeader === 'true' ? '是' : '否' || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="参加工作时间" span={12}>
                      {getFieldDecorator('workTime', { initialValue: workTime || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="是否领导成员" span={12}>
                      {getFieldDecorator('isLeaderMember', { initialValue: isLeaderMember === 'true' ? '是' : '否' || '' })(<Input />)}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col span={6}>
                  <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  // beforeUpload={this.beforeUpload}
                  // onChange={this.handleChange}
                  >
                    {imageUrl ? <Avatar shape="square" style={{ align: 'right', width: 150, height: 212 }} src={imageUrl} /> : uploadButton}
                  </Upload>
                </Col>
              </Row>
              <Row style={{ marginBottom: '15px' }}>
                <Col span={24}>
                  <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="原工作单位" span={24}>
                      {getFieldDecorator('b4OrgName', { initialValue: b4OrgName || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="原职务名称" span={6}>
                      {getFieldDecorator('b4PositionName', { initialValue: b4PositionName || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="原职级" span={6}>
                      {getFieldDecorator('b4Level', { initialValue: b4Level || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="原任职时间" span={6}>
                      {getFieldDecorator('b4ServicedTime', { initialValue: b4ServicedTime || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="原聘任时间" span={6}>
                      {getFieldDecorator('b4AppointmentTime', { initialValue: b4AppointmentTime || '' })(<Input />)}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row style={{ marginBottom: '15px' }}>
                <Col span={24}>
                  <Descriptions bordered column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="现工作单位" span={24}>
                      {getFieldDecorator('afterOrgName', { initialValue: afterOrgName || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="现职务名称" span={6}>
                      {getFieldDecorator('afterPositionName', { initialValue: afterPositionName || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="现职级" span={6}>
                      {getFieldDecorator('afterLevel', { initialValue: afterLevel || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="现任职时间" span={6}>
                      {getFieldDecorator('afterServicedTime', { initialValue: afterServicedTime || '' })(<Input />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="现聘任时间" span={6}>
                      {getFieldDecorator('afterAppointmentTime', { initialValue: afterAppointmentTime || '' })(<Input />)}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
              <Row style={{ marginBottom: '15px' }}>
                <Col span={24}>
                  <Descriptions bordered column={{ md: 24, xs: 8, sm: 16 }}>
                    <Descriptions.Item label="职务变动原因综述" span={24}>
                      {getFieldDecorator('reason', { initialValue: reason || '' })(<TextArea style={{ height: '150px' }} />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="主管部门意见" span={24}>
                      {getFieldDecorator('managerReview', { initialValue: managerReview || '' })(<TextArea placeholder="请输入主管部门意见" style={{ height: '150px' }} />)}
                    </Descriptions.Item>
                    <Descriptions.Item label="核准意见" span={24}>
                      {getFieldDecorator('approvalComments', { initialValue: approvalComments || '' })(<TextArea placeholder="请输入核准意见" style={{ height: '150px' }} />)}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Form>
          </Modal>
        }

      </>
    )
  }
}

export default Form.create({ name: 'TransferApprovalViewDrawer' })(TransferApprovalViewDrawer);
