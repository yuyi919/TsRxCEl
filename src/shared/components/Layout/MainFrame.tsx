import Drawer from '@material-ui/core/Drawer';
import { StyledComponentProps, StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { FileDialog } from 'src/main/dialog';
import { openAulFile, windowReload } from 'src/shared/clientApi';
import * as Lite from 'src/shared/components/Lite';
import { MainFrameStore } from './index';


export interface IMainFrameProps extends StyledComponentProps {
    children?: React.ReactNode | React.ReactNodeArray;
    store?: MainFrameStore | any;
}
const drawerWidth = 300;
const styles: StyleRulesCallback<"drawerPaper" | "drawerPaperClose"> = (theme: Theme) => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'fixed',
        display: 'flex',
        bottom: 0, top: 0, left: 0, right: 0
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        height: '100%',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing.unit * 7,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
})

const getPath = () => {
    const file: FileDialog = new FileDialog(true);
    file.openFile("a").subscribe((path: boolean)=>{
        console.log(path);
    })
}

const open = () =>{
    openAulFile().subscribe(text=>{
        console.log(text);
    })
}
const reload = () =>{
    windowReload(true).subscribe((re:boolean)=>{
        console.log(re);
    })
}
export const MainFrame = withStyles(styles)(inject("store")(observer((props: IMainFrameProps) => {
    const { children, store = {}, classes = {} } = props;
    return (
        <div className={classes.root}>
            <Lite.TopBar title={store.title} position='absolute' icon={<MenuIcon onClick={store.toggle} />} className={classNames(classes.appBar, store.open && classes.appBarShift)}>
                <Lite.LiteButton type='text' routerLink='/' onClick={reload}>重载</Lite.LiteButton>
                <Lite.LiteButton type='text' routerLink='/' onClick={getPath}>选择文件路径</Lite.LiteButton>
                <Lite.LiteButton type='text' routerLink='/' onClick={open}>打开exo文件</Lite.LiteButton>
                <Lite.LiteButton type='text' routerLink='/' onClick={store.openHandler}>打开txt文件</Lite.LiteButton>
            </Lite.TopBar>
            <Drawer
                variant="permanent"
                classes={
                    { paper: classNames(classes.drawerPaper, !store.open && classes.drawerPaperClose) }
                }
                anchor="left"
            >
                <div className={classes.toolbar} />
                <Lite.CollapseMenu index={0} store={store.menuList} />
            </Drawer>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Typography noWrap={true}>
                    <span dangerouslySetInnerHTML={{ __html: store.content.join("<br/>") }} />
                    {children}
                </Typography>
            </main>
        </div>
    );
})))