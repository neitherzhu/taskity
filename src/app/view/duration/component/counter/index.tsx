import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore } from '@app/hooks';
import { isCompleted, parseCount } from '@app/util';
import {
    CheckthenumberLine, CirclePlayFill, DownLine, ZantingLine
} from '@xm/icons-taskity/dist/react';

import styles from './index.module.less';

type CounterProps = {
  name: string;
  count: number;
  wallpaper: string;
  onStart: () => void;
  onPause: () => void;
};

export const MaxCounter: React.FC<CounterProps> = observer(
  ({ name, wallpaper, count, onPause, onStart }) => {
    const { taskListStore, taskInProgressStore } = useStore();
    const handleMin = () => {
      taskInProgressStore.setSize("small");
    };
    const handleDone = async () => {
      await taskListStore.completeTask(taskInProgressStore.id, true);
    };
    return (
      <div
        className={classnames(
          styles["max-wraper"],
          "w-full h-full absolute bg-white"
        )}
      >
        <div
          className={classnames(styles.wallpaper, "w-full h-full absolute", {
            [styles.animate]: !!wallpaper,
          })}
          style={{
            backgroundImage: `url(${wallpaper})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <span
          className={classnames(
            styles.close,
            "flex items-center cursor-pointer border-radius"
          )}
          onClick={handleMin}
        >
          <DownLine size={30} />
        </span>
        <div
          className={classnames(
            styles.content,
            "absolute border-radius flex items-center justify-center"
          )}
        >
          <div className={classnames(styles.task, "truncate-2 p-24")}>
            {name}
          </div>
          <div className={styles.counter}>{parseCount(count)}</div>
          <div className={classnames(styles.btn, "flex items-center")}>
            <span
              className={classnames(
                "flex items-center c-white cursor-pointer mr-24"
              )}
              onClick={handleDone}
            >
              <CheckthenumberLine size={50} />
            </span>
            <span
              className={classnames("flex items-center c-white cursor-pointer")}
              onClick={taskInProgressStore.ticking ? onPause : onStart}
            >
              {taskInProgressStore.ticking ? (
                <ZantingLine size={50} />
              ) : (
                <CirclePlayFill size={50} />
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }
);

export const MinCounter: React.FC<CounterProps> = observer(
  ({ name, count, wallpaper, onStart, onPause }) => {
    const { taskInProgressStore } = useStore();
    return (
      <div
        className={classnames(
          styles["min-wraper"],
          "absolute bg-white border-radius bb-1 border-gray1 border-solid flex items-center p-12 c-white"
        )}
        onDoubleClick={() => taskInProgressStore.setSize("large")}
        style={{
          background: `rgba(0,0,0,0.5) url(${wallpaper}) no-repeat 0 0`,
        }}
      >
        <div className="flex items-center flex-1 mr-20 overflow-hidden">
          <div className="flex-1 truncate-1">{name}</div>
          <div className="ml-12">{parseCount(count)}</div>
        </div>
        <span
          className="flex items-center c-white cursor-pointer"
          onClick={taskInProgressStore.ticking ? onPause : onStart}
        >
          {taskInProgressStore.ticking ? (
            <ZantingLine size={20} />
          ) : (
            <CirclePlayFill size={20} />
          )}
        </span>
      </div>
    );
  }
);
