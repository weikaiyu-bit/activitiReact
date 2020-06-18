import React from 'react';
import { Card, Input, Select, Form, Icon } from 'antd';
import { withPropsAPI } from 'gg-editor';
import DtseaNodeDetailPanel from './DtseaNodeDetailPanel';
import DtseaEdgeDetailPanel from './DtseaEdgeDetailPanel';

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

class DetailForm extends React.Component {
  get item() {
    const { propsAPI } = this.props;
    return propsAPI.getSelected()[0];
  }

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

  handleInputBlur = type => e => {
    e.preventDefault();
    this.handleFieldChange({
      [type]: e.currentTarget.value,
    });
  };

  renderNodeDetail = () => <DtseaNodeDetailPanel NodesAttribute={this.props.NodesAttribute}></DtseaNodeDetailPanel>;

  renderEdgeDetail = () => <DtseaEdgeDetailPanel></DtseaEdgeDetailPanel>;

  renderGroupDetail = () => {
    const { label = '新建分组' } = this.item.getModel();
    return (
      <Form
        initialValues={{
          label,
        }}
      >
        <Item label="Label" name="label" {...inlineFormItemLayout}>
          <Input onBlur={this.handleInputBlur('label')} />
        </Item>
      </Form>
    );
  };

  render() {
    const { type } = this.props;
    if (!this.item) {
      return null;
    }

    return (
        <>
          {type === 'node' && this.renderNodeDetail()}
          {type === 'edge' && this.renderEdgeDetail()}
          {type === 'group' && this.renderGroupDetail()}
        </>
    );
  }
}

export default withPropsAPI(DetailForm);
