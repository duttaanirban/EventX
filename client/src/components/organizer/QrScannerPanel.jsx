import { useEffect, useMemo, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle2, ScanLine } from 'lucide-react';
import { qrService } from '../../services/qr.service';
import { getSocket } from '../../services/socket';
import { Button } from '../ui/Button';

export function QrScannerPanel() {
  const scannerRef = useRef(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualPayload, setManualPayload] = useState('');
  const [lastCheckin, setLastCheckin] = useState(null);
  const queryClient = useQueryClient();

  const validatePayload = async (payload) => {
    try {
      const { booking } = await qrService.validate(payload);
      setLastCheckin(booking);
      toast.success(`${booking.user?.name || 'Attendee'} checked in`);
      queryClient.invalidateQueries({ queryKey: ['organizer-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'QR validation failed');
    }
  };

  useEffect(() => {
    if (!isScannerOpen) return undefined;
    const scanner = new Html5QrcodeScanner(
      'eventx-qr-scanner',
      { fps: 10, qrbox: { width: 260, height: 260 }, rememberLastUsedCamera: true },
      false
    );
    scannerRef.current = scanner;
    scanner.render(
      (decodedText) => validatePayload(decodedText),
      () => {}
    );
    return () => {
      scanner.clear().catch(() => {});
    };
  }, [isScannerOpen]);

  const socket = useMemo(() => getSocket(), []);
  useEffect(() => {
    const handler = () => queryClient.invalidateQueries({ queryKey: ['organizer-analytics'] });
    socket.on('checkin-updated', handler);
    return () => socket.off('checkin-updated', handler);
  }, [queryClient, socket]);

  const submitManual = async (event) => {
    event.preventDefault();
    if (!manualPayload.trim()) return;
    await validatePayload(manualPayload.trim());
    setManualPayload('');
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_.85fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">QR check-in</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Scan attendee tickets and prevent duplicate entry.</p>
          </div>
          <Button variant="accent" onClick={() => setIsScannerOpen((value) => !value)}>
            <ScanLine className="h-4 w-4" />
            {isScannerOpen ? 'Stop scanner' : 'Start scanner'}
          </Button>
        </div>
        <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          {isScannerOpen ? (
            <div id="eventx-qr-scanner" className="min-h-80" />
          ) : (
            <div className="grid min-h-80 place-items-center text-center text-slate-500">
              <div>
                <ScanLine className="mx-auto h-12 w-12" />
                <p className="mt-3 text-sm font-semibold">Camera scanner is paused</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
        <h3 className="text-lg font-black">Manual validation</h3>
        <form onSubmit={submitManual} className="mt-4">
          <textarea
            className="focus-ring min-h-40 w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm dark:border-white/10 dark:bg-white/5"
            value={manualPayload}
            onChange={(event) => setManualPayload(event.target.value)}
            placeholder='{"bookingId":"...","eventId":"...","token":"..."}'
          />
          <Button className="mt-3 w-full" variant="accent" type="submit">
            Validate payload
          </Button>
        </form>
        {lastCheckin ? (
          <div className="mt-5 rounded-lg bg-brand-50 p-4 text-brand-800 dark:bg-brand-500/10 dark:text-brand-100">
            <CheckCircle2 className="h-6 w-6" />
            <p className="mt-2 font-black">{lastCheckin.user?.name}</p>
            <p className="text-sm opacity-80">{lastCheckin.event?.title}</p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
