import { HrefObject } from "expo-router";
import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";
import { useThemeColors } from "@gaddario98/react-native-ui";
import React, { useMemo, memo } from "react";
import { Platform, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { setActiveTabName } from "./useActiveTab";
import AnimatedTabButton from "./AnimatedTabButton";

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
  offset?: { height: number; width: number };
  elevation?: number;
};
type BarBorder = { width?: number; color?: string; topOnly?: boolean };

export interface TabLayoutProps {
  tabs: Array<TabItemConfig>;
  ns?: string; // i18n namespace (default "tabs")
  initialRouteName?: string;
  translateTitles?: boolean; // enable i18n translation (default true)
  onTabChange?: (prev: string | undefined, next: string) => void;
  /**
   * Unified bar configuration (replaces many granular props)
   */
  bar?: {
    height?: number; // default 64
    position?: "absolute" | "relative";
    margin?: { bottom?: number; horizontal?: number };
    padding?: { top?: number; bottom?: number; horizontal?: number };
    rounded?: boolean | number; // true = default radius (18) | number = explicit radius
    radius?:
      | number
      | {
          topLeft?: number;
          topRight?: number;
          bottomLeft?: number;
          bottomRight?: number;
        }; // explicit override
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
    glass?: boolean | { alpha?: number };
    /** When true, reduces height & paddings for a denser layout */
    compact?: boolean;
    /** Respect bottom safe-area inset (default true) */
    useSafeAreaInset?: boolean;
    style?: StyleProp<ViewStyle>;
    itemStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
  };
}

