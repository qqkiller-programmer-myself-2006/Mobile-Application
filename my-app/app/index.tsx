// index.tsx
// คอมเม้นเป็นภาษาไทย เท่านั้น อธิบายเพื่อให้เข้าใจ

// Part Import เป็นส่วนนำเข้า แพ็คเกจ ที่ต้องการใช้ หรือ ไลบรารี่ ที่ต้องการใช้
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";

// 🌷 ธีมสี: Soft Pastel - Card โดดเด่นขึ้น
const COLORS = {
  background: "#E8E0E8",    // Lavender Grey (เข้มขึ้น ทำให้ card โดดเด่น)
  cardBg: "#FFFFFF",        // White card
  cardBorder: "#D4C0D0",    // Dusty Rose Border (เข้มขึ้น)
  purple: "#9A8BB0",        // Soft Lavender
  purpleLight: "#D4C9E0",
  blue: "#7BA3BD",          // Dusty Blue
  blueLight: "#C5DAE8",
  pink: "#C08888",          // Dusty Rose
  pinkLight: "#E8C5C5",
  textPrimary: "#2D2836",   // Dark Purple Grey (เข้มมาก อ่านชัด)
  textSecondary: "#4A4453", // Medium Grey
  textMuted: "#5A5263",     // Muted (เข้มขึ้นอีก)
};

// Interface สำหรับข้อมูล Pokemon
interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  type: PokemonType[];
}

// Interface สำหรับ Type ของ Pokemon
interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

// สีของแต่ละ Type โปเกม่อน - Soft Muted Version
const colorsByType: Record<string, string> = {
  normal: "#B8B8A0",
  fire: "#E8A87C",
  water: "#8CB5D9",
  electric: "#E8D08C",
  grass: "#9BC78C",
  ice: "#A8D4D0",
  fighting: "#C87C7C",
  poison: "#B088B0",
  ground: "#D8C8A0",
  flying: "#B8A8D8",
  psychic: "#E89CAB",
  bug: "#B0C080",
  rock: "#C0B080",
  ghost: "#9088A8",
  dragon: "#9C88D0",
  dark: "#887868",
  steel: "#B8B8C8",
  fairy: "#D0A8B8",
};

export default function Index() {
  // State สำหรับเก็บข้อมูล Pokemon ทั้งหมด
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  // State สำหรับแสดง Loading
  const [loading, setLoading] = useState(true);

  // เรียก API เมื่อ Component โหลดครั้งแรก
  useEffect(() => {
    fetchPokemons();
  }, []);

  // Function สำหรับดึงข้อมูล Pokemon จาก API
  async function fetchPokemons() {
    try {
      setLoading(true);
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
      const data = await response.json();

      // ดึงรายละเอียด Pokemon แต่ละตัว
      const detailsPokemon = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            type: details.types,
          };
        })
      );

      setPokemons(detailsPokemon);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  // Function แปลงชื่อให้ตัวแรกเป็นตัวใหญ่
  const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // แสดง Loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.pink} />
        <Text style={styles.loadingText}>🌸 Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🌷 Pokédex</Text>
        <Text style={styles.headerSubtitle}>Tap to see details ✨</Text>
      </View>

      {/* Pokemon List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pokemons.map((pokemon, index) => {
          const primaryColor = colorsByType[pokemon.type[0].type.name] || COLORS.purple;

          return (
            <Link
              key={pokemon.name}
              href={{ pathname: "/details", params: { name: pokemon.name } }}
              style={[styles.card, { borderLeftColor: primaryColor }]}
            >
              <View style={styles.cardContent}>
                {/* Pokemon Number - ย้ายไปซ้ายบน */}
                <View style={styles.numberBadge}>
                  <Text style={styles.pokemonNumber}>#{String(index + 1).padStart(3, '0')}</Text>
                </View>

                {/* Pokemon Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.pokemonName}>{formatName(pokemon.name)}</Text>

                  {/* Types */}
                  <View style={styles.typesContainer}>
                    {pokemon.type.map((t, idx) => (
                      <View
                        key={idx}
                        style={[styles.typeChip, { backgroundColor: colorsByType[t.type.name] || COLORS.purple }]}
                      >
                        <Text style={styles.typeText}>{formatName(t.type.name)}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Pokemon Images */}
                <View style={styles.imagesContainer}>
                  <Image
                    source={{ uri: pokemon.image }}
                    style={styles.pokemonImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </Link>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: COLORS.cardBg,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    borderLeftWidth: 4,
    overflow: "hidden",
    shadowColor: COLORS.pink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  numberBadge: {
    position: "absolute",
    top: 8,
    left: 12,
    backgroundColor: COLORS.purpleLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pokemonNumber: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: "700",
  },
  infoSection: {
    flex: 1,
    paddingRight: 12,
    paddingTop: 12,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  imagesContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 8,
  },
  pokemonImage: {
    width: 72,
    height: 72,
  },
});