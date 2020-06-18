import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'

@connect(({
  pPersonnelFilesModel,
  pfilePoliticalStatusModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfilePoliticalStatusModel,
  loading,
}))
@Form.create()
export default class PoliticalStatus extends Component {

  columns = [
    {
      title: '政治面貌',
      dataIndex: 'politicalStatus',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      inputData: this.props.politicalOutlookDictData,
      valueName: 'politicalStatusId',
      labelName: 'politicalStatus',
      labelInValue: 1,
    },
    {
      title: '第二党派',
      dataIndex: 'secondFaction',
      ellipsis: true,
      editable: true,
      rule: true,
    },
    {
      title: '第三党派',
      dataIndex: 'thirdFaction',
      ellipsis: true,
      editable: true,
    },
    {
      title: '入党时间',
      dataIndex: 'joinTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'joinTime',
    },
    {
      title: '操作',
      render: (text, record) => {
        const { editRow, editingKey, isEditing } = this.props;
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => this.saveEdit(record)}
              style={{ marginRight: 8 }}
            >
              保存
            </a>
            <Popconfirm title="取消后编辑内容将不会被保存" onConfirm={() => this.cancelEditRow(record.id)}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
            <div>
              <a disabled={editingKey !== ''} onClick={() => editRow(record.id)}>
                编辑
        </a>
              <Divider type="vertical" />
              <Popconfirm title="删除后不可恢复，确定要操作吗？" onConfirm={() => this.deleteRow([record.id])}>
                <a disabled={editingKey !== ''}>删除</a>
              </Popconfirm>
            </div>
          );
      },
    },
  ];

  deleteRow = ids => {
    // const { personnelDelete } = this.props;
    // personnelDelete();
    const { dispatch, findPoliticalStatus, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfilePoliticalStatusModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findPoliticalStatus({ fileId: personnelInfo.id }, res => {
              setEditModalState({ politicalStatusColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('删除失败');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      }
    })
  }
  cancelEditRow = id => {
    const { setEditModalState, politicalStatusColumn } = this.props;
    if (typeof id === 'string') {
      politicalStatusColumn.forEach((item, index) => {
        if (item.id === id) {
          politicalStatusColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ politicalStatusColumn, editingKey: '' });
  };
  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      joinTime: values.joinTime ? moment(values.joinTime).format('YYYY-MM-DD HH:mm:ss') : '',
    }
  }

  saveEdit = record => {
    const thiz = this;
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (typeof record.id === 'string') {
          this.addWorkRecord(thiz.formValue(record, values));
        } else {
          this.updateWorkRecord(thiz.formValue(record, values));
        }
        this.cancelEditRow();
      }
    });
  };

  addWorkRecord = payload => {
    const { dispatch, findPoliticalStatus, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfilePoliticalStatusModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加政治面貌信息成功！');
            findPoliticalStatus({ fileId: personnelInfo.id }, res => {
              setEditModalState({ politicalStatusColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('添加政治面貌信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  updateWorkRecord = payload => {
    const { dispatch, findPoliticalStatus, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfilePoliticalStatusModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改政治面貌信息成功！');
            findPoliticalStatus({ fileId: personnelInfo.id }, res => {
              setEditModalState({ politicalStatusColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('修改政治面貌信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  getColumns = col => {
    const { isEditing, form } = this.props;
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        form,
        inputType: col.inputType,
        inputdata: col.inputData,
        dataIndex: col.dataIndex,
        dataname: col.dataName,
        dateName: col.dateName,
        labelinvalue: col.labelInValue,
        valueName: col.valueName,
        labelName: col.labelName,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  };

  newRow = () => {
    const { personnelInfo } = this.props;
    const row = {
      id: v4(),
      fileId: personnelInfo.id,
      name: '',
      afterOrgName: '',
      afterPositionName: '',
      isLeader: '',
      isLeaderMember: '',
      memberCategory: '',
      inSortNo: '',
      sortNo: '',
      afterServicedTime: '',
      docNo: '',
    };
    return row;
  };

  addRow = () => {
    const { editingKey, politicalStatusColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    politicalStatusColumn.push(row);
    setEditModalState({ politicalStatusColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      editingKey,
      politicalStatusColumn,
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchPoliticalStatus']}
          rowClassName="editable-row"
          size="small"
          dataSource={politicalStatusColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加学位信息
        </Button>
      </>
    )
  }
}
