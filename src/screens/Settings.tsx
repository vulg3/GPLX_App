import { responsive } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PressableScale } from "../components";
import { APP_INFO, LEGAL_URLS } from "../constants/legalUrls";
import { useTheme } from "../contexts/ThemeContext";

export default function Settings() {
  const navigation = useNavigation();
  const { isDarkMode, setTheme, theme } = useTheme();

  const toggleTheme = async () => {
    try {
      const newTheme = isDarkMode ? "light" : "dark";
      await setTheme(newTheme);
      Alert.alert(
        "Chủ đề",
        `Đã chuyển sang chế độ ${!isDarkMode ? "tối" : "sáng"}`
      );
    } catch (error) {
      Alert.alert("Lỗi", "Không thể thay đổi chủ đề");
    }
  };

  const handleOpenLink = (title: string, url: string) => {
    // @ts-ignore - Navigation types not properly configured
    navigation.navigate("WebViewScreen", { url, title });
  };

  const handleClearData = () => {
    Alert.alert(
      "Xóa dữ liệu",
      "Bạn có chắc chắn muốn xóa tất cả dữ liệu lịch sử thi?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const keys = await AsyncStorage.getAllKeys();
              const historyKeys = keys.filter((key) =>
                key.startsWith("exam_history_")
              );
              await AsyncStorage.multiRemove(historyKeys);
              Alert.alert("Thành công", "Đã xóa tất cả dữ liệu lịch sử thi");
            } catch (error) {
              Alert.alert("Lỗi", "Không thể xóa dữ liệu");
            }
          },
        },
      ]
    );
  };

  const backgroundColor = isDarkMode ? "#1a1a1a" : "#f8f9fa";
  const cardBackground = isDarkMode ? "#2a2a2a" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#1a1a1a";
  const subTextColor = isDarkMode ? "#aaa" : "#666";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <Text style={styles.headerTitle}>⚙️ Cài đặt</Text>
            <Text style={styles.headerSubtitle}>
              Tùy chỉnh ứng dụng theo ý bạn
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Settings Section */}
        <View style={styles.content}>
          {/* Theme Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Giao diện
            </Text>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  size={24}
                  color={isDarkMode ? "#FFD700" : "#FF9500"}
                />
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: textColor }]}>
                    Chế độ tối
                  </Text>
                  <Text
                    style={[styles.settingDescription, { color: subTextColor }]}
                  >
                    {isDarkMode ? "Đang bật" : "Đang tắt"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#d1d1d6", true: "#667eea" }}
                thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          {/* About Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Thông tin
            </Text>

            <PressableScale>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color="#007AFF"
                  />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, { color: textColor }]}>
                      Phiên bản
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { color: subTextColor },
                      ]}
                    >
                      {APP_INFO.VERSION}
                    </Text>
                  </View>
                </View>
              </View>
            </PressableScale>
          </View>

          {/* Legal Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Pháp lý
            </Text>

            <PressableScale
              onPress={() =>
                handleOpenLink("Chính sách bảo mật", LEGAL_URLS.PRIVACY_POLICY)
              }
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="shield-checkmark" size={24} color="#34C759" />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, { color: textColor }]}>
                      Chính sách bảo mật
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { color: subTextColor },
                      ]}
                    >
                      Xem chính sách bảo mật
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={subTextColor}
                />
              </View>
            </PressableScale>

            <View style={styles.divider} />

            <PressableScale
              onPress={() =>
                handleOpenLink(
                  "Điều khoản sử dụng",
                  LEGAL_URLS.TERMS_OF_SERVICE
                )
              }
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="document-text" size={24} color="#007AFF" />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, { color: textColor }]}>
                      Điều khoản sử dụng
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { color: subTextColor },
                      ]}
                    >
                      Xem điều khoản sử dụng
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={subTextColor}
                />
              </View>
            </PressableScale>

            <View style={styles.divider} />

            <PressableScale
              onPress={() =>
                handleOpenLink("Tuyên bố từ chối", LEGAL_URLS.DISCLAIMER)
              }
            >
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="warning" size={24} color="#FF9500" />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, { color: textColor }]}>
                      Tuyên bố từ chối
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { color: subTextColor },
                      ]}
                    >
                      Xem tuyên bố từ chối
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={subTextColor}
                />
              </View>
            </PressableScale>
          </View>

          {/* Data Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Dữ liệu
            </Text>

            <PressableScale onPress={handleClearData}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Ionicons name="trash" size={24} color="#FF3B30" />
                  <View style={styles.settingTextContainer}>
                    <Text style={[styles.settingTitle, { color: "#FF3B30" }]}>
                      Xóa dữ liệu lịch sử
                    </Text>
                    <Text
                      style={[
                        styles.settingDescription,
                        { color: subTextColor },
                      ]}
                    >
                      Xóa tất cả lịch sử thi đã lưu
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={subTextColor}
                />
              </View>
            </PressableScale>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: subTextColor }]}>
              {APP_INFO.COMPANY_NAME} © {APP_INFO.COPYRIGHT_YEAR}
            </Text>
            <Text style={[styles.footerText, { color: subTextColor }]}>
              Made with ❤️ in Vietnam
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: responsive.padding.lg,
    paddingTop: responsive.padding.sm,
    paddingBottom: responsive.padding.xl,
  },
  headerTitle: {
    fontSize: responsive.fontSize["4xl"],
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: responsive.fontSize.base,
    color: "#fff",
    opacity: 0.9,
  },
  content: {
    padding: responsive.padding.base,
  },
  section: {
    borderRadius: responsive.radius.base,
    padding: responsive.padding.base,
    marginBottom: responsive.spacing.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.base,
    fontWeight: "bold",
    marginBottom: responsive.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: responsive.spacing.sm,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: responsive.spacing.base,
    flex: 1,
  },
  settingTitle: {
    fontSize: responsive.fontSize.base,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: responsive.fontSize.sm,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
