import * as React from "react";
import * as ReactDOM from "react-dom";
import {VerificationCode} from "./typescript/verificationCode";
// import {VerificationCode} from "./components/verificationCode";

// npm 发包流程：
// npm login 根据后面的步骤输入账号 密码 邮箱
// 输入命令 npm who am i 如果出现自己的账号 则表示npm 登录成功

// 发布前一定要先push到git 否则报：Git working directory not clean. git目录不干净
// 如果使用ts，发布前一定要确保dist中的文件是重新编译过的
// npm version patch 更新包版本（小版本号）
// npm publish  发布

// 修改版本号的命令
// npm version 命令用于更改版本号的信息，并执行commit 操作；该命令执行后， package.json 里的 version 会自动更新。
// 一般来说，当版本有较大改动时，变更第一位， 执行命令：npm version major -m "description" , 例如1.0.0 -> 2.0.0;
// 当前包变动较小时，可变更第二位，执行命令：npm version minor -m "description", 例如: 1.0.0 -> 1.1.0;
// 当前包只是修复了些问题时，可变更第三位，执行命令：npm version patch -m "description", 例如: 1.0.0 -> 1.0.1;

ReactDOM.render((
   <VerificationCode/>
), document.getElementById('root'));