import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface RealBarcodeProps {
  value: string;
  className?: string;
}

export default function RealBarcode({ value, className = 'w-24 h-5' }: RealBarcodeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          width: 1.3,
          height: 20,
          displayValue: false,
          background: 'transparent',
          lineColor: '#0F172A',
          margin: 0,
        });
      } catch (e) {
        console.warn('Barcode generation failed for value:', value, e);
      }
    }
  }, [value]);

  return <svg ref={svgRef} className={className} />;
}