// Helper: convert hex color (#RRGGBB or #RRGGBBAA) to rgba with custom alpha
const hexToRgba = (hex: string, alpha: number) => {
  if (!hex || typeof hex !== "string") return hex;
  const cleaned = hex.replace("#", "");
  if (cleaned.length === 8) {
    // already has alpha
    return hex; // trust provided
  }
  if (cleaned.length !== 6) return hex;
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  ns = "tabs",
  initialRouteName,
  translateTitles = true,
  onTabChange,
  bar,
}) => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  // Memoize bar configuration to prevent unnecessary recalculations
  const cfg = useMemo(() => {
    // Bar defaults (single source)
    const barDefaults = {
      height: 64,
      position: "absolute" as const,
      margin: { bottom: 12, horizontal: 16 },
      padding: { top: 8, bottom: 0, horizontal: 20 },
      rounded: true as boolean | number,
      radius: undefined as TabLayoutProps["bar"] extends { radius: infer R }
        ? R
        : undefined,
      colors: {
        background: colors.surface,
        activeTint: colors.primary,
        inactiveTint: colors.onSurfaceVariant,
        border: colors.outline + "30",
        shadow: colors.shadow,
      },
      shadow: true as boolean | object,
      border: true as boolean | object,
      glass: false as boolean | object,
      compact: false,
      useSafeAreaInset: true,
      style: undefined as StyleProp<ViewStyle>,
      itemStyle: undefined as StyleProp<ViewStyle>,
      labelStyle: undefined as StyleProp<TextStyle>,
    };

    const config = { ...barDefaults, ...(bar || {}) };
    config.margin = { ...barDefaults.margin, ...(bar?.margin || {}) };
    config.padding = { ...barDefaults.padding, ...(bar?.padding || {}) };
    config.colors = { ...barDefaults.colors, ...(bar?.colors || {}) };

    // Compact adjustments
    if (config.compact) {
      config.height = Math.max(52, (config.height || 64) - 12);
      config.padding = { ...config.padding, top: 4, bottom: 12 };
    }

    return config;
  }, [bar, colors]);

  // Memoize styling functions for better performance
  const getBorderRadiusStyle = useMemo(() => {
    if (cfg.radius) {
      if (typeof cfg.radius === "number") return { borderRadius: cfg.radius };
      return {
        borderTopLeftRadius: cfg.radius.topLeft,
        borderTopRightRadius: cfg.radius.topRight,
        borderBottomLeftRadius: cfg.radius.bottomLeft,
        borderBottomRightRadius: cfg.radius.bottomRight,
      };
    }
    if (typeof cfg.rounded === "number") return { borderRadius: cfg.rounded };
    if (cfg.rounded) return { borderRadius: 18 };
    return {};
  }, [cfg.radius, cfg.rounded]);

  // Shadow
  const getShadowStyle = useMemo(() => {
    if (!cfg.shadow) return {};
    const shadowConfig: BarShadow =
      (typeof cfg.shadow === "boolean" ? {} : cfg.shadow) || {};
    return Platform.select({
      ios: {
        shadowColor: shadowConfig.color || cfg.colors.shadow,
        shadowOpacity: shadowConfig.opacity ?? 0.18,
        shadowRadius: shadowConfig.radius ?? 16,
        shadowOffset: shadowConfig.offset ?? { height: 6, width: 0 },
      },
      android: {
        elevation: shadowConfig.elevation ?? 12,
      },
    });
  }, [cfg.shadow, cfg.colors.shadow]);

  // Border
  const getBorderStyle = useMemo(() => {
    if (!cfg.border) return {};
    const borderConfig: BarBorder =
      (typeof cfg.border === "boolean" ? {} : cfg.border) || {};
    const base = {
      borderWidth: borderConfig.width ?? 0.5,
      borderColor: borderConfig.color || cfg.colors.border,
    };
    if (borderConfig.topOnly) {
      return {
        borderTopWidth: base.borderWidth,
        borderTopColor: base.borderColor,
      };
    }
    return base;
  }, [cfg.border, cfg.colors.border]);

  const safeAreaExtra = useMemo(
    () =>cfg.useSafeAreaInset ? insets.bottom : 0,
    [cfg.position, cfg.useSafeAreaInset, insets.bottom]
  );
  const height = useMemo(
    () =>
      cfg.height +
      (cfg.padding.bottom || 0) +
      (cfg.padding.top || 0) ,
    [cfg.height, cfg.padding.bottom, cfg.padding.top]
  );

  // Memoize tab bar style for better performance with enhanced glass effects
  const tabBarStyle: StyleProp<ViewStyle> = useMemo(() => {
    // Safe area bottom padding

    // Enhanced glass style adaptation with backdrop blur
    let backgroundColor = cfg.colors.background;
    let additionalStyles: ViewStyle = {};

    if (cfg.glass) {
      const alpha =
        typeof cfg.glass === "object" && "alpha" in cfg.glass
          ? ((cfg.glass as any).alpha ?? 0.7)
          : 0.7;
      backgroundColor = hexToRgba(colors.surface, alpha);

      // Enhanced glass effect styles
      additionalStyles = {
        ...Platform.select({
          web: {
            backdropFilter: "blur(20px)", // Web support
          } as any,
          ios: {
            backgroundColor: "rgba(255, 255, 255, 0.1)", // iOS blur overlay
          },
          android: {
            backgroundColor: hexToRgba(colors.surface, alpha + 0.1), // Slightly more opaque on Android
          },
        }),
      };
    }

    return [
      {
        backgroundColor:cfg.colors.background,
        borderTopWidth: 0,
        height,
        paddingBottom: (cfg.padding.bottom || 0) + safeAreaExtra,
        paddingTop: cfg.padding.top,
        paddingHorizontal: cfg.padding.horizontal,
        position: cfg.position,
        left: 0,
        right: 0,
        bottom: cfg.position === "absolute" ? cfg.margin.bottom : 0,
        marginHorizontal: cfg.margin.horizontal,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        overflow: "hidden", // Important for glass effects
        ...getBorderRadiusStyle,
        ...(cfg.glass ? additionalStyles : getShadowStyle),
        ...getBorderStyle,
      },
      cfg.style,
    ];
  }, [
    cfg,
    insets.bottom,
    hexToRgba,
    colors.surface,
    getBorderRadiusStyle,
    getShadowStyle,
    getBorderStyle,
    safeAreaExtra,
    height,
  ]);

  // Handle tab change callback
  React.useEffect(() => {
    if (initialRouteName) {
      setActiveTabName(initialRouteName);
    }
  }, [initialRouteName]);

  // Memoize tab items to prevent unnecessary re-renders
  // Usa asChild per ricevere isFocused come prop su AnimatedTabButton
  const tabItems = useMemo(
    () =>
      tabs.map((tab) => (
        <TabTrigger
          key={tab.name}
          name={tab.name}
          href={tab.href || `/${tab.name}`}
          asChild
          accessibilityLabel={
            tab.accessibilityLabel ||
            (tab.title ? (translateTitles ? tab.title : tab.title) : undefined)
          }
          style={{ flex: 1 }}
        >
          {/* TabTrigger fornirà isFocused come prop */}
          <AnimatedTabButton
            tab={tab}
            cfg={cfg}
            translateTitles={translateTitles}
            ns={ns}
            key={tab.name}
            onTabChange={onTabChange}
          />
        </TabTrigger>
      )),
    [tabs, cfg, translateTitles]
  );
  return (
    <Tabs>
      <TabSlot />

      {/* Custom styled TabList */}
      <TabList style={[tabBarStyle]}>{tabItems}</TabList>
    </Tabs>
  );
};

export default memo(TabLayout);
