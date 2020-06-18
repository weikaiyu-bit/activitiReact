import React, { Component } from 'react';
import { Card, Input, Select, Form, Icon } from 'antd';
import { withPropsAPI } from 'gg-editor';
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
class DtseaEdgeDetailPanel extends Component {
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

  renderEdgeDetail = () => {
    const { label = '', shape = 'flow-smooth' } = this.item.getModel();
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.dtseaItem}>
        <Form initialValues={{
          label,
          shape,
        }}>
          <Item label="流程条件" name="节点名称" {...inlineFormItemLayout}>
            {
              getFieldDecorator('label', {
                initialValue: label || '',
              })(<Input onBlur={this.handleInputBlur('label')}/>)
            }
          </Item>
          <Item label="Shape" name="shape" {...inlineFormItemLayout}>
            {getFieldDecorator('shape', {
              initialValue: shape || '',
            })(<Select
              onChange={value =>
                this.handleFieldChange({
                  shape: value,
                })
              }
            >
              <Option value="flow-smooth">Smooth</Option>
              <Option value="flow-polyline">Polyline</Option>
              <Option value="flow-polyline-round">Polyline Round</Option>
            </Select>)
            }
          </Item>
        </Form>
      </div>
    )
  }

  render() {
    return (
      // 事件过滤属性
      <>
        <Card size="small" title="线条属性" bordered={false}>
          {this.renderEdgeDetail()}
        </Card>
      </>
    )
  }
}
export default withPropsAPI(Form.create()(DtseaEdgeDetailPanel));
