# 8086 

Simple emulator for 8086, code challenage from [Emulate an Intel 8086 CPU](http://codegolf.stackexchange.com/questions/4732/emulate-an-intel-8086-cpu)

简单的 8086 模拟器，实际上是一个课后作业，原题在这里 [Emulate an Intel 8086 CPU](http://codegolf.stackexchange.com/questions/4732/emulate-an-intel-8086-cpu)

## How to do

* [准备工作](http://treelite.me/note/8086-emulator-1/)
* _To Be Continued ..._

## Links

一些有用的参考资料：

* [8086简介](https://zh.wikipedia.org/wiki/Intel_8086) 来自 wikipedia，简要介绍 8086 的基本情况，是了解寄存器个数、大小等基本信息的好地方
* [x86指令编码入门](http://www.c-jump.com/CIS77/CPU/x86/lecture.html) 详细介绍了 x86 指令格式，入门推荐～（x86 是包含 32 位体系的，所以该文章中涉及 32 位描述的地方都可以先暂时掠过，不会影响对 8086 的理解，比如机器码中的 'Prefix Bytes' 在 16 位的 8086 中是不存在的）
* [8086操作码表](http://www.mlsite.net/8086) 不光能查操作码，其中的操作数描述十分有用
* [8086用户手册](http://matthieu.benoit.free.fr/cross/data_sheets/Intel_8086_users_manual.htm) Intel 8086 用户手册，包含每条指令的详细描述，权威指南

## Run

```sh
# Node version above 5.0
# before start you may install all dependencis by `npm install`
$ npm start
```

## Test

```sh
# Node version above 5.0
# before test you may install all dependencis by `npm install`
$ npm test
```

## License

MIT
