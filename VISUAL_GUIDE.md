# 🎨 Visual Guide - Hướng Dẫn Trực Quan

## 🎬 Animation Showcase

### 1. LicenseSelection Screen

```
┌─────────────────────────────────┐
│   🏍️  LOGO (FadeInDown)         │
│                                 │
│  "Chọn loại bằng lái"          │
│  (FadeInUp 200ms)               │
│                                 │
│  ┌──────┐      ┌──────┐        │
│  │ 🏍️  │      │ 🚗  │        │
│  │ A/A1 │      │ B/B1 │        │
│  └──────┘      └──────┘        │
│  (FadeInUp 400ms)               │
│                                 │
│  "Bạn có thể đổi..."           │
│  (FadeInUp 600ms - conditional)│
└─────────────────────────────────┘

Animation Flow:
0ms    → Logo appears
200ms  → Title fades in
400ms  → Cards slide up
600ms  → Hint appears (if selected)

Interactions:
- Press card → Scale to 0.95
- Release → Spring back to 1.0
- Selected → Gradient highlights
```

---

### 2. Home Screen

```
┌─────────────────────────────────┐
│ ╔═══ GRADIENT HEADER ═══╗     │
│ ║ Xin chào! 👋          [Đổi]║ │
│ ║ Bằng: A/A1                 ║ │
│ ║ 📚 200 câu hỏi             ║ │
│ ╚═══════════════════════════╝ │
│                                 │
│ ┌─ Thống kê ─────────────────┐│
│ │ 📝 10  ✅ 8  📈 85  🏆 92 ││
│ └────────────────────────────┘│
│ (AnimatedCard 100ms)            │
│                                 │
│ ┌─ 📖 Học câu hỏi ────────────┐│
│ │ Xem tất cả theo danh mục   ││
│ └────────────────────────────┘│
│ (AnimatedCard 200ms + Green)    │
│                                 │
│ ┌─ ✍️ Thi thử 25 câu ─────────┐│
│ │ Giống như thi thật         ││
│ └────────────────────────────┘│
│ (AnimatedCard 300ms + Orange)   │
│                                 │
│ ┌─ 📊 Lịch sử thi ────────────┐│
│ │ Xem lại bài đã làm         ││
│ └────────────────────────────┘│
│ (AnimatedCard 400ms + Blue)     │
└─────────────────────────────────┘

Stats Icons: Gradient backgrounds
Action Cards: Gradient fills
Press: Scale feedback
```

---

### 3. Exam Screen

```
┌─────────────────────────────────┐
│ [X] ⏱ 18:45 [Nộp bài]         │
│ ▓▓▓▓▓▓▓░░░░░ 15/25            │
│ (Animated progress bar)         │
├─────────────────────────────────┤
│                                 │
│ Câu 15/25  [⚠️ Điểm liệt]     │
│                                 │
│ "Người điều khiển..."          │
│                                 │
│ [Image nếu có]                  │
│                                 │
│ ○ Đáp án 1                     │
│ (FadeInUp 0ms)                  │
│ ○ Đáp án 2                     │
│ (FadeInUp 100ms)                │
│ ◉ Đáp án 3 (selected)          │
│ (FadeInUp 200ms + ZoomIn)       │
│ ○ Đáp án 4                     │
│ (FadeInUp 300ms)                │
│                                 │
├─────────────────────────────────┤
│ [← Câu trước]  [Câu sau →]    │
│                                 │
│ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤ ⬤     │
│ Gray=unanswered                 │
│ Green=answered                  │
│ Blue=current                    │
└─────────────────────────────────┘

Timer: Blue → Red (< 1 min)
Progress: Animated spring
Dots: 3 gradient states
Answers: Stagger 100ms
```

---

### 4. ExamResult Screen

