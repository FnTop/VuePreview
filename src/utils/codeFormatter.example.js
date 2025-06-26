/**
 * 代码格式化工具使用示例
 * 展示如何使用 CodeFormatter 类和各种格式化函数
 */

import CodeFormatter, { formatCode, formatCodeAsync } from './codeFormatter.js';

// 示例 1: 使用 CodeFormatter 类
export function example1() {
  console.log('=== 示例 1: 使用 CodeFormatter 类 ===');
  
  const vueCode = `
<template>
<div class="app">
<h1>{{title}}</h1>
<button @click="handleClick">点击</button>
</div>
</template>
<script setup>
const title=ref('Hello Vue')
const handleClick=()=>{
console.log('clicked')
}
</script>
<style>
.app{color:red}
</style>`;

  try {
    const formatted = CodeFormatter.format(vueCode, 'vue');
    console.log('格式化后的 Vue 代码:');
    console.log(formatted);
  } catch (error) {
    console.error('格式化失败:', error.message);
  }
}

// 示例 2: 使用便捷函数
export function example2() {
  console.log('\n=== 示例 2: 使用便捷函数 ===');
  
  const jsCode = `
function calculateSum(a,b){
return a+b;
}
const result=calculateSum(1,2);
console.log(result);`;

  try {
    const formatted = formatCode(jsCode, 'javascript');
    console.log('格式化后的 JavaScript 代码:');
    console.log(formatted);
  } catch (error) {
    console.error('格式化失败:', error.message);
  }
}

// 示例 3: 使用异步函数
export async function example3() {
  console.log('\n=== 示例 3: 使用异步函数 ===');
  
  const cssCode = `
.container{background:red;color:white;padding:10px}
.button{background:blue;color:white;border:none;padding:5px 10px}`;

  try {
    const formatted = await formatCodeAsync(cssCode, 'css');
    console.log('格式化后的 CSS 代码:');
    console.log(formatted);
  } catch (error) {
    console.error('格式化失败:', error.message);
  }
}

// 示例 4: 自定义配置
export function example4() {
  console.log('\n=== 示例 4: 自定义配置 ===');
  
  const jsCode = `
const obj={name:'John',age:30,city:'New York'};
const arr=[1,2,3,4,5];`;

  try {
    // 使用自定义配置：4空格缩进
    const formatted = CodeFormatter.format(jsCode, 'javascript', {
      indent_size: 4,
      brace_style: 'expand'
    });
    console.log('使用自定义配置格式化后的代码:');
    console.log(formatted);
  } catch (error) {
    console.error('格式化失败:', error.message);
  }
}

// 示例 5: 检查支持的语言
export function example5() {
  console.log('\n=== 示例 5: 检查支持的语言 ===');
  
  const languages = ['vue', 'javascript', 'typescript', 'html', 'css', 'python'];
  
  languages.forEach(lang => {
    const isSupported = CodeFormatter.isLanguageSupported(lang);
    console.log(`${lang}: ${isSupported ? '支持' : '不支持'}`);
  });
  
  console.log('\n支持的所有语言:');
  console.log(CodeFormatter.getSupportedLanguages());
}

// 示例 6: 获取默认配置
export function example6() {
  console.log('\n=== 示例 6: 获取默认配置 ===');
  
  const languages = ['vue', 'javascript', 'css'];
  
  languages.forEach(lang => {
    const config = CodeFormatter.getDefaultConfig(lang);
    console.log(`${lang} 默认配置:`, config);
  });
}

// 示例 7: 错误处理
export function example7() {
  console.log('\n=== 示例 7: 错误处理 ===');
  
  // 测试空代码
  try {
    CodeFormatter.format('', 'javascript');
  } catch (error) {
    console.log('空代码错误:', error.message);
  }
  
  // 测试无效代码
  try {
    CodeFormatter.format('function test{', 'javascript');
  } catch (error) {
    console.log('无效代码错误:', error.message);
  }
  
  // 测试不支持的语言
  try {
    CodeFormatter.format('print("hello")', 'python');
  } catch (error) {
    console.log('不支持语言错误:', error.message);
  }
}

// 运行所有示例
export async function runAllExamples() {
  console.log('开始运行代码格式化工具示例...\n');
  
  example1();
  example2();
  await example3();
  example4();
  example5();
  example6();
  example7();
  
  console.log('\n所有示例运行完成！');
}

// 如果在浏览器环境中，可以这样调用
if (typeof window !== 'undefined') {
  // 将示例函数挂载到全局对象，方便在控制台调用
  window.CodeFormatterExamples = {
    example1,
    example2,
    example3,
    example4,
    example5,
    example6,
    example7,
    runAllExamples
  };
} 