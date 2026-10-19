import React, { useState } from 'react';
import { ArrowLeft, Check, Download, HardDrive, ShieldCheck, Sparkles, X, Zap } from 'lucide-react';
import { SFX, triggerHaptic } from '../services/sound';

interface AssetCacheManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHdPackInstalled: boolean;
  onInstallHdPack: () => void;
}

export const AssetCacheManagerModal: React.FC<AssetCacheManagerModalProps> = ({
  isOpen,
  onClose,
  isHdPackInstalled,
  onInstallHdPack,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(isHdPackInstalled ? 100 : 0);
  const [mbDownloaded, setMbDownloaded] = useState(isHdPackInstalled ? 500 : 0);
  const [currentFile, setCurrentFile] = useState('');

  if (!isOpen) return null;

  const handleStartDownload = () => {
    setDownloading(true);
    setProgress(0);
    setMbDownloaded(0);
    SFX.rev();
    triggerHaptic(20);

    const steps = [
      { name: 'textures_4k_gost_plates.obb (190 МБ)', targetMb: 190 },
      { name: 'engine_audio_v10_v8_2jz_hd.obb (145 МБ)', targetMb: 335 },
      { name: 'highpoly_3d_car_models.obb (165 МБ)', targetMb: 500 },
    ];

    let currentStepIdx = 0;
    let mb = 0;

    const interval = setInterval(() => {
      mb += 12 + Math.floor(Math.random() * 8);
      if (mb >= 500) {
        mb = 500;
        clearInterval(interval);
        setProgress(100);
        setMbDownloaded(500);
        setDownloading(false);
        onInstallHdPack();
        SFX.tierUp(4);
        triggerHaptic(50);
      } else {
        setMbDownloaded(mb);
        setProgress(Math.round((mb / 500) * 100));

        if (mb > steps[0].targetMb && currentStepIdx === 0) currentStepIdx = 1;
        if (mb > steps[1].targetMb && currentStepIdx === 1) currentStepIdx = 2;
        setCurrentFile(steps[currentStepIdx].name);
      }
    }, 70);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none animate-fade-in">
      <div className="w-full max-w-lg bg-[#0f121d] border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-[#141826]">
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide">
                Пакет ресурсов & HD Кэш (500 МБ)
              </h2>
              <div className="text-[11px] text-slate-400">
                Текстуры 4K, 3D модели суперкаров и HD звук выхлопа
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              SFX.click();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Storage Meter */}
          <div className="p-4 rounded-2xl bg-[#141824] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-300">Размер клиента игры:</span>
              <span className="text-purple-400 font-mono text-sm">
                {isHdPackInstalled || progress === 100 ? '500 МБ (Максимум)' : '48 МБ (Lite)'}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>{mbDownloaded} МБ / 500 МБ</span>
              <span>{progress}%</span>
            </div>

            {downloading && (
              <div className="text-[11px] text-cyan-400 font-mono truncate animate-pulse">
                Загрузка: {currentFile}
              </div>
            )}
          </div>

          {/* Features Included in the 500MB Pack */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Включено в пакет 500 МБ:
            </div>

            <div className="p-3 rounded-xl bg-[#141824] border border-slate-800 flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <div className="font-bold text-white text-xs">4K Ultra HD текстуры ГОСТ</div>
                <div className="text-slate-400 text-[11px]">
                  Лазерные голограммы, тиснение и реалистичные блики металла (190 МБ)
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141824] border border-slate-800 flex items-center gap-3">
              <span className="text-xl">🏎️</span>
              <div>
                <div className="font-bold text-white text-xs">3D Фото-модели автомобилей</div>
                <div className="text-slate-400 text-[11px]">
                  Все 12 машин в студийном автосалоне 360° с подсветкой фар (165 МБ)
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#141824] border border-slate-800 flex items-center gap-3">
              <span className="text-xl">🔊</span>
              <div>
                <div className="font-bold text-white text-xs">24-битный звук V10, V8 и 2JZ</div>
                <div className="text-slate-400 text-[11px]">
                  Студийная запись прямоточного выхлопа, турбины и пневмы (145 МБ)
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          {isHdPackInstalled || progress === 100 ? (
            <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 font-bold text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" /> Полный HD Кэш (500 МБ) активирован!
            </div>
          ) : (
            <button
              disabled={downloading}
              onClick={handleStartDownload}
              className={`w-full py-3.5 rounded-2xl font-black text-sm transition shadow-xl flex items-center justify-center gap-2 ${
                downloading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
              }`}
            >
              <Download className="w-4 h-4" />
              {downloading ? 'СКАЧИВАНИЕ КЭША 500 МБ...' : 'СКАЧАТЬ ПОЛНЫЙ КЭШ 500 МБ'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
