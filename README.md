---
order: 1
title: 说明
toc: false
timeline: true
---
`canvas` 一个基于React的canvas图形验证码
#### 使用方法
-  像其他React组件一样使用即可
#### 参数定义(Props)
- btnShow?: boolean, 是否显示验证按钮
- width?: number, Canvas宽度
- height?: number, Canvas高度
- round?: number, Canvas干扰圆点个数
- fontSize?: number, Canvas字符字体大小
- strData?: string, Canvas内显示的验证码-此组件已经默认生成,但是不建议使用,前端生成方式过于危险
- onResult?: (res: any) => void Canvas验证回调方法-res{code: number, msg: string} 返回一个对象,code-200即为成功,其他均为失败,失败后会有相应的msg值,按照msg值提示即可
- onGetCanvasColor?: () => string 函数需要返回一个颜色标识，用于定制canvas的背景色
---

## 1.0.0

`2021-05-25`

- 🌐 初次提交,暂时未发现问题
- TypeScript
  - 🤖 已经增加.d.ts类型文件,兼容TypeScript
  
  