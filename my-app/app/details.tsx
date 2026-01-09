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
                    <ActivityIndicator size="large" color="#6366F1" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </>
        );
    }

    if (error || !pokemon) {
        return (
            <>
                <Stack.Screen options={{ title: "Error" }} />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorEmoji}>😢</Text>
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
                    headerStyle: { backgroundColor: "#1F2937" },
                    headerTintColor: "#F9FAFB",
                }}
            />
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Pokemon Name Header */}
                <View style={styles.headerCard}>
                    <Text style={styles.pokemonName}>{formatName(pokemon.name)}</Text>
                    <View style={styles.divider} />
                </View>

                {/* Sprites Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ Sprites</Text>

                    {/* Normal Sprites */}
                    <Text style={styles.subSectionTitle}>Normal</Text>
                    <View style={styles.spriteRow}>
                        <View style={styles.spriteCard}>
                            <Image
                                source={{ uri: pokemon.sprites.front_default || "" }}
                                style={styles.spriteImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.spriteLabel}>Front</Text>
                        </View>
                        <View style={styles.spriteCard}>
                            <Image
                                source={{ uri: pokemon.sprites.back_default || "" }}
                                style={styles.spriteImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.spriteLabel}>Back</Text>
                        </View>
                    </View>

                    {/* Shiny Sprites */}
                    <Text style={styles.subSectionTitle}>⭐ Shiny</Text>
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
                    <Text style={styles.sectionTitle}>📊 Stats</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statCard}>
                            <Text style={styles.statIcon}>⚖️</Text>
                            <Text style={styles.statValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
                            <Text style={styles.statLabel}>Weight</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statIcon}>📏</Text>
                            <Text style={styles.statValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
                            <Text style={styles.statLabel}>Height</Text>
                        </View>
                    </View>
                </View>

                {/* Abilities Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ Abilities</Text>
                    <View style={styles.abilitiesContainer}>
                        {pokemon.abilities.map((abilityData, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.abilityChip,
                                    abilityData.is_hidden && styles.hiddenAbilityChip
                                ]}
                            >
                                <Text style={[
                                    styles.abilityText,
                                    abilityData.is_hidden && styles.hiddenAbilityText
                                ]}>
                                    {formatName(abilityData.ability.name)}
                                </Text>
                                {abilityData.is_hidden && (
                                    <Text style={styles.hiddenBadge}>Hidden</Text>
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
        backgroundColor: "#111827",
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#9CA3AF",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111827",
        padding: 20,
    },
    errorEmoji: {
        fontSize: 64,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 18,
        color: "#EF4444",
        textAlign: "center",
    },
    headerCard: {
        alignItems: "center",
        marginBottom: 24,
    },
    pokemonName: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#F9FAFB",
        textTransform: "capitalize",
        letterSpacing: 1,
    },
    divider: {
        width: 60,
        height: 4,
        backgroundColor: "#6366F1",
        borderRadius: 2,
        marginTop: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#F9FAFB",
        marginBottom: 16,
    },
    subSectionTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#9CA3AF",
        marginBottom: 12,
        marginTop: 8,
    },
    spriteRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 12,
    },
    spriteCard: {
        flex: 1,
        backgroundColor: "#1F2937",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#374151",
    },
    shinyCard: {
        borderColor: "#FBBF24",
        backgroundColor: "rgba(251, 191, 36, 0.1)",
    },
    spriteImage: {
        width: 100,
        height: 100,
    },
    spriteLabel: {
        marginTop: 8,
        fontSize: 14,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#1F2937",
        borderRadius: 16,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#374151",
    },
    statIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#F9FAFB",
    },
    statLabel: {
        marginTop: 4,
        fontSize: 14,
        color: "#9CA3AF",
    },
    abilitiesContainer: {
        gap: 12,
    },
    abilityChip: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#374151",
    },
    hiddenAbilityChip: {
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
    },
    abilityText: {
        fontSize: 16,
        color: "#F9FAFB",
        fontWeight: "500",
    },
    hiddenAbilityText: {
        color: "#C4B5FD",
    },
    hiddenBadge: {
        fontSize: 12,
        color: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: "hidden",
        fontWeight: "600",
    },
});