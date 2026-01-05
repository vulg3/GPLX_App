# 🎬 Animation Guide - Hướng Dẫn Sử Dụng Animations

## 📦 Animation Components

### 1. AnimatedCard

Component card với fade in + slide up animation.

```typescript
import { AnimatedCard } from "../components";

<AnimatedCard delay={100} style={styles.card}>
  <Text>Content here</Text>
</AnimatedCard>;
```

**Props:**

- `delay` (number): Độ trễ trước khi animation bắt đầu (ms)
- `style` (ViewStyle): Custom styles
- `children` (ReactNode): Nội dung card

**Use cases:** Cards, Lists, Content blocks

---

### 2. PressableScale

TouchableOpacity với scale animation khi nhấn.

```typescript
import { PressableScale } from "../components";

<PressableScale onPress={handlePress} scale={0.95}>
  <Text>Press me</Text>
</PressableScale>;
```

**Props:**

- `scale` (number): Mức độ scale khi nhấn (0-1, default: 0.95)
- `onPress` (function): Callback khi nhấn
- Tất cả props của `TouchableOpacity`

**Use cases:** Buttons, Cards, Interactive elements

---

### 3. AnimatedProgressBar

Progress bar với animated width.

```typescript
import { AnimatedProgressBar } from "../components";

<AnimatedProgressBar progress={75} color="#34C759" showLabel={true} />;
```

**Props:**

- `progress` (number): 0-100
- `color` (string): Màu của progress fill
- `showLabel` (boolean): Hiển thị % label
- `height` (number): Chiều cao bar

**Use cases:** Progress tracking, Exam completion

---

### 4. ConfettiEffect

Hiệu ứng pháo giấy celebration.

```typescript
import { ConfettiEffect } from "../components";

{
  showConfetti && <ConfettiEffect />;
}
```

**Features:**

- 50 confetti pieces
- 5 màu ngẫu nhiên
- Tự động biến mất sau animation
- Overlay toàn màn hình

**Use cases:** Success screens, Achievements

---

### 5. LoadingSpinner

Spinner quay với gradient.

```typescript
import { LoadingSpinner } from "../components";

<LoadingSpinner />;
```

**Features:**

- Rotating gradient animation
- Smooth continuous rotation
- Self-contained

**Use cases:** Loading states, Processing

---

### 6. GradientBackground

Background gradient wrapper.

```typescript
import { GradientBackground } from "../components";

<GradientBackground colors={["#667eea", "#764ba2"]}>
  <YourContent />
</GradientBackground>;
```

**Props:**

- `colors` (string[]): Mảng màu gradient
- `children` (ReactNode): Nội dung

**Use cases:** Full screen backgrounds

---

### 7. Badge

Badge component với gradient và icon.

```typescript
import { Badge } from "../components";

<Badge text="Điểm liệt" type="critical" animated={true} />;
```

**Props:**

- `text` (string): Nội dung badge
- `type`: "success" | "error" | "warning" | "info" | "critical"
- `animated` (boolean): Có animation hay không

**Use cases:** Status indicators, Labels

---

## 🎭 Animation Patterns

### Entry Animations

#### FadeIn Family

```typescript
import { FadeIn, FadeInUp, FadeInDown, FadeInRight } from "react-native-reanimated";

// Basic fade
<Animated.View entering={FadeIn.duration(500)}>

// Fade + slide from bottom
<Animated.View entering={FadeInUp.delay(200).springify()}>

// Fade + slide from top
<Animated.View entering={FadeInDown.duration(600).springify()}>

// Fade + slide from right
<Animated.View entering={FadeInRight.delay(100).springify()}>
```

#### ZoomIn

```typescript
import { ZoomIn } from "react-native-reanimated";

<Animated.View entering={ZoomIn.delay(300).springify()}>
  <Text>Pop in!</Text>
</Animated.View>;
```

#### SlideIn Family

```typescript
import { SlideInDown, SlideInUp } from "react-native-reanimated";

<Animated.View entering={SlideInDown.springify()}>
  <Text>Slide in</Text>
</Animated.View>;
```

### Exit Animations

```typescript
import { FadeOut, SlideOutUp } from "react-native-reanimated";

<Animated.View entering={SlideInDown.springify()} exiting={SlideOutUp}>
  <Text>Expandable content</Text>
</Animated.View>;
```

### Layout Animations

```typescript
import { Layout } from "react-native-reanimated";

<Animated.View layout={Layout.springify()}>
  <Text>{isExpanded ? "−" : "+"}</Text>
</Animated.View>;
```

---

## 🎨 Gradient Patterns

### Color Schemes

```typescript
// Primary Blue
colors={["#007AFF", "#5856D6"]}

// Success Green
colors={["#34C759", "#28a745"]}

// Warning Orange
colors={["#FF9500", "#ff6b6b"]}

// Error Red
colors={["#FF3B30", "#dc2626"]}

// Purple Theme
colors={["#667eea", "#764ba2"]}

// Pink Theme
colors={["#f093fb", "#f5576c"]}
```

### Usage Examples

```typescript
<LinearGradient
  colors={["#007AFF", "#5856D6"]}
  style={styles.button}
  start={{ x: 0, y: 0 }}    // Top left
  end={{ x: 1, y: 0 }}      // Top right (horizontal)
>
  <Text>Button</Text>
</LinearGradient>

// Diagonal gradient
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 1 }}

// Vertical gradient
start={{ x: 0, y: 0 }}
end={{ x: 0, y: 1 }}
```

---

## ⚡ Performance Tips

### 1. Native Driver

Reanimated tự động sử dụng native driver - không cần config thêm.

