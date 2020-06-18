/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Card, List, Avatar, Button, Input, message } from 'antd';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import styles from '../style.less';
import RemindView from './RemindView';

const { Search } = Input;
/**
 * 待办事项
 * @author b__c<br> bc@dsea.net<br>2018-12-08 15:20:05
 */
@connect(({ noticeListModel, loading, user }) => ({
  noticeListModel,
  user,
  loading,
}))
export default class MessageBoardView extends PureComponent {
  state = {
    data: [],
    // 长列表加载
    pageNumber: 1,
    pageSize: 10,
    Edmund: false,
    total: 0,
  };

  componentDidMount () {
    const { pageNumber, pageSize, filter } = this.state;
    // this.findPage(pageNumber, pageSize, filter);
    setTimeout(() => this.findPage(pageNumber, pageSize), 1000);
    // this.interval = setInterval(() => this.getNew(), 10000);
  }

  // componentWillUnmount () {
  //   clearInterval(this.interval);
  // }

  findPage = (pageNumber, pageSize) => {
    const { dispatch } = this.props;
    const { user } = this.props;
    const { currentUser } = user
    const { id } = currentUser
    const { data } = this.state
    dispatch({
      type: 'noticeListModel/getRemind',
      payload: {
        ownerUid: id,
        notifyType: 'remind',
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            //  console.log(this.props.noticeListModel)
            // 设置数据
            // setTimeout(() => this.pullRemind(id), 1000);
            if (response.data.length !== 0) {
              this.setState(prevState => ({
                data: prevState.data.concat(this.props.noticeListModel.remindType),
              }));
              this.setState({
                total: this.props.noticeListModel.total,
              })
            } else {
              this.setState({
                Edmund: true,
              });
            }
            break;
          case ErrorCode.FAILURE:
            message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  }

  pullRemind = uid => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/pullRemind',
      payload: {
        uid,
      },
      // callback: response => {
      //   const { pageNumber, pageSize, filter } = this.state;
      //   // this.findPage(pageNumber, pageSize, filter);
      //   // setTimeout(() => this.findPage(pageNumber, pageSize), 1000);
      // },
    });
  };

  renderDate = item => (item.createAt ? moment(item.createAt).fromNow() : '');

  onScroll = e => {
    if (e.target.scrollTop === e.target.scrollHeight) {
      // 滚动到底部，可以继续发请求获取数据或干点什么
      console.log(e.target.scrollTop)
    }
    if (e.target.scrollHeight - e.target.scrollTop === 800) {
      const { Edmund } = this.state;
      if (!Edmund) {
        this.setState(prevState => ({
          pageNumber: prevState.pageNumber + 1,
        }));
        const { pageNumber, pageSize } = this.state;
        this.findPage(pageNumber, pageSize);
      }
    }
  }

  render () {
    const { user } = this.props;
    const { currentUser } = user
    const { id } = currentUser
    const {
      loading,
    } = this.props;
    const { title } = this.props;
    const { data, total } = this.state;
    const style = {
      height: 800,
    };

    return (
      <Card title={`${title}（ ${total}）`} style={{ marginTop: 12, marginRight: 12 }}>
        {/* <Scrollbars
          style={style}// 这里给个足够高的高度就好
          autoHide="true"
          onScroll={this.onScroll}
        // autoHide
        > */}

        <RemindView data={{ ...data }} />

        {/* </Scrollbars> */}
        <Button
          onClick={() => {
            this.pullRemind(id);
          }}
        >
          测试拉取提醒
        </Button>

        <Search
          enterButton="添加"
          placeholder="在此添加新的提醒，回车提交"
          style={{ marginTop: 16 }}
        />
      </Card>
    );
  }
}
