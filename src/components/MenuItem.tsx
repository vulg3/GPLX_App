import React from "react";
import { Text, TouchableOpacity, Image } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";
import { AntDesign } from "@expo/vector-icons";
import { MenuItemType } from "../models/MenuItemType";

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
            <AntDesign name="right" size={18} color="#333" style={styles.arrow} />
        </TouchableOpacity>
    );
};

export default MenuItem;

const useStyles = makeStyles(({ colors }) => ({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
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
        width: 42,
        height: 42,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        margin: 20,
        marginLeft: 10,
    },
    arrow: {
        marginLeft: 8,
    },
}));
