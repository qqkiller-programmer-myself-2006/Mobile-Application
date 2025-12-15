//
import { Text, View, ScrollView, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { Stack, useLocalSearchParams } from "expo-router";

export default function Details() {
    const params = useLocalSearchParams();

    console.log(params.name);

    useEffect(() => { }, []);

    async function fetchPokemonByName(name: string) {

    }

    return (
        <>
            <Stack.Screen options={{ title: params.name as string }} />
            <ScrollView
                contentContainerStyle={{
                    gap: 16,
                    padding: 16,
                    backgroundColor: "red",
                }}
            >
                <Text>{params.name}</Text>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({});