### 2. Stagger Delays

```typescript
// Good - smooth stagger
{items.map((item, index) => (
  <AnimatedCard key={item.id} delay={index * 50}>
    {/* content */}
  </AnimatedCard>
))}

// Bad - too fast or too slow
delay={index * 10}   // Quá nhanh
delay={index * 200}  // Quá chậm
```

### 3. Spring Physics

```typescript
// Smooth spring
withSpring(value, {
  damping: 15, // 10-20 recommended
  stiffness: 100, // 80-120 recommended
});

// Bouncy spring
withSpring(value, {
  damping: 8,
  stiffness: 150,
});

// Stiff spring
withSpring(value, {
  damping: 20,
  stiffness: 200,
});
```

### 4. Duration Guidelines

- **Fast**: 200-300ms (small interactions)
- **Medium**: 400-600ms (cards, modals)
- **Slow**: 800-1000ms (screen transitions)

---

## 🎯 Screen-by-Screen Guide

### LicenseSelection

```typescript
// Logo entrance
<Animated.View entering={FadeInDown.duration(800).springify()}>

// Title stagger
<Animated.View entering={FadeInUp.delay(200).duration(800).springify()}>

// Cards stagger
<Animated.View entering={FadeInUp.delay(400).duration(800).springify()}>

// Hint last
<Animated.Text entering={FadeInUp.delay(600).duration(600)}>
```

**Timing**: 0ms → 200ms → 400ms → 600ms

### Home

```typescript
// Header
<Animated.View entering={FadeInDown.duration(600).springify()}>

// Stats
<AnimatedCard delay={100}>
  <Animated.View entering={FadeInUp.delay(200).springify()}>

// Actions
<AnimatedCard delay={200}>  // Study
<AnimatedCard delay={300}>  // Exam
<AnimatedCard delay={400}>  // History
```

**Timing**: Sequential delays tạo flow tự nhiên

### Exam

```typescript
// Answers stagger
{answers.map((answer, index) => (
  <Animated.View entering={FadeInUp.delay(index * 100).springify()}>
))}

// Selected answer zoom
<Animated.View entering={ZoomIn.springify()}>
```

**Timing**: 0ms, 100ms, 200ms, 300ms cho 4 đáp án

### ExamResult

```typescript
// Icon entrance
<Animated.View entering={ZoomIn.delay(200).springify()}>

// Title
<Animated.Text entering={FadeInUp.delay(400)}>

// Score with custom animation
const scaleStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }],
}));

useEffect(() => {
  scale.value = withDelay(300, withSpring(1, { damping: 10 }));
}, []);
```

**Special**: Confetti + rotating icon animation!

---

## 🔧 Custom Animations

### Custom Shared Value Animation

```typescript
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const MyComponent = () => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2);
  };

  return <Animated.View style={animatedStyle}>{/* content */}</Animated.View>;
};
```

### Custom Sequence Animation

```typescript
import { withSequence, withTiming } from "react-native-reanimated";

rotate.value = withRepeat(
  withSequence(
    withTiming(-10, { duration: 100 }),
    withTiming(10, { duration: 100 }),
    withTiming(0, { duration: 100 })
  ),
  3 // Repeat 3 times
);
```

### Custom Interpolation

```typescript
const animatedStyle = useAnimatedStyle(() => ({
  backgroundColor: interpolateColor(
    progress.value,
    [0, 50, 100],
    ["#FF3B30", "#FF9500", "#34C759"]
  ),
}));
```

---

## 📱 Platform Considerations

### iOS

- Animations chạy mượt mà
- Spring physics chuẩn iOS
- Haptic feedback có thể thêm

### Android

- Elevation cho shadows
- Material Design principles
- Ripple effects có thể thêm

---

## 🎨 Design Principles

### 1. Consistency

- Timing nhất quán (600ms cho cards)
- Spring settings giống nhau
- Delay patterns đồng nhất

### 2. Purpose

- Mỗi animation có lý do
- Không animation quá nhiều
- Guide user attention

### 3. Performance

- Native driver
- Optimize re-renders
- Lazy loading

### 4. Accessibility

- Không quá nhanh
- Có thể tắt nếu cần
- Không gây choáng ngợp

---

## 🔥 Advanced Techniques

### Gesture Handler Integration

```typescript
import { GestureDetector, Gesture } from "react-native-gesture-handler";

const pan = Gesture.Pan().onUpdate((e) => {
  translateX.value = e.translationX;
});
```

### Shared Element Transitions

Có thể thêm cho navigation giữa screens.

### Layout Animations

```typescript
import { Layout } from "react-native-reanimated";

<Animated.View layout={Layout.springify()}>
  {/* Dynamic content */}
</Animated.View>;
```

---

## 📚 Resources

- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- [Animation Examples](https://github.com/software-mansion/react-native-reanimated/tree/main/example)

---

## 🎯 Quick Reference

| Component      | Animation        | Duration  | Delay Pattern    |
| -------------- | ---------------- | --------- | ---------------- |
| AnimatedCard   | FadeIn + SlideUp | 500ms     | Stagger 50-100ms |
| PressableScale | Scale            | Spring    | Instant          |
| Progress Bar   | Width            | Spring    | None             |
| Confetti       | Multiple         | 2-3s      | Stagger 50ms     |
| Loading        | Rotate           | 1s loop   | None             |
| Entrance       | FadeInUp         | 600-800ms | 0-600ms          |
| Exit           | FadeOut          | 300ms     | None             |

---

✨ **Kết quả**: App với animations mượt mà, chuyên nghiệp, tạo trải nghiệm tuyệt vời!





