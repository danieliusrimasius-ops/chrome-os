
import React, { useState, useEffect, useRef } from 'react';
import './ChromeOS.css';

// Иконки Material Design из CDN
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />

const ChromeOS = () => {
  const [activeApp, setActiveApp] = useState(null);
  const [showLauncher, setShowLauncher] = useState(false);
  
  const desktopIcons = [
    { id: 'files', name: 'Файлы', icon: 'folder' },
    { id: 'browser', name: 'Браузер', icon: 'public' },
    { id: 'calculator', name: 'Калькулятор', icon: 'calculate' },
    { id: 'settings', name: 'Настройки', icon: 'settings' }
  ];
  
  const renderApp = () => {
    const apps = {
      'files': <FileManager />,
      'browser': <Browser />,
      'calculator': <Calculator />,
      'settings': <Settings />
    };
    return apps[activeApp] || null;
  };
  
  return (
    <div className="chrome-os">
      <div className="desktop">
        {desktopIcons.map(icon => (
          <div key={icon.id} className="desktop-icon" onClick={() => setActiveApp(icon.id)}>
            <span className="material-icons">{icon.icon}</span>
            <span>{icon.name}</span>
          </div>
        ))}
      </div>
      
      {activeApp && (
        <div className="app-window">
          <div className="window-header">
            <span>{desktopIcons.find(i => i.id === activeApp)?.name}</span>
            <button onClick={() => setActiveApp(null)}>✕</button>
          </div>
          {renderApp()}
        </div>
      )}
      
      <div className="taskbar">
        <button onClick={() => setShowLauncher(!showLauncher)} className="launcher-btn">
          <span className="material-icons">apps</span>
        </button>
        <span className="time">{new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  );
};

// Компонент браузера
const Browser = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const iframeRef = useRef(null);
  
  const bookmarks = [
    { name: 'Google', url: 'https://google.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'MDN', url: 'https://developer.mozilla.org' }
  ];
  
  return (
    <div className="browser">
      <div className="browser-toolbar">
        <div className="url-bar">
          <input 
            value={url} 
            onChange={e => setUrl(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && iframeRef.current.src = url}
          />
          <button onClick={() => iframeRef.current.src = url}>
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
        <div className="bookmarks">
          {bookmarks.map((b, i) => (
            <button key={i} onClick={() => setUrl(b.url)}>{b.name}</button>
          ))}
        </div>
      </div>
      <iframe ref={iframeRef} src={url} title="Браузер" className="browser-frame" />
    </div>
  );
};

// Компонент файлового менеджера
const FileManager = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'index.html', type: 'html', content: '<html>...</html>' },
    { id: 2, name: 'styles.css', type: 'css', content: 'body { margin: 0; }' },
    { id: 3, name: 'app.jsx', type: 'jsx', content: 'import React from "react";' }
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const saveFile = (id, newContent) => {
    setFiles(files.map(f => f.id === id ? {...f, content: newContent} : f));
  };
  
  return (
    <div className="file-manager">
      <div className="file-list">
        {files.map(file => (
          <div key={file.id} className="file-item" onClick={() => setSelectedFile(file)}>
            <span className="material-icons">
              {file.type === 'html' ? 'html' : file.type === 'css' ? 'css' : 'code'}
            </span>
            <span>{file.name}</span>
          </div>
        ))}
      </div>
      {selectedFile && (
        <div className="file-editor">
          <textarea 
            value={selectedFile.content} 
            onChange={e => saveFile(selectedFile.id, e.target.value)}
            rows={15}
          />
        </div>
      )}
    </div>
  );
};

// Компонент калькулятора
const Calculator = () => {
  const [display, setDisplay] = useState('0');
  
  const buttons = [
    '7','8','9','/',
    '4','5','6','*',
    '1','2','3','-',
    '0','.','=','+',
    'C'
  ];
  
  const handleClick = (btn) => {
    if (btn === 'C') setDisplay('0');
    else if (btn === '=') {
      try { setDisplay(eval(display).toString()); }
      catch { setDisplay('Error'); }
    }
    else setDisplay(display === '0' ? btn : display + btn);
  };
  
  return (
    <div className="calculator">
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        {buttons.map(btn => (
          <button key={btn} onClick={() => handleClick(btn)}>{btn}</button>
        ))}
      </div>
    </div>
  );
};

// Компонент настроек
const Settings = () => {
  const [theme, setTheme] = useState('light');
  
  return (
    <div className="settings">
      <div className="setting">
        <label>Тема:</label>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option value="light">Светлая</option>
          <option value="dark">Темная</option>
        </select>
      </div>
    </div>
  );
};

// CSS файл
const styles = `
.chrome-os {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', sans-serif;
}

.desktop {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  gap: 20px;
  padding: 20px;
}

.desktop-icon {
  text-align: center;
  color: white;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.2s;
}

.desktop-icon:hover {
  background: rgba(255,255,255,0.1);
}

.desktop-icon .material-icons {
  font-size: 48px;
  display: block;
  margin-bottom: 5px;
}

.app-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  height: 70vh;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
}

.window-header {
  background: #4285f4;
  color: white;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
}

.window-header button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.launcher-btn {
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.browser {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.browser-toolbar {
  padding: 10px;
  background: #f1f3f4;
  border-bottom: 1px solid #ddd;
}

.url-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.url-bar input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 24px;
}

.bookmarks {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.browser-frame {
  flex: 1;
  border: none;
  width: 100%;
}

.file-manager {
  display: flex;
  height: 100%;
}

.file-list {
  width: 200px;
  border-right: 1px solid #ddd;
  padding: 10px;
  overflow-y: auto;
}

.file-item {
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-item:hover {
  background: #f0f0f0;
}

.file-editor {
  flex: 1;
  padding: 20px;
}

.file-editor textarea {
  width: 100%;
  height: 100%;
  font-family: monospace;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: none;
}

.calculator {
  padding: 20px;
}

.calc-display {
  background: #333;
  color: white;
  padding: 20px;
  font-size: 24px;
  text-align: right;
  border-radius: 8px;
  margin-bottom: 20px;
  min-height: 60px;
}

.calc-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.calc-buttons button {
  padding: 15px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  background: #f0f0f0;
  cursor: pointer;
}

.calc-buttons button:hover {
  background: #ddd;
}

.settings {
  padding: 20px;
}

.setting {
  margin-bottom: 20px;
}

.setting label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.setting select {
  width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
`;

// Внедряем стили
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default ChromeOS;