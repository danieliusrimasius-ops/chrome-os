import React, { useState, useEffect, useRef } from 'react';
import './ChromeOS.css';

const ChromeOS = () => {
  // Главное состояние
  const [activeApp, setActiveApp] = useState(null);
  const [desktopIcons] = useState([
    { id: 'files', name: 'Файлы', icon: 'folder' },
    { id: 'browser', name: 'Браузер', icon: 'public' },
    { id: 'calculator', name: 'Калькулятор', icon: 'calculate' },
    { id: 'settings', name: 'Настройки', icon: 'settings' }
  ]);
  
  // Компонент браузера
  const Browser = () => {
    const [url, setUrl] = useState('https://google.com');
    const iframeRef = useRef(null);
    const bookmarks = [
      { name: 'Google', url: 'https://google.com' },
      { name: 'YouTube', url: 'https://youtube.com' },
      { name: 'GitHub', url: 'https://github.com' },
      { name: 'MDN', url: 'https://developer.mozilla.org' }
    ];
    
    return (
      <div className="browser">
        <div className="browser-toolbar">
          <button onClick={() => iframeRef.current.contentWindow.history.back()}>←</button>
          <button onClick={() => iframeRef.current.contentWindow.history.forward()}>→</button>
          <button onClick={() => iframeRef.current.contentWindow.location.reload()}>↻</button>
          <input 
            value={url} 
            onChange={e => setUrl(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && iframeRef.current.src = url}
          />
          <button onClick={() => iframeRef.current.src = url}>Перейти</button>
        </div>
        <div className="bookmarks">
          {bookmarks.map((b, i) => (
            <button key={i} onClick={() => setUrl(b.url)}>{b.name}</button>
          ))}
        </div>
        <iframe ref={iframeRef} src={url} title="Браузер" className="browser-iframe" />
      </div>
    );
  };
  
  // Компонент файлового менеджера
  const FileManager = () => {
    const [files] = useState([
      { id: 1, name: 'index.html', type: 'html', content: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Chrome OS</title>\n  </head>\n  <body>\n    <div id="root"></div>\n  </body>\n</html>' },
      { id: 2, name: 'styles.css', type: 'css', content: 'body { margin: 0; font-family: sans-serif; background: #f0f0f0; }' },
      { id: 3, name: 'app.jsx', type: 'jsx', content: 'import React from "react";\nimport ChromeOS from "./ChromeOS";\n\nconst App = () => <ChromeOS />;' },
      { id: 4, name: 'calculator.jsx', type: 'jsx', content: 'const Calculator = () => {\n  const [display, setDisplay] = useState("0");\n  return <div>{display}</div>;\n};' }
    ]);
    const [selectedFile, setSelectedFile] = useState(files[0]);
    
    return (
      <div className="file-manager">
        <div className="file-list">
          {files.map(file => (
            <div key={file.id} className="file-item" onClick={() => setSelectedFile(file)}>
              <span className="file-icon">{file.type === 'html' ? '🟧' : file.type === 'css' ? '🟦' : '🟨'}</span>
              <span>{file.name}</span>
            </div>
          ))}
        </div>
        <div className="file-editor">
          <h4>{selectedFile.name}</h4>
          <textarea value={selectedFile.content} rows={20} readOnly />
        </div>
      </div>
    );
  };
  
  // Компонент калькулятора
  const Calculator = () => {
    const [display, setDisplay] = useState('0');
    const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'];
    
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
    const wallpapers = [
      { id: 'blue', name: 'Синий', color: '#4285f4' },
      { id: 'dark', name: 'Темный', color: '#1a1a1a' },
      { id: 'light', name: 'Светлый', color: '#ffffff' }
    ];
    
    return (
      <div className="settings">
        <div className="setting">
          <label>Тема:</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Светлая</option>
            <option value="dark">Темная</option>
          </select>
        </div>
        <div className="setting">
          <label>Обои:</label>
          <div className="wallpapers">
            {wallpapers.map(wp => (
              <div key={wp.id} className="wallpaper" style={{background: wp.color}}>
                {wp.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Рендер активного приложения
  const renderApp = () => {
    switch (activeApp) {
      case 'browser': return <Browser />;
      case 'files': return <FileManager />;
      case 'calculator': return <Calculator />;
      case 'settings': return <Settings />;
      default: return null;
    }
  };
  
  return (
    <div className="chrome-os">
      {/* Рабочий стол */}
      <div className="desktop">
        {desktopIcons.map(icon => (
          <div key={icon.id} className="desktop-icon" onClick={() => setActiveApp(icon.id)}>
            <span className="material-icons">{icon.icon}</span>
            <span>{icon.name}</span>
          </div>
        ))}
      </div>
      
      {/* Окно приложения */}
      {activeApp && (
        <div className="app-window">
          <div className="window-header">
            <h3>{desktopIcons.find(i => i.id === activeApp)?.name}</h3>
            <button onClick={() => setActiveApp(null)} className="close-btn">×</button>
          </div>
          <div className="window-content">
            {renderApp()}
          </div>
        </div>
      )}
      
      {/* Панель задач */}
      <div className="taskbar">
        <button className="start-btn" onClick={() => setActiveApp(null)}>
          <span className="material-icons">home</span>
        </button>
        <div className="time">
          {new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
        </div>
      </div>
    </div>
  );
};

export default ChromeOS;
