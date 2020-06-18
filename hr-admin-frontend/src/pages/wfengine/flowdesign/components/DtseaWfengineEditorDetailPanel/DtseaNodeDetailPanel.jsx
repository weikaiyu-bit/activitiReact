import React, { Component } from 'react';
import { Card, Input, Select, Form, Icon } from 'antd';
import { withPropsAPI } from 'gg-editor';
import DtseaFlowActor from './DtseaFlowActor';
import styles from './index.less'

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
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

  handleFieldChange = values => {
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

  // node 属性面板
  renderNodeDetail = () => {
    const { label } = this.item.getModel();
    console.log(this.item)
    console.log(this.item.getModel())
    return (
      <div className={styles.dtseaItem}>
        <Form initialValues={{
          label,
        }}>
          <Item label="节点名称" name="节点名称" {...inlineFormItemLayout}>
            <Input onBlur={this.handleInputBlur('label')}/>
          </Item>
          <Item label="节点类型" name="节点类型" {...inlineFormItemLayout}>
            <Input/>
          </Item>
          <Item label="节点大小" name="节点大小" {...inlineFormItemLayout}>
            <Input/>
          </Item>
          <Item label="节点颜色" name="节点颜色" {...inlineFormItemLayout}>
            <Input/>
          </Item>
          <Item label="分支模式" name="分支模式" {...inlineFormItemLayout}>
            <Select>
              <Option value="分支模式1">分支模式1</Option>
              <Option value="分支模式2">分支模式2</Option>
            </Select>,
          </Item>
          <Item label="流程参与者" name="流程参与者" {...inlineFormItemLayout}>
            <Input disabled="true" addonAfter={<Icon type="menu" onClick={this.showEditorActorModal}/> }/>
          </Item>
          <Item label="Label" name="扩展属性" {...inlineFormItemLayout}>
            <Input addonAfter={<Icon type="menu" /> }/>
          </Item>
        </Form>
      </div>
    )
  }

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();
    return (
      <div className={styles.dtseaItem}>
        <Form initialValues={{
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
    const { type } = this.props;
    return (
      // 事件过滤属性
      <>
        <Card size="small" title="节点属性" bordered={false}>
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
        </Card>
        {editorActor.visible && <DtseaFlowActor {...editorActor} />}
      </>
    )
  }
}
export default withPropsAPI(DtseaNodeDetailPanel);
