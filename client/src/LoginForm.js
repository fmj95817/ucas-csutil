import React from 'react'
import { Button, Divider, Form, Grid, TextArea, Header} from 'semantic-ui-react'
import http from 'stream-http'
import 'semantic-ui-css/semantic.min.css'



const httpReqs = {
    login: function(that) {
        const req = http.request({
            path: '/login',
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        }, res => {
            res.on('data', chunk => {
                that.setState({
                    consoleText: that.state.consoleText + chunk.toString()
                });
            });
            res.on('end', () => {
                that.setState({
                    onLogin: false
                });
            });
        });
        req.end(JSON.stringify({
            userName: that.state.userName,
            password: that.state.password
        }))
    },

    getUserInfo: function(that) {
        fetch('/rc')
            .then(res => res.json())
            .then(
                (result) => {
                    that.setState({
                        userName: result.userName,
                        password: result.password
                    });
                },
                () => {
                    console.log('fail to load user info.');
                }
            );
    }

};


class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            password: '',
            consoleText: '',
            onLogin: false
        };
        httpReqs.getUserInfo(this);
    }


    handleSubmit = () => {
        this.setState({
            consoleText: '',
            onLogin: true
        });
        httpReqs.login(this);
    };

    handleUserNameChange = (event) => {
        this.setState({
            userName: event.target.value
        });
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value
        });
    };


    render() {
        return (
            <Grid celled='internally' textAlign='center' columns={1} style={{margin: 0, height: '100%'}}>
                <Grid.Row textAlign='center' style={{height:'50%'}}>
                    <Grid
                        textAlign='center'
                        style={{ height: '100%' }}
                        verticalAlign='middle'
                        columns={1}
                    >
                        <Grid.Column style={{ width: '100%' }}>
                            <Form size='large' textAlign='center'>
                                <Header as='h3' textAlign='center'>登录到Sep</Header>
                                <br/>
                                <Form.Input
                                    fluid
                                    icon='user'
                                    iconPosition='left'
                                    placeholder='用户名'
                                    value={this.state.userName}
                                    onChange={this.handleUserNameChange}
                                />
                                <Form.Input
                                    fluid
                                    icon='lock'
                                    iconPosition='left'
                                    placeholder='密码'
                                    type='password'
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                /><br/>
                                <Button
                                    fluid
                                    size='large'
                                    color='blue'
                                    onClick={this.handleSubmit}
                                    loading={this.state.onLogin}
                                >登录
                                </Button>
                            </Form>
                        </Grid.Column>
                    </Grid>
                </Grid.Row>
                <Grid.Row textAlign='center' style={{height:'50%'}}>
                    <Form size='large' style={{width: '94%'}}>
                            <TextArea
                                value={this.state.consoleText}
                                style={{
                                    marginTop: '3%',
                                    marginBottom: '3%',
                                    width: '100%',
                                    height: '94%',
                                    fontFamily: 'Consolas, Monaco, Courier New',
                                    fontSize: 11,
                                    border: 'none'
                                }}
                            />
                    </Form>
                </Grid.Row>
            </Grid>
        );
    }
}

export default LoginForm;