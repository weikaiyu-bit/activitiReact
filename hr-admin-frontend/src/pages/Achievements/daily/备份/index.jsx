import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Icon, Tree, Input, Table, Popconfirm, Button, Divider } from 'antd';
import SearchBar from './components/searchBar';
import Addmodal from './components/addModal';
import Editmodal from './components/editModal';
import ViewDrawer from './components/viewDrawer';

const { Search } = Input;
const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
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
  for (let i = 0; i < data.length; i++) {
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
  for (let i = 0; i < tree.length; i++) {
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

class Daily extends Component {
  state = {
    expandList: false,
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    selectedRowKeys: [],
    addData: {
      visible: false,
      record: {},
    },
    editData: {
      visible: false,
      record: {},
    },
    viewData: {},
  };

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

  update = () => {};

  add = () => {};

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

  /** 展开/收起 */
  toggleForm = () => {
    const { expandList } = this.state;
    this.setState({
      expandList: !expandList,
    });
  };

  delete = () => {};

  onSelectChange = currySelectedRowKeys => {
    this.setState({ selectedRowKeys: currySelectedRowKeys });
  };

  // 任务列表
  renderTaskList = () => {
    const { selectedRowKeys, addData, editData } = this.state;
    const { form } = this.props;
    const columns = [
      {
        title: '名字',
        dataIndex: 'name',
        render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
      },
      {
        title: '年龄',
        dataIndex: 'age',
      },
      {
        title: '机构',
        dataIndex: 'jigou',
      },
      {
        title: '考勤时间',
        dataIndex: 'kqsj',
      },
      {
        title: '考勤地点',
        dataIndex: 'kqdd',
      },
      {
        title: '是否缺勤',
        dataIndex: 'sfqq',
      },
      {
        title: '缺勤原因',
        dataIndex: 'qqyy',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: (text, record) => (
          <>
            <a onClick={() => this.showEditModal(record)}>审阅</a>
            <Divider type="vertical" />
            <Popconfirm title="您确认删除干部培训吗？" onConfirm={() => this.delete(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: '张三',
        age: 32,
        jigou: '广西数航科技有限公司',
        kqsj: '考勤时间',
        kqdd: '考勤地点',
        sfqq: '是否缺勤',
        qqyy: '缺勤原因',
      },
      {
        key: '2',
        name: '李四',
        age: 42,
        jigou: '广西数航科技有限公司',
        kqsj: '考勤时间',
        kqdd: '考勤地点',
        sfqq: '是否缺勤',
        qqyy: '缺勤原因',
      },
      {
        key: '3',
        name: '赵六',
        age: 32,
        jigou: '广西数航科技有限公司',
        kqsj: '考勤时间',
        kqdd: '考勤地点',
        sfqq: '是否缺勤',
        qqyy: '缺勤原因',
      },
      {
        key: '4',
        name: '王五',
        age: 32,
        jigou: '广西数航科技有限公司',
        kqsj: '考勤时间',
        kqdd: '考勤地点',
        sfqq: '是否缺勤',
        qqyy: '缺勤原因',
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <div style={{ marginBottom: '16px' }}>
          <SearchBar form={form} />
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
                title="您确认需要批量删除考勤记录吗？"
                onConfirm={() => this.delete(selectedRowKeys)}
              >
                <Button icon="delete">批量删除</Button>
              </Popconfirm>
            </span>
          ) : (
            ''
          )}
        </div>
        <Table columns={columns} dataSource={data} rowSelection={rowSelection} />
        {this.state.viewVisible && (
          <ViewDrawer
            visible={this.state.viewVisible}
            {...this.state.viewData}
            onClose={this.hideDrawer}
          />
        )}
        {addData.visible && <Addmodal {...addData} />}
        {editData.visible && <Editmodal {...editData} />}
      </div>
    );
  };

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

  // 项目列表
  renderProjectList = () => {
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

  renderSimpleList() {
    return (
      <PageHeaderWrapper title="日常考勤">
        <Card style={{ width: '30%', float: 'left', marginRight: '1%' }}>
          {this.renderProjectList()}
        </Card>
        <Card style={{ width: '69%', float: 'left' }}>
          <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="left" />
          </a>
          {this.renderTaskList()}
        </Card>
      </PageHeaderWrapper>
    );
  }

  renderAdvancedList() {
    return (
      <PageHeaderWrapper title="日常考勤">
        <Card>
          {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
            <Icon type="right" />
          </a> */}
          {this.renderTaskList()}
        </Card>
      </PageHeaderWrapper>
    );
  }

  render() {
    // const { expandList } = this.state;
    return (
      <div>
        {/* {expandList ? this.renderAdvancedList() : this.renderSimpleList()} */}
        {this.renderAdvancedList()}
      </div>
    );
  }
}

export default Form.create()(Daily);
