import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import ColorSelect from '@/dtsea/common/reactColor/ColorSelect';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
@connect(({ wfNodeTemplatesModel, wfWorkflowsModel, loading }) => ({
  wfNodeTemplatesModel,
  wfWorkflowsModel,
  loading: loading.models.fetch,
}))
class WfNodesEditModal extends Component {
  wfNodeTemplatesModelmodelName='wfNodeTemplatesModel';

  wfWorkflowsModelmodelName='wfWorkflowsModel';

  state = {
    entryNodeIds: [],
    exitNodeIds: [],
    nodeColor: null,
  };

  /* ********************************************** */

  componentDidMount() {
    let { record } = this.props
    let en = record.entryNodeIds
    let ex = record.exitNodeIds
    let enn = []
    let exx = []
    if (en !== null && en !== undefined) {
      let a ='';
        for (let i = 0; i < en.length; i += 1) {
          if (en[i] === ',') {
            enn.push(a);
            a = '';
          } else if (i === en.length - 1) {
            a += en[i]
            enn.push(a);
            a = '';
          } else {
            a += en[i]
          }
        }
    }
    if (ex !== null && ex !== undefined) {
      let a = '';
      for (let i = 0; i < ex.length; i += 1) {
        if (ex[i] === ',') {
          exx.push(a);
          a = '';
        } else if (i === ex.length - 1) {
          a += ex[i]
          exx.push(a);
          a = '';
        } else {
          a += ex[i]
        }
      }
    }
    this.setState({entryNodeIds:enn,exitNodeIds:exx})

    this.wfNodeTemplatesfindAll();
    this.wfWorkflowsfindAll();
  }

  /* **************节点模板数据****************** */
  wfNodeTemplatesfindAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.wfNodeTemplatesModelmodelName}/findAll`,
      payload: {},
    });
  }

  /* **************流程数据****************** */
  wfWorkflowsfindAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.wfWorkflowsModelmodelName}/findAll`,
      payload: {},
    });
  }

  hebing =(values) => {
    if (typeof (values) === 'undefined' || values === null || values.length === 0) return ''
    if (typeof (values) !== 'string') {
      let x = ''
      x += values[0]
      for (let i = 1; i < values.length; i += 1) {
        x += ','
        x += values[i]
      }
      return x
    }
      return values
  }

  okHandler = () => {
    const { onOk, record, form: { validateFields } } = this.props;
    const { nodeColor } = this.state
    validateFields((err, values) => {
      if (!err) {
        const cc = this.hebing(values.exitNodeIds)
        const rr = this.hebing(values.entryNodeIds)
        onOk(record.id, {
          ...values,
          entryNodeIds: rr,
          exitNodeIds: cc,
          nodeName: values.flowNodeName,
          nodeColor,
        });
      }
    });
    this.cancelHandel();
  };

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  // 颜色拾取
  updateColor =(v) => {
    this.setState({
      nodeColor: v,
    })
  }

  /* ******************************************* */

  render() {
    const { title, visible, record, alldata } = this.props;
    const {
      wfNodeTemplatesModel: { data },
      wfWorkflowsModel,
    } = this.props;
    const { flowId, nodeName, remark,
      tempId, nodeSize, nodeColor, pageUrl, nodeShape } = record;
    const flowNodeName = nodeName;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const { entryNodeIds, exitNodeIds } = this.state
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
            <FormItem label="工作流程" {...formItemLayout}>
              {
                getFieldDecorator('flowId', {
                  initialValue: flowId,
                })(<Select
                  showSearch
                  style={{ width: '100%' }}
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="label"
                  placeholder="请选择工作流程"
                >
                  {(wfWorkflowsModel.data.map((item) =>
                    <Option value={item.id} key={item.id}
                            label={item.flowName} >{item.flowName}</Option>,
                  ))
                  }
                </Select>)
              }
            </FormItem>
            <FormItem label="节点名称" {...formItemLayout}>
              {
                getFieldDecorator('flowNodeName', {
                  initialValue: flowNodeName,
                })(<Input />)
              }
            </FormItem>
            <FormItem label="节点颜色拾取" {...formItemLayout}>
              <ColorSelect style={{ verticalAlign: 'middle' }}
                           color={nodeColor || '#f0f0f0'}
                           updateColor={this.updateColor}
              />
            </FormItem>

            <FormItem label="节点大小" {...formItemLayout}>
              {
                getFieldDecorator('nodeSize', {
                  initialValue: nodeSize || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="节点形状" {...formItemLayout}>
              {
                getFieldDecorator('nodeShape', {
                  initialValue: nodeShape,
                })(<Select placeholder="请选择形状">
                  <Option value="flow-rect">矩形</Option>
                  <Option value="flow-circle">圆形</Option>
                  <Option value="flow-rhombus">菱形</Option>
                  <Option value="flow-capsule">胶囊形状</Option>
                </Select>)
              }
            </FormItem>
            <FormItem label="节点模板" {...formItemLayout}>
              {
                getFieldDecorator('tempId', {
                  initialValue: tempId,
                })(<Select
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  optionLabelProp="label"
                  onChange={this.selectchange}
                  placeholder="请选择节点模板"
                >
                  {data !== undefined ? (data.map((item) =>
                    <Option value={item.id} key={item.id}
                            label={item.templateName} >{item.templateName}</Option>,
                  )) : (<Option value=""></Option>)
                  }
                </Select>)
              }
            </FormItem>
            <FormItem label="关联表单" {...formItemLayout}>
              {
                getFieldDecorator('pageUrl', {
                  initialValue: pageUrl,
                })(<Input />)
              }
            </FormItem>
            <FormItem label="入口节点" {...formItemLayout}>
              {
                getFieldDecorator('entryNodeIds', {
                  initialValue: entryNodeIds,
                })(<Select
                  showSearch
                  style={{ width: 390 }}
                  placeholder="Select a person"
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  mode="multiple"
                  optionLabelProp="label"
                >
                   {alldata !== undefined ? (alldata.map((item) =>
                     <Option value={item.id} key={item.id} label={item.id}>({item.id}){item.nodeName}</Option>)) : (<Option value=""></Option>)
                  }
                </Select>)
              }
            </FormItem>
            <FormItem label="出口节点" {...formItemLayout}>
              {
                getFieldDecorator('exitNodeIds', {
                  initialValue: exitNodeIds || '',
                })(<Select
                  showSearch
                  style={{ width: 390 }}
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  mode="multiple"
                  optionLabelProp="label"

                >
                   {alldata !== undefined ? (alldata.map((item) =>
                     <Option value={item.id} key={item.id}
                             label={item.id}>({item.id}){item.nodeName}</Option>))
                     : (<Option value=""></Option>)
                  }
                </Select>)
              }
            </FormItem>
            <FormItem label="备注" {...formItemLayout}>
              {
                getFieldDecorator('remark', {
                  initialValue: remark || '',
                })(<TextArea />)
              }
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Form.create()(WfNodesEditModal);
