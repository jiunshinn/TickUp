import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function Screen() {
  const [symbol, setSymbol] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [priceData, setPriceData] = useState(null);

  const handleSearch = async () => {
    if (!symbol.trim()) {
      setError('Please enter a stock symbol');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // TODO: Implement API call
    // For now, just simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#CAC0F4', '#C2E3C6', '#B9D7EE']}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Stock Price Target</Text>
          
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

          {priceData && (
            <View style={styles.chartContainer}>
              {/* TODO: Add PriceTargetChart component */}
              <Text style={styles.placeholderText}>Chart will be displayed here</Text>
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
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchButton: {
    backgroundColor: '#5B4CCC',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 10,
    minWidth: 80,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#CC0000',
    textAlign: 'center',
  },
  chartContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
});
