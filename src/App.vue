<template>
	<div id="app">
		<el-container>
			<el-header>工具站点</el-header>
			<el-main>
				<code-preview />
			</el-main>
		</el-container>
	</div>
</template>

<script setup>
	import CodePreview from "./components/CodePreview.vue";
</script>

<style lang="less" scoped>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		margin-top: 60px;
	}
</style>