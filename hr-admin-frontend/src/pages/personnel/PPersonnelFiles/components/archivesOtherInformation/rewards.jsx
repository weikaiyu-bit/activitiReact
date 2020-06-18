import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'
@connect(({
  pPersonnelFilesModel,
  pfileRewardsPunishmentsModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileRewardsPunishmentsModel,
  loading,
}))
@Form.create()
export default class WorkRecord extends Component {
  columns = [
    {
      title: '输出标识',
      dataIndex: 'outMark',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      inputData: [{ id: 1, dataName: '是' }, { id: 0, dataName: '否' }],
      dataName: 'dataName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'outMarkId',
      labelName: 'outMark',
    },
    {
      title: '奖惩名称',
      dataIndex: 'name',
      ellipsis: true,
      editable: true,
      inputType: 'disableParent',
      inputData: this.props.rewardPunishmentCodeDictData,
      dataName: 'dataName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'code',
      labelName: 'name',
    },
    {
      title: '受奖惩时职务层次',
      dataIndex: 'positionLevel',
      ellipsis: true,
      editable: true,
      inputType: 'disableParent',
      inputData: this.props.preJobLevelDictData,
      dataName: 'dataName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'positionLevelId',
      labelName: 'positionLevel',

    },
    {
      title: '批准机关级别',
      dataIndex: 'approvalAuthorityLevel',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      inputData: this.props.organizationLevelDictData,
      labelInValue: 1,
      valueName: 'approvalAuthorityLevelId',
      labelName: 'approvalAuthorityLevel',
    },

    {
      title: '批准机关性质',
      dataIndex: 'approvalAuthorityNature',
      ellipsis: true,
      editable: true,
      inputType: 'disableParent',
      inputData: this.props.natureAgencyDictData,
      labelInValue: 1,
      valueName: 'approvalAuthorityNatureId',
      labelName: 'approvalAuthorityNature',
    },
    {
      title: '批准日期',
      dataIndex: 'approvalTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'approvalTime',
    },
    {
      title: '撤销日期',
      dataIndex: 'revocationTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'revocationTime',
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
    const { dispatch, findRewardsPunishments, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileRewardsPunishmentsModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findRewardsPunishments({ fileId: personnelInfo.id }, res => {
              setEditModalState({ rewardsColumn: res.data });
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
    const { setEditModalState, rewardsColumn } = this.props;
    if (typeof id === 'string') {
      rewardsColumn.forEach((item, index) => {
        if (item.id === id) {
          rewardsColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ rewardsColumn, editingKey: '' });
  };

  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      approvalTime: values.approvalTime ? moment(values.approvalTime).format('YYYY-MM-DD HH:mm:ss') : '',
      revocationTime: values.revocationTime ? moment(values.revocationTime).format('YYYY-MM-DD HH:mm:ss') : '',
      positionLevel: values.positionLevel.label,
      code: values.name.value,
      name: values.name.label,
      approvalAuthorityLevel: values.approvalAuthorityLevel.label,
      approvalAuthorityNature: values.approvalAuthorityNature.label,
      outMark: values.outMark.label === '是' ? '1' : '0',
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
    const { dispatch, findRewardsPunishments, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileRewardsPunishmentsModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加惩罚信息成功！');
            findRewardsPunishments({ fileId: personnelInfo.id }, res => {
              setEditModalState({ rewardsColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('添加惩罚信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  updateWorkRecord = payload => {
    const { dispatch, findRewardsPunishments, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileRewardsPunishmentsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改惩罚信息成功！');
            findRewardsPunishments({ fileId: personnelInfo.id }, res => {
              setEditModalState({ rewardsColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('修改惩罚信息失败！');
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
    const { editingKey, rewardsColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    rewardsColumn.push(row);
    setEditModalState({ rewardsColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      rewardsColumn,
      editingKey,
      rewardPunishmentCodeDictData,
      organizationLevelDictData
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchRewardsPunishments']}
          rowClassName="editable-row"
          size="small"
          dataSource={rewardsColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加惩罚信息
        </Button>
      </>
    )
  }
}
