// index.tsx
// คอมเม้นเป็นภาษาไทย เท่านั้น อธิบายเพื่อให้เข้าใจ

// Part Import เป็นส่วนนำเข้า แพ็คเกจ ที่ต้องการใช้ หรือ ไลบรารี่ ที่ต้องการใช้
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, StyleSheet, ActivityIndicator } from "react-native";

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

// สีของแต่ละ Type โปเกม่อน
const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
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
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading Pokémon...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 Pokédex</Text>
        <Text style={styles.headerSubtitle}>Tap to see details</Text>
      </View>

      {/* Pokemon List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {pokemons.map((pokemon, index) => {
          const primaryColor = colorsByType[pokemon.type[0].type.name] || "#6366F1";

          return (
            <Link
              key={pokemon.name}
              href={{ pathname: "/details", params: { name: pokemon.name } }}
              style={[styles.card, { borderLeftColor: primaryColor }]}
            >
              <View style={styles.cardContent}>
                {/* Pokemon Number */}
                <Text style={styles.pokemonNumber}>#{String(index + 1).padStart(3, '0')}</Text>

                {/* Pokemon Info */}
                <View style={styles.infoSection}>
                  <Text style={styles.pokemonName}>{formatName(pokemon.name)}</Text>

                  {/* Types */}
                  <View style={styles.typesContainer}>
                    {pokemon.type.map((t, idx) => (
                      <View
                        key={idx}
                        style={[styles.typeChip, { backgroundColor: colorsByType[t.type.name] || "#888" }]}
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
    backgroundColor: "#111827",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#9CA3AF",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#1F2937",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#F9FAFB",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 4,
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
    backgroundColor: "#1F2937",
    borderRadius: 16,
    borderLeftWidth: 4,
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  pokemonNumber: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    position: "absolute",
    top: 8,
    right: 12,
  },
  infoSection: {
    flex: 1,
    paddingRight: 12,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  typesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  imagesContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pokemonImage: {
    width: 80,
    height: 80,
  },
});