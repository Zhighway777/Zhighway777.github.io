# Company Persona 静态包使用说明

## 电脑本地打开

解压后直接双击 `index.html`。

应用使用相对资源路径和 Hash 路由，不需要配置服务器回退。

## 静态服务器部署

把解压后的全部文件放在任意静态目录，例如：

```text
/company-persona/
├── index.html
├── DEPLOY.md
└── personas/
```

然后访问：

```text
https://你的域名/company-persona/
```

## 手机访问电脑上的包

在电脑上进入解压目录，启动任意静态服务器，例如：

```bash
npx serve .
```

用手机浏览器访问命令输出的局域网地址。

## 注意

- JS 和 CSS 已内联在 `index.html` 中，请保留 `personas/` 目录。
- 答题进度和结果保存在当前浏览器的 `sessionStorage` 中。
- 换浏览器、换设备或清除网站数据后，需要重新测试。
