/**
 * 全站访问统计脚本
 * 用于记录整个网站的访问次数和访问历史
 */

(function() {
  'use strict';
  
  // 会话超时时间（30分钟）
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分钟
  
  // 生成或获取会话ID
  function getSessionId() {
    const stored = sessionStorage.getItem('visitSessionData');
    const now = Date.now();
    
    if (stored) {
      try {
        const sessionData = JSON.parse(stored);
        // 检查会话是否过期
        if (now - sessionData.startTime < SESSION_TIMEOUT) {
          // 更新最后活跃时间
          sessionData.lastActivity = now;
          sessionStorage.setItem('visitSessionData', JSON.stringify(sessionData));
          return sessionData.sessionId;
        }
      } catch (e) {
        console.log('会话数据解析错误:', e);
      }
    }
    
    // 创建新会话
    const newSessionId = 'session_' + now + '_' + Math.random().toString(36).substr(2, 9);
    const sessionData = {
      sessionId: newSessionId,
      startTime: now,
      lastActivity: now
    };
    sessionStorage.setItem('visitSessionData', JSON.stringify(sessionData));
    return newSessionId;
  }
  
  // 检查是否是新会话
  function isNewSession() {
    const lastSessionId = localStorage.getItem('lastSessionId');
    const currentSessionId = getSessionId();
    
    if (lastSessionId !== currentSessionId) {
      localStorage.setItem('lastSessionId', currentSessionId);
      return true;
    }
    return false;
  }
  
  // 更新网站总访问次数
  function updateWebsiteVisits() {
    // 检查是否是新会话
    if (!isNewSession()) {
      console.log('同一会话，不重复计数');
      // 仍然触发事件，让UI更新
      triggerVisitEvent(false);
      return;
    }
    
    // 获取并更新总访问次数
    let totalVisits = parseInt(localStorage.getItem('websiteVisits') || '0');
    totalVisits += 1;
    localStorage.setItem('websiteVisits', totalVisits.toString());
    
    // 记录访问历史
    let visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
    const visitRecord = {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      session: getSessionId(),
      userAgent: navigator.userAgent.substring(0, 100),
      referrer: document.referrer || 'Direct',
      visitNumber: totalVisits
    };
    
    visitHistory.push(visitRecord);
    
    // 只保留最近100次访问记录
    if (visitHistory.length > 100) {
      visitHistory = visitHistory.slice(-100);
    }
    localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
    
    console.log(`🎉 新会话访问! 总访问次数: ${totalVisits}, 页面: ${window.location.pathname}`);
    
    // 触发自定义事件
    triggerVisitEvent(true);
  }
  
  // 触发访问更新事件
  function triggerVisitEvent(isNewSession) {
    const visitEvent = new CustomEvent('websiteVisitUpdated', {
      detail: {
        totalVisits: parseInt(localStorage.getItem('websiteVisits') || '0'),
        currentPage: window.location.pathname,
        isNewSession: isNewSession,
        sessionId: getSessionId()
      }
    });
    document.dispatchEvent(visitEvent);
  }
  
  // 获取网站总访问次数
  function getWebsiteVisits() {
    return parseInt(localStorage.getItem('websiteVisits') || '0');
  }
  
  // 获取访问历史
  function getVisitHistory() {
    return JSON.parse(localStorage.getItem('visitHistory') || '[]');
  }
  
  // 获取今日访问次数
  function getTodayVisits() {
    const today = new Date().toDateString();
    const visitHistory = getVisitHistory();
    return visitHistory.filter(visit => {
      const visitDate = new Date(visit.timestamp).toDateString();
      return visitDate === today;
    }).length;
  }
  
  // 获取本周访问次数
  function getWeekVisits() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const visitHistory = getVisitHistory();
    return visitHistory.filter(visit => {
      const visitDate = new Date(visit.timestamp);
      return visitDate >= oneWeekAgo;
    }).length;
  }
  
  // 获取访问统计信息
  function getVisitStats() {
    const visitHistory = getVisitHistory();
    const totalVisits = getWebsiteVisits();
    const todayVisits = getTodayVisits();
    const weekVisits = getWeekVisits();
    
    // 统计页面访问次数
    const pageStats = {};
    visitHistory.forEach(visit => {
      pageStats[visit.page] = (pageStats[visit.page] || 0) + 1;
    });
    
    // 找出最受欢迎的页面
    const mostVisitedPage = Object.keys(pageStats).reduce((a, b) => 
      pageStats[a] > pageStats[b] ? a : b, '/');
    
    return {
      totalVisits,
      todayVisits,
      weekVisits,
      pageStats,
      mostVisitedPage,
      visitHistory: visitHistory.slice(-10), // 最近10次访问
      currentSession: getSessionId()
    };
  }
  
  // 设置访问次数（用于恢复数据）
  function setWebsiteVisits(count) {
    if (typeof count === 'number' && count >= 0) {
      localStorage.setItem('websiteVisits', count.toString());
      console.log(`访问次数已设置为: ${count}`);
      triggerVisitEvent(false);
      return true;
    }
    return false;
  }
  
  // 清除访问数据（调试用）
  function clearVisitData() {
    localStorage.removeItem('websiteVisits');
    localStorage.removeItem('visitHistory');
    localStorage.removeItem('lastSessionId');
    sessionStorage.removeItem('visitSessionData');
    console.log('访问数据已清除');
  }
  
  // 备份访问数据
  function backupVisitData() {
    const data = {
      websiteVisits: localStorage.getItem('websiteVisits'),
      visitHistory: localStorage.getItem('visitHistory'),
      backupTime: new Date().toISOString()
    };
    const backup = JSON.stringify(data, null, 2);
    console.log('访问数据备份:', backup);
    return backup;
  }
  
  // 恢复访问数据
  function restoreVisitData(backupData) {
    try {
      const data = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
      if (data.websiteVisits) {
        localStorage.setItem('websiteVisits', data.websiteVisits);
      }
      if (data.visitHistory) {
        localStorage.setItem('visitHistory', data.visitHistory);
      }
      console.log('访问数据已恢复');
      triggerVisitEvent(false);
      return true;
    } catch (e) {
      console.error('恢复数据失败:', e);
      return false;
    }
  }
  
  // 添加调试功能
  function enableDebugMode() {
    window.visitDebug = {
      getStats: getVisitStats,
      clearData: clearVisitData,
      backup: backupVisitData,
      restore: restoreVisitData,
      setVisits: setWebsiteVisits,
      currentSession: getSessionId,
      isNewSession: isNewSession
    };
    console.log('🔧 调试模式已启用，使用 window.visitDebug 访问调试功能');
    console.log('可用方法:', Object.keys(window.visitDebug));
  }
  
  // 将功能暴露到全局对象
  window.VisitCounter = {
    updateWebsiteVisits,
    getWebsiteVisits,
    getVisitHistory,
    getTodayVisits,
    getWeekVisits,
    getVisitStats,
    setWebsiteVisits,
    clearVisitData,
    backupVisitData,
    restoreVisitData,
    enableDebugMode
  };
  
  // 页面加载时自动更新访问统计
  document.addEventListener('DOMContentLoaded', function() {
    // 显示当前数据状态
    const currentVisits = getWebsiteVisits();
    console.log(`📊 网站当前访问次数: ${currentVisits}`);
    
    updateWebsiteVisits();
  });
  
  // 处理单页应用的路由变化
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(function() {
    if (currentPath !== window.location.pathname) {
      currentPath = window.location.pathname;
      console.log(`📍 页面切换到: ${currentPath}`);
      // 页面切换不增加访问计数，只更新显示
      triggerVisitEvent(false);
    }
  });
  
  // 监听页面变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 监听浏览器历史变化
  window.addEventListener('popstate', function() {
    setTimeout(() => {
      console.log(`🔄 浏览器后退/前进到: ${window.location.pathname}`);
      triggerVisitEvent(false);
    }, 100);
  });
  
  // 启动时检查数据完整性
  (function checkDataIntegrity() {
    const visits = getWebsiteVisits();
    const history = getVisitHistory();
    
    console.log(`✅ 数据完整性检查:`);
    console.log(`   总访问次数: ${visits}`);
    console.log(`   历史记录条数: ${history.length}`);
    console.log(`   当前会话: ${getSessionId()}`);
    
    // 如果有访问记录但没有总数，尝试修复
    if (history.length > 0 && visits === 0) {
      const maxVisitNumber = Math.max(...history.map(h => h.visitNumber || 0));
      if (maxVisitNumber > 0) {
        setWebsiteVisits(maxVisitNumber);
        console.log(`🔧 数据修复: 根据历史记录设置访问次数为 ${maxVisitNumber}`);
      }
    }
  })();
  
})(); 