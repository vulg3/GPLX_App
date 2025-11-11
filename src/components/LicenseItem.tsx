import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { LicenseItemType } from "../models/LicenseItemType";
import AppIcon from "./AppIcon";

interface LicenseItemProps {
  description: LicenseItemType;
  isSelected: boolean;
  onPress: () => void;
}

const LicenseItem: React.FC<LicenseItemProps> = ({
  description,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text>{description.title}</Text>
        <Text>{description.description}</Text>
      </View>
      <View>
        {isSelected && (
          <AppIcon
            name="checkmark"
            type="ionicon"
            isPaddingIcon={false}
            size={25}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default LicenseItem;
