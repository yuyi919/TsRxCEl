import { Provider } from 'mobx-react';
import React from 'react';
import { FileDialog } from 'src/main/Electron/dialog';
import { openAulFile, windowReCreate, windowReload } from 'src/shared/clientApi';
import * as Lite from 'src/shared/components/Lite';
import { AppChildContainer, AppStores } from 'src/shared/stores';
import { ODrawer, OMainPanel, OTopBar } from './OComponent';
import { MainFrameStore } from './store';
import withStyle from './styles';

// export function AppTest(init: number) {
//     console.log('start')
//     console.log(useState(init))
//     const [app, setApp] = useState(init);
//     return {
//         app,
//         setApp: () => { setApp(app+1) }
//     }
// }
export interface IMainFrameProps {
    children?: React.ReactNode | React.ReactNodeArray;
}
// const OTopBar = React.lazy(() => Promise.all([import("./OComponent/OTopBar"),new Promise((r)=>{
//     setTimeout(()=>r(true), 100)
// })]).then(out=>out[0]))
export const MainFrame: AppStores.OComponent = withStyle(
    AppChildContainer(
        ({ children, appStore, classes = {} }: AppStores.OStyledProps & AppStores.Adapter) => {
            const store: MainFrameStore = appStore.mainFrameStore;
            console.log(appStore,store);
            return (
                <Provider mainFrameStore={store} classes={classes}>
                    <div className={classes.root}>
                        <React.Suspense fallback={<div>Loading...</div>}>
                            <OTopBar>
                                <Lite.LiteButton type='text' routerLink='/' onClick={recreate}>重启</Lite.LiteButton>
                                <Lite.LiteButton type='text' routerLink='/' onClick={reload}>重载</Lite.LiteButton>
                                <Lite.LiteButton type='text' routerLink='/' onClick={getPath}>选择文件路径</Lite.LiteButton>
                                <Lite.LiteButton type='text' routerLink='/' onClick={open}>打开exo文件</Lite.LiteButton>
                                <Lite.LiteButton type='text' routerLink='/' onClick={store.openHandler}>打开txt文件</Lite.LiteButton>
                            </OTopBar>
                        </React.Suspense>
                        <ODrawer>
                            <div className={classes.toolbar} />
                        </ODrawer>
                        <OMainPanel>
                            { children }
                        </OMainPanel>
                    </div>
                </Provider>
            );
        }
    )
);

const getPath = () => {
    const file: FileDialog = new FileDialog(true);
    file.openFile("a").subscribe((path: boolean) => {
        logger.log(path);
    })
}

const open = () => {
    openAulFile().subscribe(text => {
        logger.log(text);
    })
}
const recreate = () => {
    windowReCreate(true).subscribe((re: boolean) => {
        logger.log(re);
    })
}
const reload = () => {
    windowReload(true).subscribe((re: boolean) => {
        logger.log(re);
    })
}