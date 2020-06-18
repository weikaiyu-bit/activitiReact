import React, { Component } from 'react';
import { Table, Card, Tree, Input, Avatar, Form, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import { v4 } from 'uuid';
import myStyle from '../../../../assets/css/style.css';

const { TreeNode } = Tree;
const { Search } = Input;
const FormItem = Form.Item;

@Form.create()
@connect(({ myJobsModel, loading }) => ({
  myJobsModel,
  loading,
}))
export default class organizationSelector extends Component {
  modelName = 'myJobsModel';

  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedKeys: [],
    pageNumber: 1,
    pageSize: 10,
    filter: {},
    orgs: {},
  };

  columns = [
    {
      title: '头像',
      dataIndex: 'portraitUrl',
      render: (text, record) => {
        if (record.avatarUrl) return <Avatar shape="square" src={record.avatarUrl} />;
        return <Avatar shape="square" icon="user" />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;
    this.findOrganizationAll();
    this.findOrgPerson(pageNumber, pageSize, filter);
  }

  findOrganizationAll = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${this.modelName}/fetchOrgOrg`,
      payload: {},
    });
  };

  findOrgPerson = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    this.setState({ pageNumber, pageSize });
    dispatch({
      type: `${this.modelName}/fetchOrgPerson`,
      payload: {
        pageNumber,
        pageSize,
        ...filter,
      },
    });
  };

  renderTreeNodes = tree => {
    if (!tree) return '';
    const { searchValue } = this.state;
    const newTree = tree.map(item => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#ff5c02' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        );
      if (item.children) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={item.id} dataRef={item} />;
    });
    return newTree;
  };

  onSearchChange = e => {
    const {
      myJobsModel: { orgData, orgTree },
    } = this.props;
    const { value } = e.target;
    const expandedKeys = orgData
      .map(item => {
        if (item.name.indexOf(value) > -1) {
          return this.getParentKey(item.id, orgTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  /*
  树形控件
   */

  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i += 1) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentKey = node.id.toString();
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  // 获取集团ID
  getRoot = pid => {
    const { orgData } = this.props.myJobsModel;
    for (let i = 0; i < orgData.length; i += 1) {
      if (pid === orgData[i].id) {
        return orgData[i].pid;
      }
    }
    return null;
  };

  // 选中左侧树状菜单,展示数据并存储集团ID
  onSelect = (selectedKeys, info) => {
    this.setState({
      selectedKeys,
      pageNumber: 1,
    });
    const { pageSize, filter } = this.state;
    const { id, pid, type } = info.node.props.dataRef;
    const orgs = {};
    if (info.selected) {
      // 判断是集团还是公司，来决定设置参数
      if (pid === 0 && type === 'GROUP') {
        orgs.groupId = id;
        const groupId = id;
        this.findOrgPerson(1, pageSize, { groupId, ...filter });
      } else if (type === 'COMPANY' && pid !== 0) {
        orgs.groupId = pid;
        orgs.unitId = id;
        const unitId = id;
        this.findOrgPerson(1, pageSize, { unitId, ...filter });
      } else if (type === 'COMPANY' && pid === 0) {
        orgs.unitId = id;
        const unitId = id;
        this.findOrgPerson(1, pageSize, { unitId, ...filter });
      } else if (type === 'DEPARTMENT') {
        const groupId = this.getRoot(pid);
        if (groupId !== 0) {
          orgs.groupId = groupId;
          orgs.unitId = pid;
          orgs.deptId = id;
          const deptId = id;
          this.findOrgPerson(1, pageSize, { deptId, ...filter });
        } else {
          orgs.unitId = pid;
          orgs.deptId = id;
          const deptId = id;
          this.findOrgPerson(1, pageSize, { deptId, ...filter });
        }
      }
      this.setState({ orgs });
      // 取消选择
    } else {
      this.findOrgPerson(1, pageSize, filter);
      this.setState({ orgs: {} });
    }
  };

  handleTableChange = pagination => {
    const { filter, orgs } = this.state;
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findOrgPerson(pagination.current, pagination.pageSize, { ...filter, ...orgs });
  };

  handleSearch = e => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const { pageSize, orgs } = this.state;
    validateFields((error, values) => {
      if (!error) {
        this.findOrgPerson(1, pageSize, { ...values, ...orgs });
        this.setState({ filter: { ...values } });
      }
    });
  };

  render() {
    const {
      myJobsModel: { orgTree, personData, personTotal },
      loading: { effects },
      selectedRowKeys,
      changeSelectedRowKeys,
      form: { getFieldDecorator },
      checkedType,
      selectRow,
      renderTableClass,
    } = this.props;
    const { expandedKeys, autoExpandParent, selectedKeys, pageNumber, pageSize } = this.state;
    // 处理userId不存在的用户
    if (personData) {
      personData.forEach(item => {
        if (item.userId == null) item.userId = v4();
      });
    }
    const rowSelection = {
      type: checkedType,
      selectedRowKeys,
      onChange: changeSelectedRowKeys,
      getCheckboxProps: record => ({
        disabled: typeof record.userId === 'string',
      }),
    };
    // 表格分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total: personTotal,
      showTotal: all => `共 ${all} 条`,
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <>
        <div>
          <Form onSubmit={this.handleSearch} layout="horizontal">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col xl={9} md={12} sm={24}>
                <FormItem label="姓名" {...formItemLayout}>
                  {getFieldDecorator('name')(<Input placeholder="请输入姓名" />)}
                </FormItem>
              </Col>
              <Col xl={9} md={12} sm={24}>
                <FormItem label="用户名" {...formItemLayout}>
                  {getFieldDecorator('userName')(<Input placeholder="请输入用户名" />)}
                </FormItem>
              </Col>
              <Col xl={6} md={12} sm={24} style={{ marginTop: 3 }}>
                <Button type="primary" htmlType="submit">
                  查找
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <Card
          style={{
            width: 290,
            float: 'left',
            marginRight: '1%',
          }}
        >
          <Search
            style={{ marginBottom: 8 }}
            placeholder="请输入关键字"
            onChange={this.onSearchChange}
          />
          <Tree
            onExpand={this.onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onSelect={this.onSelect}
            selectedKeys={selectedKeys}
          >
            {this.renderTreeNodes(orgTree)}
          </Tree>
        </Card>
        <Card style={{ width: 550, float: 'left' }}>
          <Table
            rowKey="userId"
            columns={this.columns}
            rowSelection={rowSelection}
            dataSource={personData}
            pagination={paginationProps}
            onChange={this.handleTableChange}
            loading={effects[`${this.modelName}/fetchOrgPerson`]}
            size="small"
            onRow={record => ({
              onClick: () => {
                selectRow(record);
              },
            })}
            rowClassName={renderTableClass}
          />
        </Card>
      </>
    );
  }
}
