import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'
@connect(({
  pPersonnelFilesModel,
  pfileExitModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileExitModel,
  loading,
}))
@Form.create()
export default class Exit extends Component {

  columns = [
    {
      title: '退出方式',
      dataIndex: 'manner',
      ellipsis: true,
      editable: true,
      inputType: 'disableParent',
      inputData: this.props.exitModeDictData,
      labelInValue: 1,
      valueName: 'mannerId',
      labelName: 'manner',
    },
    {
      title: '退出时间',
      dataIndex: 'exitTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'exitTime'
    },
    {
      title: '退出去向',
      dataIndex: 'destination',
      ellipsis: true,
      editable: true,
    },
    {
      title: '批准单位',
      dataIndex: 'authority',
      ellipsis: true,
      editable: true,
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
    const { dispatch, findExitInfo, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileExitModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findExitInfo({ fileId: personnelInfo.id }, res => {
              setEditModalState({ findExitColumn: res.data });
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
    const { setEditModalState, findExitColumn } = this.props;
    if (typeof id === 'string') {
      findExitColumn.forEach((item, index) => {
        if (item.id === id) {
          findExitColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ findExitColumn, editingKey: '' });
  };
  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      exitTime: values.exitTime ? moment(values.exitTime).format('YYYY-MM-DD HH:mm:ss') : '',
      manner: values.manner.label,
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
    const { dispatch, findExitInfo, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileExitModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加学位学历信息成功！');
            findExitInfo({ fileId: personnelInfo.id }, res => {
              setEditModalState({ findExitColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('添加学位学历信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  updateWorkRecord = payload => {
    const { dispatch, findExitInfo, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileExitModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改学位学历信息成功！');
            findExitInfo({ fileId: personnelInfo.id }, res => {
              setEditModalState({ findExitColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('修改学位学历信息失败！');
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
    };
    return row;
  };

  addRow = () => {
    const { editingKey, findExitColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    findExitColumn.push(row);
    setEditModalState({ findExitColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      editingKey,
      findExitColumn,
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchExit']}
          rowClassName="editable-row"
          size="small"
          dataSource={findExitColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加学位信息
        </Button>
      </>
    )
  }
}
