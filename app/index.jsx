import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";

const WeatherApp = () => {
  const [userinp, setUserinp] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getData = () => {
    if (!userinp) return;
    setLoading(true);
    setError(false);
    fetch(
      `https://api.weatherapi.com/v1/current.json?key=c96f9250b3cb403da06155302241512&q=${userinp}&aqi=no`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          setError(true);
          setData(null);
        } else {
          setData(response);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌤️ Weather App</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={userinp}
        onChangeText={setUserinp}
      />

      <TouchableOpacity style={styles.button} onPress={getData}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {error && (
        <Text style={styles.error}>Error fetching data. Please check city name.</Text>
      )}

      {data && data.current && (
        <View style={styles.resultContainer}>
          <Text style={styles.city}>
            {data.location.name}, {data.location.country}
          </Text>
          <Image
            style={styles.icon}
            source={{ uri: `https:${data.current.condition.icon}` }}
          />
          <Text style={styles.temp}>{data.current.temp_c}°C</Text>
          <Text style={styles.condition}>{data.current.condition.text}</Text>

          <View style={styles.row}>
            <Text>Humidity: {data.current.humidity}%</Text>
            <Text>Wind: {data.current.wind_kph} kph</Text>
          </View>
          <View style={styles.row}>
            <Text>Feels Like: {data.current.feelslike_c}°C</Text>
            <Text>UV Index: {data.current.uv}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 12,
  },
  resultContainer: {
    alignItems: "center",
    gap: 10,
  },
  city: {
    fontSize: 20,
    fontWeight: "600",
  },
  icon: {
    width: 80,
    height: 80,
  },
  temp: {
    fontSize: 32,
    fontWeight: "bold",
  },
  condition: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 4,
  },
});

export default WeatherApp;
