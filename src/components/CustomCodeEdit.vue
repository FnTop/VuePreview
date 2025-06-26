<template>
  <div class="custom-code-edit" :class="currentTheme">
    <!-- 编辑器头部 -->
    <div class="editor-header">
      <div class="file-info">
        <el-icon><Document /></el-icon>
        <span class="filename">{{ filename }}</span>
        <el-tag :type="getLanguageTagType()" size="small">{{ language.toUpperCase() }}</el-tag>
      </div>
      
      <div class="header-actions">
        <el-button-group>
          <el-button size="small" :icon="CopyDocument" @click="copyCode" title="复制代码">
            复制
          </el-button>
          <el-button size="small" :icon="Download" @click="downloadCode" title="下载代码">
            下载
          </el-button>
          <el-button size="small" :icon="Refresh" @click="formatCode" title="格式化代码">
            格式化
          </el-button>
        </el-button-group>
        
        <el-dropdown @command="handleThemeChange" trigger="click">
          <el-button size="small" :icon="Brush">
            主题
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="dark">深色主题</el-dropdown-item>
              <el-dropdown-item command="light">浅色主题</el-dropdown-item>
              <el-dropdown-item command="vs-code">VS Code</el-dropdown-item>
              <el-dropdown-item command="monokai">Monokai</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    
    <!-- 编辑器工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <el-switch
          v-model="autoSave"
          active-text="自动保存"
          inactive-text="手动保存"
          size="small"
        />
        <el-switch
          v-model="wordWrap"
          active-text="自动换行"
          inactive-text="不换行"
          size="small"
        />
      </div>
      
      <div class="toolbar-right">
        <el-button size="small" :icon="Plus" @click="toggleImports" title="导入库">
          导入
        </el-button>
      </div>
    </div>
    
    <!-- 导入库面板 -->
    <el-dialog
      v-model="showImports"
      title="导入库配置"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      class="imports-dialog"
    >
      <div class="imports-content">
        <div class="library-section">
          <h5>Element Plus</h5>
          <div class="import-options">
            <el-checkbox v-model="importConfig.elementPlus.enabled" @change="updateImports">
              启用 Element Plus
            </el-checkbox>
            <el-checkbox v-model="importConfig.elementPlus.autoImport" @change="updateImports">
              自动导入组件
            </el-checkbox>
            <el-checkbox v-model="importConfig.elementPlus.importIcons" @change="updateImports">
              导入图标
            </el-checkbox>
          </div>
        </div>
        
        <div class="library-section">
          <h5>Ant Design Vue 3</h5>
          <div class="import-options">
            <el-checkbox v-model="importConfig.antdv.enabled" @change="updateImports">
              启用 Ant Design Vue
            </el-checkbox>
            <el-checkbox v-model="importConfig.antdv.autoImport" @change="updateImports">
              自动导入组件
            </el-checkbox>
            <el-checkbox v-model="importConfig.antdv.importIcons" @change="updateImports">
              导入图标
            </el-checkbox>
          </div>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showImports = false">取消</el-button>
          <el-button type="primary" @click="showImports = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
    
    <!-- 代码编辑器 -->
    <div class="editor-container">
      <el-input
        type="textarea"
        :rows="20"
        v-model="codeValue"
        placeholder="请输入 Vue3 setup 语法糖代码"
        class="code-input"
        @input="handleInput"
        @keydown.ctrl.s.prevent="saveCode"
      />
    </div>
    
    <!-- 编辑器状态栏 -->
    <div class="editor-statusbar">
      <div class="status-left">
        <el-text type="info" size="small">
          行数: {{ getLineCount() }} | 字符数: {{ codeValue.length }}
        </el-text>
        <el-text type="success" size="small" v-if="lastSaved">
          最后保存: {{ lastSaved }}
        </el-text>
      </div>
      
      <div class="status-right">
        <el-text type="info" size="small">
          {{ currentTheme }} 主题
        </el-text>
        <el-text type="info" size="small">
          {{ getEncoding() }}
        </el-text>
        <el-text type="info" size="small" v-if="activeImports.length">
          已导入: {{ activeImports.join(', ') }}
        </el-text>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { 
  Document, CopyDocument, Download, Refresh, Brush, ArrowDown,
  Plus
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { formatCodeAsync } from '../utils/codeFormatter';

// 符合 Repl editor 接口的 props
const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  filename: {
    type: String,
    default: 'App.vue'
  },
  language: {
    type: String,
    default: 'vue'
  }
});

