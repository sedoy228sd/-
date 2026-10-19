import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink, FileCode, Play, Smartphone, Terminal, X } from 'lucide-react';
import { CSHARP_PROJECT_FILES } from '../data/csharpCode';
import { SFX, triggerHaptic } from '../services/sound';

interface CSharpExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa?: () => void;
  isInstallable?: boolean;
}

export const CSharpExportModal: React.FC<CSharpExportModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isInstallable = false,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'compile' | 'install'>('code');

  if (!isOpen) return null;

  const currentFile = CSHARP_PROJECT_FILES[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    SFX.click();
    triggerHaptic(20);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    SFX.coin();
    triggerHaptic(30);

    // Create a plain text package or download individual file
    const combinedContent = CSHARP_PROJECT_FILES.map(
      (f) => `\n======================================================\nFILE: ${f.path}\n======================================================\n${f.content}\n`
    ).join('\n');

    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PlateTycoon-CSharp-Android-Source.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#0f121d] border border-slate-700/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#141826]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold font-mono text-sm">
              C#
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                C# .NET MAUI & Компиляция в APK
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Android Phone
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Полный исходный код игры на C# и инструкция по сборке файла .apk
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-[#0c0e17] border-b border-slate-800/80 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Исходный код C# ({CSHARP_PROJECT_FILES.length} файлов)
          </button>

          <button
            onClick={() => setActiveTab('compile')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'compile'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Сборка в APK (GitHub & CLI)
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'install'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Установка на телефон прямо сейчас
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'code' && (
            <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[460px]">
              
              {/* File sidebar list */}
              <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0">
                {CSHARP_PROJECT_FILES.map((file, idx) => (
                  <button
                    key={file.name}
                    onClick={() => {
                      setSelectedFileIndex(idx);
                      SFX.click();
                    }}
                    className={`text-left px-3 py-2 rounded-xl border text-xs transition flex-shrink-0 lg:flex-shrink ${
                      selectedFileIndex === idx
                        ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-sm'
                        : 'bg-[#141824] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="text-purple-400">📄</span>
                      {file.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{file.path}</div>
                  </button>
                ))}

                <button
                  onClick={handleDownloadAll}
                  className="mt-2 w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Скачать все C# файлы
                </button>
              </div>

              {/* Code viewer */}
              <div className="flex-1 flex flex-col bg-[#08090f] border border-slate-800 rounded-xl overflow-hidden min-h-[380px]">
                <div className="flex items-center justify-between px-3.5 py-2 bg-[#121624] border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-purple-400 font-bold">{currentFile.path}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {currentFile.description}
                    </span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>

                <pre className="flex-1 p-4 font-mono text-[11px] sm:text-xs text-slate-300 overflow-x-auto leading-relaxed select-text">
                  <code>{currentFile.content}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'compile' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Cloud GitHub compilation banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900 border border-purple-500/40">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm mb-1">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Автоматическая компиляция в APK через GitHub (100% бесплатно)
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Так как среда браузера не содержит 3-гигабайтный Android NDK компилятор, мы подготовили
                  готовый скрипт <strong>.github/workflows/build-apk.yml</strong>. Облачные серверы GitHub соберут
                  файл <strong>PlateTycoon.apk</strong> за 2 минуты:
                </p>
                
                <ol className="mt-3 space-y-1.5 text-xs text-slate-300 list-decimal list-inside bg-black/30 p-3 rounded-lg border border-white/5">
                  <li>Создайте бесплатный репозиторий на <strong>GitHub.com</strong>.</li>
                  <li>Скопируйте в него файлы из вкладки «Исходный код C#».</li>
                  <li>Перейдите во вкладку <strong>Actions</strong> в вашем репозитории.</li>
                  <li>Нажмите <strong>«Run workflow»</strong> у сценария <i>Build Android APK</i>.</li>
                  <li>После завершения скачайте готовый <strong>PlateTycoon-Release.apk</strong> прямо на телефон!</li>
                </ol>
              </div>

              {/* Local CLI command banner */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  Сборка на компьютере через консоль (.NET CLI)
                </div>
                <p className="text-xs text-slate-400 mb-2">
                  Если у вас установлен .NET 8 SDK, выполните одну команду в терминале:
                </p>
                <div className="bg-[#05060a] p-3 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
                  <code>dotnet publish -f net8.0-android -c Release -p:AndroidPackageFormat=apk</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('dotnet publish -f net8.0-android -c Release -p:AndroidPackageFormat=apk');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="ml-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                  >
                    {copied ? 'Скопировано!' : 'Копировать'}
                  </button>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Готовый файл появится по пути: <code className="text-slate-300">bin/Release/net8.0-android/*-Signed.apk</code>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="max-w-xl mx-auto text-center py-6 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Установка прямо на телефон (PWA / WebAPK)</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Игра полностью адаптирована под экраны смартфонов с поддержкой вибрации, тактильных эффектов,
                  офлайн-режима и иконки на рабочем столе.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141824] border border-slate-700 text-left text-xs space-y-2 text-slate-300">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>📱</span> На Android (Google Chrome, Яндекс.Браузер, Opera):
                </div>
                <p>
                  1. Нажмите меню браузера (три точки в правом верхнем углу).<br />
                  2. Выберите пункт <strong>«Установить приложение»</strong> или <strong>«Добавить на главный экран»</strong>.<br />
                  3. Приложение установится как полноценный APK без рамок браузера!
                </p>
              </div>

              {isInstallable && onInstallPwa && (
                <button
                  onClick={() => {
                    SFX.coin();
                    onInstallPwa();
                  }}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-xl transition flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  УСТАНОВИТЬ НА ТЕЛЕФОН СЕЙЧАС
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-[#121624] text-xs text-slate-400">
          <div>Проект адаптирован под .NET 8 / 9 MAUI Android</div>
          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
