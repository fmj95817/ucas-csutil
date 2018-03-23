import { Writable } from 'stream'
import util from 'util'


let ConsoleWriteStream = function(that) {
    this.that = that;
    Writable.call(this, {objectMode: true});
};

util.inherits(ConsoleWriteStream, Writable);

ConsoleWriteStream.prototype._write = function(chunk, encoding, callback) {
    this.that.props.appendConsoleText(chunk.toString(encoding));
    callback();
};


export default ConsoleWriteStream;