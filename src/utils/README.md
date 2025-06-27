# 代码格式化工具

这是一个基于 `js-beautify` 的代码格式化工具，支持多种编程语言的代码格式化。

## 功能特性

- ✅ 支持多种编程语言：Vue、JavaScript、TypeScript、HTML、CSS、Less、SCSS
- ✅ 统一的格式化配置
- ✅ 自定义格式化选项
- ✅ 完善的错误处理
- ✅ 同步和异步两种使用方式

## 使用方法

### 1. 基本使用

```javascript
import { formatCode } from '../utils/codeFormatter';

const jsCode = `function test(a,b){return a+b;}`;
const formatted = formatCode(jsCode, 'javascript');
```

### 2. 使用 CodeFormatter 类

```javascript
import CodeFormatter from '../utils/codeFormatter';

const vueCode = `<template><div>{{title}}</div></template>`;
const formatted = CodeFormatter.format(vueCode, 'vue');
```

### 3. 异步格式化

```javascript
import { formatCodeAsync } from '../utils/codeFormatter';

const formatted = await formatCodeAsync(code, 'css');
```

### 4. 自定义配置

```javascript
const formatted = CodeFormatter.format(code, 'javascript', {
  indent_size: 4,
  brace_style: 'expand'
});
```

## 支持的编程语言

- Vue (使用 HTML 格式化器)
- JavaScript (原生支持)
- TypeScript (使用 JavaScript 格式化器)
- HTML (原生支持)
- CSS/Less/SCSS (原生支持)

## 在 Vue 组件中使用

```vue
<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { formatCodeAsync } from '../utils/codeFormatter';

const code = ref('');

const handleFormat = async () => {
  try {
    const formatted = await formatCodeAsync(code.value, 'javascript');
    code.value = formatted;
    ElMessage.success('代码格式化成功');
  } catch (error) {
    ElMessage.error(`格式化失败: ${error.message}`);
  }
};
</script>
```

## 错误处理

```javascript
try {
  const formatted = formatCode(code, 'javascript');
} catch (error) {
  console.error('格式化失败:', error.message);
}
```

## 示例代码

查看 `codeFormatter.example.js` 文件获取更多使用示例。 