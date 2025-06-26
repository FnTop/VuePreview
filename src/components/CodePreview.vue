<template>
	<el-card class="preview-container">
		<Repl :editor="CustomCodeEdit" />
	</el-card>
</template>

<script setup>
	import { Repl } from "@vue/repl";
	import CustomCodeEdit from "./CustomCodeEdit.vue";
</script>

<style lang="less" scoped>
.preview-container {
	height: calc(100vh - 20px);
	overflow: hidden;
	
	:deep(.el-card__body) {
		height: 100%;
		padding: 0;
	}
}
</style>
