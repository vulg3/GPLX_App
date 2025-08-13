import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";
import { MenuItemType } from "../models/MenuItemType";
import AppIcon from "./AppIcon";

interface MenuItemProps {
    menu: MenuItemType;
    onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ menu, onPress }) => {
    const styles = useStyles();
    const { theme: { colors } } = useTheme();

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} >
            <Image source={{ uri: menu.image }} style={styles.image} />
            <Text style={styles.title}>{menu.title}</Text>
            <AppIcon
                name="arrow-forward-ios"
                type="MaterialIcons"
                isPaddingIcon={false}
                color={colors.black}
                size={25}
            />
        </TouchableOpacity>
    );
};

export default MenuItem;

const useStyles = makeStyles(({ colors }) => ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.secondary,
        borderRadius: 12,
        padding: 10,
        marginVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    image: {
        width: 70,
        height: 70,
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: "600",
        color: colors.black,
        margin: 20,
        marginLeft: 10,
    },
    arrow: {
        marginLeft: 8,
    },
}));
