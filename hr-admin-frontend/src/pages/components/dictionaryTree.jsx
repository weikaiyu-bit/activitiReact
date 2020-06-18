import React, { Component } from 'react';
import { Tree, TreeSelect, Select, Cascader } from 'antd';
import { FolderAddOutlined, FileTextOutlined } from '@ant-design/icons';

const { TreeNode } = Tree;
const { Option } = Select;

export default class dictionaryTree extends Component {
  // 处理成树的结构数据
  disableParentTreeNodes = (tree, dataName) => {
    const newTree = tree.map(item => {
      if (item.children) {
        if (item.nodeType === 'data') {
          return (
            <TreeNode
              title={item[dataName]}
              value={item.id}
              key={item.id}
              icon={<FolderAddOutlined />}
              dataRef={item}
            >
              {this.disableParentTreeNodes(item.children, dataName)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item[dataName]}
            value={item.id}
            key={item.id}
            icon={<FolderAddOutlined />}
            dataRef={item}
            disabled
          >
            {this.disableParentTreeNodes(item.children, dataName)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item[dataName]}
          value={item.id}
          icon={<FileTextOutlined color="red" />}
          key={item.id}
          dataRef={item}
        />
      );
    });
    return newTree;
  };

  renderTreeNodes = (tree, dataName) => {
    const newTree = tree.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={item[dataName]}
            value={item.id}
            key={item.id}
            icon={<FolderAddOutlined />}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children, dataName)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item[dataName]}
          value={item.id}
          key={item.id}
          icon={<FolderAddOutlined />}
          dataRef={item}
        ></TreeNode>
      );
    });
    return newTree;
  };

  renderOption = (list, dataName) => {
    const options = [];
    list.forEach(item => {
      options.push(<Option value={item.id}>{item[dataName]}</Option>);
    });
    return options;
  };

  renderTreeNode = (tree, type, dataName, labelInValue, value, width, disabled) => {
    const { onChange, fieldNames } = this.props;
    switch (type) {
      case 'list':
        return (
          <Select
            style={{ width }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            onChange={onChange}
            disabled={disabled}
            labelInValue={labelInValue}
            value={value}
            allowClear={true}
          >
            {this.renderOption(tree, dataName)}
          </Select>
        );
      case 'tree':
        return (
          <TreeSelect
            allowClear={true}
            style={{ width }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            onChange={onChange}
            treeIcon
            disabled={disabled}
            labelInValue={labelInValue}
            value={value}
          >
            {this.renderTreeNodes(tree, dataName)}
          </TreeSelect>
        );
      case 'disableParent':
        return (
          <TreeSelect
            style={{ width }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择"
            onChange={onChange}
            treeIcon
            labelInValue={labelInValue}
            value={value}
          >
            {this.disableParentTreeNodes(tree, dataName)}
          </TreeSelect>
        );
      case 'cascade':
        // fieldNames 自定义 options 中 label name children 的字段
        return (
          <Cascader
            options={tree}
            placeholder="请选择"
            value={value}
            fieldNames={fieldNames || { label: 'label', value: 'value', children: 'children' }}
            onChange={selected => {
              onChange(selected);
            }}
          />
        );
      default:
        return false;
    }
  };

  render() {
    // 只适用于数据字典数据
    // type: 传入列表的类型
    // list:普通列表
    // tree:父节点可选树
    // disableParent:父节点不可选树
    // cascade:级联选择器 返回值为数组，如：["zhejiang", "hangzhou", "xihu"]

    // dataName: 传入需要获取的相应dataName字段名，如areaName 默认为dataName
    // labelInValue: 传入是否需要获取key+value对象，如果需要则传入true,默认为false,只返回key  不适用于级联选择器
    const { tree, type, value } = this.props;
    if (!tree || !type) return false;
    let { dataName, labelInValue, width, disabled } = this.props;
    dataName = dataName || 'dataName';
    labelInValue = !!labelInValue;
    width = width || '100%';
    disabled ? disabled : false;
    return <>{this.renderTreeNode(tree, type, dataName, labelInValue, value, width, disabled)}</>;
  }
}
