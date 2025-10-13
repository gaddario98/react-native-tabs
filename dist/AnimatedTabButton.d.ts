import React from "react";
import type { TabItemConfig } from "./Tabs";
import { TabTriggerSlotProps } from "expo-router/ui";
type AnimatedTabButtonProps = TabTriggerSlotProps & {
    tab: TabItemConfig;
    translateTitles?: boolean;
    cfg?: any;
    ns?: string;
    onTabChange?: (prev: string | undefined, next: string) => void;
};
declare const _default: React.MemoExoticComponent<({ tab, isFocused, onPress, onPressIn, onPressOut, translateTitles, ns, onTabChange, cfg, ...rest }: AnimatedTabButtonProps) => import("react/jsx-runtime").JSX.Element>;
export default _default;
