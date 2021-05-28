import * as React from "react";
interface VerificationCodeProps {
    btnShow?: boolean;
    width?: number;
    height?: number;
    round?: number;
    fontSize?: number;
    strData?: string[];
    className?: string;
    style?: any;
    onResCanvasColor?: () => any;
    onResult?: (ret: object) => void;
}
export declare class VerificationCode extends React.Component<VerificationCodeProps, any> {
    _btnShow: boolean;
    _width: number;
    _height: number;
    _round: number;
    _fontSize: number;
    _halfHeight: number;
    _strArr: any[];
    _ctx: CanvasRenderingContext2D;
    _inputStr: string;
    _timeId: any;
    constructor(props: VerificationCodeProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    initCanvas(): void;
    randomSENumber(min: number, max: number): number;
    randomRgbaColor(): string;
    randomArc(ctx: CanvasRenderingContext2D): void;
    randomLine(ctx: CanvasRenderingContext2D): void;
    randomStr(): string[];
    renderStr(ctx: CanvasRenderingContext2D): void;
    doValidation(e: any, t: string): void;
    retMsg(areStr: string, inputStr: string): void;
    render(): JSX.Element;
}
export {};
