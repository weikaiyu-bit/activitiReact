/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/** 版权所有，侵权必纠
 * Copyright(c) 2018 dtsea.com All rights reserved.
 * distributed with this file and available online at */
import React, { PureComponent } from 'react';
import { Form, Input, Select, Switch, InputNumber } from 'antd';
import moment from 'moment';

const { Option } = Select;

const FormItem = Form.Item;
/**
 * 修改文章内容
 * @author b__c<br> bc@dsea.net<br>2018-11-30 17:26:05
 */
/** 连接Flux层组件属性 */
@Form.create()
export default class ContentPropertyEdit extends PureComponent {
  getItemsValue = () => {
    const values = this.props.form.getFieldsValue();
    return values;
  };

  setIsThumbnail = isThumbnail => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      isThumbnail,
    });
  };

  renderStatus = status => {
    switch (status) {
      // 草稿
      case 'DRAFT':
        return (
          <Select
            initialValue="DRAFT"
            style={{ width: 120 }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="DRAFT">草稿</Option>
            <Option value="SUBMITTED">已投稿</Option>
          </Select>
        );
      // 废稿
      case 'SCRAP':
        return (
          <Select
            initialValue="SCRAP"
            style={{ width: 120 }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="SCRAP">废稿</Option>
            <Option value="RECEIVED">已接收</Option>
            <Option value="AUDIT">审核中</Option>
          </Select>
        );
      // 已接收
      case 'RECEIVED':
        return (
          <Select
            initialValue="RECEIVED"
            style={{ width: 120 }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="RECEIVED">已接收</Option>
            <Option value="PUBLISHED">已发布</Option>
            <Option value="SCRAP">已作废</Option>
          </Select>
        );
      // 已投稿
      case 'SUBMITTED':
        return (
          <Select
            initialValue="SUBMITTED"
            style={{ width: 120 }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="SUBMITTED">已投稿</Option>
            <Option value="RECEIVED">已接收</Option>
            <Option value="DRAFT">草稿</Option>
          </Select>
        );
      // 已发布
      case 'PUBLISHED':
        return (
          <Select
            initialValue="PUBLISHED"
            style={{ width: 120 }}
            getPopupContainer={triggerNode => triggerNode.parentNode}
          >
            <Option value="PUBLISHED">已发布</Option>
            <Option value="RECEIVED">已接收</Option>
          </Select>
        );
      default:
        return <Select></Select>;
    }
  };

  render() {
    const data = this.props.dataSource;
    if (!data) return false;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    console.log('data', data.clicks);

    return (
      <>
        <Form horizontal="true">
          <FormItem label="人气" {...formItemLayout}>
            {getFieldDecorator('clicks', {
              initialValue: data.clicks || 0,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="来源" {...formItemLayout}>
            {getFieldDecorator('source', {
              initialValue: data.source || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="作者" {...formItemLayout}>
            {getFieldDecorator('author', {
              initialValue: data.author || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="文章风格" {...formItemLayout}>
            {getFieldDecorator('style', {
              initialValue: data.style || '',
            })(<Input />)}
          </FormItem>
          <FormItem label="阅读单价" {...formItemLayout}>
            {getFieldDecorator('price', {
              initialValue: data.price || 0,
            })(<InputNumber />)}
          </FormItem>
          <FormItem label="是否缩略图" {...formItemLayout}>
            {getFieldDecorator('isThumbnail', {
              initialValue: data.isThumbnail === 'true',
              valuePropName: 'checked',
            })(<Switch />)}
          </FormItem>
          <FormItem label="是否外链" {...formItemLayout}>
            {getFieldDecorator('isUrl', {
              initialValue: data.isUrl || '',
            })(<Switch defaultChecked={data.isUrl === 'true'} />)}
          </FormItem>
          <FormItem label="推荐" {...formItemLayout}>
            {getFieldDecorator('isGood', {
              initialValue: data.isGood || '',
            })(<Switch defaultChecked={data.isGood === 'true'} />)}
          </FormItem>
          <FormItem label="置顶" {...formItemLayout}>
            {getFieldDecorator('onTop', {
              initialValue: data.onTop || '',
            })(<Switch defaultChecked={data.onTop === 'true'} />)}
          </FormItem>
          <FormItem label="允许评论" {...formItemLayout}>
            {getFieldDecorator('allowComment', {
              initialValue: data.allowComment || '',
            })(<Switch defaultChecked={data.allowComment === 'true'} />)}
          </FormItem>
          <FormItem label="状态" {...formItemLayout}>
            {getFieldDecorator('contentStatus', {
              initialValue: data.contentStatus || '',
            })(this.renderStatus(data.contentStatus))}
          </FormItem>
          <FormItem label="发布时间" {...formItemLayout}>
            {getFieldDecorator('publishTime', {
              initialValue: data.publishTime || '',
            })(<Input readOnly="readOnly" />)}
          </FormItem>
          <FormItem label="发布人" {...formItemLayout}>
            {getFieldDecorator('publisherUid', {
              initialValue: data.publisherUid || '',
            })(<Input readOnly="readOnly" />)}
          </FormItem>
          <FormItem label="二维码" {...formItemLayout}>
            {getFieldDecorator('qrcode', {
              initialValue: data.qrcode || '',
            })(
              <img src="https://qr.api.cli.im/qr?data=http%253A%252F%252Fwww.dtsea.net%252F&level=H&transparent=false&bgcolor=%23ffffff&forecolor=%23000000&blockpixel=12&marginblock=1&logourl=&size=260&kid=cliim&key=f53391a01de48669a1ea7d132800dc22" />,
            )}
          </FormItem>
        </Form>
      </>
    );
  }
}
