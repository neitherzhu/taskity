import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useState } from 'react';

import { useStore } from '@app/hooks';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const { navListStore } = useStore();

  useEffect(() => {
    navListStore.getNavList().finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spin />
      </div>
    );

  return (
    <ConfigProvider locale={zhCN}>
      <div className="h-full w-full overflow-hidden">{children}</div>
    </ConfigProvider>
  );
};

export default Layout;
