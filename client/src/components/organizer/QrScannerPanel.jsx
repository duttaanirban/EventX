import { useEffect, useMemo, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle, QrCode, Scan, WarningCircle } from '@phosphor-icons/react';
import { qrService } from '../../services/qr.service';
import { getSocket } from '../../services/socket';
import { Button } from '../ui/Button';

export function QrScannerPanel() {
  const scannerRef = useRef(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [manualPayload, setManualPayload] = useState('');
  const [lastCheckin, setLastCheckin] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const queryClient = useQueryClient();

  const validatePayload = async (payload) => {
    setIsValidating(true);
    setValidationError('');
    try {
      const { booking } = await qrService.validate(payload);
      setLastCheckin(booking);
      toast.success(`${booking.user?.name || 'Attendee'} checked in`);
      queryClient.invalidateQueries({ queryKey: ['organizer-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
    } catch (error) {
      const message = error.response?.data?.message || 'QR validation failed';
      setValidationError(message);
      toast.error(message);
    } finally {
      setIsValidating(false);
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
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,.85fr)]">
      <section className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.16)] sm:p-5" aria-labelledby="qr-scanner-title">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="qr-scanner-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Camera scanner</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">Scan attendee QR tickets and validate entry.</p>
          </div>
          <Button type="button" variant={isScannerOpen ? 'outline' : 'accent'} className="rounded-xl" onClick={() => setIsScannerOpen((value) => !value)}>
            <Scan weight="regular" aria-hidden="true" className="h-4 w-4" />
            {isScannerOpen ? 'Stop scanner' : 'Start scanner'}
          </Button>
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#080d14] p-3">
          {isScannerOpen ? (
            <div id="eventx-qr-scanner" className="min-h-80 overflow-hidden rounded-lg text-slate-700 dark:text-slate-200" />
          ) : (
            <div className="grid min-h-80 place-items-center px-5 text-center">
              <div>
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-teal-300/10 bg-teal-400/10 text-teal-700 dark:text-teal-300">
                  <QrCode weight="duotone" aria-hidden="true" className="h-7 w-7" />
                </span>
                <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Scanner ready</p>
                <p className="mt-1 text-xs text-slate-500">Start the scanner to request camera access.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="space-y-4">
        <section className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#101720] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.16)] sm:p-5" aria-labelledby="manual-validation-title">
          <h2 id="manual-validation-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">Manual validation</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">Paste a complete EventX QR payload when camera scanning is unavailable.</p>
          <form onSubmit={submitManual} className="mt-4">
            <label htmlFor="manual-qr-payload" className="sr-only">QR payload</label>
            <textarea
              id="manual-qr-payload"
              className="focus-ring min-h-36 w-full resize-y rounded-xl border border-slate-200 dark:border-white/10 bg-slate-900/5 dark:bg-white/[0.045] px-3 py-3 font-sans text-xs leading-5 text-slate-900 dark:text-white transition placeholder:text-slate-600 hover:border-slate-200 dark:hover:border-white/20 focus:border-teal-400/60"
              value={manualPayload}
              onChange={(event) => setManualPayload(event.target.value)}
              placeholder='{"bookingId":"...","eventId":"...","token":"..."}'
            />
            <Button className="mt-3 w-full rounded-xl" variant="accent" type="submit" isLoading={isValidating} disabled={!manualPayload.trim()}>
              <QrCode weight="regular" aria-hidden="true" className="h-4 w-4" />
              Validate payload
            </Button>
          </form>
        </section>

        {validationError ? (
          <div role="alert" className="rounded-xl border border-rose-400/20 bg-rose-950/20 p-4 text-rose-700 dark:text-rose-100">
            <div className="flex items-start gap-3">
              <WarningCircle weight="duotone" aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-rose-700 dark:text-rose-300" />
              <div>
                <p className="text-sm font-semibold">Validation failed</p>
                <p className="mt-1 text-xs leading-5 text-rose-700/75 dark:text-rose-200/75">{validationError}</p>
              </div>
            </div>
          </div>
        ) : null}

        {lastCheckin ? (
          <section className="rounded-xl border border-teal-300/15 bg-teal-400/[0.08] p-4" aria-labelledby="last-checkin-title">
            <div className="flex items-start gap-3">
              <CheckCircle weight="duotone" aria-hidden="true" className="h-6 w-6 shrink-0 text-teal-700 dark:text-teal-300" />
              <div className="min-w-0">
                <h2 id="last-checkin-title" className="text-sm font-semibold text-teal-700 dark:text-teal-100">Check-in successful</h2>
                <p className="mt-2 truncate font-semibold text-slate-900 dark:text-white">{lastCheckin.user?.name}</p>
                <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-400">{lastCheckin.event?.title}</p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
