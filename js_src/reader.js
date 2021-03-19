const path = require('path');

const __extends = (this && this.__extends) || (function () {
    const extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

const __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { 'default': mod };
};

const pcsclite = require('@pokusew/pcsclite');
const EventEmitter = require('events');
const card_1 = __importDefault(require(path.join(__dirname, 'card.js').split(path.sep).join('/')));

const Reader = (function (_super) {
    __extends(Reader, _super);
    function Reader() {
        const _this = _super.call(this) || this;
        _this.pcsc = pcsclite();
        _this.pcsc.on('reader', function (reader) {
            _this.device = reader;
            _this.emit('reader-plugged', reader);
            reader.on('end', function () {
                _this.emit('reader-unplugged', reader);
            });
            reader.on('error', function (error) {
                _this.emit('error', { reader: reader, error: error });
            });
            reader.on('status', function (status) {
                const changes = reader.state ^ status.state;
                if (changes) {
                    if ((changes & reader.SCARD_STATE_EMPTY) && (status.state & reader.SCARD_STATE_EMPTY)) {
                        reader.disconnect(reader.SCARD_LEAVE_CARD, function (err) {
                            if (err) {
                                _this.emit('error', err);
                            }
                            else {
                                _this.emit('card-removed', _this.card);
                            }
                        });
                    }
                    if ((changes & reader.SCARD_STATE_PRESENT) && (status.state & reader.SCARD_STATE_PRESENT)) {
                        reader.connect({ share_mode: reader.SCARD_SHARE_SHARED }, function (err, protocol) {
                            if (err) {
                                _this.emit('error', err);
                            }
                            else {
                                _this.card = new card_1.default();
                                _this.emit('card-inserted', _this.card);
                            }
                        });
                    }
                }
            });
        });
        _this.pcsc.on('error', function (error) {
            _this.emit('error', { error: error });
        });
        return _this;
    }
    return Reader;
}(EventEmitter));

module.exports = Reader;
