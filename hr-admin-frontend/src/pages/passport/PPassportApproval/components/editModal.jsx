/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker } from 'antd';
import styles from "@/dtsea/common/styles/style.less";
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;

class PPassportApprovalEditModal extends Component {
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
    const { headTitle, visible, record } = this.props;
    const { id, fileId, certificateCode, certificateName, certificateType, state, destination, beginTime, endTime, applicantId, applicant, applicantOrgId, applicantOrgName, applicationTime, reason, departmentOpinions, personnelDivisionOpinions, leadersOpinions, keeper, remark, creatorId, creator, createTime } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    };
    const rekex = {
      labelCol: { span: 5 },
      wrapperCol: { span: 24 },
    };
    return (
      <>
        <Modal
          title={headTitle}
          width={960}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >

          <div className={styles.tableListForm}>
            <Form horizontal="true" onSubmit={this.okHandler}>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="证据编号" {...formItemLayout}>
                    {
                      getFieldDecorator('certificateCode', {
                        initialValue: certificateCode || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="证件名称" {...formItemLayout}>
                    {
                      getFieldDecorator('certificateName', {
                        initialValue: certificateName || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="证件类型" {...formItemLayout}>
                    {
                      getFieldDecorator('certificateType', {
                        initialValue: certificateType || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="证件状态" {...formItemLayout}>
                    {
                      getFieldDecorator('state', {
                        initialValue: state || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="开始时间" {...formItemLayout}>
                    {getFieldDecorator('beginTime')(<DatePicker format="YYYY-MM-DD" style={{
                      width: '100%',
                    }}/>)}
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="结束时间" {...formItemLayout}>
                    {getFieldDecorator('endTime')(<DatePicker format="YYYY-MM-DD" style={{
                      width: '100%',
                    }}/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="申请人" {...formItemLayout}>
                    {
                      getFieldDecorator('applicant', {
                        initialValue: applicant || '',
                      })(<Input />)
                    }
                  </FormItem>

                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="申请时间" {...formItemLayout}>
                    {getFieldDecorator('applicationTime')(<DatePicker format="YYYY-MM-DD" style={{
                      width: '100%',
                    }}/>)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={10} sm={24}>
                  <FormItem label="申请人所在单位" {...formItemLayout}>
                    {
                      getFieldDecorator('applicantOrgName', {
                        initialValue: applicantOrgName || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
                <Col md={10} sm={24}>
                  <FormItem label="保管人" {...formItemLayout}>
                    {
                      getFieldDecorator('keeper', {
                        initialValue: keeper || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="目的地" {...rekex}>
                    {
                      getFieldDecorator('destination', {
                        initialValue: destination || '',
                      })(<Input />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="申请原因" {...rekex}>
                    {
                      getFieldDecorator('reason', {
                        initialValue: reason || '',
                      })(<TextArea />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="人事处意见" {...rekex}>
                    {
                      getFieldDecorator('personnelDivisionOpinions', {
                        initialValue: personnelDivisionOpinions || '',
                      })(<TextArea />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="本部门领导意见" {...rekex}>
                    {
                      getFieldDecorator('departmentOpinions', {
                        initialValue: departmentOpinions || '',
                      })(<TextArea />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="单位领导意见" {...rekex}>
                    {
                      getFieldDecorator('leadersOpinions', {
                        initialValue: leadersOpinions || '',
                      })(<TextArea />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={20} sm={20}>
                  <FormItem label="备注" {...rekex}>
                    {
                      getFieldDecorator('remark', {
                        initialValue: remark || '',
                      })(<TextArea />)
                    }
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal>
      </>
    );
  }
}

export default Form.create()(PPassportApprovalEditModal);
