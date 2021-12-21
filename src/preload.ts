// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { ipcRenderer } from "electron";
import Produto from "../backend/src/modelo/Produto"

(window as any).ipcRenderer = ipcRenderer;