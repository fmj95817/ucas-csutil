import React from 'react'
import { Icon, Table, Button, Form } from 'semantic-ui-react'
import CourseItem from './CourseItem'
import ConsoleWriteStream from './ConsoleWriteStream'
import http from 'stream-http'
import 'semantic-ui-css/semantic.min.css'

const periodOptions = [
    { "value": 5, "text": "5s" },
    { "value": 10, "text": "10s" },
    { "value": 30, "text": "30s" },
    { "value": 60, "text": "1min" },
    { "value": 300, "text": "5min" },
    { "value": 600, "text": "10min" },
    { "value": 1200, "text": "20min" },
    { "value": 1800, "text": "30min" },
    { "value": 3600, "text": "1h" }
];


const httpReqs = {
    getCourseList: function(that) {
        fetch('/rc')
            .then(res => res.json())
            .then(
                (result) => {
                    let list = result.courseList.map(function(ele){
                        return {
                            dept: ele.dept,
                            code: ele.code,
                            saved: true
                        }
                    });
                    that.setState({
                        courseList: list
                    });
                }, () => {
                    console.log('fail to load course list.');
                }
            );
    },

    startQuery: function(that) {
        let consoleWriteStream = new ConsoleWriteStream(that);
        http.get(`/query?cmd=start&period=${that.state.queryPeriod}`, (res) => {
            res.on('data', chunk => {
                consoleWriteStream.write(chunk);
            });
        });
    },

    stopQuery: function(that) {
        let consoleWriteStream = new ConsoleWriteStream(that);
        http.get(`/query?cmd=stop`, res => {
            res.on('data', chunk => {
                consoleWriteStream.write(chunk);
            });
        });
    }
};

class CourseList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseList: [],
            queryPeriod: null,
            quering: false
        };
        httpReqs.getCourseList(this);
    }

    handleAddClick = () => {
        const newItem = {
            dept: null,
            code: null,
            saved: false
        };
        let list = this.state.courseList;
        list.push(newItem);
        this.setState({
            courseList: list
        });
    };

    handleQueryClick = () => {
        if (this.state.quering) {
            httpReqs.stopQuery(this);
        } else {
            httpReqs.startQuery(this);
        }

        this.setState({
            quering: !this.state.quering
        });

    };

    handleQueryPeriodChange = (param, data) => {
        this.setState({
            queryPeriod: data.value
        })
    };

    removeItem = (index) => {
        if (index >= 0) {
            let list = this.state.courseList;
            list.splice(index, 1);
            this.setState({
                courseList: list
            });
        }
    };

    render() {
        let removeItem = this.removeItem;
        let appendConsoleText = this.props.appendConsoleText;
        let itemList = this.state.courseList.map(function(course, index) {
            return <CourseItem
                dept={course.dept}
                code={course.code}
                index={index}
                saved={course.saved}
                removeItem={removeItem}
                appendConsoleText={appendConsoleText}
            />
        });

        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan='2'>
                            <Icon name='file text outline' />待选课程列表
                        </Table.HeaderCell>
                        <Table.HeaderCell colSpan='2' textAlign='center'>
                            <Button icon labelPosition='left' size='small' onClick={this.handleAddClick}>
                                <Icon name='plus' />添加课程
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell>
                            <Icon name='repeat' />查询周期
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            <Form size='small'>
                                <Form.Select
                                    options={periodOptions}
                                    placeholder='选择查询周期'
                                    value={this.state.queryPeriod}
                                    onChange={this.handleQueryPeriodChange}
                                />
                            </Form>
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center' colSpan='2'>
                            <Button
                                icon
                                labelPosition='left'
                                size='small'
                                disabled={this.state.courseList.length === 0
                                    || this.state.queryPeriod === null
                                }
                                onClick={this.handleQueryClick}
                            >
                                <Icon name='refresh'/>{this.state.quering ? '停止查询' : '执行查询'}
                            </Button>
                        </Table.HeaderCell>
                    </Table.Row>

                    <Table.Row>
                        <Table.HeaderCell>
                            <Icon name='building' />
                            开课单位
                        </Table.HeaderCell>
                        <Table.HeaderCell>
                            <Icon name='student'/>
                            课程代码
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            <Icon name='info circle'/>
                            状态
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign='center'>
                            <Icon name='configure'/>
                            操作
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {itemList}
                </Table.Body>
            </Table>
        );
    }
}


class Operation extends React.Component {
    render() {
        return (
            <div className='pushable' style={{margin: '2%', maxHeight: '96%'}}>
                <CourseList appendConsoleText={this.props.appendConsoleText}/>
            </div>
        );
    }
}


export default Operation;