import classnames from "classnames";
import Duration from "@app/view/duration";
import Statistics from "@app/view/statistics";
import Setting from "@app/view/setting";

import NavList from "./component/nav-list";
import TaskDetail from "./component/task-detail";
import TaskInput from "./component/task-input";
import TaskList from "./component/task-list";
import TaskSummary from "./component/task-summary";

import styles from "./index.module.less";

const Dashboard = () => {
  return (
    <div className="h-full w-full flex">
      <NavList />
      <div className="flex-1 bl-1 border-gray2 border-solid bg-gray1 flex flex-col h-full w-full">
        <TaskSummary className="p-20" />
        <TaskInput className="px-20 pb-20" />
        <TaskList className="px-20 pb-20 flex-1 overflow-auto" />
      </div>
      <TaskDetail />
      <Duration />
      <div className={classnames(styles.icon, "flex items-center")}>
        <Statistics />
        <Setting />
      </div>
    </div>
  );
};

export default Dashboard;
