import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCard, PressableScale } from "../components";
import { LicenseType, Question } from "../types/Question";
import {
  getCategoryDisplayName,
  groupQuestionsByCategory,
} from "../utils/examGenerator";

export default function Study() {
  const route = useRoute();
  const navigation = useNavigation();
  const { questions } = route.params as {
    questions: Question[];
    licenseType: LicenseType;
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const groupedQuestions = useMemo(() => {
    return groupQuestionsByCategory(questions);
  }, [questions]);

  const categories = Object.keys(groupedQuestions).sort();

  const getCategoryIcon = (category: string): string => {
    if (category.includes("diem-liet")) return "⚠️";
    if (category.includes("khai-niem")) return "📚";
    if (category.includes("bien-bao")) return "🚸";
    if (category.includes("tinh-huong")) return "🚦";
    if (category.includes("van-hoa")) return "🤝";
    if (category.includes("ky-thuat")) return "🔧";
    return "📖";
  };

  const getCategoryColor = (category: string): string => {
    if (category.includes("diem-liet")) return "#FF3B30";
    if (category.includes("khai-niem")) return "#007AFF";
    if (category.includes("bien-bao")) return "#FF9500";
    if (category.includes("tinh-huong")) return "#34C759";
    if (category.includes("van-hoa")) return "#5856D6";
    if (category.includes("ky-thuat")) return "#FF2D55";
    return "#8E8E93";
  };

  const handleCategoryPress = (category: string) => {
    // @ts-ignore - Navigation types not properly configured
    navigation.navigate("QuestionList", {
      questions: groupedQuestions[category],
      category,
    });
  };

  const renderCategoryItem = ({
    item: category,
    index,
  }: {
    item: string;
    index: number;
  }) => {
    const questionCount = groupedQuestions[category].length;
    const color = getCategoryColor(category);
    const icon = getCategoryIcon(category);
    const displayName = getCategoryDisplayName(category);

    return (
      <AnimatedCard key={index} delay={index * 80} style={{ marginBottom: 12 }}>
        <PressableScale
          style={styles.categoryCardInner}
          onPress={() => handleCategoryPress(category)}
        >
          <LinearGradient
            colors={["#fff", "#fafafa"]}
            style={[styles.categoryCard, { borderLeftColor: color }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.categoryLeft}>
              <LinearGradient
                colors={[color + "40", color + "20"]}
                style={styles.categoryIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.categoryIconText}>{icon}</Text>
              </LinearGradient>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{displayName}</Text>
                <Text style={styles.categoryCount}>
                  {questionCount} câu hỏi
                </Text>
              </View>
            </View>
            <Text style={styles.categoryArrow}>›</Text>
          </LinearGradient>
        </PressableScale>
      </AnimatedCard>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>‹ Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Học câu hỏi</Text>
        <View style={{ width: 80 }} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📚 Danh mục câu hỏi</Text>
        <Text style={styles.infoText}>
          Chọn danh mục để xem chi tiết các câu hỏi và đáp án
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 80,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  content: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: "#e3f2fd",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1976D2",
    lineHeight: 20,
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryCardInner: {
    borderRadius: 16,
    overflow: "hidden",
  },
  categoryCard: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderLeftWidth: 5,
    borderRadius: 16,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 14,
    color: "#666",
  },
  categoryArrow: {
    fontSize: 28,
    color: "#ccc",
    marginLeft: 8,
  },
});
