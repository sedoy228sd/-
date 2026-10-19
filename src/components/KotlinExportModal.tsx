import React, { useState } from 'react';
import { Check, Copy, Download, ExternalLink, FileCode, Play, Smartphone, Terminal, X, Zap } from 'lucide-react';
import { KOTLIN_PROJECT_FILES } from '../data/kotlinCode';
import { CSHARP_PROJECT_FILES } from '../data/csharpCode';
import { SFX, triggerHaptic } from '../services/sound';

interface KotlinExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallPwa?: () => void;
  isInstallable?: boolean;
}

export const KotlinExportModal: React.FC<KotlinExportModalProps> = ({
  isOpen,
  onClose,
  onInstallPwa,
  isInstallable = false,
}) => {
  const [targetFramework, setTargetFramework] = useState<'kotlin' | 'csharp'>('kotlin');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'compile' | 'install'>('code');

  if (!isOpen) return null;

  const currentFiles = targetFramework === 'kotlin' ? KOTLIN_PROJECT_FILES : CSHARP_PROJECT_FILES;
  const currentFile = currentFiles[Math.min(selectedFileIndex, currentFiles.length - 1)];

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

    const combinedContent = currentFiles.map(
      (f) => `\n======================================================\nFILE: ${f.path}\n======================================================\n${f.content}\n`
    ).join('\n');

    const fileName = targetFramework === 'kotlin' 
      ? 'PlateTycoon-Kotlin-JetpackCompose-Android-Source.txt'
      : 'PlateTycoon-CSharp-Android-Source.txt';

    const blob = new Blob([combinedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#0f121d] border border-slate-700/80 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#141826]">
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-base ${
              targetFramework === 'kotlin' 
                ? 'bg-gradient-to-tr from-[#7F52FF] to-[#E052A0] text-white shadow-lg' 
                : 'bg-purple-600/20 border border-purple-500/40 text-purple-400'
            }`}>
              {targetFramework === 'kotlin' ? 'Kt' : 'C#'}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {targetFramework === 'kotlin' ? 'Kotlin & Jetpack Compose Android' : 'C# .NET MAUI & APK'}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Android Native APK
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {targetFramework === 'kotlin' 
                  ? 'Нативный проект Android на Kotlin: Jetpack Compose, StateFlow, SoundPool и сборка APK'
                  : 'Исходный код игры на C# .NET MAUI для сборки мобильного APK'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Framework Switcher */}
            <div className="flex items-center bg-[#090b12] p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => {
                  setTargetFramework('kotlin');
                  setSelectedFileIndex(0);
                  SFX.click();
                }}
                className={`px-2.5 py-1 rounded-lg transition ${
                  targetFramework === 'kotlin'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kotlin 2.0
              </button>
              <button
                onClick={() => {
                  setTargetFramework('csharp');
                  setSelectedFileIndex(0);
                  SFX.click();
                }}
                className={`px-2.5 py-1 rounded-lg transition ${
                  targetFramework === 'csharp'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                C# MAUI
              </button>
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
            Исходный код {targetFramework === 'kotlin' ? 'Kotlin' : 'C#'} ({currentFiles.length} файлов)
          </button>

          <button
            onClick={() => setActiveTab('compile')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'compile'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Сборка в .APK
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeTab === 'install'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Установка на телефон прямо сейчас
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-hidden flex flex-col p-4">
          {activeTab === 'code' && (
            <div className="flex-1 flex flex-col md:flex-row gap-3 overflow-hidden">
              {/* File list sidebar */}
              <div className="w-full md:w-64 bg-[#141826] border border-slate-800 rounded-xl p-2 flex flex-col gap-1 overflow-y-auto max-h-48 md:max-h-full">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Файлы проекта ({targetFramework === 'kotlin' ? 'Kotlin' : 'C#'}):
                </div>
                {currentFiles.map((f, idx) => (
                  <button
                    key={f.path}
                    onClick={() => {
                      setSelectedFileIndex(idx);
                      SFX.click();
                    }}
                    className={`text-left px-2.5 py-2 rounded-lg text-xs font-mono transition flex flex-col gap-0.5 ${
                      selectedFileIndex === idx
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-semibold truncate">{f.name}</span>
                    <span className="text-[10px] text-slate-500 truncate">{f.path}</span>
                  </button>
                ))}
              </div>

              {/* Code viewer */}
              <div className="flex-1 bg-[#090b12] border border-slate-800 rounded-xl flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/80 bg-[#121624]">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-200">{currentFile.path}</span>
                    <p className="text-[11px] text-slate-400">{currentFile.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Скопировано!' : 'Копировать'}
                    </button>
                    <button
                      onClick={handleDownloadAll}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Скачать всё
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-300 bg-[#07090e] leading-relaxed">
                  <pre className="whitespace-pre">{currentFile.content}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compile' && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-300 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40">
                <h3 className="text-sm font-bold text-purple-300 mb-1 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  Как скомпилировать APK из {targetFramework === 'kotlin' ? 'Kotlin' : 'C#'}
                </h3>
                <p className="text-xs text-slate-400">
                  Все файлы проекта уже созданы в репозитории (папка <code className="text-purple-300 font-mono">android-kotlin/</code>). Вы можете собрать APK тремя способами:
                </p>
              </div>

              {/* Way 1: Android Studio */}
              <div className="p-4 rounded-xl bg-[#141826] border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                  Через Android Studio (Проще всего)
                </div>
                <p className="text-xs text-slate-400">
                  1. Откройте папку <code className="text-purple-300 font-mono">android-kotlin/</code> в Android Studio (Hedgehog, Iguana или Ladybug).
                </p>
                <p className="text-xs text-slate-400">
                  2. В верхнем меню выберите: <strong className="text-slate-200">Build → Build Bundle(s) / APK(s) → Build APK(s)</strong>.
                </p>
                <p className="text-xs text-slate-400">
                  3. Готовый APK файл будет скомпилирован в:
                </p>
                <div className="p-2.5 rounded-lg bg-black/60 font-mono text-xs text-emerald-400 border border-emerald-500/20">
                  app/build/outputs/apk/debug/app-debug.apk
                </div>
              </div>

              {/* Way 2: Gradle CLI */}
              <div className="p-4 rounded-xl bg-[#141826] border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                  Сборка через командную строку (Gradle CLI)
                </div>
                <p className="text-xs text-slate-400">
                  Выполните в терминале в папке с проектом:
                </p>
                <div className="p-3 rounded-lg bg-black/70 font-mono text-xs text-cyan-300 border border-slate-700/60 flex items-center justify-between">
                  <span>./gradlew assembleDebug</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('./gradlew assembleDebug');
                      SFX.click();
                      triggerHaptic(15);
                    }}
                    className="text-slate-400 hover:text-white text-[11px]"
                  >
                    Скопировать
                  </button>
                </div>
              </div>

              {/* Way 3: GitHub Actions */}
              <div className="p-4 rounded-xl bg-[#141826] border border-slate-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                  Бесплатная облачная сборка через GitHub Actions
                </div>
                <p className="text-xs text-slate-400">
                  Файл <code className="text-purple-300 font-mono">.github/workflows/build-kotlin-apk.yml</code> уже настроен. Выгрузите код на GitHub, нажмите <strong>Run workflow</strong> в разделе Actions, и GitHub автоматически скомпилирует готовый APK для загрузки на телефон.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-slate-300 text-xs sm:text-sm">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-blue-950/40 to-slate-900 border border-emerald-500/40 space-y-2">
                <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  Установка на телефон прямо сейчас (без компьютера)
                </h3>
                <p className="text-xs text-slate-300">
                  Благодаря технологии PWA (Progressive Web App) эта игра работает на вашем Android-телефоне с сохранением данных офлайн, полноэкранным режимом, тактильной отдачей и иконкой на рабочем столе.
                </p>
                {isInstallable && onInstallPwa && (
                  <button
                    onClick={() => {
                      SFX.coin();
                      onInstallPwa();
                    }}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Установить на телефон в 1 клик
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-[#141826] border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs">📱 Android (Chrome / Яндекс)</span>
                  <p className="text-[11px] text-slate-400">
                    Нажмите меню <strong>(⋮)</strong> в браузере и выберите <strong>«Установить приложение»</strong> или <strong>«Добавить на главный экран»</strong>.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#141826] border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white text-xs">🍏 iPhone / iPad (Safari)</span>
                  <p className="text-[11px] text-slate-400">
                    Нажмите кнопку <strong>«Поделиться» (иконка квадрата со стрелкой)</strong> и выберите <strong>«На экран «Домой»»</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800/80 bg-[#121524] flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Готово к сборке APK на Android 14/15 (API 35, Jetpack Compose)</span>
          </div>

          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
