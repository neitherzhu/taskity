import {
    DatePicker, DatePickerProps, Input, InputProps, InputRef, Modal, Select, SelectProps, Tooltip
} from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { range } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';

import { PRIORITY_LIST } from '@app/constant';
import { useStore, useVisibility } from '@app/hooks';
import { isCompleted, parseCount } from '@app/util';
import XmIcon from '@xm/icons-taskity/dist/react';

import TaskMoveModal from '../task-move-modal';
import FormItem from './form-item';
import styles from './index.module.less';

const TaskDetail = () => {
  const { navListStore, taskListStore } = useStore();
  const [visible, toggle] = useVisibility(false);
  const inputRef = useRef<InputRef>(null);
  const { currentTask, setCurrentTaskId, deleteTask, completeTask } =
    taskListStore;

  if (!currentTask) return null;

  const isComplete = isCompleted(currentTask.status);

  const handleClose = () => {
    setCurrentTaskId(0);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: `删除任务”${currentTask.name}“`,
      content: "删除的任务无法恢复，确定要删除此任务吗？",
      centered: true,
      onOk: () => {
        deleteTask(currentTask.id);
      },
    });
  };

  const handleComplete = async () => {
    setCurrentTaskId(0);
    await completeTask(currentTask.id, true);
  };

  const handleNameChange: InputProps["onChange"] = (ev) => {
    const name = ev.target.value.trim();
    currentTask.update({ name });
  };

  const handlePriorityChange: SelectProps["onChange"] = (v) => {
    currentTask.update({ priority: v });
  };

  const handleDeadLineChange: DatePickerProps["onChange"] = (v) => {
    currentTask.update({ deadLine: +v });
  };

  const handleDescChange: TextAreaProps["onChange"] = (ev) => {
    const desc = ev.target.value.trim();
    currentTask.update({ desc });
  };

  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    return current && current <= dayjs().subtract(1, "day").endOf("day");
  };

  const disabledDateTime: DatePickerProps["disabledTime"] = (current) => ({
    disabledHours: () => {
      if (dayjs(current).date() === dayjs().date()) {
        return range(0, dayjs().hour());
      }
      return [];
    },
    disabledMinutes: () => {
      if (dayjs(current).date() === dayjs().date()) {
        return range(0, dayjs().minute());
      }
      return [];
    },
    disabledSeconds: () => {
      if (dayjs(current).date() === dayjs().date()) {
        return range(0, dayjs().second());
      }
      return [];
    },
  });

  const [t, d] = parseCount(currentTask.duration, "");

  return (
    <div
      className={classnames(
        styles["task-detail"],
        "flex flex-col bl-1 border-gray2 border-solid px-20 py-12"
      )}
    >
      <div className="flex-1">
        <div className="bb-1 border-solid border-gray2 pb-20">
          <Input
            ref={inputRef}
            value={currentTask.name}
            variant="borderless"
            placeholder="任务名称"
            className="font-weight-600"
            onChange={handleNameChange}
          />
        </div>
        <div className="py-20">
          <FormItem icon="circle_time_line" label="已用时">
            <span className="c-gray6">
              {t}
              {d}
            </span>
          </FormItem>
          <FormItem icon="theflags_line" label="优先级">
            <Select
              value={currentTask.priority}
              variant="borderless"
              options={PRIORITY_LIST}
              style={{ width: "100%" }}
              onChange={handlePriorityChange}
            />
          </FormItem>
          <FormItem icon="calendar_clock_line" label="到期时间">
            <DatePicker
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={disabledDate}
              disabledTime={disabledDateTime}
              placeholder="到期时间"
              value={
                currentTask.deadLine ? dayjs(currentTask.deadLine) : undefined
              }
              showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
              onChange={handleDeadLineChange}
            />
          </FormItem>
          <FormItem icon="house_line" label="所属项目分类">
            <div className="c-link cursor-pointer" onClick={toggle}>
              {navListStore.currentNav?.name || "暂无"}
            </div>
          </FormItem>
        </div>
        <div className="bt-1 border-gray2 border-solid pt-20">
          <Input.TextArea
            placeholder="添加备注"
            maxLength={1000}
            rows={2}
            value={currentTask.desc}
            onChange={handleDescChange}
          />
        </div>
      </div>
      <div
        className={classnames(
          styles["task-action"],
          "flex items-center justify-between bt-1 border-gray2 border-solid"
        )}
      >
        <Tooltip title="关闭">
          <span
            className="flex items-center c-gray5:hover cursor-pointer"
            onClick={handleClose}
          >
            <XmIcon name="closed_line" />
          </span>
        </Tooltip>
        <Tooltip title="删除">
          <span
            className="flex items-center c-gray5:hover cursor-pointer"
            onClick={handleDelete}
          >
            <XmIcon name="deleted_line" />
          </span>
        </Tooltip>
        {!isComplete && (
          <Tooltip title="完成">
            <span
              className="flex items-center c-gray5:hover cursor-pointer"
              onClick={handleComplete}
            >
              <XmIcon name="checkthenumber_line" />
            </span>
          </Tooltip>
        )}
      </div>
      {visible && <TaskMoveModal task={currentTask} onCancel={toggle} />}
    </div>
  );
};

export default observer(TaskDetail);
