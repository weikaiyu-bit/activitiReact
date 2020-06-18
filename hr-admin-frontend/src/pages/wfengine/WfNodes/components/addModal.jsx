import React, { Component } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import ColorSelect from '@/dtsea/common/reactColor/ColorSelect';

const FormItem = Form.Item;
const { Option } = Select;

const m = new Map()
class WfNodesAddModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    //  previewVisible: false,
      pageUrl: '',
      nodeColor: null,
    };
  }

  componentDidMount() {
    this.setm(this.props.tmpdata)
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
    const { onOk, record } = this.props;
    const { nodeColor } = this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const cc = this.hebing(values.exitNodeIds)
        const rr = this.hebing(values.entryNodeIds)
        onOk(record.id,
          { ...values,
            entryNodeIds: cc === undefined ? ('') : (cc),
            exitNodeIds: rr === undefined ? ('') : (rr),
            nodeName: values.nameNode,
            nodeColor,
          });
        this.cancelHandel();
      }
    });
  };

  selectchange= (id) => {
    this.setState({ pageUrl: m.get(id) })
  }

  cancelHandel = () => {
    const { onClose } = this.props;
    onClose();
  };

  setm = (data) => {
    if (data != null && data !== undefined) {
      for (let i = 0; i < data.length; i += 1) {
          m.set(data[i].id, data[i].pageUrl)
      }
    }
  }

  // 颜色拾取
  updateColor =(v) => {
    this.setState({
      nodeColor: v,
    })
  }

  render() {
    // console.log(this.props)
    const { TextArea } = Input;
    const { title, visible, record, alldata, tmpdata, fwdata } = this.props;
    const { flowId, nodeName, remark, entryNodeIds, exitNodeIds,
      tempId, nodeSize, nodeColor, nodeShape } = record;
    const nameNode = nodeName
    const { pageUrl } = this.state
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    const data = tmpdata
    return (
      <>
        <Modal
          title={title}
          width={720}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.cancelHandel}
        >
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
                  onChange={this.selectchange}
                  placeholder="请选择工作流程"
                >
                   {fwdata !== undefined ? (fwdata.map((item) =>
                     <Option value={item.id} key={item.id}
                             label={item.flowName} >{item.flowName}</Option>,
                     )) : (<Option value=""></Option>)
                  }
                </Select>)
              }
            </FormItem>
          <Form horizontal="true" onSubmit={this.okHandler}>
            <FormItem label="节点名称" {...formItemLayout}>
              {
                getFieldDecorator('nameNode', {
                  initialValue: nameNode || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="节点颜色拾取" {...formItemLayout}>
             <ColorSelect style={{ verticalAlign: 'middle' }}
                          color={nodeColor}
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
                  initialValue: pageUrl || '',
                })(<Input />)
              }
            </FormItem>
            <FormItem label="入口节点" {...formItemLayout}>
              {
                getFieldDecorator('entryNodeIds')(<Select
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  mode="multiple"
                  optionLabelProp="label"
                >
                   {alldata !== undefined ? (alldata.map((item) =>
                     <Option value={item.id} key={item.id}
                             label={item.id} >({item.id}){item.nodeName}</Option>)) : (<Option value=""></Option>)
                  }
                </Select>)
              }
            </FormItem>
            <FormItem label="出口节点" {...formItemLayout}>
              {
                getFieldDecorator('exitNodeIds')(<Select
                  showSearch
                  optionFilterProp="children"
                  dropdownMatchSelectWidth={false}
                  mode="multiple"
                  optionLabelProp="label"
                >
                   {alldata !== undefined ? (alldata.map((item) =>
                     <Option value={item.id} key={item.id} label={item.id} >({item.id}){item.nodeName}</Option>)) : (<Option value=""></Option>)
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

export default Form.create()(WfNodesAddModal);
