import { Icon, normalize } from "@rneui/themed"
import React from "react"
import { ColorValue, StyleProp, ViewStyle } from "react-native"

interface AppIconProps {
    name: string
    type:
        | "ionicon"
        | "antdesign"
        | "entypo"
        | "feather"
        | "evilicon"
        | "font-awesome"
        | "font-awesome-5"
        | "material"
        | "material-community"
        | "MaterialIcons"
    isPaddingIcon?: boolean
    containerStyles?: StyleProp<ViewStyle>
    color?: number | ColorValue | undefined
    size?: number
    onPress?: () => void
}

const AppIcon: React.FC<AppIconProps> = ({
    name,
    type,
    isPaddingIcon = true,
    containerStyles,
    color,
    size = 24,
    onPress,
}) => {
    return (
        <Icon
            name={name}
            type={type}
            color={color}
            containerStyle={[containerStyles, { padding: isPaddingIcon ? 8 : 0 }]}
            size={normalize(size)}
            onPress={onPress}
        />
    )
}

export default AppIcon
