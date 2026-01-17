import QRCode from 'qrcode';
import { Jimp } from 'jimp';
import path from 'path';

export async function generateQRWithLogo(data: string): Promise<string> {
    try {
        // 1. Generate QR Code as Buffer
        const qrBuffer = await QRCode.toBuffer(data, {
            errorCorrectionLevel: 'H', // High error correction to allow for logo
            width: 400,
            margin: 1,
            color: {
                dark: '#000000', // Black dots
                light: '#ffffff', // White background
            }
        });

        // 2. Load images
        const qrImage = await Jimp.read(qrBuffer);
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');

        let logo;
        try {
            logo = await Jimp.read(logoPath);
        } catch (e) {
            console.warn("Logo not found at", logoPath, "generating QR without logo");
            return await QRCode.toDataURL(data);
        }

        // 3. Resize Logo
        const logoSize = qrImage.bitmap.width * 0.2;
        // Jimp v1 might use object for resize or different method
        // If resize takes 1 arg, it might be { w, h }
        logo.resize({ w: logoSize, h: logoSize });

        // 4. Calculate position (center)
        const x = (qrImage.bitmap.width - logoSize) / 2;
        const y = (qrImage.bitmap.height - logoSize) / 2;

        // 5. Composite
        qrImage.composite(logo, x, y);

        // 6. Return Data URL
        const mime = 'image/png';
        const buffer = await new Promise<Buffer>((resolve, reject) => {
            qrImage.getBuffer(mime, (err: Error | null, buff: Buffer) => {
                if (err) reject(err);
                else resolve(buff);
            });
        });
        return `data:${mime};base64,${buffer.toString('base64')}`;

    } catch (error) {
        console.error("Error generating QR with logo:", error);
        // Fallback
        return await QRCode.toDataURL(data);
    }
}
