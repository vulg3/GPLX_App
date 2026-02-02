import { responsive } from "@/utils/responsive";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { APP_INFO } from "../constants/legalUrls";
import { useAdsVisibility } from "../contexts/AdsVisibilityContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Settings() {
  const navigation = useNavigation();
  const { isDarkMode, setTheme, theme } = useTheme();
  const { adsHidden, setAdsHiddenState } = useAdsVisibility();
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [passwordInput, setPasswordInput] = React.useState("");

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

  const handleNavigate = (screen: string) => {
    // @ts-ignore
    navigation.navigate(screen);
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

  const handleToggleAds = () => {
    if (adsHidden) {
      // If ads are hidden, show them again
      setAdsHiddenState(false);
      Alert.alert("Thành công", "Đã hiển thị lại quảng cáo");
    } else {
      // Show input modal to enter password
      setShowPasswordModal(true);
      setPasswordInput("");
    }
  };

  const handlePasswordSubmit = async () => {
    if (passwordInput === "hault") {
      await setAdsHiddenState(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      Alert.alert("Thành công", "Đã ẩn tất cả quảng cáo");
    } else {
      Alert.alert("Lỗi", "Mật khẩu không đúng");
      setPasswordInput("");
    }
  };

  const backgroundColor = isDarkMode ? "#1a1a1a" : "#f8f9fa";
  const cardBackground = isDarkMode ? "#2a2a2a" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#1a1a1a";
  const subTextColor = isDarkMode ? "#aaa" : "#666";
  const borderColor = isDarkMode ? "#444" : "#eee";

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundColor}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            Cài đặt
          </Text>
        </View>

        {/* Settings Section */}
        <View style={styles.content}>
          {/* Theme Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name={isDarkMode ? "moon" : "sunny"}
                  size={24}
                  color="#667eea"
                />
                <Text style={[styles.settingTitle, { color: textColor }]}>
                  Chế độ tối
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#d1d1d6", true: "#667eea" }}
                thumbColor={"#fff"}
              />
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Thông tin
            </Text>

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Ionicons name="information-circle" size={24} color="#007AFF" />
                <Text style={[styles.settingTitle, { color: textColor }]}>
                  Phiên bản
                </Text>
              </View>
              <Text style={[styles.settingValue, { color: subTextColor }]}>
                {APP_INFO.VERSION}
              </Text>
            </View>
          </View>

          {/* Legal Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Pháp lý
            </Text>

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => handleNavigate("PrivacyPolicy")}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="shield-checkmark" size={24} color="#34C759" />
                <Text style={[styles.settingTitle, { color: textColor }]}>
                  Chính sách bảo mật
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => handleNavigate("TermsOfUse")}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="document-text" size={24} color="#007AFF" />
                <Text style={[styles.settingTitle, { color: textColor }]}>
                  Điều khoản sử dụng
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: borderColor }]} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => handleNavigate("Disclaimer")}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="warning" size={24} color="#FF9500" />
                <Text style={[styles.settingTitle, { color: textColor }]}>
                  Tuyên bố từ chối
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            </TouchableOpacity>
          </View>

          {/* Ads Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleToggleAds}
            >
              <View style={styles.settingLeft}>
                <Ionicons
                  name={adsHidden ? "eye-off" : "eye"}
                  size={24}
                  color={adsHidden ? "#34C759" : "#8E8E93"}
                />
                <Text style={[styles.settingTitle, { color: textColor }]}>
                  {adsHidden ? "Quảng cáo đã ẩn" : "Ẩn quảng cáo"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            </TouchableOpacity>
          </View>

          {/* Data Section */}
          <View style={[styles.section, { backgroundColor: cardBackground }]}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleClearData}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="trash" size={24} color="#FF3B30" />
                <Text style={[styles.settingTitle, { color: "#FF3B30" }]}>
                  Xóa dữ liệu lịch sử
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={subTextColor} />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: subTextColor }]}>
              Phiên bản {APP_INFO.VERSION}
            </Text>
            <Text style={[styles.footerText, { color: subTextColor }]}>
              © {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.COMPANY_NAME}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Password Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDarkMode
                ? "rgba(0,0,0,0.8)"
                : "rgba(0,0,0,0.5)",
            },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: cardBackground,
                borderColor: borderColor,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: textColor }]}>
              Ẩn quảng cáo
            </Text>
            <Text style={[styles.modalDescription, { color: subTextColor }]}>
              Nhập mật khẩu để ẩn tất cả quảng cáo:
            </Text>
            <TextInput
              style={[
                styles.passwordInput,
                {
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
                  color: textColor,
                  borderColor: borderColor,
                },
              ]}
              value={passwordInput}
              onChangeText={setPasswordInput}
              placeholder="Nhập mật khẩu"
              placeholderTextColor={subTextColor}
              secureTextEntry
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordInput("");
                }}
              >
                <Text style={[styles.modalButtonText, { color: subTextColor }]}>
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handlePasswordSubmit}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: responsive.padding.lg,
    paddingTop: responsive.padding.lg,
    paddingBottom: responsive.padding.base,
  },
  headerTitle: {
    fontSize: responsive.fontSize["3xl"],
    fontWeight: "bold",
  },
  content: {
    padding: responsive.padding.base,
  },
  section: {
    borderRadius: responsive.radius.base,
    marginBottom: responsive.spacing.base,
    paddingHorizontal: responsive.padding.base,
    paddingVertical: responsive.padding.sm,
  },
  sectionTitle: {
    fontSize: responsive.fontSize.base,
    fontWeight: "600",
    marginBottom: responsive.spacing.sm,
    marginLeft: responsive.spacing.xs,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: responsive.padding.sm,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTitle: {
    fontSize: responsive.fontSize.base,
    marginLeft: responsive.spacing.sm,
  },
  settingValue: {
    fontSize: responsive.fontSize.base,
  },
  divider: {
    height: 1,
    marginVertical: responsive.spacing.sm,
  },
  footer: {
    alignItems: "center",
    marginTop: responsive.spacing["2xl"],
    marginBottom: responsive.spacing.lg,
  },
  footerText: {
    fontSize: responsive.fontSize.sm,
    marginVertical: responsive.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: responsive.padding.lg,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: responsive.radius.lg,
    padding: responsive.padding.lg,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: responsive.fontSize.xl,
    fontWeight: "bold",
    marginBottom: responsive.spacing.sm,
  },
  modalDescription: {
    fontSize: responsive.fontSize.base,
    marginBottom: responsive.spacing.base,
  },
  passwordInput: {
    borderWidth: 1,
    borderRadius: responsive.radius.base,
    padding: responsive.padding.base,
    fontSize: responsive.fontSize.base,
    marginBottom: responsive.spacing.base,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: responsive.spacing.sm,
  },
  modalButton: {
    paddingHorizontal: responsive.padding.lg,
    paddingVertical: responsive.padding.sm,
    borderRadius: responsive.radius.base,
    minWidth: 100,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "transparent",
  },
  modalButtonConfirm: {
    backgroundColor: "#667eea",
  },
  modalButtonText: {
    fontSize: responsive.fontSize.base,
    fontWeight: "600",
  },
});
