import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, message } from 'antd';

import ErrorCode from '../../../dtsea/common/ErrorCode';
import SettingsView from './components/SettingsView';

@connect(({ notificationSettingsModel, loading }) => ({
  notificationSettingsModel,
  loading: loading.models.fetch,
}))
class NotificationSettingsIndex extends Component {
  state = {
    filter: {},
    pageNumber: 1,
    pageSize: 10,
  };

  componentDidMount () {
    const { pageNumber, pageSize, filter } = this.state;

    this.findPage(pageNumber, pageSize, filter);
  }

  /* ********************************************************** */

  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'notificationSettingsModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
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

  buildSettingsTree = (targetTypes, actions) => {
    const settings = {};
    for (const item of targetTypes) {
      if (settings[item.targetType] == null) {
        settings[item.targetType] = item;
        item.actions = [];
      }
    }
    for (const item of actions) {
      const temp = settings[item.targetType];
      if (temp != null) {
        temp.actions.push(item);
      }
    }

    return settings;
  };

  render () {
    const {
      loading,
      form,
      notificationSettingsModel: { targetTypes = [], data = [], total },
    } = this.props;
    const settings = this.buildSettingsTree(targetTypes, data);

    return (
      <PageHeaderWrapper>
        <SettingsView title="通知设置" dataSource={settings} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(NotificationSettingsIndex);
