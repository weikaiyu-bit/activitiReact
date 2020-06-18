/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at*/
import { PureComponent } from 'react';
import { List, Avatar, Input, Tooltip } from 'antd';

const Search = Input.Search;

/**
 * 项目信息列表
 * @author b__c<br> bc@dsea.net<br>2018-12-08 15:20:05
 */
@xbind
export default class JobProjectList extends PureComponent {
  state = {
    itemColor: '',
  };

  onClick = item => {
    this.changeColor(item, '#e7f7ff', '', item);

    const filter = jobTaskFlux.getProps('filter');
    if (filter) {
      const data = filter.data;
      data.projectId = item.projectId;
      jobTaskFlux.setProps(data);
      jobTaskFlux.findPage(data);
    }
  };

  handleMouseOver = currItem => {
    // this.changeColor(currItem, '#e7f7ff', '');
  };

  changeColor(currItem, color, color2, clickItem) {
    const table = jobProjectFlux.getProps('table');
    const {
      data: { list },
    } = table;
    for (let i in list) {
      let item = list[i];

      if (clickItem) {
        if (clickItem.dataId == item.dataId) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
        if (currItem.dataId == item.dataId) {
          item.itemColor = color;
        } else {
          item.itemColor = color2;
        }
      } else {
        if (currItem.dataId == item.dataId || item.isSelected) {
          item.itemColor = color;
        } else {
          item.itemColor = color2;
        }
      }
    }
    jobProjectFlux.setProps({ table });
  }

  onChange = e => {};

  render() {
    /**取出Flux层表格属性 */
    const table = jobProjectFlux.getProps('table');
    console.log('table=', table);
    if (!table) {
      return false;
    }
    const { data } = table;

    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="请输入项目名称" onChange={this.onChange} />

        <List
          itemLayout="horizontal"
          dataSource={data.list}
          renderItem={item => (
            <List.Item
              onClick={() => {
                this.onClick(item);
              }}
              onMouseOver={() => {
                this.handleMouseOver(item);
              }}
              style={{ backgroundColor: item.itemColor }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    style={{ backgroundColor: item.logoColor, verticalAlign: 'middle' }}
                  >
                    {item.logoName}
                  </Avatar>
                }
                title={omitName(item.projectName || '', 17)}
                description={omitName(item.remark || '', 17)}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const EllipsisText = ({ text, length, tooltip, ...other }) => {
  if (typeof text !== 'string') {
    throw new Error('Ellipsis children must be string.');
  }
  if (text.length <= length || length < 0) {
    return <span {...other}>{text}</span>;
  }
  const tail = '...';
  let displayText;
  if (length - tail.length <= 0) {
    displayText = '';
  } else {
    displayText = text.slice(0, length - tail.length);
  }

  if (tooltip) {
    return (
      <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={text}>
        <span>
          {displayText}
          {tail}
        </span>
      </Tooltip>
    );
  }

  return (
    <span {...other}>
      {displayText}
      {tail}
    </span>
  );
};
