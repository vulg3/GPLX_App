# 🚀 Quick Start - Ứng Dụng Học Bằng Lái Xe

## ⚡ Cài Đặt Nhanh

```bash
# 1. Cài đặt dependencies mới
npm install

# Hoặc
yarn install

# 2. Chạy ứng dụng
npm run android   # Android
npm run ios       # iOS
```

## 📱 Tính Năng Chính

### ✅ Đã Hoàn Thành

1. **Chọn loại bằng lái** (A/A1 hoặc B/B1)
2. **Học câu hỏi** theo danh mục có giải thích
3. **Thi thử 25 câu** đúng cấu trúc (19 phút)
4. **Xem kết quả** và đáp án chi tiết
5. **Lịch sử thi** với thống kê

### 📊 Cấu Trúc Đề Thi (25 câu)

- 1 câu khái niệm
- 1 câu điểm liệt ⚠️
- 6 câu quy tắc giao thông
- 1 câu tốc độ
- 1 câu văn hóa
- 1 câu kỹ thuật
- 7 câu biển báo
- 7 câu sa hình/tình huống

### ✓ Điều kiện đạt

- Đúng ≥ 21/25 câu (84%)
- **Không sai câu điểm liệt**

## 🗂️ Cấu Trúc Code

```
src/
├── types/Question.ts           # TypeScript types
├── utils/
│   ├── examGenerator.ts        # Tạo đề thi 25 câu
│   └── storage.ts              # AsyncStorage helpers
└── screens/
    ├── LicenseSelection.tsx    # Chọn loại bằng
    ├── Home.tsx                # Dashboard
    ├── Study.tsx               # Danh mục học
    ├── QuestionList.tsx        # Chi tiết câu hỏi
    ├── Exam.tsx                # Màn thi thử
    ├── ExamResult.tsx          # Kết quả
    ├── ReviewAnswers.tsx       # Xem đáp án
    └── ExamHistory.tsx         # Lịch sử

assets/data/
├── shlx.bike_questions.json    # 200+ câu xe máy
└── shlx.car_questions.json     # 400+ câu ô tô
```

## 🔧 Dependencies Mới

Đã thêm vào `package.json`:

- `@react-navigation/stack`: Navigation stack
- `react-native-gesture-handler`: Gestures cho navigation

## 🎯 Flow Sử Dụng

```
1. Chọn bằng A/A1 hoặc B/B1
   ↓
2. Home (Dashboard với thống kê)
   ↓
3a. Học → Chọn danh mục → Xem câu hỏi
3b. Thi thử → Làm 25 câu → Xem kết quả → Review đáp án
   ↓
4. Lịch sử (xem lại bài cũ)
```

## 💡 Tips

- **Điểm liệt**: Có icon ⚠️ màu đỏ
- **Timer**: Đếm ngược 19 phút tự động
- **Điều hướng**: Chạm số câu để nhảy nhanh
- **Lưu tự động**: Dữ liệu lưu local, không mất
- **Hình ảnh**: Cần internet để tải

## 🐛 Troubleshooting

### Lỗi navigation?

```bash
# Xóa cache và reinstall
rm -rf node_modules
npm install
```

### App không chạy?

```bash
# Reset Metro bundler
npx expo start -c
```

### Lỗi TypeScript?

Có thể bỏ qua type errors tạm thời bằng `// @ts-ignore` hoặc fix theo gợi ý.

## 📝 Customize

### Đổi thời gian thi

`src/screens/Exam.tsx` line ~35:

```typescript
const [timeRemaining, setTimeRemaining] = useState(19 * 60); // 19 phút
```

### Đổi cấu trúc đề

`src/utils/examGenerator.ts`:

```typescript
export const EXAM_STRUCTURE = {
  "khai-niem": 1,
  "diem-liet": 1,
  // ... thay đổi số lượng
};
```

### Đổi điều kiện đạt

`src/utils/examGenerator.ts` line ~90:

```typescript
const passed = correctAnswers >= 21 && !hasFailedCritical;
```

## ✨ Next Steps

Có thể mở rộng:

- [ ] Thêm chế độ ôn tập có chấm điểm
- [ ] Export kết quả PDF
- [ ] Thêm âm thanh/animation
- [ ] Chế độ offline hoàn toàn
- [ ] Chia sẻ kết quả

---

💬 **Cần hỗ trợ?** Xem file `SETUP_GUIDE.md` để biết chi tiết hơn!





