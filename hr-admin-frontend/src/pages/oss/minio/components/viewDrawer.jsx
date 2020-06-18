/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable no-case-declarations */
/* eslint-disable no-console */
/* eslint-disable nonblock-statement-body-position */
/* eslint-disable curly */
import React, { Component } from 'react';
import { Drawer, Row, Col, Divider, Input } from 'antd';

const { TextArea } = Input;
class ViewDrawer extends Component {
  close = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  getWebHeight = () => {
    let winWidth = 0;
    let winHeight = 0;

    if (window.innerWidth) winWidth = window.innerWidth;
    else if (document.body && document.body.clientWidth) winWidth = document.body.clientWidth;
    // 获取窗口高度
    if (window.innerHeight) winHeight = window.innerHeight;
    else if (document.body && document.body.clientHeight) winHeight = document.body.clientHeight;
    // 通过深入Document内部对body进行检测，获取窗口大小
    if (
      document.documentElement &&
      document.documentElement.clientHeight &&
      document.documentElement.clientWidth
    ) {
      winHeight = document.documentElement.clientHeight;
      winWidth = document.documentElement.clientWidth;
    }
    return winHeight;
  };

  getContent = data => {
    if (data) {
      // 后台获取图片接口路径
      // 111
      const apiUrl = '/api/v1/minio/oss/file/';
      const pdfUrl = '/api/v1/minio/oss/convertPdf/';
      const { fileType } = data;
      const backPath = ''; // 后台路径端口  这里为后台部署的地址+端口号
      const downloadPath = backPath + apiUrl + data.fileId; // 下载地址

      const webHeight = this.getWebHeight() - 120;

      console.log('height=', webHeight);

      switch (fileType) {
        case 'doc':
        case 'docx':
        case 'ppt':
        case 'pptx':
        case 'xls':
        case 'xlsx':
          // office预览pdf
          // eslint-disable-next-line no-case-declarations
          const officePdf = backPath + pdfUrl + data.fileId;
          const src2 = `/pdfview/web/viewer.html?file=${officePdf}`;
          return (
            <div style={{ width: '100%', height: webHeight }}>
              <iframe src={src2} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          );
        case 'pdf':
          const src = `/pdfview/web/viewer.html?file=${downloadPath}`;
          return (
            <div style={{ width: '100%', height: webHeight }}>
              <iframe src={src} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          );
        case 'txt':
          // 获取txt文件
          const txtPath = `${backPath}/api/v1/minio/oss/txt/${data.fileId}`;
          return (
            <div style={{ width: '100%', height: webHeight }}>
              <iframe src={txtPath} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>
          );
        case 'txt1':
          return (
            <div>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>应用：</lable>
                  <lable>{data.apply}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>目录：</lable>
                  <lable>{data.directory}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>原文件名称：</lable>
                  <lable>{data.fileName}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件类型：</lable>
                  <lable>{data.fileType}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件路径：</lable>
                  <lable>{data.fileUrl}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件大小：</lable>
                  <lable>{`${data.fileSize} kb`}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件状态：</lable>
                  <lable>{data.fileStatus}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>创建时间：</lable>
                  <lable>{data.createTime}</lable>
                </Col>
              </Row>
              <Divider />
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>下载附件地址：</lable>
                  <lable>{downloadPath}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}></Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={24}>
                  <lable>文本内容：</lable>
                </Col>
              </Row>
              <p>
                <a src={txtPath}></a>
              </p>

              <TextArea rows={10}>{txtPath}</TextArea>
            </div>
          );
          // eslint-disable-next-line no-unreachable
          break;
        case 'jpg':
        case 'png':
        case 'gif':
          return (
            <div>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>应用：</lable>
                  <lable>{data.apply}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>目录：</lable>
                  <lable>{data.directory}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>原文件名称：</lable>
                  <lable>{data.fileName}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件类型：</lable>
                  <lable>{data.fileType}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件路径：</lable>
                  <lable>{data.fileUrl}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件大小：</lable>
                  <lable>{`${data.fileSize} kb`}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件状态：</lable>
                  <lable>{data.fileStatus}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>创建时间：</lable>
                  <lable>{data.createTime}</lable>
                </Col>
              </Row>
              <Divider />
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>下载附件地址：</lable>
                  <lable>{downloadPath}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}></Col>
              </Row>
              <img src={apiUrl + data.fileUrl} />
            </div>
          );
          // eslint-disable-next-line no-unreachable
          break;
        default:
          return (
            <div>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>应用：</lable>
                  <lable>{data.apply}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>原文件名称：</lable>
                  <lable>{data.fileName}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件类型：</lable>
                  <lable>{data.fileType}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件路径：</lable>
                  <lable>{data.fileUrl}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件大小：</lable>
                  <lable>{`${data.fileSize} kb`}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>文件状态：</lable>
                  <lable>{data.fileStatus}</lable>
                </Col>
              </Row>
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>创建时间：</lable>
                  <lable>{data.createTime}</lable>
                </Col>
              </Row>
              <Divider />
              <Row style={{ marginTop: 12 }}>
                <Col span={12}>
                  <lable>下载附件地址：</lable>
                  <lable>{downloadPath}</lable>
                </Col>
              </Row>
            </div>
          );
      }
    }
  };

  render() {
    const { data = {}, visible } = this.props;
    console.log('viewData', data);

    return (
      <Drawer width="40%" visible={visible} onClose={this.close} title="详细信息">
        {this.getContent(data)}
      </Drawer>
    );
  }
}

export default ViewDrawer;
