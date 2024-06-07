import { message } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import classnames from 'classnames';
import * as echarts from 'echarts';
import React, { useEffect, useRef } from 'react';

import { useStore } from '@app/hooks';
import Nav from '@app/store/nav';
import { BaseTask, RecordMap } from '@app/types';
import { getDuration, parseCount } from '@app/util';

import styles from './index.module.less';

type NavRecordProps = {
  taskList: BaseTask[];
  dates: RangePickerProps["value"];
  recordMap: RecordMap;
};

type Data = {
  name: string;
  value: number;
  itemStyle: {
    color: string;
  };
};

const getOptions = ({
  taskList,
  recordMap,
  navList,
  dates,
}: NavRecordProps & {
  navList: Nav[];
}) => {
  const startMs = +dates[0];
  const endMs = +dates[1];
  const rangeTaskList = taskList.filter((x) => recordMap[x.id]);
  const navMap: Record<string, number[]> = {};
  rangeTaskList.forEach((x) => {
    if (!navMap[x.navId]) {
      navMap[x.navId] = [];
    }
    navMap[x.navId].push(getDuration(recordMap[x.id], startMs, endMs));
  });

  const data = Object.keys(navMap)
    .map((x) => {
      const nav = navList.find((n) => String(n.id) === x);
      return {
        name: nav?.name ?? "",
        value: navMap[x]?.reduce((s, d) => s + d, 0) ?? 0,
        itemStyle: {
          color: nav?.color,
        },
      };
    })
    .filter((x) => x.name && x.value);

  return {
    tooltip: {
      formatter: (params: any) => {
        if (!params.value) {
          return "";
        }
        return (parseCount(params.value, "") as [string, string]).join("");
      },
    },
    legend: {
      selectedMode: true,
      top: "5%",
      left: "center",
    },
    series: [
      {
        name: "项目",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data,
      },
    ],
  };
};

const NavRecord: React.FC<NavRecordProps> = ({
  dates,
  taskList,
  recordMap,
}) => {
  const { navListStore } = useStore();
  const echartContainerRef = useRef<HTMLDivElement>(null);
  const echartRef = useRef<echarts.EChartsType>();
  const dataRef = useRef<Data[]>();

  const handleCopy = () => {
    const total = dataRef.current.reduce((n, x) => n + Number(x.value), 0);
    const content = dataRef.current
      .sort((a, b) => b.value - a.value)
      .reduce((s, x) => {
        return s + x.name + ":" + (x.value / total).toFixed(1) + "\n";
      }, "");
    window.electron.copy(content);
    message.success("复制成功");
  };
  useEffect(() => {
    if (!echartRef.current) {
      echartRef.current = echarts.init(echartContainerRef.current);
    }

    const option = getOptions({
      taskList,
      recordMap,
      navList: navListStore.list,
      dates,
    });
    dataRef.current = option.series[0].data;
    echartRef.current.setOption(option);
  }, [recordMap]);

  useEffect(() => {
    const handleResize = () => {
      echartRef.current?.resize();
    };
    window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative">
      <div className="px-40 font-weight-500 text-20">项目分类分布</div>
      <div className={styles.wraper} ref={echartContainerRef}></div>
      <span
        className={classnames(styles.btn, "cursor-pointer c-link text-12")}
        onClick={handleCopy}
      >
        复制
      </span>
    </div>
  );
};

export default NavRecord;
