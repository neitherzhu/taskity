import { BrowserWindow, net } from "electron";

const WALLPAPER_API = "https://bing.img.run/rand_uhd.php";

export const getWallpaper = async (mainWindow: BrowserWindow) => {
  const response = await net.fetch(WALLPAPER_API);

  if (response.ok) {
    const body = await response.arrayBuffer();
    const data =
      "data:" +
      response.headers.get("content-type") +
      ";base64," +
      Buffer.from(body).toString("base64");

    mainWindow.webContents.send("set-wallpaper", data);
  }
};
