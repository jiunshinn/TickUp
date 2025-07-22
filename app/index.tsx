import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { fetchPriceTarget } from "../services/api";
import { PriceTargetResponse } from "../types/api.types";
import { ApiError } from "../types/api.types";
import { PriceTargetChart } from "../components/PriceTargetChart";
import { testScenarios } from "../utils/testData";

export default function Screen() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<PriceTargetResponse | null>(null);
  const [testMode, setTestMode] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string>("normal");

  const handleSearch = async () => {
    if (testMode) {
      // Use test data in test mode
      setPriceData(testScenarios[selectedTest]);
      return;
    }

    if (!symbol.trim()) {
      setError("Please enter a stock symbol");
      return;
    }

    setLoading(true);
    setError(null);
    setPriceData(null);

    try {
      const data = await fetchPriceTarget(symbol);
      setPriceData(data);
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.status === 404) {
        setError(
          `Stock symbol "${symbol.toUpperCase()}" not found. Please check the symbol and try again.`
        );
      } else {
        setError(apiError.message || "Failed to fetch price target");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#CAC0F4", "#C2E3C6", "#B9D7EE"]}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Stock Price Target</Text>

          {/* Test Mode Controls */}
          <View style={styles.testModeContainer}>
            <View style={styles.testModeRow}>
              <Text style={styles.testModeLabel}>Test Mode</Text>
              <Switch
                value={testMode}
                onValueChange={setTestMode}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={testMode ? "#5B4CCC" : "#f4f3f4"}
              />
            </View>
            {testMode && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.testScenarioScroll}
              >
                {Object.keys(testScenarios).map((key) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.testScenarioButton,
                      selectedTest === key && styles.testScenarioButtonActive,
                    ]}
                    onPress={() => {
                      setSelectedTest(key);
                      setPriceData(testScenarios[key]);
                    }}
                  >
                    <Text
                      style={[
                        styles.testScenarioText,
                        selectedTest === key && styles.testScenarioTextActive,
                      ]}
                    >
                      {key}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter stock symbol (e.g., AAPL)"
              placeholderTextColor="#666"
              value={symbol}
              onChangeText={setSymbol}
              autoCapitalize="characters"
              autoCorrect={false}
              onSubmitEditing={handleSearch}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {priceData && !error && (
            <View style={styles.chartContainer}>
              <PriceTargetChart data={priceData} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: "#5B4CCC",
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 10,
    minWidth: 80,
  },
  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#CC0000",
    textAlign: "center",
  },
  chartContainer: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 40,
  },
  placeholderText: {
    textAlign: "center",
    color: "#999",
    marginTop: 50,
  },
  testModeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  testModeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  testModeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  testScenarioScroll: {
    marginTop: 5,
  },
  testScenarioButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  testScenarioButtonActive: {
    backgroundColor: "#5B4CCC",
  },
  testScenarioText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  testScenarioTextActive: {
    color: "white",
  },
});
