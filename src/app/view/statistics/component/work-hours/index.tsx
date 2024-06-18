import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import * as echarts from "echarts";
import React, { useEffect, useRef } from "react";

import { ONE_DAY_MS } from "@app/constant";
import { BaseTask, RecordMap } from "@app/types";
import { getDayMsList, getDuration, parseCount } from "@app/util";

import styles from "./index.module.less";

type WorkHoursProps = {
  dates: RangePickerProps["value"];
  taskList: BaseTask[];
  recordMap: RecordMap;
};

const getOptions = ({ taskList, recordMap, dates }: WorkHoursProps) => {
  const rangeTaskList = taskList.filter((x) => recordMap[x.id]);
  const rangeDates = getDayMsList(dates);
  const xAxis = rangeDates.map((x) => dayjs(x).format("MM-DD"));

  const rawData = rangeTaskList.map((x) => {
    return rangeDates.map((ms) => {
      return getDuration(recordMap[x.id], ms, ms + ONE_DAY_MS);
    });
  });

  const totalData: number[] = [];
  if (rawData.length) {
    for (let i = 0; i < rawData[0].length; ++i) {
      let sum = 0;
      for (let j = 0; j < rawData.length; ++j) {
        sum += rawData[j][i];
      }
      totalData.push(sum);
    }
  }

  const series: echarts.LineSeriesOption = {
    // smooth: true,
    type: "line",
    data: totalData,
  };

  return {
    tooltip: {
      show: true,
      formatter: (params: any) => {
        return `
          <div>工作时间：${(
            parseCount(params.value, "") as [string, string]
          ).join("")}</div>
        `;
      },
    },
    grid: {
      left: 100,
      right: 100,
      top: 50,
      bottom: 50,
    },
    yAxis: {
      type: "value",
    },
    xAxis: {
      type: "category",
      data: xAxis,
    },
    series,
  };
};

const WorkHours: React.FC<WorkHoursProps> = ({
  dates,
  taskList,
  recordMap,
}) => {
  const echartContainerRef = useRef<HTMLDivElement>(null);
  const echartRef = useRef<echarts.EChartsType>();

  useEffect(() => {
    if (!echartRef.current) {
      echartRef.current = echarts.init(echartContainerRef.current);
    }

    echartRef.current.setOption(getOptions({ dates, taskList, recordMap }));
  }, [dates, recordMap]);

  useEffect(() => {
    const handleResize = () => {
      echartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative">
      <div className="px-40 font-weight-500 text-20">每日工时</div>
      <div className={styles.wraper} ref={echartContainerRef}></div>
    </div>
  );
};

export default WorkHours;
