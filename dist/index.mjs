import { jsx, jsxs } from 'react/jsx-runtime';
import { TabTrigger, Tabs as Tabs$1, TabSlot, TabList } from 'expo-router/ui';
import { useThemeColors } from '@gaddario98/react-native-ui';
import React, { useState, useEffect, memo, useMemo } from 'react';
import { Animated, Pressable, View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

let activeTabName = "";
const listeners = [];
const setActiveTabName = (name) => {
    activeTabName = name;
    listeners.forEach((cb) => cb(name));
};
const useActiveTab = () => {
    const [tab, setTab] = useState(activeTabName);
    useEffect(() => {
        const cb = (name) => setTab(name);
        listeners.push(cb);
        return () => {
            const idx = listeners.indexOf(cb);
            if (idx !== -1)
                listeners.splice(idx, 1);
        };
    }, []);
    return tab;
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const AnimatedTabButton = (_a) => {
    var _b;
    var { tab, isFocused, onPress, onPressIn, onPressOut, translateTitles = true, ns, onTabChange, cfg = {} } = _a, rest = __rest(_a, ["tab", "isFocused", "onPress", "onPressIn", "onPressOut", "translateTitles", "ns", "onTabChange", "cfg"]);
    const colors = useThemeColors();
    const { t } = useTranslation(ns);
    const activeTab = useActiveTab();
    const focused = useMemo(() => !!isFocused, [isFocused]);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const glowAnim = React.useRef(new Animated.Value(0)).current;
    const displayTitle = useMemo(() => (translateTitles ? t(tab.title || tab.name) : tab.title || tab.name), [tab.title, tab.name, t, translateTitles]);
    const currentColors = useMemo(() => {
        var _a, _b, _c, _d;
        return ({
            iconColor: focused
                ? ((_a = cfg.colors) === null || _a === void 0 ? void 0 : _a.activeTint) || colors.primary
                : ((_b = cfg.colors) === null || _b === void 0 ? void 0 : _b.inactiveTint) || colors.onSurfaceVariant,
            textColor: focused
                ? ((_c = cfg.colors) === null || _c === void 0 ? void 0 : _c.activeTint) || colors.primary
                : ((_d = cfg.colors) === null || _d === void 0 ? void 0 : _d.inactiveTint) || colors.onSurfaceVariant,
        });
    }, [cfg.colors, colors]);
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
    return (jsx(Pressable, Object.assign({ onPress: (e) => {
            onPress === null || onPress === void 0 ? void 0 : onPress(e);
            setActiveTabName(tab.name);
            onTabChange === null || onTabChange === void 0 ? void 0 : onTabChange(activeTab, tab.name);
        }, onPressIn: onPressIn, onPressOut: onPressOut, style: { flex: 1 }, accessibilityRole: "tab", accessibilityState: { selected: focused } }, rest, { children: jsxs(Animated.View, { style: [
                {
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                },
                cfg.itemStyle,
            ], children: [jsx(Animated.View, { style: {
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
                    } }), tab.tabBarIcon && (jsx(View, { style: {
                        marginBottom: 2,
                    }, children: tab.tabBarIcon({
                        focused,
                        color: currentColors.iconColor,
                        size: 24,
                    }) })), jsx(Text, { style: [
                        {
                            fontSize: cfg.compact ? 9 : 10,
                            fontWeight: "700",
                            letterSpacing: 0.6,
                            textTransform: "uppercase",
                            marginTop: 1,
                            color: currentColors.textColor,
                            textAlign: "center",
                            maxWidth: "100%",
                        },
                        cfg.labelStyle,
                    ], numberOfLines: 1, children: displayTitle }), tab.badge && (jsx(View, { style: {
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
                        borderColor: ((_b = cfg.colors) === null || _b === void 0 ? void 0 : _b.background) || colors.surface,
                        shadowColor: tab.badgeColor || colors.secondary,
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        shadowOffset: { height: 1, width: 0 },
                        elevation: 3,
                    }, children: jsx(Text, { style: {
                            color: tab.badgeTextColor || colors.onSecondary,
                            fontSize: 8,
                            fontWeight: "800",
                            textAlign: "center",
                        }, children: typeof tab.badge === "number" && tab.badge > 99
                            ? "99+"
                            : tab.badge }) }))] }) })));
};
var AnimatedTabButton$1 = memo(AnimatedTabButton);

// Helper: convert hex color (#RRGGBB or #RRGGBBAA) to rgba with custom alpha
const hexToRgba = (hex, alpha) => {
    if (!hex || typeof hex !== "string")
        return hex;
    const cleaned = hex.replace("#", "");
    if (cleaned.length === 8) {
        // already has alpha
        return hex; // trust provided
    }
    if (cleaned.length !== 6)
        return hex;
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
const TabLayout = ({ tabs, ns = "tabs", initialRouteName, translateTitles = true, onTabChange, bar, }) => {
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    // Memoize bar configuration to prevent unnecessary recalculations
    const cfg = useMemo(() => {
        // Bar defaults (single source)
        const barDefaults = {
            height: 64,
            position: "absolute",
            margin: { bottom: 12, horizontal: 16 },
            padding: { top: 8, bottom: 0, horizontal: 20 },
            rounded: true,
            radius: undefined,
            colors: {
                background: colors.surface,
                activeTint: colors.primary,
                inactiveTint: colors.onSurfaceVariant,
                border: colors.outline + "30",
                shadow: colors.shadow,
            },
            shadow: true,
            border: true,
            glass: false,
            compact: false,
            useSafeAreaInset: true,
            style: undefined,
            itemStyle: undefined,
            labelStyle: undefined,
        };
        const config = Object.assign(Object.assign({}, barDefaults), (bar || {}));
        config.margin = Object.assign(Object.assign({}, barDefaults.margin), ((bar === null || bar === void 0 ? void 0 : bar.margin) || {}));
        config.padding = Object.assign(Object.assign({}, barDefaults.padding), ((bar === null || bar === void 0 ? void 0 : bar.padding) || {}));
        config.colors = Object.assign(Object.assign({}, barDefaults.colors), ((bar === null || bar === void 0 ? void 0 : bar.colors) || {}));
        // Compact adjustments
        if (config.compact) {
            config.height = Math.max(52, (config.height || 64) - 12);
            config.padding = Object.assign(Object.assign({}, config.padding), { top: 4, bottom: 12 });
        }
        return config;
    }, [bar, colors]);
    // Memoize styling functions for better performance
    const getBorderRadiusStyle = useMemo(() => {
        if (cfg.radius) {
            if (typeof cfg.radius === "number")
                return { borderRadius: cfg.radius };
            return {
                borderTopLeftRadius: cfg.radius.topLeft,
                borderTopRightRadius: cfg.radius.topRight,
                borderBottomLeftRadius: cfg.radius.bottomLeft,
                borderBottomRightRadius: cfg.radius.bottomRight,
            };
        }
        if (typeof cfg.rounded === "number")
            return { borderRadius: cfg.rounded };
        if (cfg.rounded)
            return { borderRadius: 18 };
        return {};
    }, [cfg.radius, cfg.rounded]);
    // Shadow
    const getShadowStyle = useMemo(() => {
        var _a, _b, _c, _d;
        if (!cfg.shadow)
            return {};
        const shadowConfig = (typeof cfg.shadow === "boolean" ? {} : cfg.shadow) || {};
        return Platform.select({
            ios: {
                shadowColor: shadowConfig.color || cfg.colors.shadow,
                shadowOpacity: (_a = shadowConfig.opacity) !== null && _a !== void 0 ? _a : 0.18,
                shadowRadius: (_b = shadowConfig.radius) !== null && _b !== void 0 ? _b : 16,
                shadowOffset: (_c = shadowConfig.offset) !== null && _c !== void 0 ? _c : { height: 6, width: 0 },
            },
            android: {
                elevation: (_d = shadowConfig.elevation) !== null && _d !== void 0 ? _d : 12,
            },
        });
    }, [cfg.shadow, cfg.colors.shadow]);
    // Border
    const getBorderStyle = useMemo(() => {
        var _a;
        if (!cfg.border)
            return {};
        const borderConfig = (typeof cfg.border === "boolean" ? {} : cfg.border) || {};
        const base = {
            borderWidth: (_a = borderConfig.width) !== null && _a !== void 0 ? _a : 0.5,
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
    const safeAreaExtra = useMemo(() => cfg.useSafeAreaInset ? insets.bottom : 0, [cfg.position, cfg.useSafeAreaInset, insets.bottom]);
    const height = useMemo(() => cfg.height +
        (cfg.padding.bottom || 0) +
        (cfg.padding.top || 0), [cfg.height, cfg.padding.bottom, cfg.padding.top]);
    // Memoize tab bar style for better performance with enhanced glass effects
    const tabBarStyle = useMemo(() => {
        // Safe area bottom padding
        var _a;
        // Enhanced glass style adaptation with backdrop blur
        cfg.colors.background;
        let additionalStyles = {};
        if (cfg.glass) {
            const alpha = typeof cfg.glass === "object" && "alpha" in cfg.glass
                ? ((_a = cfg.glass.alpha) !== null && _a !== void 0 ? _a : 0.7)
                : 0.7;
            hexToRgba(colors.surface, alpha);
            // Enhanced glass effect styles
            additionalStyles = Object.assign({}, Platform.select({
                web: {
                    backdropFilter: "blur(20px)", // Web support
                },
                ios: {
                    backgroundColor: "rgba(255, 255, 255, 0.1)", // iOS blur overlay
                },
                android: {
                    backgroundColor: hexToRgba(colors.surface, alpha + 0.1), // Slightly more opaque on Android
                },
            }));
        }
        return [
            Object.assign(Object.assign(Object.assign({ backgroundColor: cfg.colors.background, borderTopWidth: 0, height, paddingBottom: (cfg.padding.bottom || 0) + safeAreaExtra, paddingTop: cfg.padding.top, paddingHorizontal: cfg.padding.horizontal, position: cfg.position, left: 0, right: 0, bottom: cfg.position === "absolute" ? cfg.margin.bottom : 0, marginHorizontal: cfg.margin.horizontal, flexDirection: "row", justifyContent: "space-around", alignItems: "center", overflow: "hidden" }, getBorderRadiusStyle), (cfg.glass ? additionalStyles : getShadowStyle)), getBorderStyle),
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
    const tabItems = useMemo(() => tabs.map((tab) => (jsx(TabTrigger, { name: tab.name, href: tab.href || `/${tab.name}`, asChild: true, accessibilityLabel: tab.accessibilityLabel ||
            (tab.title ? (translateTitles ? tab.title : tab.title) : undefined), style: { flex: 1 }, children: jsx(AnimatedTabButton$1, { tab: tab, cfg: cfg, translateTitles: translateTitles, ns: ns, onTabChange: onTabChange }, tab.name) }, tab.name))), [tabs, cfg, translateTitles]);
    return (jsxs(Tabs$1, { children: [jsx(TabSlot, {}), jsx(TabList, { style: [tabBarStyle], children: tabItems })] }));
};
var Tabs = memo(TabLayout);

export { Tabs as TabLayout, useActiveTab };
//# sourceMappingURL=index.mjs.map
