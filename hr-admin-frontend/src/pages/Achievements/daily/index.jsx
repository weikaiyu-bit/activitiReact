import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Table, Card, Button, Divider, Popconfirm, Form, message, Tag, Input, Tree } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import ErrorCode from '../../../dtsea/common/ErrorCode';
import DailyAttendanceAddModal from './components/addModal';
import DailyAttendanceEditModal from './components/editModal';
import DailyAttendanceViewDrawer from './components/viewDrawer';
import DailyAttendanceSearchBar from './components/searchBar';

const { Search } = Input;
const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i += 1) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i += 1) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
@connect(({ dailyAttendanceModel, loading }) => ({
  dailyAttendanceModel,
  loading: loading.models.fetch,
}))
class DailyAttendanceIndex extends Component {
  state = {
    selectedRowKeys: [],
    filter: {},
    pageNumber: 1,
    pageSize: 10,
    viewData: {},
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
    },
    expandList: false, // 卡片展开与收起
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  };

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      render: text => {
        switch (text) {
          case 'woman':
            return <Tag color="magenta">女</Tag>;
          case 'man':
            return <Tag color="blue">男</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '考勤时间',
      dataIndex: 'attendanceTime',
    },
    {
      title: '考勤地点',
      dataIndex: 'attendancePlace',
    },
    {
      title: '是否缺勤',
      dataIndex: 'isAbsenteeism',
      render: text => {
        switch (text) {
          case 'true':
            return <Tag color="red">是</Tag>;
          case 'false':
            return <Tag color="blue">否</Tag>;
          default:
            return <Tag>{text}</Tag>;
        }
      },
    },
    {
      title: '缺勤原因',
      dataIndex: 'absenteeismReason',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (text, record) => (
        <>
          <a onClick={() => this.showEditModal(record)}>审阅</a>
          <Divider type="vertical" />
          <Popconfirm title="您确认删除日常考勤吗？" onConfirm={() => this.delete(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  componentDidMount() {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
  }

  /** ********************************************************************************************* */

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
    });
  };

  hideDrawer = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  showAddModal = () => {
    this.setState({
      addData: {
        title: '新建日常考勤',
        visible: true,
        confirmLoading: false,
        record: {},
        onOk: this.add,
        onClose: this.hideAddModal,
      },
    });
  };

  hideAddModal = () => {
    this.setState({
      addData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  showEditModal = record => {
    const { dispatch } = this.props;
    this.setState({
      editData: {
        dispatch,
        title: '编辑日常考勤',
        visible: true,
        confirmLoading: false,
        record,
        onOk: this.update,
        onClose: this.hideEditModal,
      },
    });
  };

  hideEditModal = () => {
    this.setState({
      editData: {
        visible: false,
        confirmLoading: false,
        record: {},
        onOk: null,
      },
    });
  };

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  handleTableChange = pagination => {
    this.setState({ pageNumber: pagination.current, pageSize: pagination.pageSize });
    this.findPage(pagination.current, pagination.pageSize, this.state.filter);
  };

  /** ********************************************************************************************* */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dailyAttendanceModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
    });
  };

  add = (id, values) => {
    const { dispatch } = this.props;
    const { pageSize, filter } = this.state;
    const {
      dailyAttendanceModel: { total },
    } = this.props;
    const num = ((total + 1) % pageSize !== 0) + (total + 1) / pageSize; // 计算页数，使新增后条跳到最后一页
    dispatch({
      type: 'dailyAttendanceModel/add',
      payload: values,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('新建日常考勤成功！');
            this.setState({ pageNumber: num });
            this.findPage(num, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  update = (id, values) => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    const payload = { id, ...values };
    dispatch({
      type: 'dailyAttendanceModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改日常考勤成功！');
            this.findPage(pageNumber, pageSize, filter);
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  delete = ids => {
    const { dispatch } = this.props;
    const { pageNumber, pageSize, filter } = this.state;
    const {
      dailyAttendanceModel: { total },
    } = this.props;
    const num =
      typeof ids === 'number' // 计算页数，使删除后不会跳到空白页
        ? parseInt((total - 1) / pageSize, 10) + ((total - 1) % pageSize > 0)
        : parseInt((total - ids.length) / pageSize, 10) + ((total - ids.length) % pageSize > 0);
    dispatch({
      type: 'dailyAttendanceModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除日常考勤成功！');
            if (pageNumber < num) {
              this.findPage(pageNumber, pageSize, filter);
            } else {
              this.setState({ pageNumber: num });
              this.findPage(num, pageSize, filter);
            }
            this.setState({ selectedRowKeys: [] });
            break;
          case ErrorCode.FAILURE:
            message.error('删除日常考勤失败！');
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  /** **************************************************************************** */

  setFilter = filter => {
    this.setState({ filter }); // 保存搜索框上的搜索条件
  };

  /** **********************组织机构树************************************************ */
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
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

  renderOrganization = () => {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    const tree = [
      {
        title: '国家统计局广西调查总队',
        key: '1',
        children: [
          {
            title: '办公室',
            key: '1-1',
          },
          {
            title: '综合处',
            key: '1-2',
          },
          {
            title: '制度方法处',
            key: '1-3',
          },
        ],
      },
      {
        title: '广西数航科技有限公司',
        key: '2',
      },
    ];
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={loop(tree)}
        />
      </div>
    );
  };

  /** ********************************************************************************************* */
  /** **********************日常考勤表**************************************************************** */

  renderAttendance = () => {
    const { pageNumber, pageSize, selectedRowKeys, addData, editData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const {
      loading,
      form,
      dailyAttendanceModel: { data = [], total },
    } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: pageNumber,
      pageSize,
      total,
    };
    return (
      <>
        <div>
          <div style={{ marginBottom: '16px' }}>
            <DailyAttendanceSearchBar
              form={form}
              paginationProps={paginationProps}
              setFilter={this.setFilter}
              onFind={this.findPage}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <span style={{ marginBottom: '16px', marginRight: '8px' }}>
              <Button icon="plus" type="primary" onClick={this.showAddModal}>
                新建
              </Button>
            </span>
            {selectedRowKeys.length > 0 ? (
              <span>
                <Popconfirm
                  title="您确认需要批量删除日常考勤吗？"
                  onConfirm={() => this.delete(selectedRowKeys)}
                >
                  <Button icon="delete">批量删除</Button>
                </Popconfirm>
              </span>
            ) : (
              ''
            )}
          </div>

          <Table
            rowKey="id"
            loading={loading}
            columns={this.columns}
            dataSource={data}
            pagination={paginationProps}
            rowSelection={rowSelection}
            onChange={this.handleTableChange}
            bordered
          />
        </div>

        <DailyAttendanceViewDrawer
          visible={this.state.viewVisible}
          data={this.state.viewData}
          onClose={this.hideDrawer}
        />
        {addData.visible && <DailyAttendanceAddModal {...addData} />}
        {editData.visible && <DailyAttendanceEditModal {...editData} />}
      </>
    );
  };

  /** *********************************************************************************************** */
  /** **************************展开与收起**************************************************** */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  renderSimpleList = () => (
    <PageHeaderWrapper title="日常考勤">
      <Card style={{ width: '20%', float: 'left', marginRight: '1%' }}>
        {this.renderOrganization()}
      </Card>
      <Card style={{ width: '79%', float: 'left' }}>
        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
          <LeftOutlined />
        </a>
        {this.renderAttendance()}
      </Card>
    </PageHeaderWrapper>
  );

  renderAdvancedList = () => (
    <PageHeaderWrapper title="日常考勤">
      <Card>
        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
          <RightOutlined />
        </a>
        {this.renderAttendance()}
      </Card>
    </PageHeaderWrapper>
  );

  /** *************************************************************************************** */
  render() {
    const { expandList } = this.state;
    return <div>{expandList ? this.renderAdvancedList() : this.renderSimpleList()}</div>;
  }
}

export default Form.create()(DailyAttendanceIndex);
