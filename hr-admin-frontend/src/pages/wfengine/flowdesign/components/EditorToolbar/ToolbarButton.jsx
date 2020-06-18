import { Command } from 'gg-editor';
import React from 'react';
import { Tooltip } from 'antd';
import { IconFont, CustomIconFont } from '../../common/IconFont';
import styles from './index.less';

const upperFirst = str => str.toLowerCase().replace(/( |^)[a-z]/g, l => l.toUpperCase());

const ToolbarButton = props => {
  const { command, icon, text } = props;
  return (
    <Command name={command}>
      <Tooltip
        title={text || upperFirst(command)}
        placement="bottom"
        overlayClassName={styles.tooltip}
      >
        <IconFont type={`icon-${icon || command}`} />
      </Tooltip>
    </Command>
  );
};
const CustomToolbarButton = props => {
  const { icon, text, _fun } = props;
  const iconFuntion = () => {
    _fun();
  }
  return (
      <Tooltip
        title={text}
        placement="bottom"
        overlayClassName={styles.tooltip}
      >
        <CustomIconFont type={`icon-${icon}`} onClick={iconFuntion}/>
      </Tooltip>
  );
};

export { ToolbarButton, CustomToolbarButton };
