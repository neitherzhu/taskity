import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo, useRef } from 'react';

import { useStore, useVisibility } from '@app/hooks';
import Task from '@app/store/task';
import { isAllNav, isCompleted, isDoneNav } from '@app/util';
import { TriangleDownFill, TriangleUpFill } from '@xm/icons-taskity/dist/react';

import TaskMoveModal from '../task-move-modal';
import TaskItem from './task-item';

type TaskListProps = {
  className?: string;
};
const TaskList: React.FC<TaskListProps> = ({ className }) => {
  const { navListStore, taskListStore } = useStore();
  const [visibleCompleted, toggleCompleted, showCompleted, hideCompleted] =
    useVisibility(false);
  const [visible, toggle] = useVisibility(false);
  const moveToTaskRef = useRef<Task>();

  const handleMove = (task: Task) => {
    moveToTaskRef.current = task;
    toggle();
  };

  const finalTaskList = useMemo(() => {
    if (visibleCompleted) {
      return taskListStore.list;
    }

    return taskListStore.list.filter((x) => !isCompleted(x.status));
  }, [taskListStore.list, visibleCompleted]);

  useEffect(() => {
    if (isDoneNav(navListStore.currentNavId)) {
      showCompleted();
    } else {
      hideCompleted();
    }

    navListStore.currentNav &&
      taskListStore.getTaskListByNav(navListStore.currentNav);
  }, [navListStore.currentNavId]);

  return (
    <div className={className}>
      {finalTaskList.map((x) => (
        <TaskItem
          key={x.id}
          task={x}
          navName={
            isAllNav(navListStore.currentNavId)
              ? navListStore.list.find((n) => n.id === x.navId)?.name
              : navListStore.currentNav?.name
          }
          onMove={handleMove}
        />
      ))}
      {!isDoneNav(navListStore.currentNavId) && (
        <div className="mt-20 text-center text-14">
          <span
            className="bg-white border-radius py-4 px-8 cursor-pointer"
            onClick={toggleCompleted}
          >
            {visibleCompleted ? (
              <>
                隐藏已完成任务
                <TriangleUpFill size={12} className="ml-4" />
              </>
            ) : (
              <>
                显示已完成任务
                <TriangleDownFill size={12} className="ml-4" />
              </>
            )}
          </span>
        </div>
      )}
      {visible && (
        <TaskMoveModal task={moveToTaskRef.current} onCancel={toggle} />
      )}
    </div>
  );
};

export default observer(TaskList);
