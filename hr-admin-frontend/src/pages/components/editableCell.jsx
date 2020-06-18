import React, { Component } from 'react';
import { Input, InputNumber, Form, DatePicker } from 'antd';
import DictionaryTree from './dictionaryTree';
import moment from 'moment';
class EditableCell extends Component {
  getInput = () => {
    const {
      inputType,
      inputdata,
      dataname,
      labelinvalue,
      fieldnames,
      onChange,
      disabled,
    } = this.props;
    switch (inputType) {
      case 'number':
        return <InputNumber />;
      case 'tree':
        return (
          <DictionaryTree
            tree={inputdata}
            type="tree"
            dataName={dataname}
            labelInValue={labelinvalue ? 1 : 0}
          />
        );
      case 'list':
        return (
          <DictionaryTree
            onChange={onChange}
            tree={inputdata}
            disabled={disabled}
            type="list"
            dataName={dataname}
            labelInValue={labelinvalue ? 1 : 0}
          />
        );
      case 'disableParent':
        return (
          <DictionaryTree
            tree={inputdata}
            type="disableParent"
            dataName={dataname}
            labelInValue={labelinvalue ? 1 : 0}
          />
        );
      case 'cascade':
        return (
          <DictionaryTree
            tree={inputdata}
            type="cascade"
            dataName={dataname}
            fieldNames={fieldnames}
          />
        );
      case 'time':
        return <DatePicker />;
      default:
        return <Input />;
    }
  };

  render() {
    const {
      editing,
      dataIndex,
      title,
      rules,
      inputType,
      record,
      index,
      children,
      form,
      labelName,
      valueName,
      dateName,
      labelinvalue,
      ...restProps
    } = this.props;
    if (editing && form) {
      const { getFieldDecorator } = form;
      let initialValue = record[dataIndex] || '';
      switch (inputType) {
        case 'cascade':
          initialValue = record[dataIndex] ? record[dataIndex].split('/') : [];
          break;
        case 'disableParent':
          initialValue = { label: record[labelName] || '', value: record[valueName] || '' };
          break;
        case 'tree':
          initialValue = { label: record[labelName] || '', value: record[valueName] || '' };
          break;
        case 'list':
          initialValue =
            labelinvalue == 1
              ? { label: record[labelName] || '', value: record[valueName] || '' }
              : record[valueName] || '';
          break;
        case 'time':
          initialValue =
            dateName && record[dateName] ? moment(record[dateName], 'YYYY-MM-DD HH:mm:ss') : '';
          break;
        default:
          break;
      }
      return (
        <td {...restProps}>
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(
              dataIndex,
              rules
                ? { rules: [{ required: true, message: `请输入${title}!` }], initialValue }
                : {},
            )(this.getInput())}
          </Form.Item>
        </td>
      );
    }
    return <td {...restProps}>{children}</td>;
  }
}
export default EditableCell;
