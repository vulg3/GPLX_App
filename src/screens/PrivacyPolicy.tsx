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

export default function PrivacyPolicy() {
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
          Chính sách bảo mật
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
            1. Thu thập thông tin
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng {APP_INFO.COMPANY_NAME} thu thập các thông tin sau để cải
            thiện trải nghiệm người dùng:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thông tin thiết bị (loại thiết bị, hệ điều hành)
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Dữ liệu sử dụng ứng dụng (số lần thi, kết quả thi)
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Thông tin cài đặt (chế độ hiển thị, ngôn ngữ)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            2. Sử dụng thông tin
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi sử dụng thông tin thu thập được để:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Cung cấp và cải thiện dịch vụ
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Phân tích và tối ưu hóa trải nghiệm người dùng
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Lưu trữ lịch sử thi và tiến độ học tập
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Hiển thị quảng cáo phù hợp (nếu có)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            3. Lưu trữ dữ liệu
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Tất cả dữ liệu cá nhân được lưu trữ cục bộ trên thiết bị của bạn.
            Chúng tôi không thu thập hay lưu trữ thông tin cá nhân trên máy chủ
            của mình trừ khi bạn chủ động đồng ý.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            4. Chia sẻ thông tin
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của
            bạn cho bên thứ ba. Thông tin có thể được chia sẻ với:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Các đối tác quảng cáo (Google AdMob) theo chính sách của họ
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Cơ quan chức năng khi có yêu cầu pháp lý
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            5. Bảo mật thông tin
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện
            pháp kỹ thuật và tổ chức phù hợp. Tuy nhiên, không có phương thức
            truyền tải qua internet nào là hoàn toàn an toàn.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            6. Quyền của người dùng
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Bạn có quyền:
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Truy cập và xem thông tin cá nhân của bạn
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Yêu cầu xóa dữ liệu cá nhân
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Từ chối thu thập dữ liệu không bắt buộc
          </Text>
          <Text style={[styles.bulletPoint, { color: textColor }]}>
            • Cập nhật thông tin cá nhân
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            7. Cookies và công nghệ tương tự
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Ứng dụng có thể sử dụng cookies và công nghệ tương tự để thu thập
            thông tin và cải thiện dịch vụ. Bạn có thể quản lý cookies trong cài
            đặt trình duyệt của mình.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            8. Thay đổi chính sách
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian.
            Chúng tôi sẽ thông báo về các thay đổi quan trọng bằng cách đăng
            thông báo trong ứng dụng.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            9. Liên hệ
          </Text>
          <Text style={[styles.paragraph, { color: textColor }]}>
            Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này, vui lòng
            liên hệ với chúng tôi qua:
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
