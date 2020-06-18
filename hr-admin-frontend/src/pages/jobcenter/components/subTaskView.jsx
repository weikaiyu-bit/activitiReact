import React, { Component } from 'react';
import { v4 } from 'uuid';
import { Divider, Popconfirm, Progress, Table, Tag, Button, Input, Select, Form } from 'antd';
import { connect } from 'dva';
import JobTasksViewDrawer from '../JobTasks/components/viewDrawer';

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);
const EditableFormRow = Form.create()(EditableRow);
@connect(({ myJobsModel, loading }) => ({
  myJobsModel,
  loading,
}))
export default class SubTaskView extends Component {
  state = {
    viewData: {
      visible: false,
    },
    treeData: [],
    editingId: '',
    expandedRowKeys: [],
    row: {},
  };

  columns = [
    {
      title: '任务名称',
      dataIndex: 'taskName',
      editable: true,
      render: (text, record) => <a onClick={() => this.showDrawer(record)}>{text}</a>,
    },
    {
      title: '责任人',
      dataIndex: 'executorName',
      editable: true,
    },
    {
      title: '任务状态',
      dataIndex: 'taskStatus',
      editable: true,
      render(text) {
        // let text = (typeof record == 'object')? record.status: record;
        let color = '';
        switch (text) {
          case 'editing':
            text = '编辑中';
            color = 'orange';
            break;
          case 'planning':
            text = '计划中';
            color = 'lime';
            break;
          case 'doing':
            text = '进行中';
            color = 'cyan';
            break;
          case 'completed':
            text = '已完成';
            color = 'blue';
            break;
          case 'delay':
            text = '已逾期';
            color = 'magenta';
            break;
          case 'pause':
            text = '暂缓';
            color = '#CCCCCC';
            break;
          case 'undone':
            text = '已撤销';
            color = '#666666';
            break;
          case 'refuse':
            text = '已驳回';
            color = '#666666';
            break;
          default:
            break;
        }
        return (
          <Tag color={color} style={{ width: 52, textAlign: 'center' }}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: '任务进度',
      dataIndex: 'progress',
      render(text, record) {
        return <Progress percent={parseInt(record.progress, 10)} size="small" />;
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => {
        const isEditing = this.isEditing(record);
        const { editingId } = this.state;
        return (
          <>
            {isEditing ? (
              <span>
                <EditableContext.Consumer>
                  {form => (
                    <a onClick={() => this.saveData(form, record.id)} style={{ marginRight: 8 }}>
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="确认撤销编辑？" onConfirm={() => this.cancelEdit(record.id)}>
                  <a>取消</a>
                </Popconfirm>
              </span>
            ) : (
              <>
                <a
                  style={editingId !== '' ? { color: '#b8b8b8', cursor: 'not-allowed' } : {}}
                  onClick={() => this.handleAdd(record)}
                >
                  添加子任务
                </a>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确认删除任务信息吗？"
                  onConfirm={() => this.deleteTask(record)}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
            )}
          </>
        );
      },
    },
  ];

  componentDidMount() {
    const { treeData } = this.props.myJobsModel;
    this.setState({
      treeData,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { treeData } = nextProps.myJobsModel;
    this.setState({
      treeData,
    });
  }

  isEditing = record => record.id === this.state.editingId;

  cancelEdit = id => {
    const { treeData } = this.state;
    // 如果类型为STRING，表示为未提交的新建表单。
    if (typeof id === 'string') {
      this.removeChildNode(treeData, id);
    }
    this.setState({ treeData, editingId: '' });
  };

  showDrawer = record => {
    const { onFindTaskTree, dataSource } = this.props;
    this.setState({
      viewData: {
        visible: true,
        onClose: this.hideDrawer,
        selectedItem: record,
        onFindTaskTree,
        dataSource,
      },
    });
  };

  hideDrawer = () => {
    this.setState({
      viewData: {
        visible: false,
      },
    });
  };

  setChildNode = (treeData, targetId, row) => {
    for (let i = 0; i < treeData.length; i += 1) {
      if (treeData[i].id === targetId) {
        if (treeData[i].children) {
          treeData[i].children.push(row);
        } else {
          treeData[i].children = [row];
        }
        return;
      }
      if (treeData[i].children) {
        this.setChildNode(treeData[i].children, targetId, row);
      }
    }
  };

  removeChildNode = (treeData, targetId) => {
    for (let i = 0; i < treeData.length; i += 1) {
      if (treeData[i].id === targetId) {
        treeData.splice(i, 1);
        return;
      }
      if (treeData[i].children) {
        this.removeChildNode(treeData[i].children, targetId);
      }
    }
  };

  /**
   * 添加一行并进入编辑状态
   */
  handleAdd = record => {
    const { treeData, expandedRowKeys, editingId } = this.state;
    if (editingId !== '') return;
    // 如果record不存在，表示在根节点添加
    if (treeData && !record) {
      const row = this.newRow();
      treeData.push(row);
      // 设置子组件属性
      this.setState({ treeData, editingId: row.id, row });
      // 如果record存在，表示在子节点添加
    } else if (treeData && record) {
      const row = this.newRow(record.id);
      this.setChildNode(treeData, record.id, row);
      // 查询expandedRowKeys数组是否已存在对应id，若已存在，则不再次插入对应id
      const index = expandedRowKeys.findIndex(item => item === record.id);
      if (index === -1) expandedRowKeys.push(record.id);
      this.setState({
        treeData,
        editingId: row.id,
        expandedRowKeys,
        row,
      });
    }
  };

  newRow = pid => {
    const { dataSource } = this.props;
    const row = {
      id: v4(),
      pid: pid || dataSource.id,
      appId: dataSource.appId,
      tenantId: dataSource.tenantId,
      projectId: dataSource.projectId,
      projectName: dataSource.projectName,
      projectLogo: dataSource.projectLogo,
      logoColor: dataSource.logoColor,
      taskName: '',
      executorName: '',
      taskStatus: '',
      progress: '',
    };
    return row;
  };

  saveData = form => {
    form.validateFields((error, values) => {
      if (error) {
        return;
      }
      const { row } = this.state;
      const { onSaveTask, dataSource } = this.props;
      onSaveTask({ ...row, ...values }, dataSource.id);
      this.setState({ editingId: '' });
    });
  };

  deleteTask = record => {
    const { getIds, onRemoveTask, dataSource } = this.props;
    const ids = [];
    getIds(record, ids);
    onRemoveTask(ids, dataSource.id);
  };

  onExpandTable = (expand, record) => {
    const { expandedRowKeys } = this.state;
    if (expand) {
      expandedRowKeys.push(record.id);
    } else {
      expandedRowKeys.splice(
        expandedRowKeys.findIndex(item => record.id === item),
        1,
      );
    }
    this.setState({
      expandedRowKeys,
    });
  };

  render() {
    const {
      loading: { effects },
    } = this.props;
    const { viewData, treeData, editingId, expandedRowKeys } = this.state;
    const disabled = editingId !== '';

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <>
        <Table
          rowKey="id"
          loading={effects['myJobsModel/fetchTaskTree']}
          columns={columns}
          dataSource={treeData}
          pagination={false}
          onChange={this.handleTableChange}
          size="small"
          components={components}
          expandedRowKeys={expandedRowKeys}
          onExpand={this.onExpandTable}
        />
        <Button
          type="dashed"
          style={{ width: '100%', marginBottom: 8 }}
          disabled={disabled}
          icon="plus"
          onClick={() => this.handleAdd()}
        >
          添加任务
        </Button>
        {viewData.visible && <JobTasksViewDrawer {...viewData} />}
      </>
    );
  }
}
/* ***************************************************************** */

class EditableCell extends Component {
  getInput = () => {
    const { dataIndex } = this.props;
    if (dataIndex === 'executorName') {
      return <Input style={{ maxWidth: 85 }} />;
    }
    if (dataIndex === 'taskName') {
      return <Input style={{ maxWidth: 400 }} />;
    }
    if (dataIndex === 'taskStatus') {
      return (
        <Select style={{ width: 101 }}>
          <Select.Option value="editing">编辑中</Select.Option>
          <Select.Option value="planning">计划中</Select.Option>
          <Select.Option value="doing">进行中</Select.Option>
          <Select.Option value="completed">已完成</Select.Option>
          <Select.Option value="pause">暂缓</Select.Option>
          <Select.Option value="undone">已撤销</Select.Option>
          <Select.Option value="delay">已逾期</Select.Option>
          <Select.Option value="refuse">已驳回</Select.Option>
        </Select>
      );
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `请输入${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
