const importMap = ref({
  imports: {
    vue: 'https://unpkg.com/vue@3.3.4/dist/vue.esm-browser.js'
  }
});

watch(importConfig, () => {
  // 动态添加 element-plus
  if (importConfig.value.elementPlus.enabled) {
    importMap.value.imports['element-plus'] = 'https://unpkg.com/element-plus/dist/index.full.mjs';
    importMap.value.imports['@element-plus/icons-vue'] = 'https://unpkg.com/@element-plus/icons-vue/dist/index.iife.js';
  } else {
    delete importMap.value.imports['element-plus'];
    delete importMap.value.imports['@element-plus/icons-vue'];
  }
  // 同理处理 ant-design-vue
  // ...
}, { deep: true }); 