/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Card, List, Avatar, Button, Tooltip, message } from 'antd';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import styles from '../style.less';

/**
 * 待办事项
 * @author b__c<br> bc@dsea.net<br>2018-12-08 15:20:05
 */
@connect(({ noticeListModel, loading, user }) => ({
  noticeListModel,
  user,
  loading,
}))
export default class AnnounceView extends PureComponent {
  state = {
    data: [],
    // 长列表加载
    pageNumber: 1,
    pageSize: 10,
    Edmund: false,
  };

  componentDidMount () {
    const { pageNumber, pageSize } = this.state;
    setTimeout(() => this.findPage(pageNumber, pageSize), 1000);
  }

  findPage = (pageNumber, pageSize) => {
    const { dispatch } = this.props;
    const { user } = this.props;
    const { currentUser } = user
    const { id } = currentUser
    dispatch({
      type: 'noticeListModel/getAnnounce',
      payload: {
        ownerUid: id,
        notifyType: 'announce',
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (response.data.length !== 0) {
              this.setState(prevState => ({
                data: prevState.data.concat(this.props.noticeListModel.announceType),
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
  }

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        routerRedux.push('/user/login');
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  pullAnnounce = uid => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/pullAnnounces',
      payload: {
        uid,
      },
    });
  };

  renderThumb ({ style, ...props }) { // 设置滚动条的样式
    const thumbStyle = {
      width: '8px',
      backgroundColor: '#000000',
      opacity: '0.2',
      borderRadius: '6px',
      right: '4px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props} />
    );
  }

  onScroll = e => {
    if (e.target.scrollTop === e.target.scrollHeight) {
      // 滚动到底部，可以继续发请求获取数据或干点什么
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


  renderDate = item => (item.sentAt ? moment(item.sentAt).fromNow() : '');

  // const dateFormat = 'YYYY-MM-DD';
  handleScrollFrame = () => {
    const tx = {
      scrollHeight: 350,
    }
    return tx;
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
    const { loading: { effects } } = this.props
    // console.log(this.props.noticeListModel)
    return (
      <Card title={`${title} （${total}）`} style={{ marginTop: 12, marginRight: 12 }}>
        <Scrollbars
          style={style}// 这里给个足够高的高度就好
          autoHide="true"
          onScroll={this.onScroll}
          onScrollFrame={this.handleScrollFrame}
        // autoHide
        >

          <div className={styles.dtseaTinfiniteContainer}>
            <List
              itemLayout="horizontal"
              dataSource={data}
              loading={effects['noticeListModel/getAnnounce']}
              renderItem={item => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          shape="square"
                          src={item.senderAvatar}
                          style={{ backgroundColor: item.avatar, verticalAlign: 'middle' }}
                        >
                          {item.logoName}
                        </Avatar>
                      }
                      title={<Tooltip title={item.description}>{item.content}</Tooltip>}
                      description={item.description}
                    />
                    <div>{this.renderDate(item)}</div>
                  </div>
                </List.Item>
              )}
            >
            </List>

          </div>
        </Scrollbars>
        <Button onClick={() => this.pullAnnounce(id)}>测试拉取公告</Button>

        <Button.Group style={{ width: '100%', marginTop: 16 }}>
          <Button style={{ width: '50%' }}>清空</Button>
          <Button style={{ width: '50%' }}>查看更多</Button>
        </Button.Group>
      </Card>
    );
  }
}
