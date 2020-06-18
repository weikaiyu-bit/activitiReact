import React, { Component } from 'react';
import { Modal, Form, Row, Col, Input } from 'antd';

const FormItem = Form.Item;

class PPersonnelFilesEditModal extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

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

  /** ********************************************************************************************* */

  render() {
    const { title, visible, record } = this.props;
    const { id, appId, tenantId, orgId, rsOrgId, perId, name, pyCode, idCard, sex, photo, birth, national, nativePlace, birthplace, growPlace, state, partyTime, workTime, health, speciality, resume, isExamination, isSelectedGraduates, manageCategory, personnelCategory, level, establishmentCategory, positionLevel, positionLevelTime, rank, rankTime, civilServantQualification, serviceTime, remark, creatorId, creator, createTime, updaterId, updater, updateTime } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
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
            <Row>
              <Col span={18}>
                <Tabs defaultActiveKey="1">
                  <TabPane tab="任免审批表（一）" key="1">
                    <BasicInformationOne {...BasicInformationOneData} />
                  </TabPane>
                  <TabPane tab="任免审批表（二）" key="2">
                    <BasicInformationTwo {...BasicInformationOneData} />
                  </TabPane>
                  <TabPane tab="其他信息" key="3">
                    <BasicInformationThree {...BasicInformationOneData} />
                  </TabPane>
                </Tabs>

              </Col>
              <Col span={5} offset={1}>
                <div className="addModalForm">
                  <span style={{ marginBottom: '10px' }}>现职人员</span>
                  <FormItem label="统计关系所在单位">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="身份证号">
                    {
                      getFieldDecorator('idCard', {
                        initialValue: idCard || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="管理类别">
                    {
                      getFieldDecorator('manageCategory', {
                        initialValue: manageCategory || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="人员类别">
                    {
                      getFieldDecorator('personnelCategory', {
                        initialValue: personnelCategory || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="编制类型">
                    {
                      getFieldDecorator('posistionCategory', {
                        initialValue: posistionCategory || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="职位类别">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="现领导职务">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="现领导职务事件">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="现职级">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="任现职级事件">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="任相当层次职务职级事件">
                    {
                      getFieldDecorator('rsOrgId', {
                        initialValue: rsOrgId || '',
                      })(<Input />)
                    }
                  </FormItem>
                  <FormItem label="公务员登记时间">
                    {
                      getFieldDecorator('serviceTime', {
                        initialValue: serviceTime || '',
                      })(<Input />)
                    }
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PPersonnelFilesEditModal);
