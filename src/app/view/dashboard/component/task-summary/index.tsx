import { observer } from 'mobx-react-lite';

import { useStore } from '@app/hooks';
import { isCompleted, isDoneNav, isTomorrowNav, parseCount } from '@app/util';

import Summary from './summary';

type TaskSummaryProps = {
  className?: string;
};
const TaskSummary: React.FC<TaskSummaryProps> = ({ className }) => {
  const { navListStore, taskListStore } = useStore();
  const currentNav = navListStore.list.find(
    (x) => x.id === navListStore.currentNavId
  );
  let totalEstimatedTime = 0;
  let doneCount = 0;
  let undoneCount = 0;
  let durationTime = 0;

  currentNav &&
    !isDoneNav(currentNav.id) &&
    taskListStore.list.forEach((x) => {
      totalEstimatedTime += x.estimatedTime || 0;
      durationTime += x.duration || 0;
      if (isCompleted(x.status)) {
        doneCount += 1;
      } else {
        undoneCount += 1;
      }
    });
  const [t, d] = parseCount(durationTime, "");

  return (
    <div className={className}>
      <div className="text-24">{currentNav?.name}</div>
      {!isDoneNav(currentNav?.id) && (
        <div className="bg-white border-radius flex items-flex-start py-20 mt-20">
          <Summary title="预估用时" value={totalEstimatedTime} desc="分钟" />
          <Summary title="待完成任务" value={undoneCount} />
          {!isTomorrowNav(currentNav?.id) && (
            <Summary title="已使用时间" value={t} desc={d} />
          )}
          {!isTomorrowNav(currentNav?.id) && (
            <Summary title="已完成任务" value={doneCount} />
          )}
        </div>
      )}
    </div>
  );
};

export default observer(TaskSummary);
