import { Input, InputProps } from 'antd';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';

import { useStore } from '@app/hooks';
import { isDoneNav, isSystemNav, isTodayNav, isTomorrowNav } from '@app/util';
import { PlusLinearLine } from '@xm/icons-taskity/dist/react';

import styles from './index.module.less';

type TaskInputProps = {
  className?: string;
};
const TaskInput: React.FC<TaskInputProps> = ({ className }) => {
  const { navListStore, taskListStore } = useStore();
  const [name, setName] = useState("");
  const compositionRef = useRef(false);

  const handleCompositionStart = () => {
    compositionRef.current = true;
  };
  const handleCompositionEnd = () => {
    compositionRef.current = false;
  };
  const handleChange: InputProps["onChange"] = (ev) => {
    setName(ev.target.value);
  };
  const handleAddTask = () => {
    if (!name.trim() || compositionRef.current) return;

    const deadLine = isTodayNav(navListStore.currentNavId)
      ? dayjs().endOf("day")
      : isTomorrowNav(navListStore.currentNavId)
      ? dayjs().add(1, "day").endOf("day")
      : dayjs().endOf("week");
    taskListStore.addTask({
      name,
      deadLine: +deadLine,
      navId: navListStore.currentNavId,
    });
    setName("");
  };

  return !navListStore.currentNav ||
    isDoneNav(navListStore.currentNavId) ? null : (
    <div className={className}>
      <Input
        value={name}
        autoFocus
        size="large"
        placeholder={`${
          isSystemNav(navListStore.currentNav.type)
            ? ""
            : `在"${navListStore.currentNav.name}"中`
        }添加一个任务，按「回车」保存`}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onPressEnter={handleAddTask}
        className={classnames(styles.input, "text-14 py-12")}
        prefix={<PlusLinearLine size={18} className="c-gray4" />}
      />
    </div>
  );
};

export default observer(TaskInput);
