import { HrefObject } from "expo-router";
import React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
/**
 * Custom Tab Layout Component using expo-router/ui
 *
 * This component has been migrated from React Navigation tabs to expo-router/ui
 * to provide more flexible and customizable tab layouts while maintaining
 * the same API interface for backward compatibility.
 *
 * Key features:
 * - Uses expo-router/ui components (Tabs, TabSlot, TabList, TabTrigger)
 * - Maintains all styling options from the original implementation
 * - Supports glass effects, shadows, borders, and custom positioning
 * - Enhanced UI with animations, better typography, and improved badges
 * - Performance optimizations with memoization and reduced re-renders
 * - Better accessibility support and touch interactions
 * - Enhanced glass effects with backdrop blur support (web)
 * - Backwards compatible with existing configurations
 *
 * Performance optimizations:
 * - Memoized styling functions and tab bar configuration
 * - Optimized badge rendering for large numbers (99+ display)
 * - Reduced component re-renders with useMemo and useCallback
 * - Efficient animation handling with native driver
 *
 * UI improvements:
 * - Enhanced visual feedback with subtle animations
 * - Better shadow and glow effects for focused states
 * - Improved typography with better font weights and spacing
 * - Enhanced badge design with border and shadow effects
 * - Better glass effect implementation across platforms
 */
/**
 * Definition of a single tab inside TabLayout
 */
export interface TabItemConfig {
    name: string;
    tabBarIcon?: (props: {
        focused: boolean;
        color: string;
        size: number;
    }) => React.ReactNode;
    title?: string;
    initialParams?: Record<string, any>;
    href?: string | HrefObject;
    /** Optional badge value (number or string) */
    badge?: number | string;
    /** Badge background color override */
    badgeColor?: string;
    /** Badge text color override */
    badgeTextColor?: string;
    /** Accessibility label override */
    accessibilityLabel?: string;
}
export type TabBarVariant = "auto" | "top" | "bottom";
/**
 * Simplified props: consolidate all bar / appearance customization under a single 'bar' object.
 * Anything not provided falls back to smart defaults derived from the theme.
 */
type BarShadow = {
    color?: string;
    opacity?: number;
    radius?: number;
    offset?: {
        height: number;
        width: number;
    };
    elevation?: number;
};
type BarBorder = {
    width?: number;
    color?: string;
    topOnly?: boolean;
};
export interface TabLayoutProps {
    tabs: Array<TabItemConfig>;
    ns?: string;
    initialRouteName?: string;
    translateTitles?: boolean;
    onTabChange?: (prev: string | undefined, next: string) => void;
    /**
     * Unified bar configuration (replaces many granular props)
     */
    bar?: {
        height?: number;
        position?: "absolute" | "relative";
        margin?: {
            bottom?: number;
            horizontal?: number;
        };
        padding?: {
            top?: number;
            bottom?: number;
            horizontal?: number;
        };
        rounded?: boolean | number;
        radius?: number | {
            topLeft?: number;
            topRight?: number;
            bottomLeft?: number;
            bottomRight?: number;
        };
        colors?: {
            background?: string;
            activeTint?: string;
            inactiveTint?: string;
            border?: string;
            shadow?: string;
        };
        shadow?: boolean | BarShadow;
        border?: boolean | BarBorder;
        /** When true, applies a translucent / glass style (iOS style) */
        glass?: boolean | {
            alpha?: number;
        };
        /** When true, reduces height & paddings for a denser layout */
        compact?: boolean;
        /** Respect bottom safe-area inset (default true) */
        useSafeAreaInset?: boolean;
        style?: StyleProp<ViewStyle>;
        itemStyle?: StyleProp<ViewStyle>;
        labelStyle?: StyleProp<TextStyle>;
    };
}
declare const _default: React.NamedExoticComponent<TabLayoutProps>;
export default _default;
