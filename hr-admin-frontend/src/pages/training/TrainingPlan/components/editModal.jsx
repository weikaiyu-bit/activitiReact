/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Row, Col, Descriptions, Select } from 'antd';
import moment from 'moment';
import styles from '../css/style.less';
import { connect } from "dva";
import DictionaryTree from '@/pages/components/dictionaryTree';

const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';
const { TextArea } = Input;
const { Option } = Select;

@connect(({ organizationGovModel, }) => ({
  organizationGovModel
}))

class TrainingPlanEditModal extends Component {
  modelName = 'organizationGovModel';
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  /** ********************************************************************************************* */

  componentDidMount() {
    this.findByFilter({ });
  }

  findByFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchByFilter`,
      payload: {
      },
    });
  };


  okHandler = () => {
    const { onOk, record, form: { validateFields, getFieldsValue } } = this.props;
    validateFields((err, values) => {
      /* 经办单位格式转换 */
      if(values.handlingOrgName){
        values.orgId = values.handlingOrgName.value;
        values.handlingOrgName = values.handlingOrgName.label;
      }

      if (!err) {
        onOk(record.id, {
          ...record,
          ...values,
          updateTime: values.updateTime ? moment(values.updateTime)
            .format('YYYY-MM-DD HH:mm:ss') : values.updateTime,
          trainingTime: values.trainingTime!=null?moment(values.trainingTime).format('YYYY-MM-DD HH:mm:ss' ):null,
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
    const { id, tenantId, appId, title, content, trainingTime, address, trainingObjects, remark, handlingOrgName, handler, tel, state, publisher, publishTime, orgId, creatorId, createTime } = record
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const { organizationGovModel:{tree = []}, } = this.props;
    const Tx = {
      label:handlingOrgName,
      value:orgId
    }
    return (
      <>

        <Modal
          title={headTitle}
          width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
          <Form horizontal="true" onSubmit={this.okHandler}>
            <div className={styles.descriptions}>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="标题" span={12}>
                  {
                    getFieldDecorator('title', {
                      initialValue: title || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>

                <Descriptions.Item label="发布人" span={8}>
                  {
                    getFieldDecorator('publisher', {
                      initialValue: publisher || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="培训状态" span={12}>
                  {
                    getFieldDecorator('state', {
                      initialValue: state || '',
                    })(
                      <Select bordered={false}>
                        <Option value="待发布" >待发布</Option>
                        <Option value="已发布">已发布</Option>
                        <Option value="已撤下">已撤下</Option>
                        <Option value="已关闭">已关闭</Option>
                      </Select >
                    )
                    /*(<Input />)*/
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="培训内容" span={24}>
                  {
                    getFieldDecorator('content', {
                      initialValue: content || '',
                    })(<TextArea style={{ height: 100 }} />)
                  }
                </Descriptions.Item>
              </Descriptions>

              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="培训时间" span={24}>
                  {
                    getFieldDecorator('trainingTime', {
                      initialValue: trainingTime!=null?moment(trainingTime, 'YYYY-MM-DD HH:mm:ss'):null,
                    })(
                      <DatePicker bordered={false} />,
                    )
                    /*(<Input />)*/
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="培训地点" span={24}>

                  {
                    getFieldDecorator('address', {
                      initialValue: address || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="培训对象" span={24}>
                  {
                    getFieldDecorator('trainingObjects', {
                      initialValue: trainingObjects || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="经办单位" span={12}>
                  {
                    getFieldDecorator('handlingOrgName',{
                      initialValue: Tx,
                    })(
                    <DictionaryTree
                      dataName="orgName" labelInValue tree={tree} type="tree"
                    />
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="发布时间" span={12}>
                  {
                    getFieldDecorator('publishTime', {
                      initialValue: publishTime || '',
                    })(<Input disabled={true}/>)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="经办人" span={12}>
                  {
                    getFieldDecorator('handler', {
                      initialValue: handler || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="联系电话" span={12}>
                  {
                    getFieldDecorator('tel', {
                      initialValue: tel || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
              </Descriptions>
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }}>
                <Descriptions.Item label="备注" span={24}>
                  {
                    getFieldDecorator('remark', {
                      initialValue: remark || '',
                    })(<TextArea style={{ height: 100 }} />)
                  }
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(TrainingPlanEditModal);
