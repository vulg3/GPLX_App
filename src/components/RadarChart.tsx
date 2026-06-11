import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Line,
  Polygon,
  Text as SvgText,
  TSpan,
} from "react-native-svg";
import { useTheme } from "../contexts/ThemeContext";
import { TopicStats } from "../types/Question";

interface RadarChartProps {
  data: TopicStats[];
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 300 }) => {
  const { colors } = useTheme();
  const center = size / 2;
  const radius = (size / 2) * 0.7; // Leave space for labels
  const numAxes = data.length;
  const angleStep = numAxes > 0 ? (Math.PI * 2) / numAxes : 0;

  if (numAxes === 0) {
    return (
      <View
        style={[styles.container, { height: size, justifyContent: "center" }]}
      >
        <Text style={{ color: colors.textSecondary }}>Chưa có dữ liệu</Text>
      </View>
    );
  }

  // Calculate coordinates for a point on an axis
  const getCoordinates = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [20, 40, 60, 80, 100];

  // Create polygon points for the data
  const dataPoints = data
    .map((d, i) => {
      const coords = getCoordinates(i, d.percentage);
      return `${coords.x},${coords.y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Draw grid lines (hexagons/polygons) */}
        {gridLevels.map((level) => {
          const points = data
            .map((_, i) => {
              const coords = getCoordinates(i, level);
              return `${coords.x},${coords.y}`;
            })
            .join(" ");
          return (
            <Polygon
              key={`grid-${level}`}
              points={points}
              fill="none"
              stroke={colors.border}
              strokeWidth="1"
              strokeDasharray={level === 100 ? "0" : "2,2"}
              opacity={0.3}
            />
          );
        })}

        {/* Draw axes */}
        {data.map((_, i) => {
          const coords = getCoordinates(i, 100);
          return (
            <Line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={coords.x}
              y2={coords.y}
              stroke={colors.border}
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Draw data polygon */}
        <Polygon
          points={dataPoints}
          fill={colors.primary}
          fillOpacity={0.3}
          stroke={colors.primary}
          strokeWidth="3"
        />

        {/* Draw data points */}
        {data.map((d, i) => {
          const coords = getCoordinates(i, d.percentage);
          return (
            <Circle
              key={`point-${i}`}
              cx={coords.x}
              cy={coords.y}
              r="4"
              fill={colors.primary}
            />
          );
        })}

        {/* Draw labels */}
        {data.map((d, i) => {
          const coords = getCoordinates(i, 115); // Place label outside the chart
          // Adjust labels at the bottom to not overlap
          let textAnchor: "start" | "middle" | "end" = "middle";
          if (coords.x < center - 20) textAnchor = "end";
          if (coords.x > center + 20) textAnchor = "start";

          return (
            <SvgText
              key={`label-${i}`}
              x={coords.x}
              y={coords.y}
              fill={colors.text}
              fontSize="10"
              fontWeight="bold"
              textAnchor={textAnchor}
            >
              {d.displayName.split(" & ").length > 1 ? (
                <>
                  <TSpan x={coords.x} dy="-5" textAnchor={textAnchor}>
                    {d.displayName.split(" & ")[0] + " &"}
                  </TSpan>
                  <TSpan x={coords.x} dy="12" textAnchor={textAnchor}>
                    {d.displayName.split(" & ")[1]}
                  </TSpan>
                </>
              ) : d.displayName.split(" ").length > 2 ? (
                <>
                  <TSpan x={coords.x} dy="-5" textAnchor={textAnchor}>
                    {d.displayName.split(" ").slice(0, 2).join(" ")}
                  </TSpan>
                  <TSpan x={coords.x} dy="12" textAnchor={textAnchor}>
                    {d.displayName.split(" ").slice(2).join(" ")}
                  </TSpan>
                </>
              ) : (
                d.displayName
              )}
            </SvgText>
          );
        })}
      </Svg>

      {/* Legend / Warnings */}
      <View style={styles.warningContainer}>
        {data
          .filter((d) => d.percentage < 50)
          .map((d, i) => (
            <Text key={i} style={[styles.warningText, { color: colors.error }]}>
              ⚠️ Cần ôn tập kỹ: {d.displayName} ({Math.round(d.percentage)}%)
            </Text>
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  warningContainer: {
    marginTop: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
});

export default RadarChart;
