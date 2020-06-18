import React, { Component } from 'react';
import { Row, Col, Comment, Tooltip, List, Button, Form, Input, Avatar, Popconfirm, Divider, Pagination, notification } from 'antd';
import moment from 'moment';
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import convert from 'htmr';

const { TextArea } = Input;
const listComment = [];
const commentVisibleMap = new Map();
const FormItem = Form.Item;
const Editor = ({ onSubmit, submitting, getFieldDecorator, uploadFn, controlVisible, showBraftEditor }) =>
  (
    <div>
      {/* <Form.Item> */}
      {/* <TextArea rows={4} onKeyDown={onKeyDown} onChange={onChange} value={`${replyid} ${value}`} /> */}
      {/* </Form.Item> */}
      <FormItem>
        {getFieldDecorator('comment', {
          validateTrigger: 'onBlur',
          rules: [{
            type: 'object',
            validator: (_, context, callback) => {
              if (context.isEmpty()) {
                callback('')
              } else {
                callback()
              }
            },
          }],
          initialValue: BraftEditor.createEditorState(''),
        })(
            controlVisible ? (
              <BraftEditor
                style={{ border: '1px solid #E8E8E8' }}
                media={{ uploadFn }}
                contentStyle={{ height: '400px' }}
              />
            ) : (
              <BraftEditor
                style={{ border: '1px solid #E8E8E8' }}
                media={{ uploadFn }}
                contentStyle={{ height: '72px' }}
                onFocus={showBraftEditor}
                excludeControls={[
                  'undo', 'redo', 'separator',
                  'font-size', 'line-height', 'letter-spacing', 'separator',
                  'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
                  'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
                  'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
                  'link', 'separator', 'hr', 'separator',
                  'media', 'separator',
                  'clear', 'fullscreen',
                ]}
              />
            ),
          )}
        <span >
          <Button style={{ marginTop: 12 }} htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
            发表评论
          </Button>
          <Label value="（@岑登山 @吴坚）"/>
          </span>
      </FormItem>
    </div>
  );


const Label = ({ value }) => (
  <span>
    <label style={{ color: '#ccc', textAlign: 'right' }}>  {`发表评论后，这些人将会收到提醒   ${value}`}</label>
  </span>
);
@Form.create()
export default class TaskCommentView extends Component {
  state = {
    comments: [],
    submitting: false,
    value: '',
    reply: {
      id: '',
      name: '',
      comments: '',
      uid: '',
    },
    data: [],
    loading: false,
    hasMore: true,
    beChange: false,
    editorState: BraftEditor.createEditorState(null),
    editorVisible: false,
    replyEditorVisible: false,
    replyEditorState: BraftEditor.createEditorState(null),
    pageNum: 1,
    controlVisible: false,
    onMousClick: false,
  };

  componentDidMount() {
    document.onclick = this.hideBraftEditor;
    // this.findTaskCommentData()
  }

  renderCreateTime = createTime => {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    return (
      <Tooltip title={moment(createTime).format(dateFormat)}>
        <span>{moment(createTime).fromNow()}</span>
      </Tooltip>
    );
  };

// 上传
  uploadFn = param => {
    const serverURL = '/api/v1/minio/oss/upload';
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const successFn = response => {
      // 上传成功后调用param.success并传入上传后的文件地址
      console.log('response', response);
      let str = response.target.response;
      // 截取地址
      str = str.match(/"fileId":"(\S*)","fileName":"/);
      const fileUrl = `/api/v1/minio/oss/file/${str[1]}`;
      console.log('fileUrl', fileUrl);
      param.success({
        url: fileUrl,
        meta: {
          loop: false, // 指定音视频是否循环播放
          autoPlay: false, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
        },
      })
    };

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    };

    const errorFn = () => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败，请重试。',
      })
    };

    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);

    fd.append('file', param.file);
    xhr.open('POST', serverURL, true);
    xhr.send(fd);
  };

