# Test Credentials

## User Account

The following test account was created during development and testing:

```
Name: Test User
Email: test@example.com
Mobile: 1234567890
Password: password123
```

## Test Data

- **Category**: Personal
- **Item**: Test Keychain (ID type)
- **Status**: Published (with QR code generated)

## Quick Start

1. Navigate to `http://localhost:3000`
2. Log in with the credentials above
3. View the dashboard to see your items
4. Click on "Test Keychain" to see item details
5. Click "Preview" to see the public QR view
6. Open the public URL in an incognito window to test messaging

## Testing Messaging

1. Open the public QR page in incognito: `http://localhost:3000/q/[item-id]`
2. Scroll down to the message form
3. Enter a test message
4. Optionally add your name and contact info
5. Click "Send Message"
6. Log back in as the owner to see the message in the Messages inbox

## Features to Test

- ✅ Dashboard with analytics (QR Codes, Total Scans, Messages)
- ✅ Messages inbox with unread badges
- ✅ Bottom navigation with Messages tab
- ✅ Public QR view with message form
- ✅ Item detail page with messages section
- ✅ Real-time notification polling (30s intervals)
- ✅ Anonymous messaging support
