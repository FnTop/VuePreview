<template>
	<div id="app">
		<el-container>
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
		margin: 0;
		padding: 0;
		
		.el-container {
			height: 100%;
			
			.el-main {
				height: 100%;
				padding: 0;
			}
		}
	}
</style>