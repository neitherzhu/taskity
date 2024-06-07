import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

import { ONE_DAY_MS } from '@app/constant';
import { useStore } from '@app/hooks';
import Nav from '@app/store/nav';
import { BaseTask, RecordMap } from '@app/types';
import { getDayMsList, getDuration, parseCount } from '@app/util';

import styles from './index.module.less';

type DailyTaskProps = {
  dates: RangePickerProps["value"];
  taskList: BaseTask[];
  recordMap: RecordMap;
};

const getOptions = ({
  taskList,
  recordMap,
  dates,
  navList,
}: DailyTaskProps & {
  navList: Nav[];
}) => {
  const rangeTaskList = taskList.filter((x) => recordMap[x.id]);
  const rangeDates = getDayMsList(dates);
  const xAxis = rangeDates.map((x) => dayjs(x).format("MM-DD"));
  const labels: string[] = [];
  const backgroundColors: string[] = [];
  rangeTaskList.forEach((x) => {
    const nav = navList.find((n) => x.navId === n.id);
    labels.push(nav.name + "-" + x.name);
    backgroundColors.push(nav.color);
  });
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

  const series: echarts.BarSeriesOption[] = labels.map((name, i) => {
    return {
      name,
      type: "bar",
      stack: "total",
      barWidth: "80%",
      color: backgroundColors[i],
      label: {
        show: true,
        formatter: (params: any) => {
          if (!params.value) {
            return "";
          }

          return (
            params.seriesName.split("-").pop() +
            "\n" +
            (parseCount(params.value, "") as [string, string]).join("")
          );
        },
      },
      data: rawData[i],
    };
  });

  return {
    tooltip: {
      show: true,
      formatter: (params: any) => {
        return `
          <div style="font-weight:bold">${params.seriesName}</div>
          <div>总计时间：${(
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

const DailyTask: React.FC<DailyTaskProps> = ({
  dates,
  taskList,
  recordMap,
}) => {
  const { navListStore } = useStore();
  const echartContainerRef = useRef<HTMLDivElement>(null);
  const echartRef = useRef<echarts.EChartsType>();

  useEffect(() => {
    if (!echartRef.current) {
      echartRef.current = echarts.init(echartContainerRef.current);
    }

    echartRef.current.setOption(
      getOptions({ dates, taskList, recordMap, navList: navListStore.list })
    );
  }, [dates, recordMap]);

  useEffect(() => {
    const handleResize = () => {
      echartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <div className="px-40 font-weight-500 text-20">每日任务统计</div>
      <div className={styles.wraper} ref={echartContainerRef}></div>
    </div>
  );
};

export default DailyTask;
