// eslint-disable-next-line @typescript-eslint/camelcase
import React, { Component } from 'react';
import { Modal, Form, Input, Descriptions, Select, DatePicker } from 'antd';
import styles from '../css/style.less';
import DictionaryTree from '@/pages/components/dictionaryTree';
import { connect } from "dva";

const { TextArea } = Input;
const { Option } = Select;

import moment from 'moment';

@connect(({ organizationGovModel,}) => ({
  organizationGovModel
}))

class TrainingPlanAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidCatch(){
    this.findByFilter({});
  }

  findByFilter = () => {
    const { dispatch } = this.props;
    dispatch({
      type:'organizationGovModel/fetchByFilter',
      payload: {
      }
    });
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        /* 经办单位格式转换 */
        if(values.handlingOrgName){
          values.orgId = values.handlingOrgName.value
          values.handlingOrgName = values.handlingOrgName.label
        }
        /* 允许培训日期为空 */
        values.trainingTime = values.trainingTime
          ? moment(values.trainingTime).format('YYYY-MM-DD HH:mm:ss')
          : values.trainingTime;
        values.publishTime = moment().format('YYYY-MM-DD HH:mm:ss');
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
    const { headTitle, visible, record } = this.props;
    const { title, content, trainingTime, address, trainingObjects, remark,
      handler,handlingOrgName, tel, state, publisher, publishTime,orgId } = record;
    const { getFieldDecorator } = this.props.form;

    const { organizationGovModel:{tree = []}, } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

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
            <div className={styles.descriptions} >
              <Descriptions bordered size="small" column={{ md: 24, xs: 8, sm: 16 }} >
                <Descriptions.Item label="标题" span={24}>
                  {
                    getFieldDecorator('title', {
                      initialValue: title || '',
                      // style={{ border: 0, outline: 'none', backgroundColor: 'rgba(0, 0, 0, 0)' }}
                    })(<Input />)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="发布人" span={12}>
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
                <Descriptions.Item label="培训内容" span={24}>
                  {
                    getFieldDecorator('content', {
                      initialValue: content || '',
                    })(<TextArea style={{ height: 100 }} />)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="培训时间" span={24}>
                  {
                    getFieldDecorator('trainingTime', {
                      initialValue: trainingTime || '',
                    })(
                      <DatePicker bordered={false} />,
                    )
                    /*(<Input />)*/
                  }
                </Descriptions.Item>
                <Descriptions.Item label="培训地点" span={24}>

                  {
                    getFieldDecorator('address', {
                      initialValue: address || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="培训对象" span={24}>
                  {
                    getFieldDecorator('trainingObjects', {
                      initialValue: trainingObjects || '',
                    })(<Input />)
                  }
                </Descriptions.Item>
                <Descriptions.Item label="经办单位" span={12}>
                  {
                    getFieldDecorator('handlingOrgName', {
                      initialValue: handlingOrgName || '',
                    })(
                      <DictionaryTree
                        dataName="orgName" labelInValue tree={tree} type="tree"
                      />
                    )
                  }
                </Descriptions.Item>
                <Descriptions.Item label="发布时间" span={12}>
                  {
                    getFieldDecorator('publishTime', {
                      initialValue: publishTime || '',
                    })(<Input disabled={true} placeholder="点击确认按钮后自动生成发布时间(当前时间)" />)
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

export default Form.create()(TrainingPlanAddModal);
