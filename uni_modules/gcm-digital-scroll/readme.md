## 使用方法

1. 点击按钮，将项目插件导入到项目中
2. 下载插件，将.vue 文件复制到自己的项目目录里

### 传参说明

| 属性名    | 类型            | 默认值 | 说明                           |
| --------- | --------------- | ------ | ------------------------------ |
| value     | Number / String | -      | 显示数值                       |
| size      | Number / String | 14     | 字体大小(单位 px)              |
| color     | String          | #333   | 字体颜色                       |
| textAlign | String          | center | 文字居中 left \ center \ right |

### 示例代码

**html**

```html
<gcm-digital-scroll
  :value="attribute.value"
  :size="attribute.size"
  :color="attribute.color"
></gcm-digital-scroll>
```

**js**

```js
export default {
  data() {
    return {
      attribute: {
        value: "123.888",
        size: "30",
        color: "#f44336",
      },
    };
  },
};
```
