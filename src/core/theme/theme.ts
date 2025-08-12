import { createTheme } from "@rneui/themed"
import { darkColors, lightColors } from "./colors"
import { borderRadius, fontSize, padding } from "./font"

export const getTheme = (option?: any) => {
    const { mode } = option
    return createTheme({
        lightColors: lightColors,
        darkColors: darkColors,
        mode: mode,
        components: {
            Text: (props, theme) => {
                return {
                    style: {
                        color: theme.colors.black,
                        fontSize: fontSize.medium,
                    },
                }
            },
            Button: (props, theme) => {
                return {
                    containerStyle: {
                        width: "100%",
                    },
                    style: {
                        backgroundColor: theme.colors.primary,
                        padding: padding.small,
                        borderRadius: borderRadius.base,
                    },
                    titleStyle: {
                        color: theme.colors.black,
                    },
                }
            },
        },
    })
}
