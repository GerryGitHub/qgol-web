import { useEffect, useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

const SCANNER_ID = 'qr-scanner';

export default function QrScanner({ onScan, onClose }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        scanner.stop().catch(() => {});
        scannerRef.current = null;
        onScan(decodedText);
      },
      () => {},
    ).catch(() => {});

    return () => {
      scanner.stop().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto' }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
        <CloseIcon />
      </IconButton>
      <Box id={SCANNER_ID} sx={{ width: '100%', aspectRatio: '1/1', borderRadius: 3, overflow: 'hidden' }} />
      <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', textAlign: 'center', mt: 1.5 }}>
        Escanea el código QR de la quiniela
      </Typography>
    </Box>
  );
}
