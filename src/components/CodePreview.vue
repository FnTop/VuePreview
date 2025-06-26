<template>
	<el-card class="preview-container">
		<div class="title">Vue3 Setup 代码在线预览</div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-input
					type="textarea"
					:rows="20"
					v-model="code"
					placeholder="请输入 Vue3 setup 语法糖代码"
					class="code-input"
				/>
			</el-col>
			<el-col :span="12">
				<div class="preview-area" v-html="compiledCode"></div>
				<div ref="previewContainer" class="preview-box"></div>
				<el-alert
					v-if="errorMessage"
					:message="errorMessage"
					type="error"
					show-icon
				/>
			</el-col>
		</el-row>
		<div class="button-container">
			<el-button type="primary" @click="generateSampleCode">生成简单.vue代码</el-button>
			<el-button @click="clearCode">清空代码</el-button>
		</div>
	</el-card>
</template>

<script setup>
import { ref, watch } from 'vue';
import { compileFile } from '@vue/repl';

const code = ref('');
const compiledCode = ref('');
const errorMessage = ref('');

const generateSampleCode = () => {
  code.value = `<template>
  <div class="sample">
    <h1>Vue3 Setup 示例</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const message = ref('Hello Vue3!');
<\/script>

<style scoped>
.sample {
  padding: 20px;
  font-family: Arial, sans-serif;
}
</style>`;};

const clearCode = () => {
  code.value = '';
  compiledCode.value = '';
  errorMessage.value = '';
};

watch(code, async (newCode) => {
  if (!newCode) {
    compiledCode.value = '';
    errorMessage.value = '';
    return;
  }
  try {
    errorMessage.value = '';
    const result = await compileFile({ filename: 'App.vue', code: newCode });
    if (!result) {
      errorMessage.value = '编译失败，未返回结果，请检查代码格式或依赖版本。';
      compiledCode.value = '';
      return;
    }
    if (result.errors && result.errors.length > 0) {
      errorMessage.value = `编译错误: ${result.errors.map(e => e.message).join('\n')}`;
      compiledCode.value = '';
    } else {
      compiledCode.value = result.code;
    }
  } catch (err) {
    errorMessage.value = `编译异常: ${err.message}`;
    compiledCode.value = '';
  }
});
</script>

<style lang="less" scoped>
.preview-container {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #409eff;
}

.code-input {
  width: 100%;
}

.preview-area {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  min-height: 400px;
  margin-bottom: 20px;
}

.preview-box {
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  min-height: 200px;
  background-color: #f5f7fa;
}

.button-container {
  margin-top: 20px;
  text-align: center;
}

.el-button {
  padding: 12px 20px;
  margin: 0 5px;
}
</style>