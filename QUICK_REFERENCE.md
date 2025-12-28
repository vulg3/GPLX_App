# ⚡ Quick Reference - Tham Khảo Nhanh

## 🚀 Bắt Đầu Ngay (30 giây)

```bash
npm install
npm run android  # hoặc npm run ios
```

---

## 📱 App Flow

```
LicenseSelection → Home → Study/Exam → Results
                            ↓            ↓
                    QuestionList    ReviewAnswers
```

---

## 🎬 Animation Components

| Component           | Import                           | Usage                                   |
| ------------------- | -------------------------------- | --------------------------------------- |
| AnimatedCard        | `import { AnimatedCard }`        | `<AnimatedCard delay={100}>`            |
| PressableScale      | `import { PressableScale }`      | `<PressableScale onPress={...}>`        |
| ConfettiEffect      | `import { ConfettiEffect }`      | `{show && <ConfettiEffect />}`          |
| LoadingSpinner      | `import { LoadingSpinner }`      | `<LoadingSpinner />`                    |
| AnimatedProgressBar | `import { AnimatedProgressBar }` | `<AnimatedProgressBar progress={50} />` |

**Import từ**: `"../components"`

---

## 🎨 Gradient Colors

```typescript
// Copy-paste ready
colors={["#007AFF", "#5856D6"]}  // Blue
colors={["#34C759", "#28a745"]}  // Green
colors={["#FF9500", "#ff6b6b"]}  // Orange
colors={["#FF3B30", "#dc2626"]}  // Red
colors={["#667eea", "#764ba2"]}  // Purple
colors={["#f093fb", "#f5576c"]}  // Pink
```

---

## ⏱️ Animation Timing

```typescript
// Fast interactions
.duration(300)

// Normal cards
.duration(600)

// Screen transitions
.duration(800)

// Stagger delay
delay={index * 50}  // Lists
delay={index * 100} // Cards
```

---

## 💫 Common Patterns

### Animated Card with Delay

```typescript
<AnimatedCard delay={100}>
  <Text>Content</Text>
</AnimatedCard>
```

### Pressable Button

```typescript
<PressableScale onPress={handlePress}>
  <LinearGradient colors={["#007AFF", "#5856D6"]}>
    <Text>Button</Text>
  </LinearGradient>
</PressableScale>
```

### Staggered List

```typescript
{
  items.map((item, index) => (
    <AnimatedCard key={item.id} delay={index * 80}>
      <ItemContent />
    </AnimatedCard>
  ));
}
```

### Animated Text

```typescript
<Animated.Text entering={FadeInUp.delay(200)}>Hello</Animated.Text>
```

---

## 🎯 Exam Structure

| Category   | Count | Type            |
| ---------- | ----- | --------------- |
| Khái niệm  | 1     | Concept         |
| Điểm liệt  | 1     | **Critical** ⚠️ |
| Quy tắc    | 6     | Rules           |
| Tốc độ     | 1     | Speed           |
| Văn hóa    | 1     | Culture         |
| Kỹ thuật   | 1     | Technical       |
| Biển báo   | 7     | Signs           |
| Tình huống | 7     | Scenarios       |

**Total**: 25 questions  
**Time**: 19 minutes  
**Pass**: ≥21 correct + 0 critical wrong

---

## 📂 File Locations

### Components

```
src/components/
├── AnimatedCard.tsx
├── PressableScale.tsx
├── AnimatedProgressBar.tsx
├── ConfettiEffect.tsx
├── LoadingSpinner.tsx
├── GradientBackground.tsx
├── Badge.tsx
└── index.tsx
```

### Screens

```
src/screens/
├── LicenseSelection.tsx
├── Home.tsx
├── Study.tsx
├── QuestionList.tsx
├── Exam.tsx
├── ExamResult.tsx
├── ReviewAnswers.tsx
├── ExamHistory.tsx
└── index.ts
```

### Utils

```
src/utils/
├── examGenerator.ts
└── storage.ts
```

### Types

```
src/types/
└── Question.ts
```

---

## 🔧 Common Tasks

### Add New Animation

```typescript
import Animated, { FadeInUp } from "react-native-reanimated";

<Animated.View entering={FadeInUp.springify()}>{/* content */}</Animated.View>;
```

### Add New Gradient

```typescript
import { LinearGradient } from "expo-linear-gradient";

<LinearGradient
  colors={["#start", "#end"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  {/* content */}
</LinearGradient>;
```

### Add Stagger Effect

```typescript
{
  items.map((item, i) => (
    <AnimatedCard key={item.id} delay={i * 50}>
      {/* content */}
    </AnimatedCard>
  ));
}
```

### Add Press Feedback

```typescript
import { PressableScale } from "../components";

<PressableScale onPress={handlePress}>{/* button content */}</PressableScale>;
```

---

## 🐛 Troubleshooting

### Installation Issues

```bash
rm -rf node_modules
npm install
```

### Metro Bundler Issues

```bash
npx expo start -c
```

### Build Issues

```bash
cd android && ./gradlew clean && cd ..
# or
cd ios && pod install && cd ..
```

### Type Errors

- Check `tsconfig.json`
- Restart TypeScript server
- Clear cache

---

## 📊 Stats at a Glance

| Metric        | Value        |
| ------------- | ------------ |
| Screens       | 8 (new)      |
| Components    | 7 (animated) |
| Animations    | 50+          |
| Gradients     | 30+          |
| Questions (A) | ~200         |
| Questions (B) | ~400         |
| Lines of Code | ~3000+       |
| Documentation | 7 files      |
| Linter Errors | 0 ✅         |

---

## 🎨 Screen Colors

| Screen           | Primary Color | Gradient            |
| ---------------- | ------------- | ------------------- |
| LicenseSelection | Purple        | `#667eea → #764ba2` |
| Home             | Purple        | `#667eea → #764ba2` |
| Study            | Multi         | Category-based      |
| QuestionList     | Blue/Red      | Context-based       |
| Exam             | Blue          | `#007AFF → #5856D6` |
| ExamResult       | Green/Red     | Pass/Fail           |
| ReviewAnswers    | Green/Red     | Correct/Wrong       |
| ExamHistory      | Green/Red     | Pass/Fail           |

---

## 💡 Pro Tips

### Performance

1. Use `PressableScale` thay vì tự tạo animation
2. Reuse `AnimatedCard` cho consistency
3. Stick với timing guidelines
4. Test trên thiết bị thật

### Design

1. Follow gradient color palette
2. Use semantic colors (green=good, red=bad)
3. Consistent spacing (multiples of 8)
4. Maintain visual hierarchy

### Development

1. Check documentation khi cần
2. Copy patterns từ existing screens
3. Test animations trên device
4. Keep animations subtle

---

## 📞 Help

- 📖 Full docs: `README.md`
- 🚀 Quick start: `QUICK_START.md`
- 🎨 UI details: `UI_IMPROVEMENTS.md`
- 🎬 Animations: `ANIMATION_GUIDE.md`
- 📋 Todo: `TODO.md`

---

## ✅ Checklist Before Deploy

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] All animations smooth
- [ ] No console errors
- [ ] Data persists correctly
- [ ] Images load properly
- [ ] Timer works accurately
- [ ] Confetti plays on pass
- [ ] Navigation flows correctly
- [ ] Exam structure validates

---

**Quick Reference Version**: 1.0  
**Last Updated**: 2025-10-20

🎉 **You're all set! Happy coding!** 🎉




