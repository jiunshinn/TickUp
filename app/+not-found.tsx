import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function NotFoundScreen() {
  const params = useLocalSearchParams();
  const symbol = params.symbol as string;

  return (
    <>
      <Stack.Screen options={{ title: "Symbol Not Found" }} />
      <LinearGradient
        colors={["#CAC0F4", "#C2E3C6", "#B9D7EE"]}
        style={styles.gradient}
      >
        <View style={styles.container}>
          <Text style={styles.emoji}>📊</Text>
          <Text style={styles.title}>Symbol Not Found</Text>
          {symbol ? (
            <Text style={styles.message}>
              The stock symbol "{symbol.toUpperCase()}" could not be found.
              Please check the symbol and try again.
            </Text>
          ) : (
            <Text style={styles.message}>
              The requested page or stock symbol could not be found.
            </Text>
          )}

          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Go back to search</Text>
          </Link>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#5B4CCC",
    borderRadius: 10,
  },
  linkText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
});
