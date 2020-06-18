import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'
@connect(({
  pPersonnelFilesModel,
  pfileAnnualAppraisalNarrativeModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileAnnualAppraisalNarrativeModel,
  loading,
}))
@Form.create()


export default class AnnualAppraisal extends Component {


  columns = [
    {
      title: '考核年度',
      dataIndex: 'year',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      inputData: this.props.timeData,
      dataName: 'dataName',
      labelInValue: 1,
      valueName: 'id',
      labelName: 'year',
    },
    {
      title: '考核结论',
      dataIndex: 'conclusion',
      ellipsis: true,
      editable: true,
      inputType: 'tree',
      inputData: this.props.assessmentConclusionDictData,
      dataName: 'dataName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'conclusionId',
      labelName: 'conclusion',
    },
    {
      title: '考核描述',
      dataIndex: 'description',
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
    const { findAnnualAppraisalNarrative, personnelInfo, setEditModalState } = this.props;

    const { dispatch } = this.props;
    dispatch({
      type: 'pfileAnnualAppraisalNarrativeModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findAnnualAppraisalNarrative({ fileId: personnelInfo.id }, res => {
              setEditModalState({ annualAppraisalColumn: res.data });
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
    const { setEditModalState, annualAppraisalColumn } = this.props;
    if (typeof id === 'string') {
      annualAppraisalColumn.forEach((item, index) => {
        if (item.id === id) {
          annualAppraisalColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ annualAppraisalColumn, editingKey: '' });
  };
  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      conclusion: values.conclusion.label,
      year: values.year.label,
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
    const { dispatch, findAnnualAppraisalNarrative, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileAnnualAppraisalNarrativeModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加考核信息成功！');
            findAnnualAppraisalNarrative({ fileId: personnelInfo.id }, res => {
              setEditModalState({ annualAppraisalColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('添加考核信息失败！');
            break;
          default:
            message.warning(response.msg);
            break;
        }
      },
    });
  };

  updateWorkRecord = payload => {
    const { dispatch, findAnnualAppraisalNarrative, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileAnnualAppraisalNarrativeModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改考核信息成功！');
            findAnnualAppraisalNarrative({ fileId: personnelInfo.id }, res => {
              setEditModalState({ annualAppraisalColumn: res.data });
            });
            break;
          case ErrorCode.FAILURE:
            message.error('修改考核信息失败！');
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
        timeType: col.timeType,
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
      year: '',
      description: ''

    };
    return row;
  };

  addRow = () => {
    const { editingKey, annualAppraisalColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    annualAppraisalColumn.push(row);
    setEditModalState({ annualAppraisalColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      editingKey,
      annualAppraisalColumn,
      assessmentConclusionDictData
    } = this.props;
    console.log("timeData", this.props.timeData)
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchAnnualAppraisalNarrative']}
          rowClassName="editable-row"
          size="small"
          dataSource={annualAppraisalColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加考核信息
        </Button>
      </>
    )
  }
}
