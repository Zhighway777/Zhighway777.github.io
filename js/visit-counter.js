/**
 * 全站访问统计脚本
 * 用于记录整个网站的访问次数和访问历史
 */

(function() {
  'use strict';
  
  // 更新网站总访问次数
  function updateWebsiteVisits() {
    // 获取当前会话标识，避免同一会话重复计数
    const sessionId = sessionStorage.getItem('currentSessionId');
    const currentSession = Date.now().toString();
    
    // 如果是新会话，则增加访问计数
    if (!sessionId || sessionId !== currentSession) {
      sessionStorage.setItem('currentSessionId', currentSession);
      
      let totalVisits = localStorage.getItem('websiteVisits');
      if (!totalVisits) {
        totalVisits = 0;
      }
      totalVisits = parseInt(totalVisits) + 1;
      localStorage.setItem('websiteVisits', totalVisits);
      
      // 记录访问历史
      let visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
      visitHistory.push({
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        session: currentSession,
        userAgent: navigator.userAgent.substring(0, 100), // 简化的用户代理信息
        referrer: document.referrer || 'Direct'
      });
      
      // 只保留最近100次访问记录
      if (visitHistory.length > 100) {
        visitHistory = visitHistory.slice(-100);
      }
      localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
      
      console.log(`网站访问次数: ${totalVisits}, 页面: ${window.location.pathname}`);
    }
    
    // 触发自定义事件，其他脚本可以监听这个事件
    const visitEvent = new CustomEvent('websiteVisitUpdated', {
      detail: {
        totalVisits: parseInt(localStorage.getItem('websiteVisits') || 0),
        currentPage: window.location.pathname,
        isNewSession: !sessionId || sessionId !== currentSession
      }
    });
    document.dispatchEvent(visitEvent);
  }
  
  // 获取网站总访问次数
  function getWebsiteVisits() {
    return parseInt(localStorage.getItem('websiteVisits') || 0);
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
      visitHistory: visitHistory.slice(-10) // 最近10次访问
    };
  }
  
  // 清除访问数据（调试用）
  function clearVisitData() {
    localStorage.removeItem('websiteVisits');
    localStorage.removeItem('visitHistory');
    sessionStorage.removeItem('currentSessionId');
    console.log('访问数据已清除');
  }
  
  // 将功能暴露到全局对象
  window.VisitCounter = {
    updateWebsiteVisits,
    getWebsiteVisits,
    getVisitHistory,
    getTodayVisits,
    getWeekVisits,
    getVisitStats,
    clearVisitData
  };
  
  // 页面加载时自动更新访问统计
  document.addEventListener('DOMContentLoaded', function() {
    updateWebsiteVisits();
  });
  
  // 处理单页应用的路由变化
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(function() {
    if (currentPath !== window.location.pathname) {
      currentPath = window.location.pathname;
      updateWebsiteVisits();
    }
  });
  
  // 监听页面变化
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // 监听浏览器历史变化
  window.addEventListener('popstate', function() {
    setTimeout(updateWebsiteVisits, 100);
  });
  
})(); 