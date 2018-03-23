import React from 'react'
import { Form, TextArea } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

class QueryConsole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: props.height
        }
    }

    render() {
        return (
            <Form>
                <TextArea
                    value={this.props.consoleText}
                    style={{
                        height:this.state.height,
                        width: '100%',
                        fontFamily: 'Consolas, Monaco, Courier New',
                        fontSize: 11,
                        border: 'none'
                    }}
                />
            </Form>
        );
    }
}

export default QueryConsole