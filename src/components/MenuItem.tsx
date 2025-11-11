import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";
import { MenuItemType } from "../models/MenuItemType";
import AppIcon from "./AppIcon";

interface MenuItemProps {
  menu: MenuItemType;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ menu, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: menu.image }} />
      <Text>{menu.title}</Text>
      <AppIcon
        name="arrow-forward-ios"
        type="MaterialIcons"
        isPaddingIcon={false}
        size={25}
      />
    </TouchableOpacity>
  );
};

export default MenuItem;
