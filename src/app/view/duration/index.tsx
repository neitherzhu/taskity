import { Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { useStore } from '@app/hooks';

import { MaxCounter, MinCounter } from './component/counter';
import styles from './index.module.less';

const Duration = () => {
  const { taskInProgressStore } = useStore();
  const [wallpaper, setWallpaper] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const handlePause = () => {
    taskInProgressStore.setTicking(false);
    taskInProgressStore.currentTask.update({ duration: count });
  };

  const handleStart = () => {
    taskInProgressStore.setTicking(true);
  };

  useEffect(() => {
    setLoading(true);
    window.electron.onBehaviorChange((_: any, data: any) => {
      data ? handlePause() : handleStart();
    });
    window.electron.getWallpaper((_: any, data: string) => {
      setWallpaper(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.electron.timers.stop();

    if (taskInProgressStore.ticking) {
      setCount(taskInProgressStore.currentTask.duration);
      window.electron.timers.start();
      window.electron.timers.counting(() => {
        setCount((c) => {
          return c + 1;
        });
      });
    }
  }, [taskInProgressStore.ticking, taskInProgressStore.currentTask]);

  useEffect(() => {
    if (!count || !taskInProgressStore.currentTask) return;

    if (count % 5 === 0) {
      taskInProgressStore.currentTask.update({ duration: count });
    }
  }, [count]);

  if (!taskInProgressStore.currentTask) {
    return null;
  }

  return (
    <div>
      {taskInProgressStore.size === "small" ? (
        <MinCounter
          name={taskInProgressStore.currentTask.name}
          wallpaper={wallpaper}
          count={count}
          onPause={handlePause}
          onStart={handleStart}
        />
      ) : (
        <MaxCounter
          name={taskInProgressStore.currentTask.name}
          wallpaper={wallpaper}
          count={count}
          onPause={handlePause}
          onStart={handleStart}
        />
      )}
      {loading && (
        <div className={styles.loading}>
          <Spin />
        </div>
      )}
    </div>
  );
};

export default observer(Duration);
