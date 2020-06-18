
import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';

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
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = getFieldDecorator => {
    const {
      editing,
      dataIndex,
      title,
      record,
      children,
    } = this.props;
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
  constructor(props) {
    super(props);
    this.state = { data, editingKey: '' };
    this.columns = [
      {
        title: '称谓',
        dataIndex: 'name',
        width: '15%',
        editable: true,
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
  }

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
      </EditableContext.Provider>
    );
  }
}

export default EditableTable;
