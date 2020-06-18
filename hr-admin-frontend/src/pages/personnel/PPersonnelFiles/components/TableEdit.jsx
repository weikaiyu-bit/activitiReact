
import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import { v4 } from 'uuid';
import DictionaryTree from '../../../components/dictionaryTree';

const data = [
  {
    id: 1,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 2,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 3,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 4,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 5,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 6,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 7,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 8,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
  {
    id: 9,
    key: '',
    name: '',
    uname: '',
    birthday: '',
    face: '',
    duties: '',
  },
];
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    const { inputType, inputdata, dataname, labelinvalue, fieldnames, onChange, disabled } = this.props;
    switch (inputType) {
      case 'number':
        return <InputNumber />;
      case 'list':
        return <DictionaryTree tree={inputdata} disabled={disabled} type="list" dataName={dataname} labelInValue={labelinvalue ? 1 : 0} />;
      case 'time':
        return <DatePicker />
      default:
        return <Input />;
    }


  };

  renderCell = getFieldDecorator => {
    const {
      editing,
      dataIndex,
      title,
      record,
      children,
      id
    } = this.props;
    console.log("record", record)
    return (
      <td>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex + record.id, {
              // rules: [
              //   {
              //     required: true,
              //     message: `Please Input ${title}!`,
              //   },
              // ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
            children
          )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

class EditableTable extends React.Component {

  state = { data, editingKey: '' };
  columns = [
    {
      title: '称谓',
      dataIndex: 'name',
      width: '15%',
      editable: true,
      inputType: 'list'
    },
    {
      title: '名称',
      dataIndex: 'uname',
      width: '15%',
      editable: true,
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      width: '15%',
      editable: true,
    },
    {
      title: '政治面貌',
      dataIndex: 'face',
      width: '15%',
      editable: true,
    },
    {
      title: '工作单位以职务',
      dataIndex: 'duties',
      width: '30%',
      editable: true,
    },

  ];

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ data: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ data: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  addRow = () => {
    const datas = [...this.state.data, { id: (this.state.data.length + 1), key: '', name: '', uname: '', birthday: '', face: '', duties: '' }]
    console.log("datas", datas)
    this.setState({
      data: datas
    })
  }

  tableRemove = () => {
    this.state.data.pop()
    this.setState({
      data: this.state.data
    })
  }
  render() {
    const components = {
      body: {
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
          id: v4(),
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),

      };
    });

    return (
      <EditableContext.Provider value={this.props.getFieldDecorator}>
        <Table
          components={components}
          bordered
          dataSource={this.state.data}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
        />
        <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={this.addRow}>
          添加行
        </Button>
        <Button style={{ width: '100%' }} type="dashed" icon="minus" onClick={this.tableRemove}>
          删除行
        </Button>
      </EditableContext.Provider>
    );
  }
}

export default EditableTable;
