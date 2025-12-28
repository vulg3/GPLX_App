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

export default function Disclaimer() {
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
          Tuyên bố từ chối
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

        <View
          style={[
            styles.warningBox,
            { backgroundColor: isDarkMode ? "#2a2a2a" : "#fff3cd" },
          ]}
        >
          <Ionicons name="warning" size={32} color="#ff9500" />
          <Text
            style={[
              styles.warningText,
              { color: isDarkMode ? "#ffd700" : "#856404" },
            ]}
          >
            Vui lòng đọc kỹ tuyên bố từ chối này trước khi sử dụng ứng dụng
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            1. Mục đích của ứng dụng
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng {APP_INFO.COMPANY_NAME} được phát triển với mục đích hỗ trợ
            người dùng trong việc học tập và ôn luyện kiến thức cho kỳ thi giấy
            phép lái xe. Đây là công cụ tham khảo và không thay thế cho khóa học
            chính thức hoặc tài liệu từ cơ quan có thẩm quyền.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            2. Độ chính xác của thông tin
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi nỗ lực cung cấp thông tin chính xác và cập nhật nhất. Tuy
            nhiên:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Nội dung có thể chứa lỗi hoặc thiếu sót
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Quy định giao thông có thể thay đổi theo thời gian
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Câu hỏi có thể khác với đề thi thực tế
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Không đảm bảo 100% đúng với đề thi chính thức
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            3. Không đảm bảo kết quả
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            {APP_INFO.COMPANY_NAME} KHÔNG ĐẢM BẢO rằng việc sử dụng ứng dụng sẽ
            giúp bạn vượt qua kỳ thi giấy phép lái xe. Kết quả thi phụ thuộc vào
            nhiều yếu tố bao gồm:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Khả năng học tập cá nhân
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thời gian và nỗ lực bỏ ra
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Kiến thức nền tảng về giao thông
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Điều kiện thi thực tế
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            4. Giới hạn trách nhiệm
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            {APP_INFO.COMPANY_NAME} và các nhà phát triển KHÔNG CHỊU TRÁCH
            NHIỆM:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Kết quả thi không như mong muốn
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thiệt hại trực tiếp hoặc gián tiếp do sử dụng ứng dụng
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Mất mát thời gian, công sức hoặc tài chính
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Quyết định dựa trên thông tin từ ứng dụng
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Vi phạm luật giao thông do áp dụng sai kiến thức
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            5. Khuyến nghị
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi khuyến nghị người dùng:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Tham khảo tài liệu chính thức từ cơ quan có thẩm quyền
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Tham gia khóa học lái xe chính thức
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Cập nhật luật giao thông mới nhất
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thực hành lái xe với giáo viên có chứng chỉ
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Xác minh thông tin quan trọng từ nhiều nguồn
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            6. Cập nhật nội dung
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Luật giao thông và quy định thi có thể thay đổi mà không thông báo
            trước. Chúng tôi sẽ cố gắng cập nhật ứng dụng thường xuyên, nhưng
            không thể đảm bảo rằng tất cả thông tin luôn được cập nhật kịp thời.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            7. Sử dụng tùy thuộc rủi ro
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Bạn sử dụng ứng dụng này với rủi ro của riêng mình. Ứng dụng được
            cung cấp "NGUYÊN TRẠNG" và "NHƯ CÓ SẴN" mà không có bất kỳ bảo đảm
            nào, dù rõ ràng hay ngụ ý, bao gồm nhưng không giới hạn các bảo đảm
            về tính thương mại, phù hợp cho mục đích cụ thể hoặc không vi phạm.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            8. Liên kết đến trang web bên thứ ba
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng có thể chứa liên kết đến các trang web hoặc dịch vụ của bên
            thứ ba. Chúng tôi không kiểm soát và không chịu trách nhiệm về nội
            dung, chính sách bảo mật hoặc thực hành của bất kỳ trang web hoặc
            dịch vụ bên thứ ba nào.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            9. Quảng cáo
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng hiển thị quảng cáo từ bên thứ ba (Google AdMob). Chúng tôi
            không kiểm soát nội dung quảng cáo và không chịu trách nhiệm về bất
            kỳ sản phẩm hoặc dịch vụ được quảng cáo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            10. Chấp nhận tuyên bố
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Bằng việc sử dụng ứng dụng {APP_INFO.COMPANY_NAME}, bạn xác nhận
            rằng bạn đã đọc, hiểu và đồng ý với Tuyên bố Từ chối này. Nếu bạn
            không đồng ý, vui lòng ngừng sử dụng ứng dụng ngay lập tức.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            11. Liên hệ
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Nếu bạn có bất kỳ câu hỏi nào về Tuyên bố Từ chối này:
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
    marginBottom: responsive.spacing.base,
    textAlign: "center",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: responsive.padding.base,
    borderRadius: 12,
    marginBottom: responsive.spacing.xl,
    gap: 12,
  },
  warningText: {
    flex: 1,
    fontSize: responsive.fontSize.base,
    fontWeight: "600",
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
