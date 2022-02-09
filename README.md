# 简易记账本

此为项目的使用文档，思考过程在[HeartOS](HeartOS.md)文档中。

## 功能描述

1. 支持按账单月份、收支类型、账单分类三个维度进行筛选
2. 在每种筛选条件下，均显示收入和支出的汇总数据
3. 表格支持分页，每页15条数据
4. 表格默认按时间排序，最近的时间在最上面。金额排序支持点击，可以正排、倒排。金额排序不是当前页排序，是全部数据一起排。页码不在第1页时，也是“全排”，展示的是“所有数据中处在当前页码”的数据
5. 支持添加账单。数据库用的是浏览器自带的`indexedDB`，换浏览器后新增数据会丢失。这样实现的原因请参考[HeartOS](HeartOS.md)文档

## 运行环境

本项目的开发环境，`nodejs`版本是`v12.22.6`，`npm`版本是`6.14.15`。更高版本原则上也支持，但未做严格测试。

## 目录结构

```
├─HeartOS.md                      // 远程工作所要求的思考过程
├─README.md                       // 项目使用文档
├─index.html                      // HTML模板
├─index.js                        // server入口
├─package-lock.json
├─package.json
├─vite.config.js                  // vite配置文件
├─src                             // Browser端源代码
|  ├─App.vue                      // Vue主组件
|  ├─db.js                        // indexedDB封装
|  ├─main.js                      // Vue程序入口文件
|  ├─components
|  |     ├─BillForm.vue           // Form表单组件
|  |     └BillList.vue            // 数据列表组件
├─dist                            // Build后的Browser端代码
|  ├─index.html
|  ├─assets
|  |   ├─index.d502e644.css
|  |   ├─index.ec1c688b.js
|  |   ├─vendor.1e21f5e7.css
|  |   └vendor.ba84252a.js
├─data                            // CSV数据
|  ├─bill.csv
|  └categories.csv
```

## 开发及部署

项目运行前，请确保本地安装了`nodejs(>=v12.22.6)`和`npm(>=6.14.15)`

在项目根目录下，运行命令：

```
npm i
```

### 开发

依赖安装完成后，运行：

```
npm run dev
```

然后访问：

```
http://127.0.0.1:9651/
```

项目具备`HMR`机制，代码更新后页面会自动更新。

**项目启动后，控制台还会输出一个`http://localhost:3000/`的地址，这是`Vite`的`DevServer`，请忽略。原因请参考[HeartOS](HeartOS.md)文档。**

### 部署

部署到正式环境前，需要先执行：

```
npm run build
```

打包完成后，运行以下命令：

```
npm run server
```

## TODO

1. 使用`Rust`的`Yew`(2017年为其贡献过代码)库重新实现`Browser`端代码，玩一玩`Wasm`
2. 用`Julia`的`Pluto`库，重新实现项目功能。增加图表展示，并对`CSV`数据展示的财务状况进行分析，算算账单主人啥时候财务自由
3. 使用`Docker`部署

**由于时间、精力不足，这两项没做，详情参考[HeartOS](HeartOS.md)文档。**