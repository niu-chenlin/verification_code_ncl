"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.VerificationCode = void 0;
var React = require("react");
require("../static/index.css");
var VerificationCode = /** @class */ (function (_super) {
    __extends(VerificationCode, _super);
    function VerificationCode(props) {
        var _this = _super.call(this, props) || this;
        _this._btnShow = _this.props.btnShow ? _this.props.btnShow : true;
        _this._width = _this.props.width ? _this.props.width : 200;
        _this._height = _this.props.height ? _this.props.height : 50;
        _this._round = _this.props.round ? _this.props.round : 15;
        _this._fontSize = _this.props.fontSize ? _this.props.fontSize : _this._height / 2;
        _this._halfHeight = _this._height / 2;
        _this._strArr = [];
        // @ts-ignore
        _this._ctx = null;
        _this._inputStr = "";
        _this.state = {
            value: ""
        };
        return _this;
    }
    VerificationCode.prototype.componentDidMount = function () {
        this.initCanvas();
    };
    VerificationCode.prototype.initCanvas = function () {
        var canvas = document.getElementById("myCanvas");
        this._ctx = canvas.getContext("2d");
        canvas.width = this._width;
        // this._ctx.clearRect(0, 0, this._width, this._height);
        // 背景设计
        this._ctx.fillStyle = this.randomRgbaColor();
        this._ctx.fillRect(0, 0, this._width, this._height);
        // 干扰线设计
        this.randomLine(this._ctx);
        // 干扰圆点
        for (var i = 0; i < this._round; i++) {
            this.randomArc(this._ctx);
        }
        // 渲染字符
        this._ctx.font = "oblique small-caps bold " + this._fontSize + "px Serif";
        this._ctx.textBaseline = "middle";
        this.renderStr(this._ctx);
    };
    VerificationCode.prototype.randomSENumber = function (min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    };
    VerificationCode.prototype.randomRgbaColor = function () {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        var a = Math.random();
        return "rgb(" + r + "," + g + "," + b + "," + a + ")";
    };
    VerificationCode.prototype.randomArc = function (ctx) {
        var x = Math.floor(Math.random() * this._width);
        var y = Math.floor(Math.random() * this._height);
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();
    };
    VerificationCode.prototype.randomLine = function (ctx) {
        var w0_2 = this._width * 0.5, h0_3 = this._height * 0.3;
        var t_w0_2 = this._width * 0.6, t_h0_2 = this._height * 0.5;
        ctx.beginPath(); // 开始画一条线
        ctx.lineWidth = 1; // 这条线的宽度是2px
        ctx.strokeStyle = "black"; // 线条的颜色
        ctx.moveTo(0, this._halfHeight); // 从这里开始绘制 x y
        ctx.arcTo(w0_2, h0_3, t_w0_2, t_h0_2, 50); // 创建弧
        ctx.lineTo(this._width, this._height / 2);
        ctx.stroke();
    };
    VerificationCode.prototype.randomStr = function () {
        var ret = [];
        var str = "abcdefghijklmnopqrstuvwxyz0123456789";
        var arrStr = str.split("");
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        return ret;
    };
    VerificationCode.prototype.renderStr = function (ctx) {
        var _this = this;
        this._strArr = this.props.strData ? this.props.strData : this.randomStr();
        this._strArr.forEach(function (str, index) {
            var a = _this.randomSENumber(-3, 3);
            ctx.fillText(str, _this._width / 5 * (index + 1) - 10, _this._halfHeight);
            ctx.translate(0, 0);
            ctx.rotate(a * Math.PI / 180);
        });
    };
    VerificationCode.prototype.doValidation = function (e, t) {
        var areStr = this._strArr.join('').toLocaleUpperCase();
        var inputStr = e.target.value ? e.target.value.toLocaleUpperCase() : this._inputStr.toLocaleUpperCase();
        if (t === 'i') {
            if (inputStr.length > areStr.length)
                return;
            this._inputStr = e.target.value.toLocaleUpperCase();
            this.setState({ value: this._inputStr });
            if (inputStr.length === areStr.length)
                this.retMsg(areStr, this._inputStr);
        }
        else {
            this.retMsg(areStr, this._inputStr);
        }
    };
    VerificationCode.prototype.retMsg = function (areStr, inputStr) {
        var resMsg = { code: 200, msg: '验证成功' };
        if (inputStr.length < areStr.length) {
            resMsg = { code: 417, msg: '未满足期望值' };
        }
        else if (inputStr !== areStr) {
            resMsg = { code: 416, msg: '请求范围不符合要求' };
        }
        this.props.onResult && this.props.onResult(resMsg);
    };
    VerificationCode.prototype.render = function () {
        var _this = this;
        return <div id="canvas" style={{ "width": 500 }}>
            <canvas id="myCanvas" width={this._width} height={this._height} onClick={function () { _this.initCanvas(); }}/>
            <input id="v_input" value={this.state.value} type="text" placeholder="验证码" style={{ height: this._height - 5 }} onChange={function (e) { _this.doValidation(e, 'i'); }}/>
            {this._btnShow ?
                <button id="v_button" style={{ height: this._height - 5 }} onClick={function (e) { _this.doValidation(e, 'b'); }}>验&nbsp;&nbsp;证</button>
                : ""}
        </div>;
    };
    return VerificationCode;
}(React.Component));
exports.VerificationCode = VerificationCode;
