import React, { Component } from 'react';
import { Card, Input, Select, Form } from 'antd';
import { withPropsAPI } from 'gg-editor';
import DtseaFlowActor from './DtseaFlowActor';
import styles from './index.less'
import ColorSelect from '@/dtsea/common/reactColor/ColorSelect';

// const upperFirst = str => str.toLowerCase().replace(/( |^)[a-z]/g, l => l.toUpperCase());
const { Item } = Form;
const { Option } = Select;
const inlineFormItemLayout = {
  labelCol: {
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    sm: {
      span: 16,
    },
  },
};
class DtseaNodeDetailPanel extends Component {
  state = {
    editorActor: {
      visible: false,
      record: {},
    },
  }

  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

  showEditorActorModal = () => {
    const { Nodes } = this.props
    this.setState({
      editorActor: {
        title: '编辑流程参与者',
        visible: true,
        confirmLoading: false,
        Nodes,
        onOk: this.add,
        onClose: this.hideEditorActorModal,
      },
    });
  };

  hideEditorActorModal = () => {
    this.setState({
      editorActor: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  // 处理节点事件
  handleInputBlur = type => e => {
    console.log(e)
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

   onBlur =(e, values) => {
     this.handleFieldChange({ [values]: e });
  }

  handleFieldChange = values => {
    console.log(values)
    const { propsAPI } = this.props;
    const { getSelected, executeCommand, update } = propsAPI;
    setTimeout(() => {
      const item = getSelected()[0];

      if (!item) {
        return;
      }

      executeCommand(() => {
        update(item, { ...values });
      });
    }, 0);
  };

  // 颜色拾取
  // 颜色拾取
  updateColor =(v) => {
    this.handleFieldChange({ color: v })
  }

  // node 属性面板
  renderNodeDetail = () => {
    const { label, shape, size, color } = this.item.getModel();
//    console.log(this.item.getModel())
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const disabled = true;
    const { entryNodeIds, exitNodeIds } = this.props.NodesAttribute
    return (
      <div className={styles.dtseaItem}>
        <Form initialvalues={{
          label,
        }}>
          <Item label="节点名称" name="label" {...inlineFormItemLayout}>
            {
              getFieldDecorator('label', {
                initialValue: label,
              })(<Input onBlur={this.handleInputBlur('label')}/>)
            }
          </Item>
          <Item label="节点形状" name="shape" {...inlineFormItemLayout}>
          {
            getFieldDecorator('shape', {
              initialValue: shape,
            })(<Select placeholder="请选择形状"
                       onBlur={(e) => this.onBlur(e, 'shape')}
            >
              <Option value="customRect">矩形11</Option>
              <Option value="flow-rect">矩形</Option>
              <Option value="flow-circle">圆形</Option>
              <Option value="custom-node">圆形自定义</Option>
              <Option value="flow-rhombus">菱形</Option>
              <Option value="flow-capsule">胶囊形状</Option>
            </Select>)
          }
          </Item>
          <Item label="节点大小" name="size" {...inlineFormItemLayout}>
            {
              getFieldDecorator('size', {
                initialValue: size,
              })(<Input onBlur={this.handleInputBlur('size')}/>)
            }
          </Item>
          <Item label="入口节点" name="size" {...inlineFormItemLayout}>
            {
              getFieldDecorator('entryNodeIds', {
                initialValue: entryNodeIds,
              })(<TextArea disabled={disabled}/>)
            }
          </Item>
          <Item label="出口节点" name="size" {...inlineFormItemLayout}>
            {
              getFieldDecorator('exitNodeIds', {
                initialValue: exitNodeIds,
              })(<TextArea disabled={disabled} />)
            }
          </Item>
          <Item label="节点颜色" name="color" {...inlineFormItemLayout}>
            <ColorSelect style={{ verticalAlign: 'middle' }}
                         color={color}
                         updateColor={this.updateColor}
            />
          </Item>
          {/* <Item label="分支模式" name="分支模式" {...inlineFormItemLayout}>
            <Select>
              <Option value="分支模式1">分支模式1</Option>
              <Option value="分支模式2">分支模式2</Option>
            </Select>,
          </Item>
          <Item label="流程参与者" name="流程参与者" {...inlineFormItemLayout}>
            <Input disabled={disabled}
            addonAfter={<Icon type="menu" onClick={this.showEditorActorModal}/> }/>
          </Item> */}
        </Form>
      </div>
    )
  }

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();
    return (
      <div className={styles.dtseaItem}>
        <Form initialvalues={{
          label,
          shape,
        }}>
          <Item label="流程条件" name="节点名称" {...inlineFormItemLayout}>
            <Input onBlur={this.handleInputBlur('label')}/>
          </Item>
          <Item label="Shape" name="shape" {...inlineFormItemLayout}>
            <Select
              onChange={value =>
                this.handleFieldChange({
                  shape: value,
                })
              }
            >
              <Option value="flow-smooth">Smooth</Option>
              <Option value="flow-polyline">Polyline</Option>
              <Option value="flow-polyline-round">Polyline Round</Option>
            </Select>
          </Item>
        </Form>
      </div>
    )
  }

  render() {
    const { editorActor } = this.state;
   // console.log(Nodes)
  //  console.log(this.props.propsAPI.getSelected())
    return (
      // 事件过滤属性
      <>
        <Card size="small" title="节点属性" bordered={false}>
        {this.renderNodeDetail()}
        </Card>
        {editorActor.visible && <DtseaFlowActor {...editorActor} />}
      </>
    )
  }
}
export default withPropsAPI(Form.create()(DtseaNodeDetailPanel));
