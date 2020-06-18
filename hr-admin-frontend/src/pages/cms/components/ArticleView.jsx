/* eslint-disable react/no-danger */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/** 版权所有，侵权必纠
 * Copyright(c) 2019 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Icon, Tag, BackTop } from 'antd';

import moment from 'moment';

/**
 * 文章内容(详情)
 * @author b__c<br> bc@dtsea.net<br>2019-01-11 19:54:28
 */
export default class ArticleView extends PureComponent {
  render() {
    const { dataSource, categoryData } = this.props;
    if (!dataSource) return false;
    if (!categoryData) return false;

    const IconText = ({ type, text }) => (
      <span style={{ marginRight: 8 }}>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );

    const loop = words => words.map(item => <Tag key={item}>{item}</Tag>);
    const Keywords = text => {
      if (text != null && text !== '') {
        const words = text.split(',');
        return <span>{loop(words)}</span>;
      }
      return <span style={{ color: '#CCC' }}>无</span>;
    };
    const author = text => {
      if (text != null && text !== '') {
        return <a>{dataSource.author}</a>;
      }
      return '佚名 ';
    };

    const isGood = text => {
      if (text === 'true') {
        return <IconText type="like-o" text="已推荐" />;
      }
      return <IconText type="like-o" text="未推荐" />;
    };
    const time = text => {
      if (text != null && text !== '') {
        return moment(text).format('YYYY-MM-DD HH:mm');
      }
      return '(未发布)';
    };

    const source = text => {
      if (text != null && text !== '') {
        return <a>{dataSource.source}</a>;
      }
      return '未知';
    };

    return (
      <div style={{ lineHeight: '22px', maxWidth: '1024px' }}>
        <div style={{ textAlign: 'center', lineHeight: '32px' }}>
          <h1>{dataSource.title}</h1>
        </div>
        <div style={{ textAlign: 'center' }}>
          {' '}
          <span style={{ marginRight: 8, color: '#CCC' }}>关键字: </span>
          {Keywords(dataSource.keywords)}
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span style={{ color: '#CCC' }}>
            {author(dataSource.author)} 发布在
            {categoryData.map(item => {
              if (item.id === dataSource.categoryId) {
                return <a key={item.id}> {item.categoryName}</a>;
              }
            })}
            <em style={{ color: '#CCC', fontStyle: 'normal', marginLeft: 16 }}>
              {/* {moment(dataSource.publishTime).format('YYYY-MM-DD HH:mm')} */}
              {time(dataSource.publishTime)}
            </em>
          </span>
          <span style={{ color: '#CCC', marginLeft: 16 }}>
            <span style={{ marginRight: 8 }}>来源：{source(dataSource.source)}</span>
            <IconText type="star-o" text={dataSource.clicks || 0} />
            {isGood(dataSource.isGood)}
            <IconText type="message" text={dataSource.comments || 0} />
          </span>
        </div>
        <br />
        <div
          style={{ fontSize: '18px', lineHeight: '32px' }}
          dangerouslySetInnerHTML={{ __html: dataSource.intro }}
        />
        <br />
        <BackTop />
      </div>
    );
  }
}
