import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { makeStyles, useTheme } from "@rneui/themed";
import { View } from "@/components/Themed";
import { LicenseItemType } from "../models/LicenseItemType";
import AppIcon from "./AppIcon";

interface LicenseItemProps {
    description: LicenseItemType;
    isSelected: boolean;
    onPress: () => void;
}

const LicenseItem: React.FC<LicenseItemProps> = ({ description, isSelected, onPress }) => {
    const styles = useStyles();
    const { theme: { colors } } = useTheme()

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{description.title}</Text>
                <Text style={styles.description}>{description.description}</Text>
            </View>
            <View style={styles.iconWrapper}>
                {isSelected &&
                    <AppIcon
                        name="checkmark"
                        type="ionicon"
                        isPaddingIcon={false}
                        color={colors.black}
                        size={25}
                    />}
            </View>
        </TouchableOpacity>
    );
};

export default LicenseItem;

const useStyles = makeStyles(({ colors }) => ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.secondary,
        borderRadius: 12,
        marginVertical: 5,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.secondary,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.primary,
    },
    iconWrapper: {
        width: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    description: {
        fontSize: 14,
        fontWeight: "400",
        color: colors.primary,
        marginTop: 2,
    },
}));
