import { Text, View, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";

interface PokemonData {
    id: number;
    name: string;
    order: number;
    weight: number;
    height: number;
    base_experience: number;
    is_default: boolean;
    abilities: {
        ability: {
            name: string;
            url: string;
        };
        is_hidden: boolean;
        slot: number;
    }[];
    past_abilities: {
        abilities: {
            ability: {
                name: string;
                url: string;
            };
            is_hidden: boolean;
            slot: number;
        }[];
        generation: {
            name: string;
            url: string;
        };
    }[];
    sprites: {
        front_default: string | null;
        back_default: string | null;
        front_shiny: string | null;
        back_shiny: string | null;
    };
    stats: {
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        };
    }[];
    types: {
        slot: number;
        type: {
            name: string;
            url: string;
        };
    }[];
    past_types: {
        generation: {
            name: string;
            url: string;
        };
        types: {
            slot: number;
            type: {
                name: string;
                url: string;
            };
        }[];
    }[];
    held_items: {
        item: {
            name: string;
            url: string;
        };
        version_details: {
            rarity: number;
            version: {
                name: string;
                url: string;
            };
        }[];
    }[];
    species: {
        name: string;
        url: string;
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

    // สีเพิ่มเติมสำหรับ Types
    green: "#7EC89D",         // Soft Green
    yellow: "#E8D47A",        // Soft Yellow
    orange: "#E8A87A",        // Soft Orange

    // ข้อความ - เข้มขึ้นมาก อ่านชัด
    textPrimary: "#2D2836",   // Dark Purple Grey (เข้มมาก)
    textSecondary: "#4A4453", // Medium Grey (เข้มขึ้น)
    textMuted: "#6B6374",     // Muted Grey (เข้มขึ้น)
};

// สีสำหรับแต่ละ Type ของ Pokemon
const TYPE_COLORS: { [key: string]: string } = {
    normal: "#A8A878",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    grass: "#78C850",
    ice: "#98D8D8",
    fighting: "#C03028",
    poison: "#A040A0",
    ground: "#E0C068",
    flying: "#A890F0",
    psychic: "#F85888",
    bug: "#A8B820",
    rock: "#B8A038",
    ghost: "#705898",
    dragon: "#7038F8",
    dark: "#705848",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
};

// สีสำหรับ Stats
const STAT_COLORS: { [key: string]: string } = {
    hp: "#FF5959",
    attack: "#F5AC78",
    defense: "#FAE078",
    "special-attack": "#9DB7F5",
    "special-defense": "#A7DB8D",
    speed: "#FA92B2",
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

    const formatStatName = (name: string) => {
        const statNames: { [key: string]: string } = {
            hp: "HP",
            attack: "Attack",
            defense: "Defense",
            "special-attack": "Sp. Atk",
            "special-defense": "Sp. Def",
            speed: "Speed",
        };
        return statNames[name] || formatName(name);
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
                {/* Pokemon Name & ID Header */}
                <View style={styles.headerCard}>
                    <Text style={styles.pokemonId}>#{String(pokemon.id).padStart(4, '0')}</Text>
                    <Text style={styles.pokemonName}>{formatName(pokemon.name)}</Text>
                    <View style={styles.dividerContainer}>
                        <View style={[styles.dividerSegment, { backgroundColor: COLORS.purple }]} />
                        <View style={[styles.dividerSegment, { backgroundColor: COLORS.blue }]} />
                        <View style={[styles.dividerSegment, { backgroundColor: COLORS.pink }]} />
                    </View>
                </View>

                {/* Types Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>🏷️</Text>
                        <Text style={styles.sectionTitle}>Types</Text>
                    </View>
                    <View style={styles.typesRow}>
                        {pokemon.types.map((typeData, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.typeChip,
                                    { backgroundColor: TYPE_COLORS[typeData.type.name] || COLORS.purple }
                                ]}
                            >
                                <Text style={styles.typeText}>{formatName(typeData.type.name)}</Text>
                            </View>
                        ))}
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

                {/* Base Info Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📋</Text>
                        <Text style={styles.sectionTitle}>Basic Info</Text>
                    </View>
                    <View style={styles.infoGrid}>
                        <View style={[styles.infoCard, styles.weightCard]}>
                            <Text style={styles.infoIcon}>⚖️</Text>
                            <Text style={[styles.infoValue, { color: COLORS.blue }]}>
                                {(pokemon.weight / 10).toFixed(1)} kg
                            </Text>
                            <Text style={styles.infoLabel}>Weight</Text>
                        </View>
                        <View style={[styles.infoCard, styles.heightCard]}>
                            <Text style={styles.infoIcon}>📏</Text>
                            <Text style={[styles.infoValue, { color: COLORS.purple }]}>
                                {(pokemon.height / 10).toFixed(1)} m
                            </Text>
                            <Text style={styles.infoLabel}>Height</Text>
                        </View>
                    </View>
                    <View style={styles.infoGrid}>
                        <View style={[styles.infoCard, styles.expCard]}>
                            <Text style={styles.infoIcon}>⭐</Text>
                            <Text style={[styles.infoValue, { color: COLORS.orange }]}>
                                {pokemon.base_experience || "N/A"}
                            </Text>
                            <Text style={styles.infoLabel}>Base Exp</Text>
                        </View>
                        <View style={[styles.infoCard, styles.orderCard]}>
                            <Text style={styles.infoIcon}>📊</Text>
                            <Text style={[styles.infoValue, { color: COLORS.mint }]}>
                                #{pokemon.order}
                            </Text>
                            <Text style={styles.infoLabel}>Order</Text>
                        </View>
                    </View>
                    {/* Is Default */}
                    <View style={styles.defaultInfoRow}>
                        <Text style={styles.defaultLabel}>🎯 Is Default Form:</Text>
                        <View style={[styles.defaultBadge, pokemon.is_default ? styles.yesDefault : styles.noDefault]}>
                            <Text style={styles.defaultBadgeText}>
                                {pokemon.is_default ? "Yes" : "No"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📈</Text>
                        <Text style={styles.sectionTitle}>Base Stats</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        {pokemon.stats.map((statData, index) => (
                            <View key={index} style={styles.statRow}>
                                <Text style={styles.statName}>{formatStatName(statData.stat.name)}</Text>
                                <Text style={styles.statValue}>{statData.base_stat}</Text>
                                <View style={styles.statBarContainer}>
                                    <View
                                        style={[
                                            styles.statBar,
                                            {
                                                width: `${Math.min(100, (statData.base_stat / 255) * 100)}%`,
                                                backgroundColor: STAT_COLORS[statData.stat.name] || COLORS.blue
                                            }
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                        <View style={styles.totalStatRow}>
                            <Text style={styles.totalStatLabel}>Total</Text>
                            <Text style={styles.totalStatValue}>
                                {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                            </Text>
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

                {/* Past Types Section */}
                {pokemon.past_types && pokemon.past_types.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionIcon}>🕰️</Text>
                            <Text style={styles.sectionTitle}>Past Types</Text>
                        </View>
                        {pokemon.past_types.map((pastData, genIndex) => (
                            <View key={genIndex} style={styles.pastContainer}>
                                <Text style={styles.generationTitle}>
                                    🎮 {formatName(pastData.generation.name)}
                                </Text>
                                <View style={styles.typesRow}>
                                    {pastData.types.map((typeData, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.typeChip,
                                                { backgroundColor: TYPE_COLORS[typeData.type.name] || COLORS.purple }
                                            ]}
                                        >
                                            <Text style={styles.typeText}>{formatName(typeData.type.name)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Species Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>🧬</Text>
                        <Text style={styles.sectionTitle}>Species</Text>
                    </View>
                    <View style={styles.speciesCard}>
                        <Text style={styles.speciesName}>{formatName(pokemon.species.name)}</Text>
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
    pokemonId: {
        fontSize: 16,
        fontWeight: "600",
        color: COLORS.textMuted,
        marginBottom: 4,
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
    // Types
    typesRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    typeChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    typeText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
        textShadowColor: "rgba(0,0,0,0.3)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    // Sprites
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
    // Info Grid
    infoGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
    },
    infoCard: {
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
    expCard: {
        backgroundColor: "rgba(232, 168, 122, 0.15)",
        borderColor: COLORS.orange + "40",
    },
    orderCard: {
        backgroundColor: "rgba(143, 192, 168, 0.15)",
        borderColor: COLORS.mint + "40",
    },
    infoIcon: {
        fontSize: 32,
        marginBottom: 10,
    },
    infoValue: {
        fontSize: 24,
        fontWeight: "bold",
    },
    infoLabel: {
        marginTop: 6,
        fontSize: 13,
        color: COLORS.textMuted,
        fontWeight: "500",
    },
    defaultInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        gap: 12,
    },
    defaultLabel: {
        fontSize: 15,
        color: COLORS.textSecondary,
        fontWeight: "500",
    },
    defaultBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    yesDefault: {
        backgroundColor: COLORS.mint + "30",
    },
    noDefault: {
        backgroundColor: COLORS.pink + "30",
    },
    defaultBadgeText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    // Stats
    statsContainer: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1.5,
        borderColor: COLORS.cardBorder,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    statName: {
        width: 70,
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.textSecondary,
    },
    statValue: {
        width: 40,
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
        textAlign: "right",
        marginRight: 12,
    },
    statBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: COLORS.cream,
        borderRadius: 5,
        overflow: "hidden",
    },
    statBar: {
        height: "100%",
        borderRadius: 5,
    },
    totalStatRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.cardBorder,
    },
    totalStatLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    totalStatValue: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.purple,
    },
    // Abilities
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
        color: COLORS.pinkDark,
    },
    hiddenBadge: {
        backgroundColor: COLORS.pink + "20",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 10,
    },
    hiddenBadgeText: {
        fontSize: 11,
        color: COLORS.pinkDark,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    // Past Abilities & Types
    pastContainer: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: COLORS.cream,
        borderRadius: 16,
    },
    generationTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    // Species
    speciesCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: COLORS.mint + "40",
    },
    speciesName: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textPrimary,
    },
    // Held Items
    heldItemsContainer: {
        gap: 12,
    },
    heldItemCard: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: COLORS.peach + "40",
    },
    heldItemName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    versionDetailsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    versionDetailChip: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.cream,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
    },
    versionName: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: "500",
    },
    rarityText: {
        fontSize: 12,
        color: COLORS.purple,
        fontWeight: "700",
    },
    emptyCard: {
        backgroundColor: COLORS.cream,
        borderRadius: 16,
        padding: 24,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 15,
        color: COLORS.textMuted,
        fontWeight: "500",
    },
});