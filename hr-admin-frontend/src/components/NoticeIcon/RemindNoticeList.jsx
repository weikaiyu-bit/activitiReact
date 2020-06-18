import { List, Tag } from 'antd';
import React from 'react';
import classNames from 'classnames';
import convert from 'htmr';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './NoticeList.less';

const RemindNoticeList = ({
  data = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  onFindPage,
  pageNumber,
  pageSize,
  hasMore,
}) => {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    );
  }
  const renderTaskStatus = item => {
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
        return <Tag color="blue">{item.extra}</Tag>;
    }
  };
  const test = () => {
    onFindPage(pageNumber, pageSize);
  };
  return (
    <div>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={() => test()}
        hasMore={hasMore}
        useWindow={false}
      >
        <List
          className={styles.list}
          dataSource={data}
          renderItem={(item, i) => {
            const itemCls = classNames(styles.item, {
              [styles.read]: item.read,
            }); // eslint-disable-next-line no-nested-ternary

            const leftIcon = item.avatar ? (
              typeof item.avatar === 'string' ? (
                <Avatar className={styles.avatar} src={item.avatar} />
              ) : (
                <span className={styles.iconElement}>{item.avatar}</span>
              )
            ) : null;
            return (
              <List.Item
                className={itemCls}
                key={item.key || i}
                onClick={() => onClick && onClick(item)}
              >
                <List.Item.Meta
                  className={styles.meta}
                  avatar={leftIcon}
                  title={
                    <div className={styles.title}>
                      <a onClick={() => test()}>{item.targetName}</a>
                      {item.title}
                      <div className={styles.extra}>{renderTaskStatus(item)}</div>
                    </div>
                  }
                  description={
                    <div>
                      <div className={styles.description}>{convert(item.description)}</div>
                      <div className={styles.datetime}>{item.sentAt}</div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </InfiniteScroll>
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={e => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RemindNoticeList;
