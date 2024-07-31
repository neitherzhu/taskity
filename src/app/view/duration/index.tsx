import { Spin, Modal } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";

import { useStore } from "@app/hooks";

import { MaxCounter, MinCounter } from "./component/counter";
import styles from "./index.module.less";

const Duration = () => {
  const { taskInProgressStore } = useStore();
  const [wallpaper, setWallpaper] = useState("");
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const countRef = useRef(0);
  const isPausedAutoRef = useRef(false);
  const autoPausedWhenLock = useRef(false);
  const handlePause = () => {
    taskInProgressStore.stop();
    taskInProgressStore.currentTask.update({ duration: countRef.current });
  };

  const handleStart = () => {
    taskInProgressStore.start(taskInProgressStore.id);
  };

  useEffect(() => {
    setLoading(true);
    window.electron.onBehaviorChange((_: any, data: any) => {
      if (!taskInProgressStore.currentTask) return;

      if (data) {
        if (taskInProgressStore.ticking) {
          autoPausedWhenLock.current = true;
          isPausedAutoRef.current = true;
          handlePause();
        }
      } else {
        // 只有自动停止的任务才会自动开启
        if (isPausedAutoRef.current && !taskInProgressStore.ticking) {
          isPausedAutoRef.current = false;
          handleStart();
        }
      }
    });
    window.electron.getWallpaper((_: any, data: string) => {
      setWallpaper(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.electron.timers.counting(() => {
      setCount((c) => {
        countRef.current = c + 1;
        return c + 1;
      });
    });
    window.electron.timers.resume((_: any, data: number) => {
      if (!autoPausedWhenLock.current) return;
      autoPausedWhenLock.current = false;
      Modal.confirm({
        centered: true,
        title: "累加锁屏时间？",
        content: `当前锁屏时间已累计 ${data} 秒，是否累加到当前任务？`,
        onOk: () => {
          setCount((c) => {
            countRef.current = c + data;
            return c + data;
          });
        },
      });
    });
  }, []);

  useEffect(() => {
    if (taskInProgressStore.ticking) {
      if (taskInProgressStore.currentTask) {
        countRef.current = taskInProgressStore.currentTask.duration;
        setCount(taskInProgressStore.currentTask.duration);
      }
      window.electron.timers.start();
    } else {
      window.electron.timers.stop();
    }
  }, [taskInProgressStore.ticking, taskInProgressStore.currentTask]);

  useEffect(() => {
    if (!count || !taskInProgressStore.currentTask) return;

    taskInProgressStore.currentTask.update({ duration: count });
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
