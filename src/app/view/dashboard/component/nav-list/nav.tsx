import { Dropdown, MenuProps, Modal } from 'antd';
import classnames from 'classnames';
import React, { useMemo } from 'react';

import { NAV_TYPE } from '@app/constant';
import { useStore } from '@app/hooks';
import Nav from '@app/store/nav';
import XmIcon from '@xm/icons-taskity/dist/react';

import styles from './index.module.less';

type NavProps = {
  nav: Nav;
  isActive: boolean;
  onUpdate: (nav: Nav) => void;
};
const NavItem: React.FC<NavProps> = ({ nav, isActive, onUpdate }) => {
  const { navListStore } = useStore();
  const { setCurrentNavId, deleteNav } = navListStore;
  const { type, id, name, icon, activeIcon, color } = nav;
  const handleClick = () => {
    setCurrentNavId(id);
  };
  const menus = useMemo(() => {
    if (type !== NAV_TYPE.CUSTOM) return null;
    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
      if (key === "update") {
        onUpdate(nav);
      } else if (key === "delete") {
        Modal.confirm({
          title: `删除项目分类${name}`,
          content:
            "删除项目分类不会删除此项目分类下的任务，确定要删除此项目分类吗？",
          centered: true,
          onOk: () => {
            deleteNav(id);
          },
        });
      }
    };
    return {
      items: [
        {
          key: "update",
          label: <span>编辑</span>,
        },
        {
          key: "delete",
          label: <span>删除</span>,
        },
      ],
      onClick: handleMenuClick,
    };
  }, [type]);

  return (
    <div
      onClick={handleClick}
      className={classnames(
        styles.nav,
        "flex items-center border-radius px-8 bg-gray1:hover",
        {
          "bg-gray1": isActive,
        }
      )}
    >
      {icon ? (
        <XmIcon name={isActive ? activeIcon : icon} color={color} size={18} />
      ) : color ? (
        <span className={styles.icon} style={{ backgroundColor: color }}></span>
      ) : null}
      <span className="ml-4 flex-1 truncate-1">{name}</span>
      {type === NAV_TYPE.CUSTOM && (
        <Dropdown menu={menus} trigger={["hover"]}>
          <span className="flex items-center">
            <XmIcon name="more_applet_fill" />
          </span>
        </Dropdown>
      )}
    </div>
  );
};

export default NavItem;