// 删除评论
  deleteComment=list => {
    const { onRemoveComments } = this.props;
    onRemoveComments(list.id);
    this.findTaskCommentData();
    setTimeout(() => this.findTaskCommentData(), 1500);
    setTimeout(() => this.findTaskCommentData(), 2000);
    setTimeout(() => this.findTaskCommentData(), 2500);
    setTimeout(() => this.findTaskCommentData(), 3000);
    setTimeout(() => this.findTaskCommentData(), 3500);
    setTimeout(() => this.findTaskCommentData(), 4000);
  }

  // 搜索任务讨论信息
  findTaskCommentData = () => {
    const { taskId, onFindCommentsPage, onFindComments } = this.props;
    const { pageNum } = this.state;
    onFindCommentsPage({ taskId, pageNum });
    onFindComments({ taskId })
  };


  renderReplyList = item => {
    const { data } = this.props;
    const { reply, replyEditorVisible, submitting } = this.state;
    const dataList = data.filter(list => list.replyId === item.id);
    if (dataList !== null && dataList !== undefined) {
      return (
        <div style={{ backgroundColor: '#EEE', paddingLeft: '24px' }}>{
          dataList.map((list, index) =>
            <Comment
              key={list.id}
              author={(list.replyUname !== null && parseInt(list.replyComments) !== item.id) ? (`${list.commentatorName} 回复了 ${list.repliedName}`) : (list.commentatorName)}
              avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              datetime={this.renderCreateTime(list.createTime)}
              content={convert(item.comment)}
              actions={[
                <div style={{ textAlign: 'left' }}>
                  {
                    reply.comments === list.id ? (
                      <a key={index} onClick={() => this.cancelReplyList(item)}>取消</a>
                    ) : (
                      <a key={index} onClick={() => this.replyList(item, list)}>回复</a>
                    )
                  }
                  <Divider type="vertical" />
                  <Popconfirm title="您确定要删除评论吗？" onConfirm={() => this.deleteComment(list)}>
                    <a>删除</a>
                  </Popconfirm>
                </div>,
              ]}
            >
              {
                replyEditorVisible && reply.comments === list.id ? (
                  <div style={{ backgroundColor: '#FFFFFF' }}>
                    <BraftEditor
                      defaultValue={BraftEditor.createEditorState('')}
                      onChange={this.handleReplyChange}
                      style={{ border: '1px solid #E8E8E8' }}
                      media={{ uploadFn: this.uploadFn }}
                      contentStyle={{ height: '288px', marginRight: '10%' }}
                    />
                    <Button style={{ marginTop: 12 }} htmlType = "submit" loading={submitting} onClick={this.handleReplySubmit} type="primary">
                      发表
                    </Button>
                  </div>
                ) : (
                  null
                )
              }
            </Comment>,
          )}
        </div>
      )
    }
  };

  // 是否显示富文本组件
  showBraftEditor=() => {
    this.setState({ controlVisible: true });
    this.cancelReply();
  };

  hideBraftEditor=() => {
    this.setState({ controlVisible: false });
  };

  // 展开收起回复
  commentVisible=item => {
    if (commentVisibleMap.has(item.id)) {
      const a = commentVisibleMap.get(item.id);
      commentVisibleMap.set(item.id, !a);
    } else {
      commentVisibleMap.set(item.id, true);
    }
    const { beChange } = this.state;
    this.setState({ beChange });
  };


  renderCommentList = () => {
    const { jobCommentsModel } = this.props;
    const { listCommentTotal, listComment } = jobCommentsModel;
    const { reply, editorVisible, submitting, pageNum } = this.state;
    const i = parseInt(listCommentTotal / 10 + (listCommentTotal % 10 > 0));
    const hooks = {
      'insert-medias': file => {
        console.log('file', file);
        console.log('file.thumbnail', file[0].thumbnail);
        file[0].size = 5000;
        return file
      },
    }
    return (
      <div>
        <List
          className="comment-list"
          // header={`${data.length} 条评论`}
          itemLayout="horizontal"
          dataSource={listComment}
          renderItem={(item, index) => (
            <li>
              {
                (item.replyId === null || item.replyId.length === 0 || item.replyId === undefined) ? (
                  <Comment
                    author={ item.commentatorName }
                    avatar="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    datetime={this.renderCreateTime(item.createTime)}
                    content={ convert(item.comment)}
                    actions={[
                      <div style={{ textAlign: 'left' }}>
                        {
                          reply.id === item.id ? (
                            <a key={index} onClick={() => this.cancelReply(item)}>取消</a>
                          ) : (
                            <a key={index} onClick={() => this.reply(item)}>回复</a>
                          )
                        }
                        <Divider type="vertical" />
                        <Popconfirm title="您确定要删除评论吗？" onConfirm={() => this.deleteComment(item)}>
                          <a>删除</a>
                        </Popconfirm>
                      </div>,

                    ]}
                  >
                    { this.renderReplyList(item)}
                    {
                      editorVisible && reply.id === item.id ? (
                        <div>
                          <BraftEditor
                            hooks={hooks}
                            defaultValue={BraftEditor.createEditorState('')}
                            onChange={this.handleReplyChange}
                            style={{ border: '1px solid #E8E8E8' }}
                            media={{ uploadFn: this.uploadFn }}
                            contentStyle={{ height: '144px' }}
                          />
                          <Button style={{ marginTop: 12 }} htmlType = "submit" loading={submitting} onClick={this.handleReplySubmit} type="primary">
                            发表
                          </Button>
                        </div>
                      ) : (
                        null
                      )
                    }
                  </Comment>
                ) : (
                  null
                )
              }
            </li>
          )}
        />
        <div style={{ marginTop: '30px' }}>
          <Pagination
            showQuickJumper
            defaultCurrent={1}
            current={pageNum}
            total={listCommentTotal}
            onChange={this.changePagination}
            showTotal={total => ` 总共 ${total} 条评论`}
            pageSize={10}
            hideOnSinglePage
          />
        </div>
      </div>
    );
  };

  changePagination = pageNum => {
    const { onFindCommentsPage, taskId } = this.props;
    onFindCommentsPage({ taskId, pageNum });
    this.setState({ pageNum })
};

