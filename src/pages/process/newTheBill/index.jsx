import React, { Component } from 'react';
import { Card, Table, Tag, Button } from 'antd';
import ViewDrawer from './components/viewDrawer';

class NewTheBill extends Component {
  state = {
    visible: false,
  };

  hideEditModal = () => {
    this.setState({
      visible: false,
    });
  };

  onTheBill = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { visible } = this.state;
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
          <>
            {tags.map(tag => {
              let color = tag.length > 5 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <a>Invite {record.name}</a>
        ),
      },
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ];
    const viewDrawerData = {
      visible,
      onCancel: this.hideEditModal,
    };
    return (
      <Card>
        <Button type="primary" onClick={this.onTheBill}>
          填写请假单
        </Button>
        <Table columns={columns} dataSource={data} />
        <ViewDrawer {...viewDrawerData} />
      </Card>
    );
  }
}

export default NewTheBill;

