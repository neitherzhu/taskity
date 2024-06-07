import '@xm/atom-class';
import './index.less';

import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import { createRoot } from 'react-dom/client';

import { StoreProvider } from './hooks/use-store';
import Layout from './layout';
import store from './store';
import Dashboard from './view/dashboard';

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const App = () => {
  return (
    <StoreProvider value={store}>
      <Layout>
        <Dashboard />
      </Layout>
    </StoreProvider>
  );
};
const root = createRoot(document.getElementById("root"));
root.render(<App />);
