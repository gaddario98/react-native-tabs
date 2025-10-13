import React, { memo, useMemo } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { useThemeColors } from "@gaddario98/react-native-ui";
import { useTranslation } from "react-i18next";
import type { TabItemConfig } from "./Tabs";
import { TabTriggerSlotProps } from "expo-router/ui";

import { setActiveTabName,useActiveTab } from "./useActiveTab";
type AnimatedTabButtonProps = TabTriggerSlotProps & {
  tab: TabItemConfig;
  translateTitles?: boolean;
  cfg?: any;
  ns?: string; // namespace for i18n
  onTabChange?: (prev: string | undefined, next: string) => void;
};

const AnimatedTabButton = ({
  tab,
  isFocused,
  onPress,
  onPressIn,
  onPressOut,
  translateTitles = true,
  ns,
  onTabChange,
  cfg = {},
  ...rest
}: AnimatedTabButtonProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation(ns);
  const activeTab = useActiveTab();
  const focused = useMemo(() => !!isFocused, [isFocused]);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const glowAnim = React.useRef(new Animated.Value(0)).current;
  const displayTitle = useMemo(
    () => (translateTitles ? t(tab.title || tab.name) : tab.title || tab.name),
    [tab.title, tab.name, t, translateTitles]
  );
  const currentColors = useMemo(
    () => ({
      iconColor: focused
        ? cfg.colors?.activeTint || colors.primary
        : cfg.colors?.inactiveTint || colors.onSurfaceVariant,
      textColor: focused
        ? cfg.colors?.activeTint || colors.primary
        : cfg.colors?.inactiveTint || colors.onSurfaceVariant,
    }),
    [cfg.colors, colors]
  );

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.08 : 1,
      useNativeDriver: true,
      tension: 200,
      friction: 10,
    }).start();
    Animated.timing(glowAnim, {
      toValue: focused ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [focused, scaleAnim, glowAnim]);

  return (
    <Pressable
      onPress={(e) => {
        onPress?.(e);
        setActiveTabName(tab.name);
        onTabChange?.(activeTab, tab.name);
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ flex: 1 }}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      {...rest}
    >
      <Animated.View
        style={[
          {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          },
          cfg.itemStyle,
        ]}
      >
        {/* Glow effect */}
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 22,
            backgroundColor: currentColors.iconColor,
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
          }}
        />
        {/* Icon */}
        {tab.tabBarIcon && (
          <View
            style={{
              marginBottom: 2,
            }}
          >
            {tab.tabBarIcon({
              focused,
              color: currentColors.iconColor,
              size: 24,
            })}
          </View>
        )}
        {/* Label */}
        <Text
          style={[
            {
              fontSize: cfg.compact ? 9 : 10,
              fontWeight: "700",
              letterSpacing: 0.6,
              textTransform: "uppercase" as const,
              marginTop: 1,
              color: currentColors.textColor,
              textAlign: "center",
              maxWidth: "100%",
            },
            cfg.labelStyle,
          ]}
          numberOfLines={1}
        >
          {displayTitle}
        </Text>
        {/* Badge */}
        {tab.badge && (
          <View
            style={{
              position: "relative",
              top: -2,
              right: 2,
              backgroundColor: tab.badgeColor || colors.secondary,
              borderRadius: 10,
              minWidth: 18,
              height: 18,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 5,
              borderWidth: 2,
              borderColor: cfg.colors?.background || colors.surface,
              shadowColor: tab.badgeColor || colors.secondary,
              shadowOpacity: 0.3,
              shadowRadius: 3,
              shadowOffset: { height: 1, width: 0 },
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: tab.badgeTextColor || colors.onSecondary,
                fontSize: 8,
                fontWeight: "800",
                textAlign: "center",
              }}
            >
              {typeof tab.badge === "number" && tab.badge > 99
                ? "99+"
                : tab.badge}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
export default memo(AnimatedTabButton);
