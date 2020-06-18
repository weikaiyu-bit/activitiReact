/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Component } from 'react';
import { Card, Icon, List, Tag, Drawer, Row, Col } from 'antd';

import moment from 'moment';
import ArticleView from './ArticleView';

class ArticleList2 extends Component {
  state = {
    viewVisible: false,
    viewData: {},
  };

  showDrawer = record => {
    this.setState({
      viewVisible: true,
      viewData: record,
    });
  };

  hideDrawer = () => {
    this.setState({
      viewVisible: false,
      viewData: {},
    });
  };

  render() {
    const { dataSource, categoryData = [] } = this.props;
    if (!dataSource) return false;

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
        return <a>{text}</a>;
      }
      return '佚名 ';
    };

    const isGood = text => {
      if (text === 'true') {
        return <IconText type="like-o" text="已推荐" />;
      }
      return <IconText type="like-o" text="未推荐" />;
    };
    const renderTime = text => {
      if (text != null && text !== '') {
        return moment(text).format('YYYY-MM-DD HH:mm');
      }
      return '(未发布)';
    };

    const source = text => {
      if (text != null && text !== '') {
        return <a>{text}</a>;
      }
      return '未知';
    };

    return (
      <>
        <List
          itemLayout="vertical"
          size="large"
          dataSource={dataSource}
          renderItem={item => (
            <List.Item key={item.id}>
              <List.Item.Meta title={<a onClick={() => this.showDrawer(item)}>{item.title}</a>} />
              <div>
                <Row>
                  <Col span={7}>
                    <img width={120} height={80} src={item.thumbnail} />
                  </Col>
                  <Col span={17}>
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: 'webkitBox',
                        webkitBoxClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        WebkitBoxOrient: 'vertical',
                        height: 80,
                      }}
                      dangerouslySetInnerHTML={{ __html: item.intro }}
                    />
                  </Col>
                </Row>
                <div style={{ color: '#CCC', marginTop: '12px' }}>
                  {author(item.author)} 发布在 {source(item.source)}
                  <em
                    style={{
                      textAlign: 'right',
                      color: '#CCC',
                      fontStyle: 'normal',
                      marginLeft: 16,
                    }}
                  >
                    {renderTime(item.publishTime)}
                  </em>
                </div>
              </div>
            </List.Item>
          )}
        />

        <Drawer
          width="50%"
          visible={this.state.viewVisible}
          onClose={this.hideDrawer}
          title="文章预览"
        >
          <ArticleView dataSource={this.state.viewData} categoryData={categoryData} />
        </Drawer>
      </>
    );
  }
}
export default ArticleList2;
