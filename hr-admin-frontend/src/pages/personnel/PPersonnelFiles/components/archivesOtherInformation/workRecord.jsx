import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'
@connect(({
  pPersonnelFilesModel,
  pfileWorkRecordModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileWorkRecordModel,
  loading,
}))
@Form.create()
export default class WorkRecord extends Component {

  state = {
    isMemberCategory: false
  }
  columns = [
    {
      title: '任职机构',
      dataIndex: 'afterOrgName',
      width: 150,
      ellipsis: true,
      editable: true,
      inputType: 'tree',
      inputData: this.props.organizationData,
      dataName: 'orgName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'afterOrgId',
      labelName: 'afterOrgName',
    },
    {
      title: '职务名称',
      dataIndex: 'afterPositionName',
      width: 150,
      ellipsis: true,
      editable: true,
    },
    {
      title: '是否领导职务',
      dataIndex: 'isLeader',
      inputType: 'list',
      inputData: [{ id: 1, dataName: '是' }, { id: 0, dataName: '否' }],
      width: 100,
      ellipsis: true,
      editable: true,
      labelInValue: 1,
      valueName: 'isLeaderId',
      labelName: 'isLeader',
    },
    {
      title: '是否领导成员',
      dataIndex: 'isLeaderMember',
      inputType: 'list',
      inputData: [{ id: 1, dataName: '是' }, { id: 0, dataName: '否' }],
      width: 100,
      ellipsis: true,
      editable: true,
      labelInValue: 1,
      valueName: 'isLeaderMemberId',
      labelName: 'isLeaderMember',
      onChange: item => {
        this.colOnChange(item);
      },
    },
    {
      title: '成员类别',
      inputType: 'list',
      inputData: this.props.memberCategoryData,
      dataIndex: 'memberCategory',
      width: 80,
      onDisable: true,
      ellipsis: true,
      editable: true,
      labelInValue: 1,
      valueName: 'memberCategoryId',
      labelName: 'memberCategory',
    },
    {
      title: '职务排序',
      dataIndex: 'sortNo',
      width: 80,
      ellipsis: true,
      editable: true,
    },
    {
      title: '集体内排序',
      dataIndex: 'inSortNo',
      width: 90,
      ellipsis: true,
      editable: true,
    },
    {
      title: '任职时间',
      dataIndex: 'afterServicedTime',
      width: 100,
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'afterServicedTime',
    },
    {
      title: '任职文号',
      dataIndex: 'docNo',
      width: 80,
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
    const { dispatch, findWorkRecord, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileWorkRecordModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findWorkRecord({ fileId: personnelInfo.id }, res => {
              setEditModalState({ workRecordColumn: res.data });
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
    const { setEditModalState, workRecordColumn } = this.props;
    if (typeof id === 'string') {
      workRecordColumn.forEach((item, index) => {
        if (item.id === id) {
          workRecordColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ workRecordColumn, editingKey: '' });
  };

  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      afterOrgId: values.afterOrgName.value,
      afterOrgName: values.afterOrgName.label,
      memberCategoryId: values.memberCategory.value,
      memberCategory: values.memberCategory.label,
      afterServicedTime: values.afterServicedTime ? moment(values.afterServicedTime).format('YYYY-MM-DD HH:mm:ss') : '',
      isLeaderMember: values.isLeaderMember.label === '是' ? '1' : '0',
      isLeader: values.isLeaderMember.label === '是' ? '1' : '0',
    }
  }
  saveEdit = record => {
    const thiz = this;
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      if (!err) {
        if (typeof record.id === 'string') {
          this.addWorkRecord(this.addWorkRecord(thiz.formValue(record, values)));
        }
        else {
          this.updateWorkRecord(thiz.formValue(record, values));
        }
        this.cancelEditRow();
      }
    });
  };

  addWorkRecord = payload => {
    const { dispatch, findWorkRecord, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/addWorkRecord',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加职务信息成功！');
            findWorkRecord({ fileId: personnelInfo.id }, res => {
              setEditModalState({ workRecordColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('添加职务信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  updateWorkRecord = payload => {
    const { dispatch, findWorkRecord, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pPersonnelFilesModel/updateWorkRecord',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改职务信息成功！');
            findWorkRecord({ fileId: personnelInfo.id }, res => {
              setEditModalState({ workRecordColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('修改职务信息失败！');
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
    const { isMemberCategory } = this.state;
    if (!col.editable) {
      return col;
    }
    console.log('col', col);
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
        disabled: col.onDisable === true ? isMemberCategory : false,
        onChange: col.onChange,
        editing: isEditing(record),
      }),
    };
  };
  colOnChange = item => {
    if (item && item.label === '是') {
      this.setState({
        isMemberCategory: false
      })
    } else if (item && item.label === '否') {
      this.setState({
        isMemberCategory: true
      })
    }
    this.setFieldsValue();
  }
  setFieldsValue = () => {
    if (!this.state.isMemberCategory) {
      this.props.form.setFieldsValue({ 'memberCategory': { label: '', value: '' } })
    }
  }
  newRow = () => {
    const { personnelInfo } = this.props;
    const row = {
      id: v4(),
      fileId: personnelInfo.id,
      name: personnelInfo.name,
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
    const { editingKey, workRecordColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    workRecordColumn.push(row);
    setEditModalState({ workRecordColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      workRecordColumn,
      editingKey,
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchListWorkRecord']}
          rowClassName="editable-row"
          size="small"
          dataSource={workRecordColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加信息
        </Button>
      </>
    )
  }
}