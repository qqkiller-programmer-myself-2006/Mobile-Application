import { Text, View, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";

interface PokemonData {
    name: string;
    weight: number;
    height: number;
    abilities: {
        ability: {
            name: string;
        };
        is_hidden: boolean;
    }[];
    sprites: {
        front_default: string | null;
        back_default: string | null;
        front_shiny: string | null;
        back_shiny: string | null;
    };
}

// 🌷 ธีมสี: Soft Pastel - นุ่มนวล สบายตา (อ่านชัดขึ้น)
const COLORS = {
    // พื้นหลัก - Warm Cream (สบายตา ไม่แสบ)
    background: "#FAF7F5",    // Warm Cream
    cardBg: "#FFFFFF",
    cardBorder: "#E8D5D5",    // Dusty Rose Border

    // สีหลัก - Muted Soft Pastels
    purple: "#9A8BB0",        // Soft Lavender (เข้มขึ้น)
    purpleLight: "#D4C9E0",   // Light Lavender
    purpleDark: "#7B6A8F",    // Dusty Lavender (เข้มขึ้น)

    blue: "#7BA3BD",          // Dusty Blue (เข้มขึ้น)
    blueLight: "#C5DAE8",     // Soft Sky
    blueDark: "#5A8AA8",      // Muted Blue (เข้มขึ้น)

    pink: "#C08888",          // Dusty Rose (เข้มขึ้น)
    pinkLight: "#E8C5C5",     // Soft Blush
    pinkDark: "#A06868",      // Muted Rose (เข้มขึ้น)

    // สีเสริม - Muted Warm
    peach: "#D4B8A0",         // Soft Peach (เข้มขึ้น)
    mint: "#8FC0A8",          // Dusty Mint (เข้มขึ้น)
    cream: "#F5EDE5",         // Warm Cream

    // ข้อความ - เข้มขึ้นมาก อ่านชัด
    textPrimary: "#2D2836",   // Dark Purple Grey (เข้มมาก)
    textSecondary: "#4A4453", // Medium Grey (เข้มขึ้น)
    textMuted: "#6B6374",     // Muted Grey (เข้มขึ้น)
};

export default function Details() {
    const params = useLocalSearchParams();
    const [pokemon, setPokemon] = useState<PokemonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.name) {
            fetchPokemonByName(params.name as string);
        }
    }, [params.name]);

    async function fetchPokemonByName(name: string) {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
            if (!response.ok) {
                throw new Error("Pokemon not found");
            }
            const data = await response.json();
            setPokemon(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    }

    const formatName = (name: string) => {
        return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
    };

    if (loading) {
        return (
            <>
                <Stack.Screen options={{ title: formatName(params.name as string || "Loading...") }} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.purple} />
                    <Text style={styles.loadingText}>✨ Loading...</Text>
                </View>
            </>
        );
    }

    if (error || !pokemon) {
        return (
            <>
                <Stack.Screen options={{ title: "Error" }} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>💔</Text>
                    <Text style={styles.errorText}>{error || "Pokemon not found"}</Text>
                </View>
            </>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: formatName(pokemon.name),
                    headerStyle: { backgroundColor: COLORS.cardBg },
                    headerTintColor: COLORS.textPrimary,
                }}
            />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Pokemon Name Header */}
                <View style={styles.headerCard}>
                    <Text style={styles.pokemonName}>{formatName(pokemon.name)}</Text>
                    <View style={styles.dividerContainer}>
                        <View style={[styles.dividerSegment, { backgroundColor: COLORS.purple }]} />
                        <View style={[styles.dividerSegment, { backgroundColor: COLORS.blue }]} />
                        <View style={[styles.dividerSegment, { backgroundColor: COLORS.pink }]} />
                    </View>
                </View>

                {/* Sprites Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>🎨</Text>
                        <Text style={styles.sectionTitle}>Sprites</Text>
                    </View>

                    {/* Normal Sprites */}
                    <Text style={styles.subSectionTitle}>Normal</Text>
                    <View style={styles.spriteRow}>
                        <View style={[styles.spriteCard, styles.normalCard]}>
                            <Image
                                source={{ uri: pokemon.sprites.front_default || "" }}
                                style={styles.spriteImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.spriteLabel}>Front</Text>
                        </View>
                        <View style={[styles.spriteCard, styles.normalCard]}>
                            <Image
                                source={{ uri: pokemon.sprites.back_default || "" }}
                                style={styles.spriteImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.spriteLabel}>Back</Text>
                        </View>
                    </View>

                    {/* Shiny Sprites */}
                    <Text style={styles.subSectionTitle}>✨ Shiny</Text>
                    <View style={styles.spriteRow}>
                        <View style={[styles.spriteCard, styles.shinyCard]}>
                            <Image
                                source={{ uri: pokemon.sprites.front_shiny || "" }}
                                style={styles.spriteImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.spriteLabel}>Front</Text>
                        </View>
                        <View style={[styles.spriteCard, styles.shinyCard]}>
                            <Image
                                source={{ uri: pokemon.sprites.back_shiny || "" }}
                                style={styles.spriteImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.spriteLabel}>Back</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📊</Text>
                        <Text style={styles.sectionTitle}>Stats</Text>
                    </View>
                    <View style={styles.statsRow}>
                        <View style={[styles.statCard, styles.weightCard]}>
                            <Text style={styles.statIcon}>⚖️</Text>
                            <Text style={[styles.statValue, { color: COLORS.blue }]}>
                                {(pokemon.weight / 10).toFixed(1)} kg
                            </Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                        <View style={[styles.statCard, styles.heightCard]}>
                            <Text style={styles.statIcon}>📏</Text>
                            <Text style={[styles.statValue, { color: COLORS.purple }]}>
                                {(pokemon.height / 10).toFixed(1)} m
                            </Text>
                            <Text style={styles.statLabel}>Height</Text>
                        </View>
                    </View>
                </View>

                {/* Abilities Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>⚡</Text>
                        <Text style={styles.sectionTitle}>Abilities</Text>
                    </View>
                    <View style={styles.abilitiesContainer}>
                        {pokemon.abilities.map((abilityData, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.abilityChip,
                                    abilityData.is_hidden ? styles.hiddenAbilityChip : styles.normalAbilityChip
                                ]}
                            >
                                <View style={styles.abilityInfo}>
                                    <View style={[
                                        styles.abilityDot,
                                        { backgroundColor: abilityData.is_hidden ? COLORS.pink : COLORS.blue }
                                    ]} />
                                    <Text style={[
                                        styles.abilityText,
                                        abilityData.is_hidden && styles.hiddenAbilityText
                                    ]}>
                                        {formatName(abilityData.ability.name)}
                                    </Text>
                                </View>
                                {abilityData.is_hidden && (
                                    <View style={styles.hiddenBadge}>
                                        <Text style={styles.hiddenBadgeText}>Hidden</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.purpleLight,
        fontWeight: "500",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
        padding: 20,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.pink,
        textAlign: "center",
    },
    headerCard: {
        alignItems: "center",
        marginBottom: 28,
        paddingTop: 8,
    },
    pokemonName: {
        fontSize: 34,
        fontWeight: "bold",
        color: COLORS.textPrimary,
        textTransform: "capitalize",
        letterSpacing: 1.5,
    },
    dividerContainer: {
        flexDirection: "row",
        gap: 6,
        marginTop: 14,
    },
    dividerSegment: {
        width: 24,
        height: 4,
        borderRadius: 2,
    },
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionIcon: {
        fontSize: 22,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    subSectionTitle: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textMuted,
        marginBottom: 12,
        marginTop: 8,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    spriteRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    spriteCard: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        borderWidth: 1.5,
    },
    normalCard: {
        backgroundColor: COLORS.cardBg,
        borderColor: COLORS.blue + "40",
    },
    shinyCard: {
        backgroundColor: "rgba(236, 72, 153, 0.08)",
        borderColor: COLORS.pink + "50",
    },
    spriteImage: {
        width: 100,
        height: 100,
    },
    spriteLabel: {
        marginTop: 10,
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: "600",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        borderWidth: 1.5,
    },
    weightCard: {
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        borderColor: COLORS.blue + "40",
    },
    heightCard: {
        backgroundColor: "rgba(168, 85, 247, 0.08)",
        borderColor: COLORS.purple + "40",
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 26,
        fontWeight: "bold",
    },
    statLabel: {
        marginTop: 6,
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: "500",
    },
    abilitiesContainer: {
        gap: 10,
    },
    abilityChip: {
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1.5,
    },
    normalAbilityChip: {
        backgroundColor: COLORS.cardBg,
        borderColor: COLORS.blue + "30",
    },
    hiddenAbilityChip: {
        backgroundColor: "rgba(236, 72, 153, 0.08)",
        borderColor: COLORS.pink + "40",
    },
    abilityInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    abilityDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    abilityText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: "600",
    },
    hiddenAbilityText: {
        color: COLORS.pinkLight,
    },
    hiddenBadge: {
        backgroundColor: COLORS.pink + "20",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 10,
    },
    hiddenBadgeText: {
        fontSize: 11,
        color: COLORS.pinkLight,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
});