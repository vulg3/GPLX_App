import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { PressableScale } from "../components";
import { LicenseType } from "../types/Question";
import { getSelectedLicense, saveSelectedLicense } from "../utils/storage";

const { width } = Dimensions.get("window");

export default function LicenseSelection() {
  const navigation = useNavigation();
  const [selectedLicense, setSelectedLicense] = useState<LicenseType | null>(
    null
  );

  useEffect(() => {
    loadSelectedLicense();
  }, []);

  const loadSelectedLicense = async () => {
    const license = await getSelectedLicense();
    if (license) {
      setSelectedLicense(license);
    }
  };

  const handleSelectLicense = async (type: LicenseType) => {
    setSelectedLicense(type);
    await saveSelectedLicense(type);
    // Navigate to main tabs
    navigation.navigate("MainTabs" as never);
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.View entering={FadeInDown.duration(800).springify()}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200).duration(800).springify()}
          >
            <Text style={styles.title}>Chọn loại bằng lái</Text>
            <Text style={styles.subtitle}>
              Chọn loại bằng lái bạn muốn học tập và thi thử
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400).duration(800).springify()}
            style={styles.licenseContainer}
          >
            <PressableScale
              style={[
                styles.licenseCard,
                selectedLicense === "A" && styles.licenseCardSelected,
              ]}
              onPress={() => handleSelectLicense("A")}
            >
              <LinearGradient
                colors={
                  selectedLicense === "A"
                    ? ["#667eea", "#764ba2"]
                    : ["#fff", "#fff"]
                }
                style={styles.licenseGradient}
              >
                <View style={styles.licenseIconContainer}>
                  <Text style={styles.licenseIcon}>🏍️</Text>
                </View>
                <Text
                  style={[
                    styles.licenseTitle,
                    selectedLicense === "A" && styles.licenseTextSelected,
                  ]}
                >
                  Bằng A / A1
                </Text>
                <Text
                  style={[
                    styles.licenseDescription,
                    selectedLicense === "A" && styles.licenseDescSelected,
                  ]}
                >
                  Xe mô tô hai bánh, ba bánh, xe gắn máy
                </Text>
                <View
                  style={[
                    styles.licenseBadge,
                    selectedLicense === "A" && styles.licenseBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.licenseBadgeText,
                      selectedLicense === "A" &&
                        styles.licenseBadgeTextSelected,
                    ]}
                  >
                    Xe máy
                  </Text>
                </View>
              </LinearGradient>
            </PressableScale>

            <PressableScale
              style={[
                styles.licenseCard,
                selectedLicense === "B" && styles.licenseCardSelected,
              ]}
              onPress={() => handleSelectLicense("B")}
            >
              <LinearGradient
                colors={
                  selectedLicense === "B"
                    ? ["#f093fb", "#f5576c"]
                    : ["#fff", "#fff"]
                }
                style={styles.licenseGradient}
              >
                <View style={styles.licenseIconContainer}>
                  <Text style={styles.licenseIcon}>🚗</Text>
                </View>
                <Text
                  style={[
                    styles.licenseTitle,
                    selectedLicense === "B" && styles.licenseTextSelected,
                  ]}
                >
                  Bằng B / B1
                </Text>
                <Text
                  style={[
                    styles.licenseDescription,
                    selectedLicense === "B" && styles.licenseDescSelected,
                  ]}
                >
                  Xe ô tô con, xe ô tô tải nhỏ
                </Text>
                <View
                  style={[
                    styles.licenseBadge,
                    selectedLicense === "B" && styles.licenseBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.licenseBadgeText,
                      selectedLicense === "B" &&
                        styles.licenseBadgeTextSelected,
                    ]}
                  >
                    Ô tô
                  </Text>
                </View>
              </LinearGradient>
            </PressableScale>
          </Animated.View>

          {selectedLicense && (
            <Animated.Text
              entering={FadeInUp.delay(600).duration(600)}
              style={styles.hint}
            >
              Bạn có thể đổi loại bằng lái bất cứ lúc nào trong cài đặt
            </Animated.Text>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 40,
    textAlign: "center",
    paddingHorizontal: 20,
    opacity: 0.9,
  },
  licenseContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
    width: "100%",
  },
  licenseCard: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  licenseCardSelected: {
    transform: [{ scale: 1.02 }],
  },
  licenseGradient: {
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
  },
  licenseIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  licenseIcon: {
    fontSize: 40,
  },
  licenseTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  licenseTextSelected: {
    color: "#fff",
  },
  licenseDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  licenseDescSelected: {
    color: "#fff",
    opacity: 0.9,
  },
  licenseBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  licenseBadgeSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  licenseBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  licenseBadgeTextSelected: {
    color: "#fff",
  },
  hint: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    paddingHorizontal: 30,
    opacity: 0.8,
  },
});
