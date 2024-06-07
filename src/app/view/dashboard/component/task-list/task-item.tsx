import { Checkbox, CheckboxProps, Dropdown, MenuProps, Modal } from 'antd';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';

import { PRIORITY_LIST } from '@app/constant';
import { useStore } from '@app/hooks';
import Task from '@app/store/task';
import { isCompleted, parseCount } from '@app/util';
import {
    CirclePlayFill, CircleTimeLine, TheflagsLine, ZantingLine
} from '@xm/icons-taskity/dist/react';

import styles from './index.module.less';

type TaskItemProps = {
  task: Task;
  navName: string;
  onMove: (task: Task) => void;
};
const TaskItem: React.FC<TaskItemProps> = ({ task, navName, onMove }) => {
  const { taskListStore, taskInProgressStore } = useStore();
  const { id, name, status, priority, duration } = task;
  const isFinished = isCompleted(status);
  const isStarted =
    taskInProgressStore.id === id && taskInProgressStore.ticking;
  const handleClick = () => {
    taskListStore.setCurrentTaskId(id);
  };
  const toggleProgress = () => {
    if (taskInProgressStore.id === task.id && taskInProgressStore.ticking) {
      taskInProgressStore.setTicking(false);
    } else {
      taskInProgressStore.setId(task.id);
      taskInProgressStore.setTicking(true);
    }
  };
  const handleComplete: CheckboxProps["onChange"] = (ev) => {
    taskListStore.completeTask(task.id, ev.target.checked);
  };
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "update") {
      taskListStore.setCurrentTaskId(task.id);
    } else if (key === "delete") {
      Modal.confirm({
        title: `删除任务”${task.name}“`,
        content: "删除的任务无法恢复，确定要删除此任务吗？",
        centered: true,
        onOk: () => {
          taskListStore.deleteTask(task.id);
        },
      });
    } else if (key === "complete") {
      taskListStore.completeTask(task.id, true);
    } else if (key === "uncomplete") {
      taskListStore.completeTask(task.id, false);
    } else if (key === "start") {
      toggleProgress();
    } else if (key === "stop") {
      toggleProgress();
    } else if (key === "moveTo") {
      onMove(task);
    }
  };
  const menus = {
    items: [
      !isFinished &&
        (!isStarted
          ? {
              key: "start",
              label: <span>开始任务</span>,
            }
          : {
              key: "stop",
              label: <span>暂停任务</span>,
            }),
      !isFinished
        ? {
            key: "complete",
            label: <span>完成任务</span>,
          }
        : {
            key: "uncomplete",
            label: <span>取消完成任务</span>,
          },
      {
        key: "moveTo",
        label: <span>移动到</span>,
      },
      {
        key: "update",
        label: <span>编辑任务</span>,
      },
      {
        key: "delete",
        label: <span>删除任务</span>,
      },
    ].filter(Boolean),
    onClick: handleMenuClick,
  };

  const priorityData = PRIORITY_LIST.find((x) => x.value === priority);

  return (
    <Dropdown menu={menus} trigger={["contextMenu"]}>
      <div className="flex items-center px-12 bg-white border-radius mb-4 text-12">
        <Checkbox onChange={handleComplete} checked={isFinished} />
        {!isFinished && (
          <span
            className="ml-8 c-primary cursor-pointer flex items-center"
            onClick={toggleProgress}
          >
            {taskInProgressStore.id === id && taskInProgressStore.ticking ? (
              <ZantingLine size={16} />
            ) : (
              <CirclePlayFill size={16} />
            )}
          </span>
        )}
        <div
          className={classnames(styles.task, "ml-8 flex-1 py-12 ")}
          onClick={handleClick}
        >
          {name}
        </div>
        {navName && <div className="mx-12 c-gray4">{navName}</div>}
        {!!duration && (
          <span className="c-primary flex items-center">
            <CircleTimeLine size={16} className="mr-4" />
            {parseCount(duration)}
          </span>
        )}
        {priorityData.color && (
          <span className={classnames(priorityData.color, "ml-12")}>
            <TheflagsLine size={16} />
          </span>
        )}
      </div>
    </Dropdown>
  );
};

export default observer(TaskItem);