// 符合 Repl editor 接口的 emits
const emit = defineEmits(['update:value', 'change', 'update:importMap']);

const codeValue = ref(props.value);
const autoSave = ref(false);
const wordWrap = ref(true);
const lastSaved = ref('');
const currentTheme = ref('dark');
const showImports = ref(false);
const importConfig = ref({
  elementPlus: {
    enabled: false,
    autoImport: true,
    importIcons: true
  },
  antdv: {
    enabled: false,
    autoImport: true,
    importIcons: true
  }
});

// 新增：维护 importMap 响应式对象
const importMap = ref({
  imports: {},
  scopes: {}
});

// 计算活跃的导入
const activeImports = computed(() => {
  const active = [];
  if (importConfig.value.elementPlus.enabled) active.push('Element Plus');
  if (importConfig.value.antdv.enabled) active.push('Ant Design Vue');
  return active;
});

// 主题配置
const themes = {
  dark: {
    background: '#1e1e1e',
    color: '#d4d4d4',
    border: '#3c3c3c'
  },
  light: {
    background: '#ffffff',
    color: '#333333',
    border: '#dcdfe6'
  },
  'vs-code': {
    background: '#1e1e1e',
    color: '#d4d4d4',
    border: '#3c3c3c'
  },
  monokai: {
    background: '#272822',
    color: '#f8f8f2',
    border: '#75715e'
  }
};

// 监听外部传入的 value 变化
watch(() => props.value, (newValue) => {
  codeValue.value = newValue;
});

// 监听内部值变化，向外部发送更新
watch(codeValue, (newValue) => {
  emit('update:value', newValue);
  emit('change', newValue);
  
  // 自动保存
  if (autoSave.value) {
    setTimeout(() => {
      saveCode();
    }, 1000);
  }
});

// 处理输入事件
const handleInput = (value) => {
  codeValue.value = value;
};

// 获取语言标签类型
const getLanguageTagType = () => {
  const typeMap = {
    'vue': 'success',
    'js': 'warning',
    'ts': 'primary',
    'html': 'danger',
    'css': 'info'
  };
  return typeMap[props.language] || 'info';
};

// 获取行数
const getLineCount = () => {
  return codeValue.value.split('\n').length;
};

// 获取编码
const getEncoding = () => {
  return 'UTF-8';
};

// 复制代码
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(codeValue.value);
    ElMessage.success('代码已复制到剪贴板');
  } catch (err) {
    ElMessage.error('复制失败');
  }
};

