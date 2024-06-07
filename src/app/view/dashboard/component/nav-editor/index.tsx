import { Input, InputProps, Modal } from 'antd';
import { observer, useLocalObservable } from 'mobx-react-lite';

import { COLORS } from '@app/constant';

import ColorItem from './color-item';

export type EditNav = {
  name: string;
  color: string;
};

export type NavEditorProps = {
  defaultName?: string;
  defaultColor?: string;
  onCancel: () => void;
  onOk: (nav: EditNav) => void;
};
const NavEditor: React.FC<NavEditorProps> = ({
  defaultName = "",
  defaultColor = COLORS[Math.floor(Math.random() * COLORS.length)],
  onCancel,
  onOk,
}) => {
  const state = useLocalObservable<EditNav>(() => ({
    name: defaultName,
    color: defaultColor,
  }));

  const handleInputChange: InputProps["onChange"] = (ev) => {
    state.name = ev.target.value;
  };
  const handleColorChange = (color: string) => {
    state.color = color;
  };
  const handleConfirm = () => {
    onOk(state);
  };

  return (
    <Modal
      open
      centered
      width={400}
      onCancel={onCancel}
      onOk={handleConfirm}
      title="创建项目分类"
    >
      <Input
        placeholder="分类名称"
        value={state.name}
        onChange={handleInputChange}
        onPressEnter={handleConfirm}
        maxLength={20}
      />
      <div className="flex items-center mt-20">
        {COLORS.map((x) => (
          <ColorItem
            key={x}
            color={x}
            isActive={x === state.color}
            onClick={handleColorChange}
          />
        ))}
      </div>
    </Modal>
  );
};

export default observer(NavEditor);
