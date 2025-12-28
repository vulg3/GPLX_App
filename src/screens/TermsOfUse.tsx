import { responsive } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { APP_INFO } from "../constants/legalUrls";
import { useTheme } from "../contexts/ThemeContext";

export default function TermsOfUse() {
  const navigation = useNavigation();
  const { isDarkMode, colors } = useTheme();

  const backgroundColor = isDarkMode ? "#1a1a1a" : "#f8f9fa";
  const textColor = isDarkMode ? "#fff" : "#1a1a1a";
  const subTextColor = isDarkMode ? "#aaa" : "#666";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Điều khoản sử dụng
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.updateDate, { color: subTextColor }]}>
          Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
        </Text>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            1. Chấp nhận điều khoản
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Bằng việc tải xuống, cài đặt và sử dụng ứng dụng{" "}
            {APP_INFO.COMPANY_NAME}, bạn đồng ý tuân thủ và bị ràng buộc bởi các
            Điều khoản Sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của
            các điều khoản này, vui lòng không sử dụng ứng dụng.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            2. Mục đích sử dụng
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng {APP_INFO.COMPANY_NAME} được thiết kế để hỗ trợ người dùng
            trong việc học tập và ôn luyện kiến thức cho kỳ thi giấy phép lái
            xe. Ứng dụng bao gồm:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Bộ câu hỏi ôn tập cho các loại giấy phép lái xe
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thi thử theo cấu trúc đề thi thực tế
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thống kê và theo dõi tiến độ học tập
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Lưu trữ lịch sử bài thi
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            3. Quyền và trách nhiệm của người dùng
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Khi sử dụng ứng dụng, bạn đồng ý:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Sử dụng ứng dụng cho mục đích hợp pháp và đúng đắn
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Không can thiệp vào hoạt động của ứng dụng
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Không sao chép, phân phối nội dung trái phép
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Không sử dụng ứng dụng cho mục đích thương mại
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Tuân thủ các quy định pháp luật hiện hành
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            4. Quyền sở hữu trí tuệ
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Tất cả nội dung trong ứng dụng bao gồm nhưng không giới hạn văn bản,
            hình ảnh, biểu tượng, thiết kế, mã nguồn đều thuộc quyền sở hữu của
            {APP_INFO.COMPANY_NAME} hoặc được cấp phép sử dụng hợp pháp. Nghiêm
            cấm mọi hành vi sao chép, phân phối mà không có sự cho phép.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            5. Nội dung và thông tin
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi nỗ lực cung cấp thông tin chính xác và cập nhật. Tuy
            nhiên:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Nội dung chỉ mang tính chất tham khảo
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Không thay thế cho tài liệu chính thức
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Có thể có sai sót hoặc chưa cập nhật
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Người dùng cần tự xác minh thông tin quan trọng
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            6. Quảng cáo
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng có thể hiển thị quảng cáo từ các đối tác của chúng tôi (như
            Google AdMob). Chúng tôi không chịu trách nhiệm về nội dung của các
            quảng cáo này. Việc tương tác với quảng cáo là do quyết định của
            bạn.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            7. Giới hạn trách nhiệm
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            {APP_INFO.COMPANY_NAME} không chịu trách nhiệm cho:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thiệt hại trực tiếp hoặc gián tiếp do sử dụng ứng dụng
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Mất mát dữ liệu hoặc thông tin
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Lỗi kỹ thuật hoặc gián đoạn dịch vụ
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Nội dung từ bên thứ ba
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            8. Chấm dứt sử dụng
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi có quyền chấm dứt hoặc đình chỉ quyền truy cập của bạn vào
            ứng dụng nếu phát hiện vi phạm các Điều khoản Sử dụng này mà không
            cần thông báo trước.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            9. Thay đổi điều khoản
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi có quyền sửa đổi các Điều khoản Sử dụng này bất cứ lúc
            nào. Các thay đổi sẽ có hiệu lực ngay khi được đăng tải trên ứng
            dụng. Việc bạn tiếp tục sử dụng ứng dụng sau khi có thay đổi đồng
            nghĩa với việc bạn chấp nhận các điều khoản mới.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            10. Luật áp dụng
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Các Điều khoản Sử dụng này được điều chỉnh bởi pháp luật Việt Nam.
            Mọi tranh chấp phát sinh sẽ được giải quyết tại tòa án có thẩm quyền
            tại Việt Nam.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            11. Liên hệ
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Sử dụng, vui lòng liên
            hệ:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Email: {APP_INFO.SUPPORT_EMAIL}
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Ứng dụng: {APP_INFO.COMPANY_NAME}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: subTextColor }]}>
            © {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.COMPANY_NAME}
          </Text>
          <Text style={[styles.footerText, { color: subTextColor }]}>
            Tất cả các quyền được bảo lưu
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: responsive.padding.base,
    paddingVertical: responsive.padding.base,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: responsive.fontSize.xl,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: responsive.padding.lg,
  },
  updateDate: {
    fontSize: responsive.fontSize.sm,
    fontStyle: "italic",
    marginBottom: responsive.spacing.lg,
    textAlign: "center",
  },
  section: {
    marginBottom: responsive.spacing.xl,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.lg,
    fontWeight: "bold",
    marginBottom: responsive.spacing.sm,
  },
  paragraph: {
    fontSize: responsive.fontSize.base,
    lineHeight: 24,
    marginBottom: responsive.spacing.sm,
  },
  bulletPoint: {
    fontSize: responsive.fontSize.base,
    lineHeight: 24,
    marginLeft: responsive.spacing.base,
    marginBottom: 4,
  },
  footer: {
    alignItems: "center",
    paddingVertical: responsive.spacing.xl,
    gap: 4,
  },
  footerText: {
    fontSize: responsive.fontSize.sm,
  },
});
