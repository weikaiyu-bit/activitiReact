/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Card, List, Avatar, Button, Tag, Tooltip, Input, message } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import ErrorCode from '@/dtsea/common/ErrorCode';
import { connect } from 'dva';
import convert from 'htmr';
import styles from '../style.less';

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
export default class RemindView extends PureComponent {
  state = {
    data: [],
    // 长列表加载
    pageNumber: 1,
    pageSize: 10,
    // 记录数据是否结束
    Edmund: false,
    total: 0,
  };

  componentDidMount () {
    const { user } = this.props;
    const { currentUser } = user
    const { id } = currentUser
    const { pageNumber, pageSize, filter } = this.state;
    // this.findPage(pageNumber, pageSize, filter);
    setTimeout(() => this.findPage(pageNumber, pageSize), 1000);
  }


  findPage = (pageNumber, pageSize) => {
    const { dispatch } = this.props;
    const { user } = this.props;
    const { currentUser } = user
    const { id } = currentUser
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
            // console.log(this.props.noticeListModel)
            // 设置数据
            if (response.data.length !== 0) {
              this.setState(prevState => ({
                // data: [...prevState.data, this.props.noticeListModel.announceType],
                data: prevState.data.concat(this.props.noticeListModel.remindType),
              }));
              this.setState({
                total: this.props.noticeListModel.total,
              })
            } else {
              this.setState({
                total: 0,
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
  };

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        // routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  pullRemind = uid => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/pullRemind',
      payload: {
        uid,
      },
    });
  };

  renderDate = item => (item.createAt ? moment(item.createAt).fromNow() : '');
  // const dateFormat = 'YYYY-MM-DD';
  //  return item.createAt ? moment(item.createAt).fromNow() : '';

  renderTaskStatus = item => {
    switch (item.status) {
      case 'editing':
        return <Tag color="orange">编辑中</Tag>;
      case 'planning':
        return <Tag color="lime">未开始</Tag>;
      case 'doing':
        return <Tag color="cyan">进行中</Tag>;
      case 'completed':
        return <Tag color="blue">已完成</Tag>;
      case 'delay':
        return <Tag color="magenta">已逾期</Tag>;
      case 'pause':
        return <Tag color="#CCCCCC">暂缓</Tag>;
      case 'undone':
        return <Tag color="#666666">已撤销</Tag>;
      case 'refuse':
        return <Tag color="#666666">已驳回</Tag>;
      case 'processing':
      default:
        return <Tag>{item.extra}</Tag>;
    }
  };

  onScroll = e => {
    // 几个可能用到的值可以打印看看 e.target.scrollTop  e.target.scrollHeight  e.target.offsetHeight
    //  console.log(e.target.parentNode)// 父节点
    //  console.log('scrollTop', e.target.scrollTop)
    //  console.log('scrollHeight', e.target.scrollHeight)
    //  console.log('clientHeight', e.target.clientHeight)
    //  console.log(e.target.scrollHeight - e.target.scrollTop)
    if (e.target.scrollTop === e.target.scrollHeight) {
      // 滚动到底部，可以继续发请求获取数据或干点什么
      console.log(e.target.scrollTop)
    }
    if (e.target.scrollHeight - e.target.scrollTop === 800) {
      const { Edmund } = this.state
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
    const {
      loading,
    } = this.props;
    const { title } = this.props;
    const { data, total } = this.state;
    const style = {
      height: 800,
    };
    const { loading: { effects } } = this.props
    return (
      <Scrollbars
        style={style}// 这里给个足够高的高度就好
        autoHide="true"
        onScroll={this.onScroll}
      // autoHide
      >
        <div className={styles.dtseaTinfiniteContainer}>
          <List
            bordered={false}
            itemLayout="horizontal"
            dataSource={data}
            loading={effects['noticeListModel/getRemind']}
            renderItem={item => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        src={item.senderAvatar}
                        style={{ backgroundColor: item.senderAvatar, verticalAlign: 'middle' }}
                      >
                        {item.senderName}
                      </Avatar>
                    }
                    title={<a>{item.content}</a>}
                    description={convert(item.description)}
                  />
                  <div>{this.renderTaskStatus(item)}</div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </Scrollbars >
    );
  }
}
