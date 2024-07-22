import { Tooltip } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import classnames from "classnames";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

import { useVisibility } from "@app/hooks";
import { recordMapService, taskListService } from "@app/service";
import { BaseTask, RecordMap } from "@app/types";
import { formatterRecordMap } from "@app/util";
import { CircleStatisticsLine, DownLine } from "@xm/icons-taskity/dist/react";

import DailyTask from "./component/daily-task";
import DatePicker from "./component/date-picker";
import NavRecord from "./component/nav-record";
import WorkHours from "./component/work-hours";
// import Record from './component/record';
import styles from "./index.module.less";

const Statistics = () => {
  const [visible, toggle] = useVisibility(false);
  const [dates, setDates] = useState<RangePickerProps["value"]>([
    dayjs().startOf("month"),
    dayjs().endOf("day"),
  ]);
  const [totalRecordMap, setTotalRecordMap] = useState<RecordMap>({});
  const [rangeRecordMap, setRangeRecordMap] = useState<RecordMap>({});
  const [taskList, setTaskList] = useState<BaseTask[]>([]);

  const handleDateChange: RangePickerProps["onChange"] = (dates) => {
    setDates([
      dates?.[0] || dayjs().startOf("month"),
      dates?.[1] ? dayjs(dates[1]).endOf("day") : dayjs().endOf("day"),
    ]);
  };

  useEffect(() => {
    if (!visible) return;

    Promise.all([
      taskListService.getTaskList(),
      recordMapService.getRecordMap(),
    ]).then(([taskList, recordMap]) => {
      setTaskList(taskList);
      setTotalRecordMap(recordMap);
    });
  }, [visible]);

  useEffect(() => {
    setRangeRecordMap(formatterRecordMap(totalRecordMap, +dates[0], +dates[1]));
  }, [totalRecordMap, dates]);

  return (
    <div>
      <Tooltip title="统计">
        <span className="flex items-center cursor-pointer" onClick={toggle}>
          <CircleStatisticsLine size={20} />
        </span>
      </Tooltip>
      {visible && (
        <div className={classnames(styles.wraper, "bg-white overflow-auto")}>
          <span
            className={classnames(
              styles.close,
              "flex items-center cursor-pointer border-radius"
            )}
            onClick={toggle}
          >
            <DownLine size={30} />
          </span>
          <DatePicker value={dates} onChange={handleDateChange} />
          <DailyTask
            dates={dates}
            taskList={taskList}
            recordMap={rangeRecordMap}
          />
          {/* <Record
            navList={navList}
            taskList={taskList}
            recordList={recordList}
          /> */}
          <div className="flex mt-20">
            <div className="flex-1">
              <NavRecord
                dates={dates}
                taskList={taskList}
                recordMap={rangeRecordMap}
              />
            </div>
            <div className="flex-1">
              <WorkHours
                dates={dates}
                taskList={taskList}
                recordMap={rangeRecordMap}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(Statistics);
