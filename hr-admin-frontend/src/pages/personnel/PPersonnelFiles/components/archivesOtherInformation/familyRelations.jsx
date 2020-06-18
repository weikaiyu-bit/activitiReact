import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'

@connect(({
  pPersonnelFilesModel,
  pfileFamilyRelationsModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileFamilyRelationsModel,
  loading,
}))
@Form.create()
export default class FamilyRelations extends Component {

  columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      ellipsis: true,
      editable: true,
    },
    {
      title: '称谓',
      inputData: this.props.appellationDictData,
      dataIndex: 'appellation',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      dataName: 'dataName',
      labelInValue: 0,
    },
    {
      title: '出生时间',
      dataIndex: 'birthday',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'birthday',
    },
    {
      title: '政治面貌',
      dataIndex: 'politicalStatus',
      ellipsis: true,
      editable: true,
      dateName: 'politicalStatus',
    },
    {
      title: '工作单位及职务',
      dataIndex: 'companyPosition',
      ellipsis: true,
      editable: true,
      dateName: 'companyPosition',
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
    const { dispatch, findFamilyRelations, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileFamilyRelationsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findFamilyRelations({ fileId: personnelInfo.id }, res => {
              setEditModalState({ familyRelationsColumn: res.data });
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
    const { setEditModalState, familyRelationsColumn } = this.props;
    if (typeof id === 'string') {
      familyRelationsColumn.forEach((item, index) => {
        if (item.id === id) {
          familyRelationsColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ familyRelationsColumn, editingKey: '' });
  };
  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      birthday: values.birthday ? moment(values.birthday).format('YYYY-MM-DD HH:mm:ss') : '',
    }
  }

  saveEdit = record => {
    const thiz = this;
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      console.log("values", values)
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
    const { dispatch, findFamilyRelations, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileFamilyRelationsModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加家庭成员信息成功！');
            findFamilyRelations({ fileId: personnelInfo.id }, res => {
              setEditModalState({ familyRelationsColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('添加家庭成员信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  updateWorkRecord = payload => {
    const { dispatch, findFamilyRelations, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileFamilyRelationsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改家庭成员信息成功！');
            findFamilyRelations({ fileId: personnelInfo.id }, res => {
              setEditModalState({ familyRelationsColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('修改家庭成员信息失败！');
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
    const { editingKey, familyRelationsColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    familyRelationsColumn.push(row);
    setEditModalState({ familyRelationsColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      editingKey,
      familyRelationsColumn,
    } = this.props;
    console.log("familyRelationsColumn", familyRelationsColumn)
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchFamilyRelations']}
          rowClassName="editable-row"
          size="small"
          dataSource={familyRelationsColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加家庭成员信息
        </Button>
      </>
    )
  }
}
