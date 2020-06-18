import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';

@connect(({
  pPersonnelFilesModel,
  pfilePositionLevelModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfilePositionLevelModel,
  loading,
}))
@Form.create()
export default class positionLevel extends Component {
  state = {
    status: 0,
  }



  colOnChange = item => {
    console.log("item", item)
    const { preJobLevelDictData, currentRankDictData } = this.props;
    this.setState({
      status: item.key,
    })
    this.props.form.setFieldsValue({ 'positionLevel': { label: '', value: '' } });
  }
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
              setEditModalState({ positionLevelColumn: res.data });
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
    const { setEditModalState, positionLevelColumn } = this.props;
    if (typeof id === 'string') {
      positionLevelColumn.forEach((item, index) => {
        if (item.id === id) {
          positionLevelColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ positionLevelColumn, editingKey: '' });
  };

  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      term: values.term ? moment(values.term).format('YYYY-MM-DD HH:mm:ss') : '',
      approvalTime: values.approvalTime ? moment(values.approvalTime).format('YYYY-MM-DD HH:mm:ss') : '',
      positionLevel: values.positionLevel.label,
      positionLevelId: values.positionLevel.value,
      positionCategory: values.positionCategory.label === '职级' ? '1' : '0',
    }
  }

  saveEdit = record => {
    const thiz = this;
    const { form: { validateFields } } = this.props;
    validateFields((err, values) => {
      console.log("value", values)
      if (!err) {
        if (typeof record.id === 'string') {
          this.addPositionLevel(thiz.formValue(record, values));
        } else {
          this.updatePositionLevel(thiz.formValue(record, values));
        }
        this.cancelEditRow();
      }
    });
  };

  addPositionLevel = payload => {
    console.log('payload :>> ', payload);
    const { dispatch, findPositionLevel, positionLevelColumn, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfilePositionLevelModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加职务信息成功！');
            findPositionLevel({ fileId: personnelInfo.id }, res => {
              setEditModalState({ positionLevelColumn: res.data });
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

  updatePositionLevel = payload => {
    console.log('payload :>> ', payload);
    const { dispatch, findPositionLevel, positionLevelColumn, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfilePositionLevelModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改职务信息成功！');
            findPositionLevel({ fileId: personnelInfo.id }, res => {
              setEditModalState({ positionLevelColumn: res.data });
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
    console.log("col", col)
    // console.log('col :>> ', col);
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
        labelinvalue: col.labelInValue,
        title: col.title,
        dateName: col.dateName,
        labelName: col.labelName,
        valueName: col.labelName,
        onChange: col.onChange,
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
    const { editingKey, positionLevelColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    positionLevelColumn.push(row);
    setEditModalState({ positionLevelColumn, editingKey: row.id });
  };

  render() {

    const columns = [
      {
        title: '类别（ 职务层次、职级标志）',
        inputData: [{ id: 0, dataName: '职务' }, { id: 1, dataName: '职级' }],
        dataIndex: 'positionCategory',
        width: 150,
        ellipsis: true,
        editable: true,
        dataName: 'dataName',
        inputType: 'list',
        labelInValue: 1,
        onChange: item => {
          this.colOnChange(item);
        },
        valueName: 'positionCategoryId',
        labelName: 'positionCategory',
      },
      {
        title: '职务层次（职级）',
        dataIndex: 'positionLevel',
        width: 150,
        ellipsis: true,
        editable: true,
        dataName: 'dataName',
        inputType: 'disableParent',
        inputData: this.state.status === 1 ? this.props.preJobLevelDictData : this.props.currentRankDictData,
        labelInValue: 1,
        valueName: 'positionLevelId',
        labelName: 'positionLevel',
      },
      {
        title: '批准日期',
        dataIndex: 'approvalTime',
        width: 150,
        ellipsis: true,
        editable: true,
        inputType: 'time',
        dateName: 'approvalTime',
      },
      {
        title: '批准文号',
        dataIndex: 'approvalNo',
        width: 150,
        ellipsis: true,
        editable: true,
      },
      {
        title: '终止日期',
        dataIndex: 'term',
        width: 150,
        ellipsis: true,
        editable: true,
        inputType: 'time',
        dateName: 'term',
      },
      {
        title: '状态',
        dataIndex: 'state',
        width: 150,
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
              <a onClick={() => this.saveEdit(record)} style={{ marginRight: 8 }}> 保存 </a>
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

    const {
      components,
      loading: { effects },
      positionLevelColumn,
      editingKey,
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchListPositionLevel']}
          rowClassName="editable-row"
          size="small"
          dataSource={positionLevelColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加信息
        </Button>
      </>
    )
  }
}