// 下载代码
const downloadCode = () => {
  const blob = new Blob([codeValue.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = props.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  ElMessage.success('代码已下载');
};

// 格式化代码
const formatCode = async () => {
  try {
    const code = codeValue.value;
    if (!code || !code.trim()) {
      ElMessage.warning('没有代码需要格式化');
      return;
    }

    // 使用封装的格式化工具
    const formattedCode = await formatCodeAsync(code, props.language);
    codeValue.value = formattedCode;
    ElMessage.success('代码格式化成功');
  } catch (err) {
    console.error('格式化错误:', err);
    ElMessage.error(`格式化失败: ${err.message || '未知错误'}`);
  }
};

// 保存代码
const saveCode = () => {
  lastSaved.value = new Date().toLocaleTimeString();
  ElMessage.success('代码已保存');
};

// 切换主题
const handleThemeChange = (theme) => {
  currentTheme.value = theme;
  ElMessage.success(`已切换到${theme}主题`);
};

// 符合 Repl editor 接口的方法
const setValue = (value) => {
  codeValue.value = value;
};

const getValue = () => {
  return codeValue.value;
};

const focus = () => {
  // 聚焦到输入框
  const textarea = document.querySelector('.code-input textarea');
  if (textarea) {
    textarea.focus();
  }
};

// 切换导入库面板
const toggleImports = () => {
  showImports.value = !showImports.value;
};

// 更新导入配置
const updateImports = () => {
  // 更新 importMap
  updateImportMap();
  
  // 这里可以添加额外的逻辑，比如保存配置到本地存储
  console.log('导入配置已更新:', importConfig.value);
};

// 新增：更新 importMap 的方法
const updateImportMap = () => {
  // 获取当前的 importMap，如果不存在则创建新的
  const currentImportMap = importMap.value || { imports: {}, scopes: {} };
  
  // 保留原有的 imports 和 scopes
  const newImportMap = {
    imports: { ...currentImportMap.imports },
    scopes: { ...currentImportMap.scopes }
  };
  
  // Element Plus 配置
  if (importConfig.value.elementPlus.enabled) {
    if (importConfig.value.elementPlus.autoImport) {
      newImportMap.imports['element-plus'] = 'https://cdn.jsdelivr.net/npm/element-plus@2.4.4/dist/index.full.js';
      newImportMap.imports['element-plus/dist/index.css'] = 'https://cdn.jsdelivr.net/npm/element-plus@2.4.4/dist/index.css';
    }
    if (importConfig.value.elementPlus.importIcons) {
      newImportMap.imports['@element-plus/icons-vue'] = 'https://cdn.jsdelivr.net/npm/@element-plus/icons-vue@2.3.1/dist/index.js';
    }
  } else {
    // 如果禁用了 Element Plus，移除相关的 imports
    delete newImportMap.imports['element-plus'];
    delete newImportMap.imports['element-plus/dist/index.css'];
    delete newImportMap.imports['@element-plus/icons-vue'];
  }
  
  // Ant Design Vue 配置
  if (importConfig.value.antdv.enabled) {
    if (importConfig.value.antdv.autoImport) {
      newImportMap.imports['ant-design-vue'] = 'https://cdn.jsdelivr.net/npm/ant-design-vue@4.0.0/dist/antd.min.js';
      newImportMap.imports['ant-design-vue/dist/antd.css'] = 'https://cdn.jsdelivr.net/npm/ant-design-vue@4.0.0/dist/reset.css';
    }
    if (importConfig.value.antdv.importIcons) {
      newImportMap.imports['@ant-design/icons-vue'] = 'https://cdn.jsdelivr.net/npm/@ant-design/icons-vue@7.0.1/dist/index.js';
    }
  } else {
    // 如果禁用了 Ant Design Vue，移除相关的 imports
    delete newImportMap.imports['ant-design-vue'];
    delete newImportMap.imports['ant-design-vue/dist/antd.css'];
    delete newImportMap.imports['@ant-design/icons-vue'];
  }
  
  // 确保 Vue 相关库始终存在，使用正确的 CDN 格式
  newImportMap.imports['vue'] = 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@3.5.17/dist/runtime-dom.esm-browser.js';
  newImportMap.imports['vue/server-renderer'] = 'https://cdn.jsdelivr.net/npm/@vue/server-renderer@3.5.17/dist/server-renderer.esm-browser.js';
  newImportMap.imports['vue-router'] = 'https://cdn.jsdelivr.net/npm/vue-router@4.2.5/dist/vue-router.esm-browser.js';
  newImportMap.imports['pinia'] = 'https://cdn.jsdelivr.net/npm/pinia@2.1.7/dist/pinia.esm-browser.js';
  
  // 更新 importMap
  importMap.value = newImportMap;
  
  // 发送更新事件给父组件
  emit('update:importMap', newImportMap);
  
  // 直接修改 Vue REPL 的 Import Map 输入框的值
  updateVueReplImportMap(newImportMap);
  
  // 显示成功消息
  ElMessage.success({
    message: 'Import Map 配置已更新',
    duration: 2000,
    showClose: true
  });
  
  console.log('Import Map 已更新:', newImportMap);
};

// 新增：直接修改 Vue REPL 的 Import Map 输入框的值
const updateVueReplImportMap = (importMapData) => {
  // 使用 nextTick 确保 DOM 更新完成后再执行
  nextTick(() => {
    // 查找 Vue REPL 的 Import Map 输入框
    // 尝试多种选择器来找到正确的 textarea
    let importMapTextarea = null;
    
    // 方法1：通过文件名查找
    const textareas = document.querySelectorAll('.el-textarea__inner');
    for (const textarea of textareas) {
      const container = textarea.closest('.custom-code-edit');
      if (container) {
        const filenameElement = container.querySelector('.filename');
        if (filenameElement && filenameElement.textContent === 'import-map.json') {
          importMapTextarea = textarea;
          break;
        }
      }
    }
    
    // 方法2：如果方法1失败，尝试通过父级结构查找
    if (!importMapTextarea) {
      const importMapWrapper = document.querySelector('.import-map-wrapper');
      if (importMapWrapper) {
        const activeFile = importMapWrapper.querySelector('.file.active');
        if (activeFile && activeFile.textContent.includes('Import Map')) {
          const editorContainer = importMapWrapper.parentElement?.querySelector('.editor-container');
          if (editorContainer) {
            importMapTextarea = editorContainer.querySelector('.el-textarea__inner');
          }
        }
      }
    }
    
    // 方法3：如果前两种方法都失败，尝试查找所有 textarea 并检查内容
    if (!importMapTextarea) {
      const allTextareas = document.querySelectorAll('.el-textarea__inner');
      for (const textarea of allTextareas) {
        const value = textarea.value || '';
        if (value.includes('"imports"') && value.includes('"scopes"')) {
          importMapTextarea = textarea;
          break;
        }
      }
    }
    
    if (importMapTextarea) {
      // 格式化 JSON 并设置值
      const formattedJson = JSON.stringify(importMapData, null, 2);
      importMapTextarea.value = formattedJson;
      
      // 触发 input 事件以确保 Vue 响应式更新
      importMapTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      
      console.log('Vue REPL Import Map 输入框已更新');
    } else {
      console.warn('未找到 Vue REPL 的 Import Map 输入框');
    }
  });
};

// 新增：获取当前 importMap 的方法
const getImportMap = () => {
  return importMap.value;
};

// 新增：设置 importMap 的方法
const setImportMap = (newImportMap) => {
  importMap.value = newImportMap;
};

// 暴露方法给 Repl 组件使用
defineExpose({
  setValue,
  getValue,
  focus,
  getImportMap,
  setImportMap
});

onMounted(() => {
  // 初始化时设置值
  if (props.value) {
    codeValue.value = props.value;
  }
  
  // 初始化 importMap
  updateImportMap();
});
</script>

<style lang="less" scoped>

.custom-code-edit {
  
  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .filename {
        font-weight: 600;
        color: #303133;
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #fafafa;
    border-bottom: 1px solid #e4e7ed;
    
    .toolbar-left, .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  
  .imports-dialog {
    .imports-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      
      .library-section {
        background: white;
        padding: 16px;
        border-radius: 6px;
        border: 1px solid #e4e7ed;
        
        h5 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 14px;
          font-weight: 600;
        }
        
        .import-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
      }
    }
    
    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
  }
  
  // 自定义对话框样式
  :deep(.el-dialog) {
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    
    .el-dialog__header {
      border-bottom: 1px solid #e4e7ed;
      padding: 20px 24px 16px;
      
      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }
    
    .el-dialog__body {
      padding: 24px;
    }
    
    .el-dialog__footer {
      border-top: 1px solid #e4e7ed;
      padding: 16px 24px 20px;
    }
  }
  
  // 自定义遮罩层样式
  :deep(.el-overlay) {
    z-index: 1999;
    background-color: rgba(0, 0, 0, 0.5);
  }
  
  .editor-container {
    height: calc(100vh - 170px);
    flex: 1;
    overflow: hidden;
    
    .code-input {
      width: 100%;
      height: 100%;
      
      :deep(.el-textarea__inner) {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 14px;
        line-height: 1.5;
        border: none;
        border-radius: 0;
        padding: 12px;
        resize: none;
        height: 100% !important;
        
        &:focus {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }
        
        &::placeholder {
          color: #6c6c6c;
        }
      }
    }
  }
  
  .editor-statusbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    background-color: #f5f7fa;
    border-top: 1px solid #e4e7ed;
    font-size: 12px;
    
    .status-left, .status-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }
  
  // 主题样式
  &.dark {
    .editor-container .code-input :deep(.el-textarea__inner) {
      background-color: #1e1e1e;
      color: #d4d4d4;
    }
  }
  
  &.light {
    .editor-container .code-input :deep(.el-textarea__inner) {
      background-color: #ffffff;
      color: #333333;
    }
  }
  
  &.vs-code {
    .editor-container .code-input :deep(.el-textarea__inner) {
      background-color: #1e1e1e;
      color: #d4d4d4;
    }
  }
  
  &.monokai {
    .editor-container .code-input :deep(.el-textarea__inner) {
      background-color: #272822;
      color: #f8f8f2;
    }
  }
}
</style> 