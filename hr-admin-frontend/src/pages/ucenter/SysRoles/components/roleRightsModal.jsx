import React, { Component } from 'react';
import { Modal, Form, Table } from 'antd';

class RoleRightsModal extends Component {
  state = {
    selectedRowKeys: [],
  };

  columns = [
    {
      title: '功能名称',
      dataIndex: 'functionName',
    },
    {
      title: '功能类型',
      dataIndex: 'functionType',
      render(text) {
        switch (text) {
          case 'MENU':
            return '菜单';
          case 'FUNC':
            return '权限';
          default:
            return text;
        }
      },
    },
    {
      title: '权限标识',
      dataIndex: 'auth',
    },
  ];

  componentDidMount() {
    const { getRoleFuncs, record } = this.props;
    // 为了快速打开页面，显示页面的同时去查询角色对应的权限，最后通过回调设置初始值
    getRoleFuncs(record.id, res => {
      this.setState({
        selectedRowKeys: res.data,
      });
    });
  }

  onSelectChange = selectedRowKeys => {
    // console.log('selectedRowKeys ', selectedRowKeys);
    // 去重
    const keys = Array.from(new Set(selectedRowKeys));
    // console.log('keys ', keys);
    this.setState({ selectedRowKeys: keys });
  };

  okHandler = () => {
    const { onOk, record } = this.props;
    const { selectedRowKeys } = this.state;
    onOk(record.id, selectedRowKeys);
    this.hideModel();
  };

  hideModel = () => {
    const { onClose } = this.props;
    onClose();
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { visible, title, record, tree = [] } = this.props;
    // const { roleName, remark } = record;
    // const { getFieldDecorator } = this.props.form;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <>
        <Modal
          title={title}
          // width={1024}
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModel}
          maskClosable={false}
        >
          <Table
            rowKey="id"
            columns={this.columns}
            rowSelection={rowSelection}
            dataSource={tree}
            pagination={false}
            size="small"
            defaultExpandAllRows
          />
        </Modal>
      </>
    );
  }
}

export default Form.create()(RoleRightsModal);
