# Bottom Tab Navigation Implementation

## Tóm tắt

Đã triển khai thành công Bottom Tab Navigation với 3 tab chính:

1. **Xe máy** 🏍️ - Tab cho bằng lái A/A1
2. **Ô tô** 🚗 - Tab cho bằng lái B/B1
3. **Cài đặt** ⚙️ - Tab cho các thiết lập ứng dụng

## Các tính năng đã triển khai

### 1. Bottom Tab Navigation

- ✅ 3 tabs: Xe máy, Ô tô, Cài đặt
- ✅ Icons đẹp mắt với Ionicons
- ✅ Responsive height cho iOS và Android
- ✅ Theme-aware (thay đổi màu theo theme)

### 2. Tab Xe máy (`MotorbikeTab.tsx`)

- ✅ Hiển thị nội dung cho bằng lái A/A1
- ✅ Load câu hỏi từ `shlx.bike_questions.json`
- ✅ Thống kê riêng cho xe máy
- ✅ Các action: Học câu hỏi, Thi thử, Lịch sử thi
- ✅ Tự động lưu license type = "A"

### 3. Tab Ô tô (`CarTab.tsx`)

- ✅ Hiển thị nội dung cho bằng lái B/B1
- ✅ Load câu hỏi từ `shlx.car_questions.json`
- ✅ Thống kê riêng cho ô tô
- ✅ Các action: Học câu hỏi, Thi thử, Lịch sử thi
- ✅ Tự động lưu license type = "B"

### 4. Tab Cài đặt (`Settings.tsx`)

Đã implement đầy đủ các setting:

#### Giao diện

- ✅ **Chế độ tối/sáng** - Toggle switch để bật/tắt dark mode
- ✅ Theme được lưu vào AsyncStorage
- ✅ Thay đổi theme realtime

#### Thông tin

- ✅ **Phiên bản** - Hiển thị version từ constants

#### Pháp lý

- ✅ **Chính sách bảo mật** - WebView link (có thể override)
- ✅ **Điều khoản sử dụng** - WebView link (có thể override)
- ✅ **Tuyên bố từ chối** - WebView link (có thể override)

#### Dữ liệu

- ✅ **Xóa dữ liệu lịch sử** - Xóa tất cả lịch sử thi đã lưu

### 5. Theme System (`ThemeContext.tsx`)

- ✅ React Context cho quản lý theme
- ✅ Support: light, dark, auto (follow system)
- ✅ Theme persistence với AsyncStorage
- ✅ Colors object cho easy access
- ✅ Hook `useTheme()` để sử dụng trong components

### 6. WebView Screen (`WebViewScreen.tsx`)

- ✅ Màn hình hiển thị legal documents
- ✅ Header với back button
- ✅ Loading indicator
- ✅ Error handling
- ✅ Theme-aware

### 7. Legal URLs Configuration (`src/constants/legalUrls.ts`)

File này chứa các URL có thể dễ dàng override:

```typescript
export const LEGAL_URLS = {
  PRIVACY_POLICY: "https://example.com/privacy-policy",
  TERMS_OF_SERVICE: "https://example.com/terms-of-service",
  DISCLAIMER: "https://example.com/disclaimer",
};

export const APP_INFO = {
  VERSION: "1.0.0",
  BUILD_NUMBER: "1",
  COPYRIGHT_YEAR: "2025",
  COMPANY_NAME: "GPLX App",
  SUPPORT_EMAIL: "support@gplxapp.com",
};
```

## Cách override Legal URLs

1. Mở file `/Users/lehau/Code/Freelance/GPLX_App/src/constants/legalUrls.ts`
2. Thay đổi các URL trong object `LEGAL_URLS`:

```typescript
export const LEGAL_URLS = {
  PRIVACY_POLICY: "https://your-domain.com/privacy",
  TERMS_OF_SERVICE: "https://your-domain.com/terms",
  DISCLAIMER: "https://your-domain.com/disclaimer",
};
```

3. Cập nhật thông tin app nếu cần:

```typescript
export const APP_INFO = {
  VERSION: "1.0.0",
  BUILD_NUMBER: "1",
  COPYRIGHT_YEAR: "2025",
  COMPANY_NAME: "Your Company Name",
  SUPPORT_EMAIL: "your-email@example.com",
};
```

## Cấu trúc file mới

```
src/
├── contexts/
│   └── ThemeContext.tsx          # Theme management
├── constants/
│   └── legalUrls.ts             # Legal URLs configuration
├── navigation/
│   └── MainTabs.tsx             # Bottom tab navigator
└── screens/
    ├── MotorbikeTab.tsx         # Tab xe máy
    ├── CarTab.tsx               # Tab ô tô
    ├── Settings.tsx             # Tab cài đặt
    └── WebViewScreen.tsx        # WebView cho legal docs
```

## Thư viện đã cài đặt

```bash
npm install @react-navigation/bottom-tabs --legacy-peer-deps
npm install react-native-webview --legacy-peer-deps
```

## Navigation Flow

```
LicenseSelection
    ↓ (chọn loại bằng)
MainTabs (Bottom Tabs)
    ├── MotorbikeTab → Study/Exam/ExamHistory
    ├── CarTab → Study/Exam/ExamHistory
    └── Settings → WebViewScreen (legal docs)
```

## Testing

Để test ứng dụng:

```bash
# iOS
npm run ios

# Android
npm run android
```

## Notes

- Khi user chọn tab Xe máy hoặc Ô tô, license type sẽ tự động được lưu
- Theme thay đổi được persist và apply cho toàn bộ app
- Legal documents mở trong WebView trong app, không mở browser bên ngoài
- Tất cả animations và UI đã được giữ nguyên từ design cũ

## Troubleshooting

### Lỗi: "TurboModuleRegistry.getEnforcing(...): 'RNCWebViewModule' could not be found"

Đây là lỗi thường gặp khi cài đặt `react-native-webview`. Native module cần được link vào app.

**Giải pháp cho iOS:**

```bash
cd ios
pod install
cd ..
npm run ios
```

**Giải pháp cho Android:**

```bash
npm run android
```

### Lỗi: "Unimplemented component: ExpoLinearGradient"

Lỗi này xảy ra khi `expo-linear-gradient` không được cài đặt đúng cách.

**Giải pháp:**

```bash
# Gỡ bỏ và cài lại
npm uninstall expo-linear-gradient --legacy-peer-deps
npx expo install expo-linear-gradient

# iOS
cd ios && pod install && cd ..
npm run ios

# Android
npm run android
```

### Các lỗi build khác

Nếu gặp lỗi build sau khi cài đặt:

#### iOS

```bash
cd ios && pod install && cd ..
npm run ios
```

#### Android

```bash
# Clean build nếu cần
cd android
./gradlew clean
cd ..
npm run android
```

## Future Enhancements (Optional)

- [ ] Add push notifications settings
- [ ] Add language selection (Vietnamese/English)
- [ ] Add app feedback/rating
- [ ] Add about us page
- [ ] Add FAQ section
