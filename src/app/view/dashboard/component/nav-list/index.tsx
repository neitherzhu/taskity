import { message } from 'antd';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';

import { useStore, useVisibility } from '@app/hooks';
import Nav from '@app/store/nav';
import { PlusLinearLine } from '@xm/icons-taskity/dist/react';

import NavEditor, { EditNav } from '../nav-editor';
import styles from './index.module.less';
import NavItem from './nav';

const NavList = () => {
  const { navListStore } = useStore();
  const [visible, toggle] = useVisibility(false);
  const editingNavRef = useRef<Nav>();

  const handleCreate = () => {
    toggle();
  };

  const handleCancel = () => {
    editingNavRef.current = null;
    toggle();
  };

  const handleConfirm = (nav: EditNav) => {
    if (editingNavRef.current?.id) {
      editingNavRef.current?.update(nav);
    } else {
      navListStore.addNav(nav);
    }
    message.success("操作成功");
    handleCancel();
  };

  const handleUpdate = (nav: Nav) => {
    editingNavRef.current = nav;
    toggle();
  };

  return (
    <div className={classnames(styles["nav-list"], "text-14 flex flex-col")}>
      <div className="p-8 flex-1 overflow-auto">
        {navListStore.list?.map((x) => (
          <NavItem
            key={x.id}
            nav={x}
            isActive={navListStore.currentNavId === x.id}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
      <div
        className={classnames(
          styles.nav,
          "flex items-center px-8 bt-1 border-gray1 border-solid c-primary:hover cursor-pointer"
        )}
        onClick={handleCreate}
      >
        <PlusLinearLine size={18} className="mr-4" />
        <span>创建项目分类</span>
      </div>
      {visible && (
        <NavEditor
          defaultColor={editingNavRef.current?.color}
          defaultName={editingNavRef.current?.name}
          onCancel={handleCancel}
          onOk={handleConfirm}
        />
      )}
    </div>
  );
};

export default observer(NavList);
