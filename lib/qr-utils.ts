import QRCode from 'qrcode';
import { Jimp } from 'jimp';
import path from 'path';

export async function generateQRWithLogo(data: string): Promise<string> {
    // Temporary fallback: Generate standard QR code
    return await QRCode.toDataURL(data);
}
