
import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';


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

export default EditableCell;

