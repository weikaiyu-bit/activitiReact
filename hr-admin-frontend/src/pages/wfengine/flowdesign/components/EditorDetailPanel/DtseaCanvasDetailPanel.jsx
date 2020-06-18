import React, { Component } from 'react';
import { Card, Input, Form } from 'antd';
import { withPropsAPI } from 'gg-editor';
import styles from './index.less'

// const upperFirst = str => str.toLowerCase().replace(/( |^)[a-z]/g, l => l.toUpperCase());
const { Item } = Form;
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
class DtseaCanvasDetailPanel extends Component {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

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
    const { getFieldDecorator } = this.props.form;
    const { id, flowName } = this.props
    const disabled = true;
    return (
      <div className={styles.dtseaItem}>
        <Form>
          <Item label="流程ID" name="流程ID" {...inlineFormItemLayout}>
            {
              getFieldDecorator('id', {
                initialValue: id || '',
              })(<Input disabled={disabled}/>)
            }
          </Item>
         {/* <Item label="流程版本ID" name="流程版本ID" {...inlineFormItemLayout}>
            <Input disabled="true"/>
          </Item> */}
          <Item label="流程名称" name="流程名称" {...inlineFormItemLayout}>
            {
              getFieldDecorator('flowName', {
                initialValue: flowName || '',
              })(<Input />)
            }
          </Item>
          <Item label="流程参数" name="流程参数" {...inlineFormItemLayout}>
            <Input/>
          </Item>
          <Item label="流程条件" name="流程条件" {...inlineFormItemLayout}>
            <Input/>
          </Item>
        </Form>
      </div>
    )
  }

  render() {
    return (
      // 事件过滤属性
      <>
        <Card size="small" title="流程属性" bordered={false}>
          {this.renderNodeDetail()}
        </Card>
      </>
    )
  }
}
export default withPropsAPI(Form.create()(DtseaCanvasDetailPanel));
