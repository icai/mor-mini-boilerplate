# mor-mini-boilerplate

> MorJS 最佳实践

## 扩展功能插件

- [x] 环境变量注入运行时
- [x] 项目编译图片自动 CDN
- [x] OSS 文件上传
- [x] web 自定义模版
- [x] OSS 可配置白名单
- [x] OSS 文件头自定义
- [ ] 运行时状态管理插件
- [ ] 运行时埋点插件
- [ ] 运行时切面插件
- [ ] ...

## 配置说明

### 环境变量注入运行时

```sh

# 阿里云账号的AccessKey ID
accessKeyId=accessKeyIdTAI4accessKeyIdD

# 阿里云账号的AccessKey Secret
accessKeySecret=accessKeySecret2NpTKeySecret7k4YNKeySecret

# 阿里云 OSS bucket
bucket=bucketname

# 阿里云 OSS region
region=regionname

# oss 上传域名
ossRoot=https://bucketname.oss-cn-regionname.aliyuncs.com/

# oss 上传路径
ossUploadPath=miniapp/1_0_0

# cdn 域名，多个支持, 分隔
cdnRoot=https://docs.w3cub.com/

# cdnRoot=https://assets1.w3cub.com/,https://assets2.w3cub.com/,https://assets3.w3cub.com/

```

## MorJS 使用

请参考 `MorJS` 官方站点: [https://mor.eleme.io/](https://mor.eleme.io/)

## LICENSE

Copyright (c) Terry Cai. Licensed under the MIT license.
