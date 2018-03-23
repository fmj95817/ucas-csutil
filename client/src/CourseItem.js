import React from 'react'
import { Icon, Table, Input,Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'


const deptOptions = [
    { "value": 910, "text": "910 数学学院" },
    { "value": 911, "text": "911 物理学院" },
    { "value": 957, "text": "957 天文学院" },
    { "value": 912, "text": "912 化学学院" },
    { "value": 928, "text": "928 材料学院" },
    { "value": 913, "text": "913 生命学院" },
    { "value": 914, "text": "914 地球学院" },
    { "value": 921, "text": "921 资环学院" },
    { "value": 951, "text": "951 计算机学院" },
    { "value": 952, "text": "952 电子学院" },
    { "value": 958, "text": "958 工程学院" },
    { "value": 917, "text": "917 经管学院" },
    { "value": 945, "text": "945 公共管理学院" },
    { "value": 927, "text": "927 人文学院" },
    { "value": 964, "text": "964 马克思中心" },
    { "value": 915, "text": "915 外语系" },
    { "value": 954, "text": "954 中丹学院" },
    { "value": 955, "text": "955 国际学院" },
    { "value": 959, "text": "959 存济医学院" },
    { "value": 946, "text": "946 体育教研室" },
    { "value": 961, "text": "961 微电子学院" },
    { "value": 962, "text": "962 未来技术学院" },
    { "value": 963, "text": "963 网络空间安全学院" },
    { "value": 968, "text": "968 心理学系" },
    { "value": 969, "text": "969 人工智能学院" },
    { "value": 970, "text": "970 纳米科学与技术学院" },
    { "value": 971, "text": "971 艺术中心" },
    { "value": 972, "text": "972 光电学院" },
    { "value": 967, "text": "967 创新创业学院" }
];


const httpReqs = {
    add: function(that) {
        fetch('/ops?cmd=add', {
            method: 'POST',
            body: JSON.stringify({
                dept: that.state.dept,
                code: that.state.code
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.text())
            .then(
                (res) => {
                    that.props.appendConsoleText(res);
                }, () => {
                    console.log('fail to add course.');
                }
            );
    },

    modify: function(that) {
        fetch('/ops?cmd=modify', {
            method: 'POST',
            body: JSON.stringify({
                dept: that.state.dept,
                code: that.state.code,
                lastCode: that.state.lastCode
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.text())
            .then(
                (res) => {
                    that.props.appendConsoleText(res);
                }, () => {
                    console.log('fail to modify course.');
                }
            );
    },

    remove: function(that) {
        fetch('/ops?cmd=remove', {
            method: 'POST',
            body: JSON.stringify({
                code: that.state.code
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.text())
            .then(
                (res) => {
                    that.props.appendConsoleText(res);
                }, () => {
                    console.log('fail to remove course');
                }
            );
    }
};


class CourseItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dept: props.dept,
            deptErr: !Boolean(props.dept),
            code: props.code,
            codeErr: !Boolean(props.code),
            lastCode: props.code,
            saved: props.saved,
            index: props.index,
        }
    }

    handleDeptChange = (param, data) => {
        this.setState({
            dept: data.value,
            deptErr: false,
            saved: false
        });
    };

    handleCodeChange = (event) => {
        this.setState({
            code: event.target.value,
            codeErr: !Boolean(event.target.value),
            saved: false
        });
    };

    handleRemoveItem = () => {
        if (this.state.saved) {
            httpReqs.remove(this);
        }
        this.props.removeItem(this.state.index);
    };

    handleSave = () => {
        if ((!this.state.deptErr) && (!this.state.codeErr) && (!this.state.saved)) {
            if (this.state.lastCode) {
                httpReqs.modify(this);
            } else {
                httpReqs.add(this);
            }
            this.setState({
                saved: true
            });
        }
    };

    render() {
        return (
            <Table.Row>
                <Table.Cell>
                    <Form size='small'>
                        <Form.Select
                            options={deptOptions}
                            value={this.state.dept}
                            placeholder='选择开课单位'
                            onChange={this.handleDeptChange}
                            error={this.state.deptErr}
                        />
                    </Form>
                </Table.Cell>
                <Table.Cell>
                    <Input
                        placeholder='课程代码'
                        value={this.state.code}
                        style={{width:'100%'}}
                        size='small'
                        onChange={this.handleCodeChange}
                        error={this.state.codeErr}
                    />
                </Table.Cell>

                <Table.Cell textAlign='center'> {
                    this.state.saved ?
                        <Icon name='checkmark' color='green'/> :
                        <Icon name='warning circle' color='red'/>
                }
                </Table.Cell>

                <Table.Cell textAlign='center'>
                    <Icon name='save' style={{cursor: 'pointer'}} onClick={this.handleSave}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Icon name='trash' style={{cursor: 'pointer'}} onClick={this.handleRemoveItem}/>
                </Table.Cell>


            </Table.Row>
        );
    }
}

export default CourseItem;