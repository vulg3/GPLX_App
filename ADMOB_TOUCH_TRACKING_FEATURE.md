# AdMob Touch Tracking Feature

## Tính năng mới ✨

### Banner Ad Position

- **Vị trí mới**: Banner ad hiện **phía trên** bottom tab bar (thay vì phía dưới)
- **Layout**: Tạo UX tốt hơn, banner nằm trong vùng nhìn thấy

### Automatic Interstitial Ads on Touch

#### Cách hoạt động:

1. **Touch Counter**: Mỗi khi user chạm vào màn hình, counter tăng lên 1
2. **Random Target**: Khi app khởi động, random một số từ 100-150
3. **Show Ad**: Khi đạt số lần chạm target → hiện fullscreen interstitial ad
4. **Reset**: Sau khi đóng ad, reset counter về 0 và random target mới

#### Code Implementation:

```tsx
// MainTabs.tsx
const touchCountRef = useRef(0);
const targetTouchCountRef = useRef(
  Math.floor(Math.random() * 51) + 100 // Random 100-150
);

const handleTouch = () => {
  touchCountRef.current += 1;

  if (touchCountRef.current >= targetTouchCountRef.current) {
    AdMobService.showInterstitialAd(() => {
      touchCountRef.current = 0;
      targetTouchCountRef.current = Math.floor(Math.random() * 51) + 100;
    });
  }
};
```

#### Ưu điểm:

- ✅ Không làm phiền user quá nhiều (random 100-150 touches)
- ✅ Tự động, không cần code thêm ở các screen
- ✅ Sử dụng `useRef` - không trigger re-render
- ✅ Reset và random lại sau mỗi ad

#### Kiểm tra trong console:

```
Next ad will show after 127 touches
Next ad will show after 143 touches
Next ad will show after 105 touches
```

## Layout Structure

```
┌─────────────────────────┐
│                         │
│   Tab Navigator         │
│   (Xe máy/Ô tô/Cài đặt) │
│                         │
└─────────────────────────┘
┌─────────────────────────┐
│   📢 Banner Ad          │  ← Vị trí mới (trên tab bar)
└─────────────────────────┘
┌─────────────────────────┐
│   Bottom Tab Bar        │
│   🏍️  🚗  ⚙️          │
└─────────────────────────┘
```

## Testing

1. Chạy app: `npx expo run:ios` hoặc `npx expo run:android`
2. Chạm vào màn hình nhiều lần
3. Xem console log để track số lần chạm
4. Sau 100-150 lần → fullscreen ad sẽ hiện
