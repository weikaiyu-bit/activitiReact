import React, { Component } from 'react';
import { Modal, Form, Table } from 'antd';

class UserRolesModal extends Component {
  state = {
    selectedRowKeys: [],
  };

  columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
  ];

  componentDidMount() {
    const { getUserRoles, record } = this.props;
    // 为了快速打开页面，显示页面的同时去查询用户拥有的角色，最后通过回调设置初始值
    getUserRoles(record.id, res => {
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
    const { visible, title, record, roles = [] } = this.props;
    // const { roleName, remark } = record;
    // const { getFieldDecorator } = this.props.form;
    console.log('roles', roles);
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
            dataSource={roles}
            pagination={false}
            size="small"
            defaultExpandAllRows
          />
        </Modal>
      </>
    );
  }
}

export default Form.create()(UserRolesModal);
