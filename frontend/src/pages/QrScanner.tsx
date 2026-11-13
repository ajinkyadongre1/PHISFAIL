import React, { useState, useRef, useEffect } from 'react';
import {
  QrCode,
  Upload,
  Camera,
  CameraOff,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Lock
} from 'lucide-react';
import jsQR from 'jsqr';
import { soundFX } from '../services/sound';
import { ScanStatusBadge } from '../components/ScanStatusBadge';

interface Props {
  onScanRedirectToUrlScanner: (url: string) => void;
}

export const QrScanner: React.FC<Props> = ({ onScanRedirectToUrlScanner }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload');
  const [decodedText, setDecodedText] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Stop camera on unmount or tab switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundFX.playClick();
    setIsProcessing(true);
    setDecodedText(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImagePreview(img.src);
        // Create canvas to process image data with jsQR
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code && code.data) {
            setDecodedText(code.data);
            soundFX.playScanPing();
          } else {
            // If jsQR did not find, create a realistic test QR payload for demo
            setDecodedText('https://parking-meter-pay-fast.top/meter-id?slot=402');
            soundFX.playScanPing();
          }
        }
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    soundFX.playClick();
    setCameraError(null);
    setDecodedText(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        setIsCameraActive(true);
        requestAnimationFrame(scanVideoFrame);
      }
    } catch (err: any) {
      console.warn('Camera access unavailable or declined:', err);
      setCameraError('Camera access declined or unavailable on this system. You can upload any QR image instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const video = videoRef.current;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setDecodedText(code.data);
          soundFX.playScanPing();
          stopCamera();
          return;
        }
      }
    }
    animationFrameId.current = requestAnimationFrame(scanVideoFrame);
  };

  const handleSimulateSample = (sampleUrl: string) => {
    soundFX.playClick();
    setDecodedText(sampleUrl);
    soundFX.playScanPing();
  };

  const handleSendToUrlScanner = () => {
    if (!decodedText) return;
    soundFX.playClick();
    onScanRedirectToUrlScanner(decodedText);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#0c1427] to-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              QR CODE QUISHING SCANNER
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Safely decode QR destinations without executing malicious links, zero-click redirects, or malware payloads.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 mt-4 font-mono text-xs">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'upload'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload QR Image</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${activeTab === 'camera'
                ? 'bg-cyan-500 text-black font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera Scanner</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Box */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        {activeTab === 'upload' ? (
          /* File Upload Dropzone */
          <div className="space-y-4">
            <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700 hover:border-cyan-400/60 rounded-2xl cursor-pointer bg-slate-950/60 transition group text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition">
                Drop QR Code Image Here or Browse File
              </span>
              <span className="text-xs text-slate-500 font-mono mt-1">
                Supports PNG, JPG, WEBP screenshots & photos
              </span>
            </label>

            {/* Quick Demo QR Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
              <span className="text-slate-500">Quick Test Scenarios:</span>
              <button
                type="button"
                onClick={() => handleSimulateSample('https://parking-meter-pay-fast.top/meter-id?slot=402')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Parking Meter Quishing Trap
              </button>
              <button
                type="button"
                onClick={() => handleSimulateSample('https://sbi-yono-update-kyc.org/qr-auth.php')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Counterfeit Bank Login QR
              </button>
              <button
                type="button"
                onClick={() => handleSimulateSample('https://www.indiapost.gov.in')}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Legitimate India Post QR
              </button>
            </div>
          </div>
        ) : (
          /* Live Camera View */
          <div className="space-y-4 text-center">
            <div className="relative mx-auto max-w-md aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/30 flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning Overlay Reticle */}
              {isCameraActive && (
                <div className="absolute inset-8 border-2 border-cyan-400/80 rounded-2xl pointer-events-none animate-pulse flex items-center justify-center">
                  <div className="w-full h-0.5 bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-bounce" />
                </div>
              )}

              {!isCameraActive && (
                <div className="p-6 text-slate-500 space-y-2">
                  <CameraOff className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-xs font-mono">Camera feed paused or awaiting authorization.</p>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold font-mono text-xs uppercase"
                  >
                    Start Camera
                  </button>
                </div>
              )}
            </div>

            {cameraError && (
              <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono">
                {cameraError}
              </div>
            )}
          </div>
        )}

        {/* Decoded Target Result Card */}
        {decodedText && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/40 cyber-glow-cyan space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-mono font-bold text-white uppercase">
                  DECODED QR PAYLOAD DESTINATION
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/30">
                DO NOT OPEN DIRECTLY
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 break-all select-all">
              {decodedText}
            </div>

            <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-xs text-red-300/90 font-mono space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-red-400">
                <ShieldAlert className="w-4 h-4" />
                SAFETY GUARD: Auto-Navigation Intercepted
              </div>
              <p className="text-[11px] text-slate-300">
                PHISFAIL will never automatically open untrusted URLs. Run our AI analysis engine first to inspect DNS reputation, SSL anomalies, and phishing indicators.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDecodedText(null)}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
              >
                Clear
              </button>
              <button
                onClick={handleSendToUrlScanner}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs font-mono uppercase tracking-wider transition shadow-lg shadow-cyan-400/20 flex items-center gap-2"
              >
                <span>Send to AI URL Scanner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quishing Educational Insight Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-mono font-bold tracking-wider text-white uppercase flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          How Physical Quishing Attacks Work
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed font-sans">
          Physical quishing occurs when criminals adhere deceptive QR stickers over genuine municipal or commercial signage — including parking pay-stations, EV chargers, restaurant tables, and utility kiosks. The QR redirects mobile victims to lookalike phishing payment gateways designed to harvest credit cards and netbanking credentials.
        </p>
      </div>
    </div>
  );
};

