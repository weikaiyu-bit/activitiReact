import React, { Component } from 'react';
import { Modal, Table, Tabs, Card } from 'antd';
import myStyle from '@/assets/css/style.css';
import ContactsSelector from './contactsSelector';
import OrganizationSelector from './organizationSelector';
import ProjectMembersSelector from './projectMembersSelector';

const { TabPane } = Tabs;
export default class UserSelector extends Component {
  state = {
    selectedRowKeys: [],
    selectedRows: [],
  };

  componentDidMount() {
    const { selectedRowKeys, selectedRows } = this.props;
    if (selectedRowKeys && selectedRows) {
      this.setState({ selectedRowKeys, selectedRows });
    }
  }

  okHandler = () => {
    const { onOk } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;
    let names = [];
    let userNames = [];
    selectedRows.forEach(item => {
      names.push(item.name);
      userNames.push(item.userName);
    });
    userNames = userNames.join(',');
    names = names.join(',');
    const keysStr = selectedRowKeys.join(',');
    onOk(keysStr, names, userNames);
    this.onCancel();
  };

  onCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
    });
    onCancel();
  };

  changeSelectedRowKeys = (selectedRowKeys, newSelectedRows) => {
    let { selectedRows } = this.state;
    const { checkedType } = this.props;
    // 如果不是单选，执行去重、过滤操作
    if (checkedType !== 'radio') {
      selectedRows = [...selectedRows, ...newSelectedRows];
      const obj = {};
      // 去重
      selectedRows = selectedRows.reduce((cur, next) => {
        if (!obj[next.userId]) {
          obj[next.userId] = true;
          cur.push(next);
        }
        return cur;
      }, []);
      // 匹配相同项
      selectedRows = selectedRows.filter(item => selectedRowKeys.indexOf(item.userId) !== -1);
    } else {
      selectedRows = [...newSelectedRows];
    }
    this.setState({ selectedRowKeys, selectedRows });
  };

  selectRow = record => {
    const { checkedType } = this.props;
    let selectedRowKeys = [...this.state.selectedRowKeys];
    let selectedRows = [...this.state.selectedRows];
    if (typeof record.userId === 'string') return;
    if (checkedType !== 'radio') {
      if (selectedRowKeys.indexOf(record.userId) >= 0) {
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.userId), 1);
      } else {
        selectedRowKeys.push(record.userId);
        selectedRows.push(record);
      }
    } else {
      selectedRowKeys = [record.userId];
      selectedRows = [record];
    }
    this.changeSelectedRowKeys(selectedRowKeys, selectedRows);
  };

  renderTableClass = record => {
    if (typeof record.userId === 'string') {
      return myStyle.disabled;
    }
    return myStyle.pointer;
  };

  render() {
    const {
      visible,
      showOrganization,
      showContacts,
      showProjectMembers,
      checkedType,
      title,
      data,
    } = this.props;
    const { selectedRowKeys, selectedRows } = this.state;

    const dataSource = {
      selectedRowKeys,
      selectedRows,
      changeSelectedRowKeys: this.changeSelectedRowKeys,
      checkedType,
      data,
      selectRow: this.selectRow,
      renderTableClass: this.renderTableClass,
    };
    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.okHandler}
        onCancel={this.onCancel}
        width={950}
      >
        <Card>
          <Tabs defaultActiveKey="1">
            {showProjectMembers && (
              <TabPane tab="按项目成员" key="1">
                <ProjectMembersSelector {...dataSource} />
              </TabPane>
            )}
            {showContacts && (
              <TabPane tab="按通讯录" key="2">
                <ContactsSelector {...dataSource} />
              </TabPane>
            )}
            {showOrganization && (
              <TabPane tab="按组织机构" key="3">
                <OrganizationSelector {...dataSource} />
              </TabPane>
            )}
          </Tabs>
        </Card>
      </Modal>
    );
  }
}
