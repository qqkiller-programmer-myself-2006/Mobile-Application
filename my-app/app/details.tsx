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
    location_area_encounters: string;
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
            ability: { name: string; url: string } | null;
            is_hidden: boolean;
            slot: number;
        }[];
        generation: {
            name: string;
            url: string;
        };
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
    sprites: {
        front_default: string | null;
        back_default: string | null;
        front_shiny: string | null;
        back_shiny: string | null;
        other?: {
            "official-artwork"?: {
                front_default: string | null;
                front_shiny: string | null;
            };
            home?: {
                front_default: string | null;
                front_shiny: string | null;
            };
        };
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
}

const typeColors: { [key: string]: string } = {
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

const statColors: { [key: string]: string } = {
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
                {/* Pokemon Name & ID Header */}
                <View style={styles.headerCard}>
                    <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(4, '0')}</Text>
                    <Text style={styles.pokemonName}>{formatName(pokemon.name)}</Text>
                    {pokemon.is_default && <Text style={styles.defaultBadge}>Default Form</Text>}
                    <View style={styles.divider} />
                </View>

                {/* Types Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏷️ Types</Text>
                    <View style={styles.typesContainer}>
                        {pokemon.types.map((typeData, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.typeChip,
                                    { backgroundColor: typeColors[typeData.type.name] || "#777" }
                                ]}
                            >
                                <Text style={styles.typeText}>{formatName(typeData.type.name)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Official Artwork */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎨 Official Artwork</Text>
                    <View style={styles.artworkContainer}>
                        {pokemon.sprites.other?.["official-artwork"]?.front_default && (
                            <Image
                                source={{ uri: pokemon.sprites.other["official-artwork"].front_default }}
                                style={styles.artworkImage}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </View>

                {/* Sprites Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✨ Sprites</Text>
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

                {/* Basic Info Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Basic Info</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoIcon}>⚖️</Text>
                            <Text style={styles.infoValue}>{(pokemon.weight / 10).toFixed(1)} kg</Text>
                            <Text style={styles.infoLabel}>Weight</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoIcon}>📏</Text>
                            <Text style={styles.infoValue}>{(pokemon.height / 10).toFixed(1)} m</Text>
                            <Text style={styles.infoLabel}>Height</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoIcon}>⭐</Text>
                            <Text style={styles.infoValue}>{pokemon.base_experience || "N/A"}</Text>
                            <Text style={styles.infoLabel}>Base EXP</Text>
                        </View>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoIcon}>📋</Text>
                            <Text style={styles.infoValue}>#{pokemon.order}</Text>
                            <Text style={styles.infoLabel}>Order</Text>
                        </View>
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📈 Base Stats</Text>
                    {pokemon.stats.map((statData, index) => (
                        <View key={index} style={styles.statRow}>
                            <Text style={styles.statName}>{formatName(statData.stat.name)}</Text>
                            <Text style={styles.statValue}>{statData.base_stat}</Text>
                            <View style={styles.statBarContainer}>
                                <View
                                    style={[
                                        styles.statBar,
                                        {
                                            width: `${Math.min((statData.base_stat / 255) * 100, 100)}%`,
                                            backgroundColor: statColors[statData.stat.name] || "#6366F1"
                                        }
                                    ]}
                                />
                            </View>
                        </View>
                    ))}
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
                                <View>
                                    <Text style={[
                                        styles.abilityText,
                                        abilityData.is_hidden && styles.hiddenAbilityText
                                    ]}>
                                        {formatName(abilityData.ability.name)}
                                    </Text>
                                    <Text style={styles.abilitySlot}>Slot {abilityData.slot}</Text>
                                </View>
                                {abilityData.is_hidden && (
                                    <Text style={styles.hiddenBadge}>Hidden</Text>
                                )}
                            </View>
                        ))}
                    </View>
                </View>

                {/* Past Abilities Section */}
                {pokemon.past_abilities.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📜 Past Abilities</Text>
                        {pokemon.past_abilities.map((pastAbility, index) => (
                            <View key={index} style={styles.pastAbilityCard}>
                                <Text style={styles.generationText}>
                                    {formatName(pastAbility.generation.name)}
                                </Text>
                                {pastAbility.abilities.map((ability, aIndex) => (
                                    <Text key={aIndex} style={styles.pastAbilityText}>
                                        Slot {ability.slot}: {ability.ability?.name ? formatName(ability.ability.name) : "None"}
                                        {ability.is_hidden && " (Hidden)"}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Species Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🧬 Species</Text>
                    <View style={styles.speciesCard}>
                        <Text style={styles.speciesName}>{formatName(pokemon.species.name)}</Text>
                    </View>
                </View>

                {/* Held Items Section */}
                {pokemon.held_items.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🎒 Held Items</Text>
                        {pokemon.held_items.map((heldItem, index) => (
                            <View key={index} style={styles.heldItemCard}>
                                <Text style={styles.heldItemName}>{formatName(heldItem.item.name)}</Text>
                                <Text style={styles.heldItemRarity}>
                                    Found in: {heldItem.version_details.slice(0, 3).map(v => formatName(v.version.name)).join(", ")}
                                    {heldItem.version_details.length > 3 && ` +${heldItem.version_details.length - 3} more`}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Past Types Section */}
                {pokemon.past_types.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📜 Past Types</Text>
                        {pokemon.past_types.map((pastType, index) => (
                            <View key={index} style={styles.pastTypeCard}>
                                <Text style={styles.generationText}>
                                    {formatName(pastType.generation.name)}
                                </Text>
                                <View style={styles.typesContainer}>
                                    {pastType.types.map((typeData, tIndex) => (
                                        <View
                                            key={tIndex}
                                            style={[
                                                styles.typeChip,
                                                { backgroundColor: typeColors[typeData.type.name] || "#777" }
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
    pokemonId: {
        fontSize: 18,
        color: "#6366F1",
        fontWeight: "600",
        marginBottom: 4,
    },
    pokemonName: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#F9FAFB",
        textTransform: "capitalize",
        letterSpacing: 1,
    },
    defaultBadge: {
        marginTop: 8,
        fontSize: 12,
        color: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
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
    typesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    typeText: {
        color: "#FFF",
        fontWeight: "600",
        fontSize: 14,
        textTransform: "capitalize",
    },
    artworkContainer: {
        alignItems: "center",
        backgroundColor: "#1F2937",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#374151",
    },
    artworkImage: {
        width: 200,
        height: 200,
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
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    infoCard: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "#1F2937",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#374151",
    },
    infoIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    infoValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#F9FAFB",
    },
    infoLabel: {
        marginTop: 4,
        fontSize: 12,
        color: "#9CA3AF",
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#1F2937",
        padding: 12,
        borderRadius: 12,
    },
    statName: {
        width: 120,
        fontSize: 14,
        color: "#9CA3AF",
        textTransform: "capitalize",
    },
    statValue: {
        width: 40,
        fontSize: 14,
        fontWeight: "bold",
        color: "#F9FAFB",
        textAlign: "right",
        marginRight: 12,
    },
    statBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: "#374151",
        borderRadius: 4,
        overflow: "hidden",
    },
    statBar: {
        height: "100%",
        borderRadius: 4,
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
    abilitySlot: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
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
    pastAbilityCard: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#374151",
    },
    generationText: {
        fontSize: 14,
        color: "#6366F1",
        fontWeight: "600",
        marginBottom: 8,
    },
    pastAbilityText: {
        fontSize: 14,
        color: "#9CA3AF",
    },
    speciesCard: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#374151",
    },
    speciesName: {
        fontSize: 18,
        color: "#F9FAFB",
        fontWeight: "500",
        textTransform: "capitalize",
    },
    criesContainer: {
        gap: 12,
    },
    cryButton: {
        backgroundColor: "#6366F1",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    legacyCryButton: {
        backgroundColor: "#4B5563",
    },
    cryButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
    formsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    formChip: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: "#374151",
    },
    formText: {
        fontSize: 14,
        color: "#F9FAFB",
    },
    heldItemCard: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#374151",
    },
    heldItemName: {
        fontSize: 16,
        color: "#F9FAFB",
        fontWeight: "500",
        textTransform: "capitalize",
    },
    heldItemRarity: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 4,
    },
    collapsibleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    expandIcon: {
        fontSize: 16,
        color: "#6366F1",
    },
    movesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
    },
    moveChip: {
        backgroundColor: "#1F2937",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#374151",
    },
    moveText: {
        fontSize: 12,
        color: "#F9FAFB",
        textTransform: "capitalize",
    },
    gameIndicesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 8,
    },
    gameIndexCard: {
        backgroundColor: "#1F2937",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#374151",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    gameIndexVersion: {
        fontSize: 12,
        color: "#F9FAFB",
        textTransform: "capitalize",
    },
    gameIndexNumber: {
        fontSize: 12,
        color: "#6366F1",
        fontWeight: "600",
    },
    pastTypeCard: {
        backgroundColor: "#1F2937",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#374151",
    },
    locationButton: {
        backgroundColor: "#10B981",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    locationButtonText: {
        fontSize: 16,
        color: "#FFF",
        fontWeight: "600",
    },
});