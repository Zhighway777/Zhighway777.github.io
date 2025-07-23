/**
 * 服务器端访问统计同步脚本
 * 使用外部API服务来持久化访客数据，防止部署时数据丢失
 */

(function() {
  'use strict';
  
  // 服务器端配置
  const SERVER_CONFIG = {
    // 使用 JSONBin.io 作为免费的数据存储服务
    // 你也可以替换为其他服务，如 Firebase、Supabase 等
    apiUrl: 'https://api.jsonbin.io/v3/b',
    apiKey: '$2a$10$YOUR_API_KEY_HERE', // 需要替换为你的 API Key
    binId: 'YOUR_BIN_ID_HERE', // 需要替换为你的 Bin ID
    syncInterval: 2 * 60 * 1000, // 2分钟同步一次
    maxRetries: 3,
    retryDelay: 1000
  };
  
  // 数据同步状态
  let syncState = {
    lastSync: 0,
    isSyncing: false,
    retryCount: 0,
    lastError: null
  };
  
  // 从服务器获取数据
  async function fetchFromServer() {
    if (!SERVER_CONFIG.binId || SERVER_CONFIG.binId === 'YOUR_BIN_ID_HERE') {
      console.log('⚠️ 服务器配置未设置，跳过服务器同步');
      return null;
    }
    
    try {
      const response = await fetch(`${SERVER_CONFIG.apiUrl}/${SERVER_CONFIG.binId}`, {
        method: 'GET',
        headers: {
          'X-Master-Key': SERVER_CONFIG.apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('📥 从服务器获取数据成功');
      return data.record || null;
    } catch (error) {
      console.error('❌ 从服务器获取数据失败:', error);
      syncState.lastError = error.message;
      return null;
    }
  }
  
  // 向服务器发送数据
  async function sendToServer(data) {
    if (!SERVER_CONFIG.binId || SERVER_CONFIG.binId === 'YOUR_BIN_ID_HERE') {
      console.log('⚠️ 服务器配置未设置，跳过服务器同步');
      return false;
    }
    
    if (syncState.isSyncing) {
      console.log('⏳ 正在同步中，跳过重复请求');
      return false;
    }
    
    syncState.isSyncing = true;
    
    try {
      const response = await fetch(`${SERVER_CONFIG.apiUrl}/${SERVER_CONFIG.binId}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': SERVER_CONFIG.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          websiteVisits: data.websiteVisits,
          visitHistory: data.visitHistory,
          lastSessionId: data.lastSessionId,
          lastUpdate: new Date().toISOString(),
          version: '1.0'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      syncState.lastSync = Date.now();
      syncState.lastError = null;
      syncState.retryCount = 0;
      console.log('📤 数据同步到服务器成功');
      return true;
    } catch (error) {
      console.error('❌ 数据同步到服务器失败:', error);
      syncState.lastError = error.message;
      syncState.retryCount++;
      
      // 重试机制
      if (syncState.retryCount < SERVER_CONFIG.maxRetries) {
        setTimeout(() => {
          syncState.isSyncing = false;
          sendToServer(data);
        }, SERVER_CONFIG.retryDelay * syncState.retryCount);
      } else {
        syncState.isSyncing = false;
      }
      return false;
    }
  }
  
  // 合并本地和服务器数据
  function mergeData(localData, serverData) {
    if (!serverData) return localData;
    
    const merged = { ...localData };
    
    // 合并访问次数，取最大值
    const localVisits = parseInt(localData.websiteVisits || '0');
    const serverVisits = parseInt(serverData.websiteVisits || '0');
    merged.websiteVisits = Math.max(localVisits, serverVisits).toString();
    
    // 合并访问历史
    const localHistory = JSON.parse(localData.visitHistory || '[]');
    const serverHistory = JSON.parse(serverData.visitHistory || '[]');
    
    // 去重并合并历史记录
    const allHistory = [...localHistory, ...serverHistory];
    const uniqueHistory = allHistory.filter((visit, index, self) => 
      index === self.findIndex(v => v.session === visit.session && v.timestamp === visit.timestamp)
    );
    
    // 按时间排序并保留最近100条
    uniqueHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    merged.visitHistory = JSON.stringify(uniqueHistory.slice(0, 100));
    
    console.log('🔄 数据合并完成');
    return merged;
  }
  
  // 初始化服务器同步
  async function initializeServerSync() {
    console.log('🚀 初始化服务器同步...');
    
    // 获取本地数据
    const localData = {
      websiteVisits: localStorage.getItem('websiteVisits'),
      visitHistory: localStorage.getItem('visitHistory'),
      lastSessionId: localStorage.getItem('lastSessionId')
    };
    
    // 从服务器获取数据
    const serverData = await fetchFromServer();
    
    // 合并数据
    const mergedData = mergeData(localData, serverData);
    
    // 更新本地存储
    if (mergedData.websiteVisits) {
      localStorage.setItem('websiteVisits', mergedData.websiteVisits);
    }
    if (mergedData.visitHistory) {
      localStorage.setItem('visitHistory', mergedData.visitHistory);
    }
    if (mergedData.lastSessionId) {
      localStorage.setItem('lastSessionId', mergedData.lastSessionId);
    }
    
    // 同步到服务器
    await sendToServer(mergedData);
    
    console.log('✅ 服务器同步初始化完成');
  }
  
  // 定期同步数据
  function startServerSync() {
    setInterval(async () => {
      const localData = {
        websiteVisits: localStorage.getItem('websiteVisits'),
        visitHistory: localStorage.getItem('visitHistory'),
        lastSessionId: localStorage.getItem('lastSessionId')
      };
      
      await sendToServer(localData);
    }, SERVER_CONFIG.syncInterval);
  }
  
  // 手动同步数据
  async function manualSync() {
    console.log('🔄 手动同步数据...');
    const localData = {
      websiteVisits: localStorage.getItem('websiteVisits'),
      visitHistory: localStorage.getItem('visitHistory'),
      lastSessionId: localStorage.getItem('lastSessionId')
    };
    
    const success = await sendToServer(localData);
    if (success) {
      console.log('✅ 手动同步成功');
    } else {
      console.log('❌ 手动同步失败');
    }
    return success;
  }
  
  // 获取同步状态
  function getSyncStatus() {
    return {
      ...syncState,
      nextSync: syncState.lastSync + SERVER_CONFIG.syncInterval,
      isConfigured: SERVER_CONFIG.binId !== 'YOUR_BIN_ID_HERE'
    };
  }
  
  // 设置服务器配置
  function setServerConfig(config) {
    Object.assign(SERVER_CONFIG, config);
    console.log('⚙️ 服务器配置已更新');
  }
  
  // 暴露到全局对象
  window.VisitCounterServer = {
    initializeServerSync,
    startServerSync,
    manualSync,
    getSyncStatus,
    setServerConfig,
    fetchFromServer,
    sendToServer
  };
  
  // 页面加载时初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保主访问统计脚本已加载
    setTimeout(() => {
      initializeServerSync().then(() => {
        startServerSync();
      });
    }, 1000);
  });
  
  // 页面卸载前同步
  window.addEventListener('beforeunload', function() {
    const localData = {
      websiteVisits: localStorage.getItem('websiteVisits'),
      visitHistory: localStorage.getItem('visitHistory'),
      lastSessionId: localStorage.getItem('lastSessionId')
    };
    
    // 使用 sendBeacon 确保数据发送
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(localData)], { type: 'application/json' });
      navigator.sendBeacon(`${SERVER_CONFIG.apiUrl}/${SERVER_CONFIG.binId}`, blob);
    } else {
      sendToServer(localData);
    }
  });
  
})(); 