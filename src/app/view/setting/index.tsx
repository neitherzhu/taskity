import { Tooltip, Drawer, Switch, InputNumber } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useStore, useVisibility } from "@app/hooks";
import { SettingsLine } from "@xm/icons-taskity/dist/react";
import FormItem from "./component/form-item";

const Setting = () => {
  const [visible, toggle] = useVisibility(false);
  const { settingStore } = useStore();
  const handleChange = (key: string, value: any) => {
    // @ts-ignore
    settingStore.update({
      [key]: value,
    });
  };
  useEffect(() => {
    if (!visible) return;

    settingStore.getSetting();
  }, [visible]);

  return (
    <div>
      <Tooltip title="设置">
        <span className="flex items-center cursor-pointer" onClick={toggle}>
          <SettingsLine size={20} />
        </span>
      </Tooltip>
      <Drawer open={visible} title="设置" onClose={toggle}>
        <FormItem label="锁屏自动停止任务" className="justify-between">
          <Switch
            value={settingStore.stopWhenLockScreen}
            onChange={handleChange.bind(null, "stopWhenLockScreen")}
          />
        </FormItem>
        <FormItem label="解锁屏幕自动开启任务" className="justify-between">
          <Switch
            value={settingStore.startWhenUnlockScreen}
            onChange={handleChange.bind(null, "startWhenUnlockScreen")}
          />
        </FormItem>
        <FormItem>
          <div className="font-weight-500">
            <span>空闲</span>
            <InputNumber
              step={1}
              min={1}
              max={10}
              value={settingStore.stopWhenNoBehaviorInMiniutes}
              style={{ width: 54 }}
              className="mx-8"
              onChange={handleChange.bind(null, "stopWhenNoBehaviorInMiniutes")}
            />
            <span>分钟自动停止任务</span>
          </div>
        </FormItem>
      </Drawer>
    </div>
  );
};

export default observer(Setting);