// 监听键盘事件
  onKeyDown=e => this.setState({ onKeyDown: e.keyCode });

  // 取消回复
  cancelReply =() => {
    this.setState({
      editorVisible: false,
      reply: {
        id: '',
        name: '',
        comments: '',
        uid: '',
      },
    })
  };

  // 展开列表里取消回复
  cancelReplyList=() => {
    this.setState({
      replyEditorVisible: false,
      reply: {
        id: '',
        name: '',
        comments: '',
        uid: '',
      },
    })
  };

  // 回复
  reply = e => {
    this.setState({
      editorVisible: true,
      reply: {
        id: e.id,
        name: e.commentatorName,
        comments: e.id,
        uid: e.commentatorId,
      },
    })
  };

  // 在展开列表里回复
  replyList = (item, list) => {
    this.setState({
      replyEditorVisible: true,
      reply: {
        id: item.id,
        name: list.commentatorName,
        comments: list.id,
        uid: list.commentatorId,
      },
    });
  };

  // 提交
  handleSubmit= async () => {
    const { form: { validateFields } } = this.props;
    validateFields((errors, values) => {
      if (errors) return;
      // 在编辑器获得焦点时按下ctrl+s会执行此方法
      // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
      const htmlContent = values.comment.toHTML();
      if (!values.comment) return;
      this.setState({ submitting: true });
      const { onSaveComments, taskId, onFindRecord } = this.props;
      onSaveComments(0, {
        taskId,
        commentatorId: '123456',
        commentatorName: '鼬神',
        comment: htmlContent,
      });
      this.props.form.resetFields(['comment']);
      this.setState({
        editorState: BraftEditor.createEditorState(null),
      });
      this.cancelReply();
      onFindRecord({ taskId });
      this.findTaskCommentData();
      this.setState({ pageNum: 1 });
      setTimeout(() => this.findTaskCommentData(), 1500);
      setTimeout(() => this.findTaskCommentData(), 2000);
      setTimeout(() => this.findTaskCommentData(), 2500);
      setTimeout(() => this.findTaskCommentData(), 3000);
      setTimeout(() => this.findTaskCommentData(), 3500);
      setTimeout(() => this.findTaskCommentData(), 4000);
      this.setState({
        submitting: false,
      });
    })
    // const result = await saveEditorContent(htmlContent)
    // if (!this.state.value) {
    //   return;
    // }
    // this.setState({
    //   submitting: true,
    // });
    // const { onSaveComments, taskId } = this.props;
    // const { reply } = this.state;
    //
    // onSaveComments(0, {
    //   taskId,
    //   commentatorUid: '123456',
    //   commentatorName: '鼬神',
    //   comment: this.state.value,
    //   replyId: reply.id,
    //   replyComments: this.state.value,
    // });
    // this.setState({ value: '' });
    // this.setState({
    //   reply: {
    //     id: '',
    //     name: '',
    //     value: '',
    //   },
    // });
    // setTimeout(this.findTaskCommentData(), 1500);
    // this.setState({
    //   submitting: false,
    // });
  };

  // 回复内容提交
  handleReplySubmit= async () => {
    // 在编辑器获得焦点时按下ctrl+s会执行此方法
    // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
    const htmlContent = this.state.replyEditorState.toHTML();
    if (!this.state.replyEditorState) return;
    this.setState({ submitting: true });
    const { onSaveComments, taskId, onFindRecord } = this.props;
    const { reply } = this.state;
    onSaveComments(0, {
      taskId,
      commentatorUid: '123456',
      commentatorName: '鼬神',
      comment: htmlContent,
      replyId: reply.id,
      replyComments: reply.comments,
      repliedId: reply.uid,
      repliedName: reply.name,
    });
    this.props.form.resetFields(['comment']);
    this.cancelReply();
    onFindRecord({ taskId });
    this.findTaskCommentData();
    setTimeout(() => this.findTaskCommentData(), 1500);
    setTimeout(() => this.findTaskCommentData(), 2000);
    setTimeout(() => this.findTaskCommentData(), 2500);
    setTimeout(() => this.findTaskCommentData(), 3000);
    setTimeout(() => this.findTaskCommentData(), 3500);
    setTimeout(() => this.findTaskCommentData(), 4000);
    this.setState({
      submitting: false,
    });
  };

  handleReplyChange = replyEditorState => {
    this.setState({ replyEditorState });
  }

  handleChange = editorState => {
    this.setState({ editorState });
    // const { reply, onKeyDown } = this.state;
    // const name = `${reply.value}`;
    // if (onKeyDown === 8) {
    //   if (reply.value === undefined || reply.value === null || reply.value === '' || reply.value.length === 0) {
    //     const value = e.target.value.replace(`${name} `, '');
    //     this.setState({
    //       value,
    //     });
    //   } else if (e.target.value.length === name.length) {
    //       this.setState({
    //         reply: {
    //           id: '',
    //           name: '',
    //           value: '',
    //         },
    //       });
    //       this.setState({
    //         value: '',
    //       });
    //     } else {
    //       const value = e.target.value.replace(`${name} `, '');
    //       if (e.target.value.length === name.length) {
    //         this.setState({
    //           reply: {
    //             id: '',
    //             name: '',
    //             value: '',
    //           },
    //         });
    //       }
    //       this.setState({
    //         value,
    //       });
    //     }
    // } else if (reply.value === undefined || reply.value === null || reply.value === '' || reply.value.length === 0) {
    //     const value = e.target.value.replace(`${name} `, '');
    //     this.setState({
    //       value,
    //     });
    //   } else {
    //     const value = e.target.value.replace(`${name} `, '');
    //     this.setState({
    //       value,
    //     });
    //   }
  };

  // 鼠标点击其他地方时隐藏
  one=e => {
    e.nativeEvent.stopImmediatePropagation();
    this.showBraftEditor()
  }

  render() {
    console.log('this.props', this.props);
    const { submitting, editorState, controlVisible } = this.state;
    const { reply } = this.state;
    const { getFieldDecorator } = this.props.form;
    const extendControls = [
      {
        key: 'clear-editor',
        type: 'button',
        text: '清空编辑器',
        onClick: this.clearContent,
      },
    ];
    const htmlll = '<p></p><div class="media-wrap image-wrap"><img controls="" src="/api/v1/minio/oss/file/4836039264028672"/></div><p></p>';
    console.log("html",htmlll);
    console.log("htmr",convert(htmlll));
    return (
      <>
        <div onClick={this.one}>
          <Row>
            <Col>
              <Comment
                avatar={
                  <Avatar
                    src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                    alt="Serati Ma"
                  />
                }
                content={
                  <Editor
                    onKeyDown={this.onKeyDown}
                    onChange={this.handleChange}
                    onSubmit={this.handleSubmit}
                    submitting={submitting}
                    value={editorState}
                    replyid={reply.value}
                    getFieldDecorator={getFieldDecorator}
                    uploadFn={this.uploadFn}
                    controlVisible={controlVisible}
                    showBraftEditor={this.showBraftEditor}
                    hideBraftEditor={this.hideBraftEditor}
                    extendControls={extendControls}
                  />
                }
              />
            </Col>
          </Row>
        </div>
      <Row style={{ marginTop: 12 }}>
        <Col>
          {this.renderCommentList()}
        </Col>
      </Row>
      </>
    );
  }
}
