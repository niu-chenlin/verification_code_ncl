import * as React from "react";
import css from "../static/index.css";

/**
 * 验证组件-props定义
 * @param btnShow 组件是否显示验证按钮 - 组件input已经监听onChange事件,不需要btn可以实现无感验证
 * @param strData canvas中的验证码 - 一般要求后端生成
 * @param width  canvas宽度
 * @param height canvas高度
 * @param round canvas中干扰圆点个数
 * @param round canvas中字符的字体大小
 * @output onResult 验证成功后的
 */
export class VerificationCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ""};
        this._btnShow = this.props.btnShow ? this.props.btnShow : true;
        this._width = this.props.width ? this.props.width : 200;
        this._height = this.props.height ? this.props.height : 50;
        this._round = this.props.round ? this.props.round : 15;
        this._fontSize = this.props.fontSize ? this.props.fontSize : this._height / 2;

        this._halfWidth = this._width / 2;
        this._halfHeight = this._height / 2;
        this._strArr = [];
        this._ctx = null;
        this._inputStr = "";
    }
    componentDidMount() {
        this.initCanvas();
    }

    initCanvas() {
        let canvas = document.getElementById("myCanvas");
        this._ctx = canvas.getContext("2d");
        canvas.width = this._width;
        // this._ctx.clearRect(0, 0, this._width, this._height);
        // 背景设计
        this._ctx.fillStyle = this.props.canvasColor ? this.props.canvasColor : this.randomRgbaColor();
        this._ctx.fillRect(0,0,this._width,this._height);

        // 干扰线设计
        this.randomLine(this._ctx);
        // 干扰圆点
        for(let i = 0; i < this._round; i++) {
            this.randomArc(this._ctx);
        }

        // 渲染字符
        this._ctx.font = `oblique small-caps bold ${this._fontSize}px Serif`;
        this._ctx.textBaseline = "middle";
        this.renderStr(this._ctx);

    }

    randomSENumber(min, max) {
        return Math.round(Math.random() * (max-min)) + min;
    }

    randomRgbaColor() { //随机生成RGBA颜色
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        let a = Math.random();
        return `rgb(${r},${g},${b},${a})`;
    }

    randomArc(ctx) { // 随机生成干扰圆点
        let x = Math.floor(Math.random() * this._width);
        let y = Math.floor(Math.random() * this._height);
        ctx.beginPath();
        ctx.arc(x, y,1,0,2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    randomLine(ctx) { // 生成干扰线条 不存在什么随机性... 后续有需求可以考虑扩展一下
        let w0_2 = this._width*0.5, h0_3 = this._height*0.3;
        let t_w0_2 = this._width*0.6, t_h0_2 = this._height*0.5;

        ctx.beginPath(); // 开始画一条线
        ctx.lineWidth = "1"; // 这条线的宽度是2px
        ctx.strokeStyle = "black"; // 线条的颜色
        ctx.moveTo(0, this._halfHeight); // 从这里开始绘制 x y
        ctx.arcTo(w0_2, h0_3, t_w0_2, t_h0_2,50); // 创建弧
        ctx.lineTo(this._width, this._height/2);
        ctx.stroke();
    }

    randomStr() {
        let ret = [];
        let str = "abcdefghijklmnopqrstuvwxyz0123456789";
        let arrStr = str.split("");
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        ret.push(arrStr[this.randomSENumber(0, 33)].toLocaleUpperCase());
        return ret;
    }

    renderStr(ctx) {
        this._strArr = this.props.strData ? this.props.strData : this.randomStr();
        this._strArr.forEach((str, index) => {
            let a = this.randomSENumber(-3, 3);
            ctx.fillText(str, this._width/5*(index+1)-10, this._halfHeight);
            ctx.translate(0,0);
            ctx.rotate(a*Math.PI/180);
        });
    }

    doValidation(e, t) { // 函数式编程 一个函数只关注一件事 冗余的代码能增强可维护性
        let areStr = this._strArr.join('').toLocaleUpperCase();
        let inputStr = e.target.value ? e.target.value.toLocaleUpperCase() : this._inputStr.toLocaleUpperCase();
        if(t === 'i') {
            if(inputStr.length > areStr.length) return;
            this._inputStr = e.target.value.toLocaleUpperCase();
            this.setState({value: this._inputStr});
            if(inputStr.length === areStr.length) this.retMsg(areStr, this._inputStr);
        } else {
            this.retMsg(areStr, this._inputStr);
        }
    }

    retMsg(areStr, inputStr) {
        let resMsg = {code: 200, msg: '验证成功'};
        if(inputStr.length < areStr.length) {
            resMsg = {code: 417, msg: '未满足期望值'};
        } else if(inputStr !== areStr) {
            resMsg = {code: 416, msg: '请求范围不符合要求'};
        }
        this.props.onResult && this.props.onResult(resMsg);
    }
    render() {
        return <div id="canvas" style={{"width": 500}}>
            <canvas id="myCanvas" width={this._width} height={this._height} onClick={() => {this.initCanvas()}}/>
            <input id="v_input" value={this.state.value} type="text" placeholder="验证码" style={{height: this._height-5}} onChange={(e) => {this.doValidation(e, 'i')}}/>
            {this._btnShow ?
                <button id="v_button" style={{height: this._height-5}} onClick={(e) => {this.doValidation(e, 'b')}}>验&nbsp;&nbsp;证</button>
                : ""
            }
        </div>
    }
}