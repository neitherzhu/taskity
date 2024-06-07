import classnames from 'classnames';

import { CheckthenumberLine } from '@xm/icons-taskity/dist/react';

import styles from './index.module.less';

type ColorItemProps = {
  color: string;
  isActive: boolean;
  onClick: (color: string) => void;
};
const ColorItem: React.FC<ColorItemProps> = ({ color, isActive, onClick }) => {
  const handleClick = () => {
    onClick(color);
  };
  return (
    <div
      className={classnames(
        styles.icon,
        "mr-8 c-white flex items-center justify-center cursor-pointer"
      )}
      style={{ background: color }}
      onClick={handleClick}
    >
      {isActive && <CheckthenumberLine size={12} />}
    </div>
  );
};

export default ColorItem;
