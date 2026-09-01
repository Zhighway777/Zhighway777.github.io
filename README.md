# Company Persona｜公司人格图鉴

这是公司文化人格测试系统的初版前端应用。项目参考
[JohnDev19/Personality-Test-App](https://github.com/JohnDev19/Personality-Test-App)
的 `Home → Test → Results` 应用骨架，但人格模型、题库和评分逻辑均已重写为公司文化版本。

## 当前功能

- 25 道跨部门可答的工作情境题
- 10 个连续行为维度
- 16 个公司人格原型
- 人格吸引域校准，避免混合作答系统性集中到单一人格
- 主原型 + 副原型输出
- 十维雷达图和逐维度得分
- 优势、盲区、协作方式和推荐搭档
- 答题页大按钮选项、点击后自动进入下一题、保留上一题修改入口和移动端底部操作栏
- 结果页分享摘要卡，支持生成分享图、复制摘要和复制链接
- 16 个人格形象已按图片名称映射到 `public/personas`
- 答题进度和结果仅保存在 `sessionStorage`

## 启动

```bash
npm install
npm run dev
```

打开终端输出的本地地址，默认为：

```text
http://127.0.0.1:5173/
```

## 验证

```bash
npm run check
npm run build
```

## 打包

```bash
npm run package
```

打包产物：

```text
release/
company-persona-app-v0.1.0-static.zip
```

JS 和 CSS 已内联到 `index.html`。电脑可以直接双击 `release/index.html` 使用；手机浏览器可将 zip 解压到静态服务器或部署平台后访问。

## 初版边界

- 不包含后端、数据库、账号和管理后台
- 不生成 PDF，只提供分享摘要
- 不上传或持久化用户答案
- 题库为 25 题内测版，后续应扩展到 40～60 题并做跨部门审题

## 设计依据

产品设计文档见：

```text
../公司文化人格测试系统产品设计文档_v0.2.md
```
