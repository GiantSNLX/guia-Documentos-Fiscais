import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { QRCodeSVG } from 'qrcode.react';

interface RealBarcodeProps {
  value: string;
  height?: number;
}

export function RealBarcode({ value, height = 38 }: RealBarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const digitsOnly = value.replace(/\D/g, '');

  useEffect(() => {
    if (!svgRef.current || !digitsOnly) return;
    try {
      JsBarcode(svgRef.current, digitsOnly, {
        format: 'CODE128',
        displayValue: false,
        margin: 0,
        height,
        width: 1.15,
        background: 'transparent',
        lineColor: '#0f172a',
      });
    } catch {
      // Fallback silently if digits cannot be encoded
    }
  }, [digitsOnly, height]);

  return (
    <svg
      ref={svgRef}
      className="h-auto w-full max-w-full"
      aria-label={`Código de barras da chave ${digitsOnly}`}
    />
  );
}

interface RealQrCodeProps {
  value: string;
  size?: number;
}

export function RealQrCode({ value, size = 84 }: RealQrCodeProps) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="#ffffff"
      fgColor="#0f172a"
      level="M"
      includeMargin={false}
    />
  );
}
