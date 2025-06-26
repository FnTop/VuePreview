import beautify from 'js-beautify';

/**
 * 代码格式化工具类
 */
export class CodeFormatter {
  /**
   * 格式化配置
   */
  static config = {
    // HTML/Vue 格式化配置
    html: {
      indent_size: 2,
      indent_char: ' ',
      max_preserve_newlines: 2,
      preserve_newlines: true,
      keep_indent_on_empty_lines: false,
      break_chained_methods: false,
      indent_scripts: 'normal',
      brace_style: 'collapse',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: false,
      end_with_newline: true,
      wrap_line_length: 0,
      indent_inner_html: false,
      comma_first: false,
      e4x: false,
      indent_empty_lines: false
    },
    
    // JavaScript/TypeScript 格式化配置
    js: {
      indent_size: 2,
      indent_char: ' ',
      indent_level: 0,
      indent_with_tabs: false,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      space_in_paren: false,
      space_in_empty_paren: false,
      jslint_happy: false,
      space_after_anon_function: false,
      space_after_named_function: false,
      brace_style: 'collapse',
      break_chained_methods: false,
      keep_array_indentation: false,
      keep_function_indentation: false,
      space_before_conditional: true,
      eval_code: false,
      unescape_strings: false,
      wrap_line_length: 0,
      end_with_newline: true
    },
    
    // CSS/Less/SCSS 格式化配置
    css: {
      indent_size: 2,
      indent_char: ' ',
      indent_with_tabs: false,
      selector_separator_newline: false,
      end_with_newline: true,
      newline_between_rules: true,
      preserve_newlines: false,
      max_preserve_newlines: 0,
      wrap_line_length: 0
    }
  };

  /**
   * 格式化代码
   * @param {string} code - 要格式化的代码
   * @param {string} language - 编程语言类型
   * @param {object} customConfig - 自定义配置（可选）
   * @returns {string} 格式化后的代码
   * @throws {Error} 格式化失败时抛出错误
   */
  static format(code, language, customConfig = {}) {
    if (!code || typeof code !== 'string') {
      throw new Error('代码不能为空');
    }

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      throw new Error('没有代码需要格式化');
    }

    const lang = language.toLowerCase();
    let formattedCode = '';

    try {
      switch (lang) {
        case 'vue':
          formattedCode = this.formatVue(trimmedCode, customConfig);
          break;
        
        case 'js':
        case 'javascript':
          formattedCode = this.formatJavaScript(trimmedCode, customConfig);
          break;
        
        case 'ts':
        case 'typescript':
          formattedCode = this.formatTypeScript(trimmedCode, customConfig);
          break;
        
        case 'html':
          formattedCode = this.formatHtml(trimmedCode, customConfig);
          break;
        
        case 'css':
        case 'less':
        case 'scss':
          formattedCode = this.formatCss(trimmedCode, customConfig);
          break;
        
        default:
          formattedCode = this.formatJavaScript(trimmedCode, customConfig);
      }

      return formattedCode;
    } catch (error) {
      throw new Error(`格式化失败: ${error.message}`);
    }
  }

  /**
   * 格式化 Vue 代码
   * @param {string} code - Vue 代码
   * @param {object} customConfig - 自定义配置
   * @returns {string} 格式化后的代码
   */
  static formatVue(code, customConfig = {}) {
    const config = { ...this.config.html, ...customConfig };
    return beautify.html(code, config);
  }

  /**
   * 格式化 JavaScript 代码
   * @param {string} code - JavaScript 代码
   * @param {object} customConfig - 自定义配置
   * @returns {string} 格式化后的代码
   */
  static formatJavaScript(code, customConfig = {}) {
    const config = { ...this.config.js, ...customConfig };
    return beautify.js(code, config);
  }

  /**
   * 格式化 TypeScript 代码
   * @param {string} code - TypeScript 代码
   * @param {object} customConfig - 自定义配置
   * @returns {string} 格式化后的代码
   */
  static formatTypeScript(code, customConfig = {}) {
    // TypeScript 使用 JavaScript 格式化器
    return this.formatJavaScript(code, customConfig);
  }

  /**
   * 格式化 HTML 代码
   * @param {string} code - HTML 代码
   * @param {object} customConfig - 自定义配置
   * @returns {string} 格式化后的代码
   */
  static formatHtml(code, customConfig = {}) {
    const config = { ...this.config.html, ...customConfig };
    return beautify.html(code, config);
  }

  /**
   * 格式化 CSS 代码
   * @param {string} code - CSS 代码
   * @param {object} customConfig - 自定义配置
   * @returns {string} 格式化后的代码
   */
  static formatCss(code, customConfig = {}) {
    const config = { ...this.config.css, ...customConfig };
    return beautify.css(code, config);
  }

  /**
   * 获取支持的语言列表
   * @returns {string[]} 支持的语言列表
   */
  static getSupportedLanguages() {
    return ['vue', 'js', 'javascript', 'ts', 'typescript', 'html', 'css', 'less', 'scss'];
  }

  /**
   * 检查是否支持指定语言
   * @param {string} language - 语言类型
   * @returns {boolean} 是否支持
   */
  static isLanguageSupported(language) {
    return this.getSupportedLanguages().includes(language.toLowerCase());
  }

  /**
   * 获取默认配置
   * @param {string} language - 语言类型
   * @returns {object} 默认配置
   */
  static getDefaultConfig(language) {
    const lang = language.toLowerCase();
    
    switch (lang) {
      case 'vue':
      case 'html':
        return this.config.html;
      case 'js':
      case 'javascript':
      case 'ts':
      case 'typescript':
        return this.config.js;
      case 'css':
      case 'less':
      case 'scss':
        return this.config.css;
      default:
        return this.config.js;
    }
  }
}

/**
 * 便捷的格式化函数
 * @param {string} code - 要格式化的代码
 * @param {string} language - 编程语言类型
 * @param {object} customConfig - 自定义配置（可选）
 * @returns {string} 格式化后的代码
 */
export function formatCode(code, language, customConfig = {}) {
  return CodeFormatter.format(code, language, customConfig);
}

/**
 * 异步格式化函数（用于处理大量代码）
 * @param {string} code - 要格式化的代码
 * @param {string} language - 编程语言类型
 * @param {object} customConfig - 自定义配置（可选）
 * @returns {Promise<string>} 格式化后的代码
 */
export function formatCodeAsync(code, language, customConfig = {}) {
  return new Promise((resolve, reject) => {
    try {
      const result = CodeFormatter.format(code, language, customConfig);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

export default CodeFormatter; 