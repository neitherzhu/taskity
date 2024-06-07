import { BrowserWindow, screen } from "electron";

let isStop = false;
let stopMins = 0;
const MAX_STOP = 60 * 10; // 10分钟无动作则暂停

export const behaviorTracker = (mainWindow: BrowserWindow) => {
  const { x, y } = screen.getCursorScreenPoint();
  const lastMousePosition = `${x}-${y}`;

  setTimeout(() => {
    const { x, y } = screen.getCursorScreenPoint();
    const currentMousePosition = `${x}-${y}`;
    if (lastMousePosition === currentMousePosition) {
      stopMins++;
      if (stopMins === MAX_STOP) {
        isStop = true;
        mainWindow.webContents.send("behavior-change", true);
      }
    } else {
      if (isStop) {
        // 任务开始需要手动开始
        // mainWindow.webContents.send('behavior-change', false);
      }
      stopMins = 0;
      isStop = false;
    }

    behaviorTracker(mainWindow);
  }, 1000);
};
