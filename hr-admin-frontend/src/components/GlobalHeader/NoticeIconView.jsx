import React, { Component } from 'react';
import antd, { Tag } from 'antd';
import { connect } from 'dva';
import ErrorCode from '@/dtsea/common/ErrorCode';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';

class GlobalHeaderRight extends Component {
  state = {
    announce: [],
    remind: [],
    message: [],
    announceTotal: 0,
    remindTotal: 0,
    messageTotal: 0,
    // 长列表加载
    announceEdmund: false,
    remindEdmund: false,
    messageEdmund: false,
    announcepageNumber: 1,
    announcepageSize: 10,
    remindpageNumber: 1,
    remindpageSize: 10,
    messagepageNumber: 1,
    messagepageSize: 10,
  };

  componentDidMount() {
    const {
      announcepageNumber,
      announcepageSize,
      remindpageNumber,
      remindpageSize,
      messagepageNumber,
      messagepageSize,
    } = this.state;
    this.getRemind(remindpageNumber, remindpageSize);
    this.getAnnounce(announcepageNumber, announcepageSize);
    this.getMessage(messagepageNumber, messagepageSize);
    this.interval = setInterval(() => this.getNewRemind(), 300000);
    this.interval = setInterval(() => this.getNewMessage(), 300000);
    this.interval = setInterval(() => this.getNewAnnounce(), 300000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getNewestMessage = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/getNewestRemind',
      payload: {
        ...filter,
      },
      callback: response => {
        const { data, total } = response;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (data.length !== 0) {
              this.setState(prevState => ({
                message: data.concat(prevState.message),
              }));
              this.setState(prevState => ({
                total: prevState.total + total,
              }));
            }
            break;
          case ErrorCode.FAILURE:
            antd.message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  getNewMessage = () => {
    const { announce } = this.state;
    if (announce === undefined || announce === null) return;
    if (announce.length === 0) return;
    setTimeout(
      () =>
        this.getNewestRemind({
          sentAt: announce[0].sentAt,
          isRead: 'false',
          notifyType: 'message',
        }),
      1000,
    );
  };

  getNewestAnnounce = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/getNewestRemind',
      payload: {
        ...filter,
      },
      callback: response => {
        const { data, total } = response;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (data.length !== 0) {
              this.setState(prevState => ({
                announce: data.concat(prevState.announce),
              }));
              this.setState(prevState => ({
                total: prevState.total + total,
              }));
            }
            break;
          case ErrorCode.FAILURE:
            antd.message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  getNewAnnounce = () => {
    const { announce } = this.state;
    if (announce === undefined || announce === null) return;
    if (announce.length === 0) return;
    setTimeout(
      () =>
        this.getNewestRemind({
          sentAt: announce[0].sentAt,
          isRead: 'false',
          notifyType: 'announce',
        }),
      1000,
    );
  };

  getNewestRemind = filter => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/getNewestRemind',
      payload: {
        ...filter,
      },
      callback: response => {
        const { data, total } = response;
        switch (response.code) {
          case ErrorCode.SUCCESS:
            if (data.length !== 0) {
              this.setState(prevState => ({
                remind: data.concat(prevState.remind),
              }));
              this.setState(prevState => ({
                total: prevState.total + total,
              }));
            }
            break;
          case ErrorCode.FAILURE:
            antd.message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  getNewRemind = () => {
    const { remind } = this.state;
    if (remind === undefined || remind === null) return;
    if (remind.length === 0) return;
    setTimeout(
      () =>
        this.getNewestRemind({ sentAt: remind[0].sentAt, isRead: 'false', notifyType: 'remind' }),
      1000,
    );
  };

  getMessage = (pageNumber, pageSize) => {
    if (this.state.messageEdmund) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/getMessage',
      payload: {
        notifyType: 'message',
        isRead: 'false',
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            // 设置数据
            if (response.data.length !== 0) {
              this.setState(prevState => ({
                message: prevState.message.concat(this.props.noticeListModel.messageType),
              }));
              this.setState({
                messageTotal: this.props.noticeListModel.total,
              });
            } else {
              this.setState({
                messageTotal: 0,
                messageEdmund: true,
              });
            }
            break;
          case ErrorCode.FAILURE:
            antd.message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  getRemind = (pageNumber, pageSize) => {
    if (this.state.remindEdmund) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/getRemind',
      payload: {
        notifyType: 'remind',
        isRead: 'false',
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            // 设置数据
            setTimeout(() => this.pullRemind(), 1000);
            if (response.data.length !== 0) {
              this.setState(prevState => ({
                remind: prevState.remind.concat(this.props.noticeListModel.remindType),
              }));
              this.setState({
                remindTotal: this.props.noticeListModel.total,
              });
            } else {
              this.setState({
                remindTotal: 0,
                remindEdmund: true,
              });
            }
            break;
          case ErrorCode.FAILURE:
            antd.message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  getAnnounce = (pageNumber, pageSize) => {
    if (this.state.announceEdmund) return;
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/getAnnounce',
      payload: {
        notifyType: 'announce',
        isRead: 'false',
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case ErrorCode.SUCCESS:
            setTimeout(() => this.pullAnnounce(), 1500);
            if (response.data.length !== 0) {
              this.setState(prevState => ({
                announce: prevState.announce.concat(this.props.noticeListModel.announceType),
              }));
              this.setState({
                announceTotal: this.props.noticeListModel.total,
              });
            } else {
              this.setState({
                announceTotal: 0,
                announceEdmund: true,
              });
            }
            break;
          case ErrorCode.FAILURE:
            antd.message.error(response.msg);
            break;
          default:
            this.callbackDefault(response);
            break;
        }
      },
    });
  };

  pullAnnounce = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/pullAnnounces',
      payload: {},
      callback: response => {
        const { data } = response;
        if (!data.lenght === 0) {
          this.getNewAnnounce();
        }
      },
    });
  };

  pullRemind = () => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'noticeListModel/pullRemind',
    //   payload: {},
    //   callback: response => {
    //     const { data } = response;
    //     if (data) {
    //       this.getNewRemind();
    //     }
    //   },
    // });
  };

  viewMore = e => {
    const { tabKey } = e;
    const {
      remindpageNumber,
      messagepageNumber,
      announcepageNumber,
      remindpageSize,
      messagepageSize,
      announcepageSize,
    } = this.state;
    if (tabKey === 'Remind') {
      this.setState({ remindpageNumber: remindpageNumber + 1 });
      this.getRemind(remindpageNumber, remindpageSize);
    }

    if (tabKey === 'Message') {
      this.setState({ messagepageNumber: messagepageNumber + 1 });
      this.getMessage(messagepageNumber, messagepageSize);
    }

    if (tabKey === 'Announce') {
      this.setState({ announcepageNumber: announcepageNumber + 1 });
      this.getAnnounce(announcepageNumber, announcepageSize);
    }
  };

  cleanAll = (filter, type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'noticeListModel/allRead',
      payload: {
        ...filter,
      },
      callback: () => {
        if (type === 'remind') {
          this.setState({ remind: [] });
          this.setState({ remindpageNumber: 1 });
          this.getRemind(1, 10);
        }
        if (type === 'message') {
          this.setState({ message: [] });
          this.setState({ messagepageNumber: 1 });
          this.getMessage(1, 10);
        }
        if (type === 'announce') {
          this.setState({ announce: [] });
          this.setState({ announcepageNumber: 1 });
          this.getAnnounce(1, 10);
        }
      },
    });
  };

  clearMsg = e => {
    const { tabKey } = e;
    if (tabKey === 'Remind') {
      const { remind } = this.state;
      if (remind) {
        this.cleanAll({ notifyType: 'remind' }, 'remind');
      }
    }

    if (tabKey === 'Message') {
      const { message } = this.state;
      if (message) {
        this.cleanAll({ notifyType: 'message' }, 'message');
      }
    }

    if (tabKey === 'Announce') {
      const { announce } = this.state;
      if (announce) {
        this.cleanAll({ notifyType: 'announce' }, 'announce');
      }
    }
  };

  render() {
    const RemindData = {
      onFindPage: this.getRemind,
      hasMore: this.state.remindEdmund,
      pageNumber: this.state.remindpageNumber,
      pageSize: this.state.remindpageSize,
    };
    const MessageData = {
      onFindPage: this.getMessage,
      hasMore: this.state.remindEdmund,
      pageNumber: this.state.messagepageNumber,
      pageSize: this.state.messagepageSize,
    };
    const AnnounceData = {
      onFindPage: this.getAnnounce,
      hasMore: this.state.remindEdmund,
      pageNumber: this.state.announcepageNumber,
      pageSize: this.state.announcepageSize,
    };
    const NoticeIconData = {
      RemindData,
      MessageData,
      AnnounceData,
    };
    const { announce, message, remind, announceTotal, messageTotal, remindTotal } = this.state;
    return (
      <NoticeIcon
        className={styles.action}
        count={announceTotal + messageTotal + remindTotal}
        // onItemClick={item => {
        //   this.changeReadState(item);
        // }}
        // loading={fetchingNotices}
        clearText="清空"
        viewMoreText="查看更多"
        onClear={e => this.clearMsg(e)}
        // onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={e => this.viewMore(e)}
        clearClose
        {...NoticeIconData}
      >
        <NoticeIcon.Remind
          tabKey="Remind"
          count={remindTotal}
          list={remind}
          title="提醒"
          emptyText="你已查看所有提醒"
          showViewMore
          {...RemindData}
        />
        <NoticeIcon.Message
          tabKey="Message"
          count={messageTotal}
          list={message}
          title="消息"
          emptyText="您已读完所有消息"
          showViewMore
          {...MessageData}
        />
        <NoticeIcon.Announce
          tabKey="Announce"
          title="公告"
          emptyText="你已查看所有公告"
          count={announceTotal}
          list={announce}
          showViewMore
          {...AnnounceData}
        />
      </NoticeIcon>
    );
  }
}

export default connect(({ loading, noticeListModel }) => ({
  loading,
  noticeListModel,
}))(GlobalHeaderRight);
