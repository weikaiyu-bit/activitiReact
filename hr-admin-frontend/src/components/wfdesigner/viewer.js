import React from 'react';
import GGEditor, { Flow } from 'gg-editor';
import styles from './index.less';

GGEditor.setTrackable(false);

export default class viewer extends React.PureComponent {
  render() {
    const { data, busy } = this.props;

    return (
      <GGEditor>
        <Flow graph={{ modes: { default: [] } }} className={styles.viewer} data={data.content} />
      </GGEditor>
    );
  }
}