```
┌─────────────────────────────────┐
│         🎊 CONFETTI! 🎊        │
│     (4 seconds animation)       │
│                                 │
│    ┌───────────────┐           │
│    │   🎉 (Zoom+   │           │
│    │     Rotate)    │           │
│    └───────────────┘           │
│   (Gradient circle)             │
│                                 │
│      Chúc mừng!                │
│  Bạn đã đạt yêu cầu            │
│                                 │
│        ╔═══╗                   │
│        ║ 92║                   │
│        ╚═══╝                   │
│       điểm                      │
│   (Scale animation)             │
│                                 │
│  ┌──────┬──────┬──────┐       │
│  │  23  │   2  │  25  │       │
│  │ Đúng │ Sai  │ Tổng │       │
│  └──────┴──────┴──────┘       │
│                                 │
├─────────────────────────────────┤
│ [🔍 Xem đáp án]                │
│ [🔄 Thi lại] [🏠 Trang chủ]   │
│ (FadeInUp 800ms)                │
└─────────────────────────────────┘

IF PASSED:
✅ Confetti effect!
✅ Green gradient icon
✅ Pulse animation

IF FAILED:
❌ Red gradient icon
❌ Warning message
```

---

## 🎨 Color Reference

### Status Colors

```
✅ Success:  #34C759 (Green)
❌ Error:    #FF3B30 (Red)
⚠️ Warning:  #FF9500 (Orange)
ℹ️ Info:     #007AFF (Blue)
⚡ Critical: #FF3B30 (Red + ⚠️)
```

### Backgrounds

```
Screen:  #f8f9fa (Light gray)
Card:    #ffffff (White)
Header:  Gradient
Empty:   #f0f0f0 (Light)
```

### Text

```
Primary:   #1a1a1a (Almost black)
Secondary: #666666 (Gray)
Tertiary:  #999999 (Light gray)
On Color:  #ffffff (White)
```

---

## 📐 Spacing Guide

### Component Spacing

```
Card Padding:    16-20px
Button Padding:  12-16px
Icon Size:       24-56px
Touch Target:    ≥ 44x44px
Gap Between:     12-16px
Screen Margin:   16px
```

### Visual Hierarchy

```
Section Gap:   24-32px
Card Gap:      12-16px
Element Gap:   8-12px
Text Spacing:  4-8px
```

---

## 🎯 Interactive States

### Button States

```
Default:  Normal style
Pressed:  Scale(0.95) + Spring
Disabled: Opacity(0.5) + Gray
Loading:  Spinner overlay
```

### Card States

```
Default:   Shadow level 2
Hover:     Shadow level 3 (web)
Selected:  Border + Gradient
Expanded:  SlideDown content
```

### Input States

```
Unselected: Gray border
Selected:   Blue border + Gradient overlay
Correct:    Green fill
Wrong:      Red fill
```

---

## 📱 Screen Dimensions

```typescript
const { width, height } = Dimensions.get("window");

Card Width:    width - 32 (16px margin each side)
Image Width:   width - 64 (for padding)
Modal Width:   width - 64 (max 400px)
Button Width:  Auto or full width
```

---

## 🎬 Animation Cheat Sheet

### Quick Copy-Paste

```typescript
// Fade in
<Animated.View entering={FadeIn}>

// Fade in from bottom
<Animated.View entering={FadeInUp.springify()}>

// Fade in from top
<Animated.View entering={FadeInDown.springify()}>

// Zoom in
<Animated.View entering={ZoomIn.springify()}>

// Stagger list
<AnimatedCard delay={index * 50}>

// Press feedback
<PressableScale onPress={...}>

// Gradient
<LinearGradient colors={["#007AFF", "#5856D6"]}>

// Progress
<AnimatedProgressBar progress={75} color="#34C759" />

// Loading
<LoadingSpinner />

// Confetti
{passed && <ConfettiEffect />}
```

---

## 🎯 Component Decision Tree

**Need a card?** → Use `AnimatedCard`

**Need a button?** → Wrap with `PressableScale`

**Need progress?** → Use `AnimatedProgressBar`

**Need gradient?** → Use `LinearGradient`

**Need loading?** → Use `LoadingSpinner`

**Need celebration?** → Use `ConfettiEffect`

**Need status?** → Use `Badge`

---

## 📚 Learn More

| Topic       | File                  |
| ----------- | --------------------- |
| Setup       | `SETUP_GUIDE.md`      |
| Quick Start | `QUICK_START.md`      |
| Animations  | `ANIMATION_GUIDE.md`  |
| Features    | `FEATURES_SUMMARY.md` |
| Changes     | `CHANGELOG.md`        |
| Future      | `TODO.md`             |

---

**Visual Guide Version**: 1.0  
**Matches App Version**: 2.0

🎨 **Design is not just what it looks like. Design is how it works.** - Steve Jobs



