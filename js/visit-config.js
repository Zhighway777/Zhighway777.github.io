/**
 * 访问统计配置文件
 * 用于配置服务器端数据同步和其他设置
 */

window.VisitConfig = {
  // 服务器端配置
  server: {
    // 使用 JSONBin.io 作为免费的数据存储服务
    // 注册地址: https://jsonbin.io/
    enabled: false, // 设置为 true 启用服务器同步
    apiUrl: 'https://api.jsonbin.io/v3/b',
    apiKey: '$2a$10$YOUR_API_KEY_HERE', // 从 JSONBin.io 获取
    binId: 'YOUR_BIN_ID_HERE', // 从 JSONBin.io 获取
    syncInterval: 2 * 60 * 1000, // 同步间隔（毫秒）
    maxRetries: 3,
    retryDelay: 1000
  },
  
  // 本地存储配置
  local: {
    backupEnabled: true, // 启用本地备份
    backupInterval: 5 * 60 * 1000, // 备份间隔（毫秒）
    maxHistoryRecords: 100, // 最大历史记录数
    sessionTimeout: 30 * 60 * 1000 // 会话超时时间（毫秒）
  },
  
  // 调试配置
  debug: {
    enabled: false, // 启用调试模式
    logLevel: 'info', // 日志级别: 'debug', 'info', 'warn', 'error'
    showConsoleMessages: true // 显示控制台消息
  },
  
  // 访客统计配置
  analytics: {
    trackPageViews: true, // 跟踪页面访问
    trackReferrers: true, // 跟踪来源
    trackUserAgent: true, // 跟踪用户代理
    trackSessionDuration: true, // 跟踪会话时长
    anonymizeData: true // 匿名化数据
  }
};

// 配置验证函数
window.VisitConfig.validate = function() {
  const config = window.VisitConfig;
  const errors = [];
  
  if (config.server.enabled) {
    if (!config.server.apiKey || config.server.apiKey === '$2a$10$YOUR_API_KEY_HERE') {
      errors.push('服务器 API Key 未配置');
    }
    if (!config.server.binId || config.server.binId === 'YOUR_BIN_ID_HERE') {
      errors.push('服务器 Bin ID 未配置');
    }
  }
  
  if (config.local.backupInterval < 60000) {
    errors.push('备份间隔不能少于1分钟');
  }
  
  if (config.server.syncInterval < 60000) {
    errors.push('同步间隔不能少于1分钟');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// 获取配置的函数
window.VisitConfig.get = function(path) {
  const keys = path.split('.');
  let value = window.VisitConfig;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// 设置配置的函数
window.VisitConfig.set = function(path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let target = window.VisitConfig;
  
  for (const key of keys) {
    if (!target[key] || typeof target[key] !== 'object') {
      target[key] = {};
    }
    target = target[key];
  }
  
  target[lastKey] = value;
  console.log(`⚙️ 配置已更新: ${path} = ${value}`);
};

// 保存配置到本地存储
window.VisitConfig.save = function() {
  try {
    localStorage.setItem('visitConfig', JSON.stringify(window.VisitConfig));
    console.log('💾 配置已保存到本地存储');
  } catch (error) {
    console.error('保存配置失败:', error);
  }
};

// 从本地存储加载配置
window.VisitConfig.load = function() {
  try {
    const saved = localStorage.getItem('visitConfig');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(window.VisitConfig, parsed);
      console.log('📥 配置已从本地存储加载');
    }
  } catch (error) {
    console.error('加载配置失败:', error);
  }
};

// 重置配置到默认值
window.VisitConfig.reset = function() {
  // 重新加载默认配置
  location.reload();
};

// 导出配置
window.VisitConfig.export = function() {
  const config = { ...window.VisitConfig };
  delete config.validate;
  delete config.get;
  delete config.set;
  delete config.save;
  delete config.load;
  delete config.reset;
  delete config.export;
  
  return JSON.stringify(config, null, 2);
};

// 导入配置
window.VisitConfig.import = function(configString) {
  try {
    const config = JSON.parse(configString);
    Object.assign(window.VisitConfig, config);
    window.VisitConfig.save();
    console.log('📤 配置已导入');
    return true;
  } catch (error) {
    console.error('导入配置失败:', error);
    return false;
  }
};

// 页面加载时自动加载配置
document.addEventListener('DOMContentLoaded', function() {
  window.VisitConfig.load();
  
  // 验证配置
  const validation = window.VisitConfig.validate();
  if (!validation.isValid) {
    console.warn('⚠️ 配置验证失败:', validation.errors);
  }
  
  // 如果启用调试模式，显示配置信息
  if (window.VisitConfig.debug.enabled) {
    console.log('🔧 访问统计配置:', window.VisitConfig);
  }
}); 