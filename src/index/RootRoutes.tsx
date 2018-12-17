import { CssBaseline } from '@material-ui/core';
import * as Colors from '@material-ui/core/colors';
import { createMuiTheme, MuiThemeProvider, Theme } from '@material-ui/core/styles';
import { Provider } from "mobx-react";
import * as React from "react";
import { HashRouter } from "react-router-dom";
// import { Route, Switch } from "react-router-dom";
// import { AppHomePage } from "./components/AppHomePage";
// import { CounterPage } from "./components/CounterPage";
// import { EchartsTestPage } from './components/EchartTestPage';
import IndexPage from 'src/components/IndexPage';
import { AppStore } from "src/shared";
// import { LiteButton } from './shared/components/Lite';

const appStore = new AppStore();

const theme: Theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: Colors.lightBlue,
        secondary: Colors.blueGrey,
        error: Colors.lightGreen,
        type: 'dark',
        // background:{
        //     paper: Colors.common.black 
        // },
    },
})
export default function RootRoutes(){
    // console.log(theme);
    return (
        <>
            <CssBaseline />
            <MuiThemeProvider theme={theme}>
                <Provider appStore={appStore}>
                    <HashRouter>
                        <IndexPage>
                            {/* <LiteButton type='raised' color='default' routerLink='/'>home</LiteButton>
                            <Switch>
                                <Route exact={true} path="/" component={AppHomePage} />
                                <EchartsTestPage>
                                    <Route exact={true} path="/counter" component={CounterPage} />
                                </EchartsTestPage>
                            </Switch> */}
                        </IndexPage>
                    </HashRouter>
                </Provider>
            </MuiThemeProvider>
        </>
    );
}