import { Modal, Select, SelectProps } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { useRef } from 'react';

import { useStore } from '@app/hooks';
import Task from '@app/store/task';
import { isSystemNav } from '@app/util';

type TaskMoveModalProps = {
  task: Task;
  onCancel: () => void;
};

const TaskMoveModal: React.FC<TaskMoveModalProps> = ({ task, onCancel }) => {
  const { navListStore, taskListStore } = useStore();
  const moveToIdRef = useRef();
  const handleSelectChange: SelectProps["onChange"] = ({ value }) => {
    moveToIdRef.current = value;
  };
  const handleConfirmMove = async () => {
    if (!moveToIdRef.current) {
      return onCancel();
    }
    await taskListStore.moveTask({
      fromNavId: task.navId,
      toNavId: moveToIdRef.current,
      id: task.id,
    });
    onCancel();
  };

  return (
    <Modal
      open
      centered
      width={400}
      onCancel={onCancel}
      onOk={handleConfirmMove}
      title="移动到"
    >
      <Select
        defaultValue={task.navId}
        style={{ width: "100%" }}
        onChange={handleSelectChange}
        labelInValue
        options={navListStore.list.map((x) => ({
          value: x.id,
          label: x.name,
          disabled: isSystemNav(x.type),
        }))}
      ></Select>
    </Modal>
  );
};

export default observer(TaskMoveModal);
