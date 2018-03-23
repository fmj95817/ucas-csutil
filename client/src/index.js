import React from 'react'
import ReactDOM from 'react-dom'
import { Grid, Sidebar, Menu, Icon} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import LoginForm from './LoginForm'
import Operation from  './Operation'
import QueryConsole from './QueryConsole'


class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            mainViewHeight: 0,
            barHeight: 0,
            consoleText: ''
        };
    }

    appendConsoleText = (text) => {
        let consoleText = this.state.consoleText;
        this.setState({
            consoleText: consoleText + text
        });
    };

    handleResize() {
        this.setState({
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        });
    }

    componentDidMount() {
        window.addEventListener('resize', () => this.handleResize());
        const height = document.getElementById('sidebar').clientHeight - 4;
        this.setState({
            barHeight: height,
            mainViewHeight: this.state.windowHeight - height
        });
    }

    render() {
        return (
            <div className='main-view' style={{padding: 15}}>
                <Sidebar
                    as={Menu}
                    animation='push'
                    direction='top'
                    visible={true}
                    inverted
                    id='sidebar'
                >
                    <Menu.Item name='home'>
                        <Icon name='home' />
                        UCAS选课实用工具
                    </Menu.Item>
                </Sidebar>
                <Grid columns={2} divided style={{paddingTop: this.state.barHeight}}>
                    <Grid.Column style={{width: '21%', height: this.state.mainViewHeight, padding: 0}}>
                        <LoginForm/>
                    </Grid.Column>
                    <Grid.Column style={{width: '49%', height: this.state.mainViewHeight}}>
                        <Operation appendConsoleText={this.appendConsoleText}/>
                    </Grid.Column>
                    <Grid.Column style={{width: '30%', height: this.state.mainViewHeight}}>
                        <QueryConsole height={this.state.windowHeight - 70} consoleText={this.state.consoleText}/>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}


ReactDOM.render(
    <MainView/>,
    document.getElementById('root')
);
