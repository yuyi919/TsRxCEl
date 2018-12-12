import { StyledComponentProps } from '@material-ui/core/styles';
import { IReactComponent, Provider } from 'mobx-react';
import * as React from 'react';
import { FileDialog } from 'src/main/dialog';
import { openAulFile, windowReCreate, windowReload } from 'src/shared/clientApi';
import * as Lite from 'src/shared/components/Lite';
import { AppChildContainer, IAppStoreInjectProps, IAppStoreProps } from 'src/shared/stores';
import { ODrawer, OMainPanel, OTopBar } from './OComponent';
import { MainFrameStore } from './store';
import withStyle from './styles';

export interface IMainFrameProps extends StyledComponentProps, IAppStoreProps {
    children?: React.ReactNode | React.ReactNodeArray;
}
export const MainFrame: IReactComponent<IMainFrameProps> = withStyle(
    AppChildContainer(
        ({ children, appStore, classes = {} }: IMainFrameProps & IAppStoreInjectProps) => {
            const store: MainFrameStore = appStore.mainFrameStore;
            console.log(appStore,store);
            return (
                <Provider mainFrameStore={store} classes={classes}>
                    <div className={classes.root}>
                        <OTopBar>
                            <Lite.LiteButton type='text' routerLink='/' onClick={recreate}>重启</Lite.LiteButton>
                            <Lite.LiteButton type='text' routerLink='/' onClick={reload}>重载</Lite.LiteButton>
                            <Lite.LiteButton type='text' routerLink='/' onClick={getPath}>选择文件路径</Lite.LiteButton>
                            <Lite.LiteButton type='text' routerLink='/' onClick={open}>打开exo文件</Lite.LiteButton>
                            <Lite.LiteButton type='text' routerLink='/' onClick={store.openHandler}>打开txt文件</Lite.LiteButton>
                        </OTopBar>
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
        console.log(path);
    })
}

const open = () => {
    openAulFile().subscribe(text => {
        console.log(text);
    })
}
const recreate = () => {
    windowReCreate(true).subscribe((re: boolean) => {
        console.log(re);
    })
}
const reload = () => {
    windowReload(true).subscribe((re: boolean) => {
        console.log(re);
    })
}