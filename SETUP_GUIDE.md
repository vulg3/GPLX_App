# 📚 Hướng Dẫn Cài Đặt Ứng Dụng Học Bằng Lái Xe

## 🎯 Tổng Quan

Ứng dụng học và thi thử bằng lái xe với đầy đủ tính năng:

- ✅ Học câu hỏi theo danh mục
- ✅ Thi thử 25 câu (đúng cấu trúc đề thi thật)
- ✅ Lưu lịch sử và tiến độ học tập
- ✅ Xem đáp án chi tiết có giải thích
- ✅ Hỗ trợ bằng A/A1 (xe máy) và B/B1 (ô tô)

## 📁 Cấu Trúc Đã Tạo

```
src/
├── types/
│   └── Question.ts          # Định nghĩa types
├── utils/
│   ├── examGenerator.ts     # Logic tạo đề thi
│   └── storage.ts           # Lưu trữ local
├── screens/
│   ├── LicenseSelection.tsx # Chọn loại bằng
│   ├── Home.tsx             # Màn hình chính
│   ├── Study.tsx            # Danh sách danh mục
│   ├── QuestionList.tsx     # Câu hỏi theo danh mục
│   ├── Exam.tsx             # Màn hình thi
│   ├── ExamResult.tsx       # Kết quả thi
│   ├── ReviewAnswers.tsx    # Xem đáp án chi tiết
│   ├── ExamHistory.tsx      # Lịch sử thi
│   └── index.ts             # Export screens
```

## 🔧 Cách Tích Hợp với Expo Router

### Phương án 1: Chuyển sang React Navigation (Khuyến nghị)

Vì code đã được viết với React Navigation, bạn nên cài đặt:

```bash
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-gesture-handler
```

Sau đó cập nhật `app/_layout.tsx`:

```typescript
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LicenseSelection,
  Home,
  Study,
  QuestionList,
  Exam,
  ExamResult,
  ReviewAnswers,
  ExamHistory,
} from "../src/screens";

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="LicenseSelection"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LicenseSelection" component={LicenseSelection} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Study" component={Study} />
        <Stack.Screen name="QuestionList" component={QuestionList} />
        <Stack.Screen name="Exam" component={Exam} />
        <Stack.Screen name="ExamResult" component={ExamResult} />
        <Stack.Screen name="ReviewAnswers" component={ReviewAnswers} />
        <Stack.Screen name="ExamHistory" component={ExamHistory} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Phương án 2: Tạo các file routing trong app/

Tạo các file sau trong thư mục `app/`:

```
app/
├── index.tsx                -> LicenseSelection
├── home.tsx                 -> Home
├── study.tsx                -> Study
├── question-list.tsx        -> QuestionList
├── exam.tsx                 -> Exam
├── exam-result.tsx          -> ExamResult
├── review-answers.tsx       -> ReviewAnswers
└── exam-history.tsx         -> ExamHistory
```

Mỗi file sẽ export component tương ứng từ `src/screens/`

## 📊 Cấu Trúc Đề Thi

Đề thi 25 câu được phân bổ theo đúng quy định:

1. **1 câu** về khái niệm
2. **1 câu** điểm liệt (sai 1 là trượt)
3. **6 câu** về quy tắc giao thông
4. **1 câu** về tốc độ, khoảng cách
5. **1 câu** về văn hóa giao thông
6. **1 câu** về kỹ thuật lái xe
7. **7 câu** về biển báo
8. **7 câu** về sa hình và tình huống

## 🎓 Điều Kiện Đạt

- ✅ Đúng ≥ 21/25 câu (84%)
- ✅ Không sai câu điểm liệt
- ⏱️ Thời gian: 19 phút

## 💾 Dữ Liệu

- **Câu hỏi A/A1**: `assets/data/shlx.bike_questions.json`
- **Câu hỏi B/B1**: `assets/data/shlx.car_questions.json`
- **Lưu trữ**: AsyncStorage (tự động)

## 🚀 Chạy Ứng Dụng

```bash
# Cài đặt dependencies
npm install

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios
```

## 🎨 Tính Năng

### 1. Chọn Loại Bằng

- Chọn bằng A/A1 (xe máy) hoặc B/B1 (ô tô)
- Lưu lựa chọn, có thể đổi sau

### 2. Học Câu Hỏi

- Xem theo danh mục
- Hiển thị đáp án đúng
- Có giải thích chi tiết
- Đánh dấu câu điểm liệt

### 3. Thi Thử

- 25 câu theo đúng cấu trúc
- Đếm ngược thời gian
- Điều hướng giữa các câu
- Xem trước tiến độ

### 4. Xem Kết Quả

- Điểm số và phân tích
- Xem lại từng câu
- Đối chiếu đáp án
- Lưu lịch sử

## 📱 Demo Flow

```
LicenseSelection → Home → Study/Exam
                            ↓
                    QuestionList/Exam
                            ↓
                    ExamResult → ReviewAnswers
```

## 🔍 Lưu Ý

- Dữ liệu được lưu local, không mất khi thoát app
- Hình ảnh câu hỏi load từ `600cauhoigplx.com`
- Cần kết nối internet để tải hình ảnh
- Có thể xem lịch sử 50 lần thi gần nhất

## 🐛 Debug

Nếu gặp lỗi navigation, kiểm tra:

1. Đã cài `@react-navigation/native`?
2. Đã import đúng screens?
3. Navigation params có đúng type?

## 📞 Hỗ Trợ

Nếu cần customize thêm, có thể chỉnh sửa:

- `src/utils/examGenerator.ts`: Logic tạo đề
- `src/utils/storage.ts`: Lưu trữ
- Styles trong mỗi screen

---

✨ **Chúc bạn học tập tốt và thi đạt kết quả cao!** ✨





