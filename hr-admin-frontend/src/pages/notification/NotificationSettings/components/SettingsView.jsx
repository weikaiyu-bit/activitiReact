/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at*/
import { PureComponent } from 'react';
import { Card, List, Radio, Button, Row, Col, Switch } from 'antd';
import moment from 'moment';

/**
 * 待办事项
 * @author b__c<br> bc@dsea.net<br>2018-12-08 15:20:05
 */
export default class SettingsView extends PureComponent {
  renderDate = item => {
    // const dateFormat = 'YYYY-MM-DD';
    return item.createAt ? moment(item.createAt).fromNow() : '';
  };

  renderRadioGroup(actions) {
    var arr = [];
    for (let item of actions) {
      arr.push(
        <span>
          <label> {item.reasonAction} </label>
          <Switch />
        </span>,
      );
    }
    return arr;
  }

  renderSetting = targetType => {
    return (
      <Row style={{ marginTop: 12 }}>
        <Col span={3} style={{ textAlign: 'right' }}>
          <label>{targetType.remark}</label>
        </Col>
        <Col span={1}></Col>
        <Col span={12}>
          <Radio.Group>{this.renderRadioGroup(targetType.actions)}</Radio.Group>
        </Col>
      </Row>
    );
  };

  render() {
    const { dataSource, title } = this.props;
    // console.log('dataSource=', dataSource);
    if (!dataSource) return false;
    const count = dataSource.length;
    const settings = [];
    for (var key in dataSource) {
      const targetType = dataSource[key];
      const text = this.renderSetting(targetType);
      settings.push(text);
    }

    return (
      <Card title={title} style={{ marginTop: 12, marginRight: 12 }}>
        <div>
          <div>{settings}</div>

          <div style={{ textAlign: 'left' }}>
            <Button type="primary" style={{ marginTop: 16 }}>
              保存
            </Button>
          </div>
        </div>
      </Card>
    );
  }
}
