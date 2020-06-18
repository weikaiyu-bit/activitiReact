import React, { Component } from 'react';
import { Popconfirm, Table, Form, message, Button, Divider } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { v4 } from 'uuid';
import moment from 'moment'
@connect(({
  pPersonnelFilesModel,
  pfileEducationalModel,
  loading
}) => ({
  pPersonnelFilesModel,
  pfileEducationalModel,
  loading,
}))
@Form.create()
export default class Education extends Component {

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
      title: '学历名称',
      dataIndex: 'educationName',
      ellipsis: true,
      editable: true,
      inputType: 'tree',
      inputData: this.props.educationCodeDictData,
      dataName: 'dataName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'educationNameId',
      labelName: 'educationName',
    },
    {
      title: '学位名称',
      dataIndex: 'degreeName',
      ellipsis: true,
      editable: true,
      inputType: 'disableParent',
      inputData: this.props.degreeCodeDictData,
      dataName: 'dataName',
      // 传Boolean值报警告，所以传1或0
      labelInValue: 1,
      valueName: 'degreeNameId',
      labelName: 'degreeName',

    },
    {
      title: '学校（单位）名称',
      dataIndex: 'schoolName',
      ellipsis: true,
      editable: true,
    },

    {
      title: '教育类别',
      dataIndex: 'educationCategory',
      ellipsis: true,
      editable: true,
      inputType: 'list',
      inputData: this.props.educationCategoryDictData,
      labelInValue: 1,
      valueName: 'educationCategoryId',
      labelName: 'educationCategory',
    },
    {
      title: '所学专业类别',
      dataIndex: 'majorCategory',
      ellipsis: true,
      editable: true,
      inputType: 'disableParent',
      inputData: this.props.majorCategoryDictData,
      labelInValue: 1,
      valueName: 'majorCategoryId',
      labelName: 'majorCategory',
    },
    {
      title: '所学专业名称',
      dataIndex: 'majorName',
      ellipsis: true,
      editable: true,
    },
    {
      title: '入学时间',
      dataIndex: 'enrollmentTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'enrollmentTime',
    },
    {
      title: '毕业时间',
      dataIndex: 'graduationTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'graduationTime',
    },
    {
      title: '学位授予时间',
      dataIndex: 'degreeTime',
      ellipsis: true,
      editable: true,
      inputType: 'time',
      dateName: 'degreeTime',
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
    const { dispatch, findEducational, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileEducationalModel/remove',
      payload: { ids },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('删除成功');
            findEducational({ fileId: personnelInfo.id }, res => {
              setEditModalState({ educationalColumn: res.data });
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
    const { setEditModalState, educationalColumn } = this.props;
    if (typeof id === 'string') {
      educationalColumn.forEach((item, index) => {
        if (item.id === id) {
          educationalColumn.splice(index, 1);
        }
      });
    }
    setEditModalState({ educationalColumn, editingKey: '' });
  };
  formValue = (record, values) => {
    return {
      ...record,
      ...values,
      enrollmentTime: values.enrollmentTime ? moment(values.enrollmentTime).format('YYYY-MM-DD HH:mm:ss') : '',
      graduationTime: values.graduationTime ? moment(values.graduationTime).format('YYYY-MM-DD HH:mm:ss') : '',
      degreeTime: values.degreeTime ? moment(values.degreeTime).format('YYYY-MM-DD HH:mm:ss') : '',
      educationName: values.educationName.label,
      educationCode: values.educationName.value,
      degreeName: values.degreeName.label,
      degreeCode: values.degreeName.value,
      majorCategory: values.majorCategory.label,
      majorCategoryCode: values.majorCategory.value,
      educationCategory: values.educationCategory.label,
      educationCategoryCode: values.educationCategory.key,
      outMark: values.outMark.label === '是' ? '1' : '0',
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
    const { dispatch, findEducational, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileEducationalModel/add',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('添加学位学历信息成功！');
            findEducational({ fileId: personnelInfo.id }, res => {
              setEditModalState({ educationalColumn: res.data });
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
    const { dispatch, findEducational, personnelInfo, setEditModalState } = this.props;
    dispatch({
      type: 'pfileEducationalModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            message.success('修改学位学历信息成功！');
            findEducational({ fileId: personnelInfo.id }, res => {
              setEditModalState({ educationalColumn: res.data });
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
    const { editingKey, educationalColumn, setEditModalState } = this.props;
    // if (editingKey !== '') return false;
    const row = this.newRow();
    educationalColumn.push(row);
    setEditModalState({ educationalColumn, editingKey: row.id });
  };

  render() {
    const {
      components,
      loading: { effects },
      editingKey,
      educationalColumn,
    } = this.props;
    return (
      <>
        <Table
          components={components}
          rowKey="id"
          columns={this.columns.map(this.getColumns)}
          loading={effects['pPersonnelFilesModel/fetchEducationalByPage']}
          rowClassName="editable-row"
          size="small"
          dataSource={educationalColumn}
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow} disabled={editingKey !== ''}>
          添加学位信息
        </Button>
      </>
    )
  }
}
