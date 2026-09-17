import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Copy, Check, ExternalLink, ShieldCheck, Download } from 'lucide-react';

interface Props {
  wasteId: string;
  material: string;
  status: string;
}

export const QRCodeCard: React.FC<Props> = ({ wasteId, material, status }) => {
  const [copied, setCopied] = useState(false);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const verifyUrl = `${origin}/verify/${wasteId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = document.getElementById(`qr-code-${wasteId}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `Passport-QR-${wasteId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-center flex flex-col items-center">
      <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4 border border-emerald-200">
        <ShieldCheck className="w-3.5 h-3.5" />
        Digital Waste Passport QR
      </div>

      <div className="p-4 bg-white border-2 border-emerald-600/20 rounded-2xl shadow-inner mb-4 relative group">
        <QRCodeSVG
          id={`qr-code-${wasteId}`}
          value={verifyUrl}
          size={180}
          level="H"
          includeMargin={true}
        />
        <div className="absolute inset-0 bg-emerald-950/5 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
          <span className="bg-emerald-900 text-white text-[11px] px-2 py-1 rounded-md shadow-md">
            Scan to Verify
          </span>
        </div>
      </div>

      <div className="w-full text-center space-y-1 mb-4">
        <div className="font-mono text-sm font-bold text-slate-800 tracking-wide">{wasteId}</div>
        <p className="text-xs text-slate-500 truncate max-w-[220px] mx-auto">{material}</p>
        <p className="text-[11px] font-medium text-emerald-700">Status: {status}</p>
      </div>

      <div className="w-full flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        <button
          type="button"
          onClick={downloadQR}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          title="Download PNG QR Code"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        <a
          href={`/verify/${wasteId}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
        >
          <span>Verify</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
