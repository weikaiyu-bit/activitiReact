/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at*/
import React, { PureComponent } from 'react';
import { Input, Card, Icon, Row, Divider, Spin, Tag } from 'antd';

/** 用户群列表过滤器
 * @author b__c<br> bc@dtsea.net<br>2018-10-10 22:27:53
 */
export default class MyProfile extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  render() {
    const { dataSource } = this.props;
    if (!dataSource) return false;

    let empolyee = dataSource;

    /**取出内部状态 */
    const { newTags, inputVisible, inputValue } = this.state;

    return (
      <Card >
        <div>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img
              alt=""
              src={empolyee.avatarUrl}
              style={{ width: '104px', height: '104px', marginBottom: '20px' }}
            />
            <div
              style={{
                fontSize: '20px',
                lineHeight: '28px',
                fontWeight: '500',
                color: '@heading-color',
              }}
            >
              {empolyee.nickname}
            </div>
            <div>{empolyee.userName}</div>
            <div>{empolyee.realName}</div>
          </div>
          <Divider style={{ marginTop: 16 }} dashed />
          <div>
            <p>
              <Icon type="shop" style={{ marginRight: 16 }} />
              {empolyee.groupName}
            </p>
            <p>
              <Icon type="shop" style={{ marginRight: 16 }} />
              {empolyee.companeName}
            </p>
            <p>
              <Icon type="team" style={{ marginRight: 16 }} />
              {empolyee.departmentName}
            </p>
            <p>
              <Icon type="mail" style={{ marginRight: 16 }} />
              {empolyee.email}
            </p>
            <p>
              <Icon type="phone" style={{ marginRight: 16 }} />
              {empolyee.mobile}
            </p>
            <p>
              <Icon type="environment" style={{ marginRight: 16 }} />
              {empolyee.address}
            </p>
          </div>
          {/*<Divider style={{ marginTop: 16 }} dashed />*/}
          {/*<div>*/}
          {/*<div>团队</div>*/}
          {/*<Spin>*/}
          {/*<Row gutter={36}>*/}
          {/*</Row>*/}
          {/*</Spin>*/}
          {/*</div>*/}
        </div>
      </Card>
    );
  }
}
