import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenTool } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  sublabel?: string;
  nameValue: string;
  onNameChange: (val: string) => void;
  signatureValue: string;
  onSignatureChange: (val: string) => void;
  placeholderName?: string;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  sublabel,
  nameValue,
  onNameChange,
  signatureValue,
  onSignatureChange,
  placeholderName = 'Nombre completo y cargo/parentesco',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [mode, setMode] = useState<'draw' | 'type'>('draw');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;

    // If there's an existing signature image, draw it
    if (signatureValue && signatureValue.startsWith('data:image')) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasDrawn(true);
      };
      img.src = signatureValue;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent scrolling on touch devices while drawing
    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-wide uppercase">{label}</h4>
          {sublabel && <p className="text-xs text-slate-500">{sublabel}</p>}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setMode('draw')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === 'draw' ? 'bg-white shadow-sm text-nl-petrol font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5" /> Dibujar
            </span>
          </button>
          <button
            type="button"
            onClick={() => setMode('type')}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              mode === 'type' ? 'bg-white shadow-sm text-nl-petrol font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Escribir
          </button>
        </div>
      </div>

      {/* Name input */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-600 mb-1">
          Nombre de quien firma:
        </label>
        <input
          type="text"
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={placeholderName}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-nl-petrol focus:border-transparent bg-slate-50 focus:bg-white transition-all"
        />
      </div>

      {/* Signature Canvas / Typed Box */}
      {mode === 'draw' ? (
        <div className="space-y-2">
          <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 overflow-hidden touch-none h-36">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-full cursor-crosshair block"
            />
            {!hasDrawn && !signatureValue && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs">
                <PenTool className="w-6 h-6 mb-1 opacity-50 text-nl-petrol" />
                <span>Firma aquí con tu dedo o ratón</span>
              </div>
            )}
            <div className="absolute bottom-2 left-4 right-4 border-b border-slate-300/80 pointer-events-none"></div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Área de firma digital</span>
            <button
              type="button"
              onClick={clearCanvas}
              className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition-colors"
            >
              <Eraser className="w-3.5 h-3.5" /> Limpiar trazo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="h-36 rounded-xl border-2 border-slate-200 bg-amber-50/30 p-4 flex flex-col justify-end relative">
            <div className="text-center font-serif italic text-2xl text-slate-800 tracking-wider">
              {nameValue || 'Ingresa el nombre arriba'}
            </div>
            <div className="border-b-2 border-slate-400 w-full mt-2"></div>
            <div className="text-[10px] text-center text-slate-400 mt-1 uppercase tracking-widest">
              Firma Electrónica Simple
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic text-right">
            Se utiliza el nombre capturado como firma electrónica
          </p>
        </div>
      )}
    </div>
  );
};
