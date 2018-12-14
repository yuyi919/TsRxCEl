// import { BrowserWindow, MenuItem } from 'electron';
// import { FileDialog } from './dialog';
// export const main: any = [
//     {
//         label: '文件',
//         submenu: [{
//             label: '打开',
//             accelerator: 'CmdOrCtrl+Z', 
//             click: (item: MenuItem, focusedWindow: BrowserWindow) => {
//                 new FileDialog().readFile('打开').subscribe((value: string)=>{
//                     console.log(value);
//                 });
//             }
//         }, {
//             label: '输出',
//             accelerator: 'CmdOrCtrl+X',
//             role: 'cut'
//         }]
//     }, {
//         label: '编辑',
//         submenu: [{
//             label: '撤销',
//             accelerator: 'CmdOrCtrl+Z',
//             role: 'undo'
//         }, {
//             label: '剪切',
//             accelerator: 'CmdOrCtrl+X',
//             role: 'cut'
//         }, {
//             label: '复制',
//             accelerator: 'CmdOrCtrl+C',
//             role: 'copy'
//         }, {
//             label: '粘贴',
//             accelerator: 'CmdOrCtrl+V',
//             role: 'paste'
//         }]
//     }, {
//         label: '显示',
//         submenu: [{
//             label: '进入全屏幕',
//             accelerator: (() => {
//                 if (process.platform === 'darwin') {
//                     return 'Ctrl+Command+F'
//                 } else {
//                     return 'F11'
//                 }
//             })(),
//             click: (item: MenuItem, focusedWindow: BrowserWindow) => {
//                 if (focusedWindow) {
//                     focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
//                 }
//             }
//         }, {
//             label: '开发者工具',
//             accelerator: (() => {
//                 if (process.platform === 'darwin') {
//                     return 'Alt+Command+I'
//                 } else {
//                     return 'Ctrl+Shift+I'
//                 }
//             })(),
//             click: (item: MenuItem, focusedWindow: BrowserWindow) => {
//                 if (focusedWindow) {
//                     focusedWindow.webContents.toggleDevTools()
//                     focusedWindow.webContents.reload()
//                 }
//             }
//         }, {
//             type: 'separator'
//         }]
//     }, {
//         label: '窗口',
//         role: 'window',
//         submenu: [{
//             label: '重载',
//             accelerator: 'F5',
//             click: (item: MenuItem, focusedWindow: BrowserWindow) => {
//                 if (focusedWindow) {
//                     focusedWindow.reload()
//                 }
//             }
//         }, {
//             label: '强制重载',
//             accelerator: 'alt+F5',
//             click: (item: MenuItem, focusedWindow: BrowserWindow) => {
//                 if (focusedWindow) {
//                     focusedWindow.webContents.reloadIgnoringCache();
//                 }
//             }
//         }, {
//             label: '最小化',
//             accelerator: 'CmdOrCtrl+M',
//             role: 'minimize'
//         }]
//     }
// ];