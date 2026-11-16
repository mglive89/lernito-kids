/** Rückkamera öffnen. Fehler werden in verständliche Gründe übersetzt. */
export type CameraError = 'denied' | 'unavailable' | 'insecure';

export async function openCamera(): Promise<MediaStream> {
  if (!window.isSecureContext) throw 'insecure' as CameraError;
  if (!navigator.mediaDevices?.getUserMedia) throw 'unavailable' as CameraError;
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } }
    });
  } catch (e) {
    const name = (e as DOMException)?.name;
    throw (name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'unavailable') as CameraError;
  }
}

export function stopCamera(s: MediaStream | null) {
  s?.getTracks().forEach((t) => t.stop());
}

/** Rahmen für eine einzelne Aufgabe (relativ zum Bild). */
export const FRAME = { x: 0.06, y: 0.36, w: 0.88, h: 0.28 };

export interface Rect { x: number; y: number; w: number; h: number }

/** Videobild als Canvas aufnehmen. */
export function grabFrame(video: HTMLVideoElement): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = video.videoWidth; c.height = video.videoHeight;
  c.getContext('2d')!.drawImage(video, 0, 0);
  return c;
}

/** Ausschnitt (relativ) eines Bildes als PNG. */
export async function cropToBlob(img: CanvasImageSource & { width: number; height: number }, r: Rect, naturalW: number, naturalH: number): Promise<Blob> {
  const sx = Math.round(r.x * naturalW), sy = Math.round(r.y * naturalH);
  const sw = Math.max(8, Math.round(r.w * naturalW)), sh = Math.max(8, Math.round(r.h * naturalH));
  const c = document.createElement('canvas');
  c.width = sw; c.height = sh;
  c.getContext('2d')!.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('crop'))), 'image/png'));
}
