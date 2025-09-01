// 代码高亮增强功能脚本

document.addEventListener('DOMContentLoaded', function() {
  // 为所有代码块添加标题栏和复制按钮
  enhanceCodeBlocks();
  
  // 为内联代码添加悬停效果
  enhanceInlineCode();
  
  // 添加代码块行号高亮
  enhanceLineNumbers();
});

// 增强代码块功能
function enhanceCodeBlocks() {
  const codeBlocks = document.querySelectorAll('.highlight');
  
  codeBlocks.forEach((block, index) => {
    // 检查是否已经有标题栏
    if (block.querySelector('.code-header')) {
      return;
    }
    
    // 获取语言信息
    const language = getLanguageFromBlock(block);
    
    // 创建标题栏
    const header = document.createElement('div');
    header.className = 'code-header';
    
    // 语言标签
    const languageLabel = document.createElement('span');
    languageLabel.className = 'language-label';
    languageLabel.textContent = language || 'CODE';
    
    // 复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = '复制';
    copyButton.setAttribute('data-clipboard-target', `#code-${index}`);
    
    // 添加复制功能
    copyButton.addEventListener('click', function() {
      copyCodeToClipboard(block, copyButton);
    });
    
    // 组装标题栏
    header.appendChild(languageLabel);
    header.appendChild(copyButton);
    
    // 为代码块添加ID
    const preElement = block.querySelector('pre');
    if (preElement) {
      preElement.id = `code-${index}`;
    }
    
    // 插入标题栏
    block.insertBefore(header, block.firstChild);
  });
}

// 从代码块中获取语言信息
function getLanguageFromBlock(block) {
  // 尝试从class中获取语言信息
  const classes = block.className.split(' ');
  for (let cls of classes) {
    if (cls.startsWith('language-')) {
      return cls.replace('language-', '').toUpperCase();
    }
  }
  
  // 尝试从pre标签的class中获取
  const preElement = block.querySelector('pre');
  if (preElement) {
    const preClasses = preElement.className.split(' ');
    for (let cls of preClasses) {
      if (cls.startsWith('language-')) {
        return cls.replace('language-', '').toUpperCase();
      }
    }
  }
  
  return null;
}

// 复制代码到剪贴板
async function copyCodeToClipboard(block, button) {
  try {
    const preElement = block.querySelector('pre');
    if (!preElement) return;
    
    // 获取纯文本代码（去除行号）
    let codeText = '';
    const codeLines = preElement.querySelectorAll('.chroma .lntd:last-child');
    
    if (codeLines.length > 0) {
      // 有行号的情况
      codeLines.forEach(line => {
        codeText += line.textContent + '\n';
      });
    } else {
      // 没有行号的情况
      codeText = preElement.textContent;
    }
    
    // 复制到剪贴板
    await navigator.clipboard.writeText(codeText);
    
    // 显示成功反馈
    showCopyFeedback(button, true);
  } catch (err) {
    // 如果clipboard API不可用，使用传统方法
    fallbackCopyTextToClipboard(block, button);
  }
}

// 传统复制方法（兼容性）
function fallbackCopyTextToClipboard(block, button) {
  const preElement = block.querySelector('pre');
  if (!preElement) return;
  
  let codeText = '';
  const codeLines = preElement.querySelectorAll('.chroma .lntd:last-child');
  
  if (codeLines.length > 0) {
    codeLines.forEach(line => {
      codeText += line.textContent + '\n';
    });
  } else {
    codeText = preElement.textContent;
  }
  
  const textArea = document.createElement('textarea');
  textArea.value = codeText;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopyFeedback(button, true);
  } catch (err) {
    showCopyFeedback(button, false);
  }
  
  document.body.removeChild(textArea);
}

// 显示复制反馈
function showCopyFeedback(button, success) {
  const originalText = button.textContent;
  
  if (success) {
    button.textContent = '已复制!';
    button.style.background = 'rgba(72, 182, 133, 0.8)';
  } else {
    button.textContent = '复制失败';
    button.style.background = 'rgba(239, 97, 85, 0.8)';
  }
  
  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = 'rgba(255, 255, 255, 0.2)';
  }, 2000);
}

// 增强内联代码
function enhanceInlineCode() {
  const inlineCodes = document.querySelectorAll('code:not(.highlight code)');
  
  inlineCodes.forEach(code => {
    // 添加悬停效果
    code.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    code.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
    
    // 添加点击复制功能
    code.addEventListener('click', function() {
      copyInlineCode(this);
    });
    
    // 添加提示
    code.title = '点击复制代码';
    code.style.cursor = 'pointer';
  });
}

// 复制内联代码
async function copyInlineCode(codeElement) {
  try {
    await navigator.clipboard.writeText(codeElement.textContent);
    showInlineCopyFeedback(codeElement);
  } catch (err) {
    // 使用传统方法
    const textArea = document.createElement('textarea');
    textArea.value = codeElement.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showInlineCopyFeedback(codeElement);
  }
}

// 显示内联代码复制反馈
function showInlineCopyFeedback(codeElement) {
  const originalBackground = codeElement.style.background;
  const originalColor = codeElement.style.color;
  
  codeElement.style.background = '#48b685';
  codeElement.style.color = 'white';
  
  setTimeout(() => {
    codeElement.style.background = originalBackground;
    codeElement.style.color = originalColor;
  }, 1000);
}

// 增强行号功能
function enhanceLineNumbers() {
  const lineNumbers = document.querySelectorAll('.chroma .lnt, .chroma .ln');
  
  lineNumbers.forEach((lineNum, index) => {
    // 添加悬停效果
    lineNum.addEventListener('mouseenter', function() {
      this.style.background = 'rgba(255, 255, 255, 0.15)';
      this.style.color = '#ffffff';
    });
    
    lineNum.addEventListener('mouseleave', function() {
      this.style.background = 'rgba(255, 255, 255, 0.05)';
      this.style.color = '#7f7f7f';
    });
    
    // 点击行号高亮对应行
    lineNum.addEventListener('click', function() {
      highlightLine(this);
    });
  });
}

// 高亮指定行
function highlightLine(lineNum) {
  // 移除之前的高亮
  const previousHighlight = document.querySelector('.chroma .hl');
  if (previousHighlight) {
    previousHighlight.classList.remove('hl');
  }
  
  // 获取行号对应的代码行
  const lineTable = lineNum.closest('.lntable');
  if (lineTable) {
    const lineIndex = Array.from(lineTable.querySelectorAll('.lnt, .ln')).indexOf(lineNum);
    const codeLines = lineTable.querySelectorAll('.lntd:last-child');
    
    if (codeLines[lineIndex]) {
      codeLines[lineIndex].classList.add('hl');
      
      // 滚动到高亮行
      codeLines[lineIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + K 复制当前选中的代码
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      navigator.clipboard.writeText(selection.toString());
    }
  }
});

