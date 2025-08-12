import React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { Edges, SafeAreaView } from "react-native-safe-area-context"

interface Props {
    children: React.ReactNode
    edges?: Edges
    isSafeArea?: boolean
    isLoading?: boolean
    containerStyle?: StyleProp<ViewStyle>
}

const Wrapper: React.FC<Props> = ({ children, edges = ["bottom", "top"], isSafeArea, containerStyle }) => {
    if (!isSafeArea) {
        return <View style={[{ flex: 1 }, containerStyle]}>{children}</View>
    }
    return (
        <SafeAreaView edges={edges} style={[{ flex: 1 }, containerStyle]}>
            {children}
        </SafeAreaView>
    )
}

export default Wrapper
