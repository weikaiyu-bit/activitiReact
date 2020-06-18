import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'
@connect(({
  pPersonnelFilesModel,
  pfileProfessionalTechnicalQualificationModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileProfessionalTechnicalQualificationModel,
  loading,
}))
@Form.create()

export default class Technical extends Component {

  columns = [
    {
      title: '输出标识',
      dataIndex: 'outputFlag',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      inputData: [{ id: 1, dataName: '是' }, { id: 2, dataName: '否' }],
      labelInValue: 1,
      valueName: 'outputFlagId',
      labelName: 'outputFlag',
    },
    {
      title: '专业技术资格名称',
      dataIndex: 'ptqName',
      inputType: 'disableParent',
      ellipsis: true,
      editable: true,
      inputData: this.props.professionalAndTechnicalTitleDictData,
      labelInValue: 1,
      valueName: 'ptqNameId',
      labelName: 'ptqName',
    },
    {
      title: '获取资格日期',
      dataIndex: 'ptqTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'ptqTime'
    },
    {
      title: '获取资格途径',
      dataIndex: 'ptFrom',
      inputType: 'list',
      ellipsis: true,
      editable: true,
      inputData: this.props.accessQualificationDictData,
      dataName: 'dataName',
      labelInValue: 1,
      valueName: 'ptFromId',
      labelName: 'ptFrom',
    },
    {
      title: '评委会或考试名称',
      dataIndex: 'examinationName',
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
    const { dispatch, findTechnicalQualification, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileEducationalModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findTechnicalQualification({ fileId: personnelInfo.id }, res => {
              setEditModalState({ technicalColumn: res.data });
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
    const { setEditModalState, technicalColumn } = this.props;
    if (typeof id === 'string') {
      technicalColumn.forEach((item, index) => {
        if (item.id === id) {
          technicalColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ technicalColumn, editingKey: '' });
  };
  formValue = (record, values) => {
    console.log("values", values)
    return {
      ...record,
      ...values,
      ptqTime: values.ptqTime ? moment(values.ptqTime).format('YYYY-MM-DD HH:mm:ss') : '',
      ptqName: values.ptqName.label,
      ptqCode: values.ptqName.value,
      ptFrom: values.ptFrom.label,
      outputFlag: values.outputFlag.label === '是' ? '1' : '0',
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
    const { dispatch, findTechnicalQualification, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileProfessionalTechnicalQualificationModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加学位学历信息成功！');
            findTechnicalQualification({ fileId: personnelInfo.id }, res => {
              setEditModalState({ technicalColumn: res.data });
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
    const { dispatch, findTechnicalQualification, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileProfessionalTechnicalQualificationModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改学位学历信息成功！');
            findTechnicalQualification({ fileId: personnelInfo.id }, res => {
              setEditModalState({ technicalColumn: res.data });
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
    const { editingKey, technicalColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    technicalColumn.push(row);
    setEditModalState({ technicalColumn, editingKey: row.id });
  };


  render() {
    const {
      components,
      loading: { effects },
      editingKey,
      technicalColumn,
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchTechnicalQualification']}
          rowClassName="editable-row"
          size="small"
          dataSource={technicalColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加专业技术任职信息
        </Button>
      </>
    )
  }
}
