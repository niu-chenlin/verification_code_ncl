import * as React from "react";
require("./static/index.css");

interface VerificationCodeProps {
    btnShow?: boolean;
    width?: number;
    height?: number;
    round?: number;
    fontSize?: number;
    strData?: string[];
    onResCanvasColor?: () => any;
    onResult?: (ret: object) => void;
}
export class VerificationCode extends React.Component<VerificationCodeProps, any> {
    _btnShow: boolean = this.props.btnShow ? this.props.btnShow : true;
    _width: number = this.props.width ? this.props.width : 200;
    _height: number = this.props.height ? this.props.height : 50;
    _round: number = this.props.round ? this.props.round : 15;
    _fontSize: number = this.props.fontSize ? this.props.fontSize : this._height / 2;

    _halfHeight: number = this._height / 2;
    _strArr: any[] = [];
    // @ts-ignore
    _ctx: CanvasRenderingContext2D = null;
    _inputStr: string = "";
    constructor(props: VerificationCodeProps) {
        super(props);
        this.state = {
            value: ""
        }
    }
    componentDidMount() {
        this.initCanvas();
    }

    initCanvas() {
        let canvas: HTMLCanvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
        this._ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        canvas.width = this._width;
        // this._ctx.clearRect(0, 0, this._width, this._height);
        // 背景设计
        this._ctx.fillStyle = this.props.onResCanvasColor ? this.props.onResCanvasColor() : this.randomRgbaColor();
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

    randomSENumber(min: number, max: number) {
        return Math.round(Math.random() * (max-min)) + min;
    }

    randomRgbaColor() { //随机生成RGBA颜色
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        let a = Math.random();
        return `rgb(${r},${g},${b},${a})`;
    }

    randomArc(ctx: CanvasRenderingContext2D) { // 随机生成干扰圆点
        let x = Math.floor(Math.random() * this._width);
        let y = Math.floor(Math.random() * this._height);
        ctx.beginPath();
        ctx.arc(x, y,1,0,2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    randomLine(ctx: CanvasRenderingContext2D) { // 生成干扰线条 不存在什么随机性... 后续有需求可以考虑扩展一下
        let w0_2 = this._width*0.5, h0_3 = this._height*0.3;
        let t_w0_2 = this._width*0.6, t_h0_2 = this._height*0.5;

        ctx.beginPath(); // 开始画一条线
        ctx.lineWidth = 1; // 这条线的宽度是2px
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

    renderStr(ctx: CanvasRenderingContext2D) {
        this._strArr = this.props.strData ? this.props.strData : this.randomStr();
        this._strArr.forEach((str, index) => {
            let a = this.randomSENumber(-3, 3);
            ctx.fillText(str, this._width/5*(index+1)-10, this._halfHeight);
            ctx.translate(0,0);
            ctx.rotate(a*Math.PI/180);
        });
    }

    doValidation(e: any, t: string) { // 函数式编程 一个函数只关注一件事 冗余的代码能增强可维护性
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

    retMsg(areStr: string, inputStr: string) {
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

