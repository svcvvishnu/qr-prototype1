# In-App QR Scanner Feature

## Overview
Add a QR code scanner within the app so logged-in users can scan QR codes directly and send authenticated (non-anonymous) messages.

## Benefits
- **Authenticated Messaging**: Messages from logged-in users show verified sender info
- **Better Communication**: Two-way conversation capability
- **Improved UX**: No need to manually type URLs or use external scanner apps
- **User Tracking**: Know who scanned your QR codes

---

## Implementation Plan

### 1. QR Scanner Library

Use **html5-qrcode** - a popular, lightweight browser-based QR scanner:
- No external dependencies
- Works on mobile and desktop
- Camera permission handling built-in
- Good browser support

```bash
npm install html5-qrcode
```

### 2. Scanner Page

#### [NEW] [app/(dashboard)/scan/page.tsx](file:///Users/vishnuvini/freelance/qr-prototype1/app/(dashboard)/scan/page.tsx)

Features:
- Camera preview
- Auto-focus and scan
- Success/error feedback
- Redirect to scanned item's public page
- Maintain logged-in session

### 3. Navigation Update

#### [MODIFY] [app/components/BottomNav.tsx](file:///Users/vishnuvini/freelance/qr-prototype1/app/components/BottomNav.tsx)

Replace the center FAB (Create button) with a dual-action button:
- **Long press / Click**: Show menu with "Create Item" and "Scan QR"
- **Quick tap**: Default to Scan QR (most common action)

Alternative: Add 5th tab for Scanner

### 4. Message Flow Enhancement

When a logged-in user scans a QR code:
1. Scanner detects QR code → extracts item ID
2. Redirects to `/q/[id]` with session active
3. Public page detects logged-in user
4. Message form pre-fills sender info from session
5. Message sent with `senderId` populated
6. Owner sees verified sender in inbox

### 5. UI Improvements

**Scanner Page:**
- Full-screen camera view
- Scan target overlay (crosshair/frame)
- Flash/torch toggle for low light
- Switch camera (front/back)
- Manual URL input fallback

**Message Form Enhancement:**
- Show "Sending as [User Name]" for logged-in users
- Hide name/contact fields when logged in
- Add verified badge preview

---

## Technical Details

### Camera Permissions

```typescript
// Request camera access
const scanner = new Html5Qrcode("reader");
await scanner.start(
  { facingMode: "environment" }, // Back camera
  { fps: 10, qrbox: 250 },
  onScanSuccess,
  onScanError
);
```

### Security Considerations

- ✅ Validate scanned URLs match app domain
- ✅ Prevent XSS from malicious QR codes
- ✅ Rate limit scanning to prevent abuse
- ✅ Handle camera permission denials gracefully

### Browser Compatibility

- ✅ Chrome/Edge (desktop & mobile)
- ✅ Safari (iOS 11+)
- ✅ Firefox
- ⚠️ Requires HTTPS (or localhost for dev)

---

## User Flow

### Scanning Flow

```
1. User clicks "Scan" in bottom nav
2. Camera permission requested (first time)
3. Camera preview appears
4. User points at QR code
5. Auto-detects and scans
6. Redirects to public item page
7. User can send authenticated message
```

### Message Sending (Logged In)

```
1. User on public QR page (logged in)
2. Message form shows: "Sending as [Name] ✓"
3. User types message
4. Clicks "Send Message"
5. Message saved with senderId
6. Owner sees verified sender
```

---

## Files to Create/Modify

### New Files
1. `app/(dashboard)/scan/page.tsx` - Scanner page
2. `app/components/QRScanner.tsx` - Scanner component
3. `lib/qr-scanner-utils.ts` - Helper functions

### Modified Files
1. `app/components/BottomNav.tsx` - Add scan button
2. `app/components/MessageForm.tsx` - Auto-fill for logged-in users
3. `package.json` - Add html5-qrcode dependency

---

## Testing Plan

1. **Camera Access**: Test permission flow
2. **QR Detection**: Scan various QR codes
3. **URL Validation**: Test with non-app QR codes
4. **Logged-in Flow**: Verify sender info populated
5. **Mobile Testing**: Test on iOS and Android
6. **Error Handling**: Test camera denial, invalid codes

---

## Future Enhancements

- **Scan History**: Track scanned items
- **Bulk Scan**: Scan multiple codes in sequence
- **Offline Mode**: Cache scanned data
- **AR Overlay**: Show item info on camera view
- **Sound/Vibration**: Feedback on successful scan
