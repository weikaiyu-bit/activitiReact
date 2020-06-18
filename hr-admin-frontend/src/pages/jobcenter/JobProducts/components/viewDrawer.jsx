import React, { Component } from 'react';
import { Drawer, Row, Col, Tabs, Upload, Button, Icon, Progress, Tag, message, Spin } from 'antd';
import { connect } from 'dva';
import ProductBaseInfoView from '../../components/productBaseInfoView';
import ErrorCode from '../../../../dtsea/common/ErrorCode';

const { TabPane } = Tabs;

@connect(({ jobProductsModel, loading }) => ({
  jobProductsModel,
  loading,
}))
class JobProductsViewDrawer extends Component {
  state = {
    selectItem: [],
    load: false,
  };

  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  componentDidMount() {
    const { id } = this.props;
    this.findById(id);
    this.findProductLog({ id });
  }

  // 增加日志
  addProductLog = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProductsModel/addProductLog',
      payload: { ...record },
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('日志增加成功！');
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

  // 查询日志
  findProductLog = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProductsModel/findProductLog',
      payload: { ...record },
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
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

  // 按Id查询
  findById = id => {
    this.setState({ load: true });
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProductsModel/findById',
      payload: id,
      callback: response => {
        this.setState({ load: false });
        switch (response.code) {
          case 'SUCCESS':
            const { data } = response;
            console.log(data);
            this.setState({ selectItem: data });
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

  // 分页查询
  findPage = (pageNumber, pageSize, filter) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jobProductsModel/fetch',
      payload: {
        ...filter,
        pageNumber,
        pageSize,
      },
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            // const { data } = this.props;
            // this.getById(data.id);
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

  // 修改
  updateProudct = (id, values) => {
    const { dispatch } = this.props;
    const payload = { id, ...values };
    dispatch({
      type: 'jobProductsModel/update',
      payload,
      callback: response => {
        switch (response.code) {
          case 'SUCCESS':
            message.success('修改产品信息成功！');
            const { id, page } = this.props;
            this.findById(id);
            if (page !== null && page !== undefined) this.findPage(page.pageNum, page.pageSize, {});
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

  renderProduct = data => (
    <div>
      <Row style={{ marginTop: 12 }}>
        <Col>
          <h2>{data.applicationName}</h2>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col span={12}>
          <label>应用版本：</label>
          <label>{data.version}</label>
        </Col>
        <Col span={12}>
          <label>应用状态：</label>
          <label>{data.status}</label>
        </Col>
      </Row>
      <Row style={{ marginTop: 12 }}>
        <Col>
          <label>产品描述：</label>
          <p>{data.remark}</p>
        </Col>
      </Row>
    </div>
  );

  callbackDefault = response => {
    const msg = response.msg ? response.msg : '发生未知错误！';

    switch (response.code) {
      case ErrorCode.NO_PERMISSION:
        message.error('没有权限');
        break;
      case ErrorCode.NOT_LOGIN:
        break;
      default:
        message.warning(msg);
        break;
    }
  };

  render() {
    const { visible, jobProductsModel } = this.props;
    const { selectItem } = this.state;
    const productData = {
      data: selectItem,
      onUpdate: this.updateProudct,
      onGetById: this.findById,
      onFindProductLog: this.findProductLog,
      onSaveProductLog: this.addProductLog,
      jobProductsModel,
    };
    const {
      loading: { effects },
    } = this.props;

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="应用信息">
        <div>
          <Spin spinning={effects['jobProductsModel/findById']} size="large">
            {this.state.load === false && <ProductBaseInfoView {...productData} />}
          </Spin>
        </div>
      </Drawer>
    );
  }
}

export default JobProductsViewDrawer;
