import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import bgimg from "../assets/images/weahrer.webp";

const Index = () => {
  const [userinp, setUserinp] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchWeather = (locate) => {
    if (!locate) return;
    setLoading(true);
    setError(false);
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=c96f9250b3cb403da06155302241512&q=${locate}&days=7&aqi=no&alerts=no`
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

  useEffect(() => {
    let position = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (!status) {
        setError(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      fetchWeather(`${latitude},${longitude}`);
    };

    position();
  }, []);

  const getData = () => {
    fetchWeather(userinp.trim());
  };

  return (
    <ImageBackground source={bgimg} style={styles.bgImage} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter city name"
              placeholderTextColor="black"
              value={userinp}
              onChangeText={setUserinp}
              onSubmitEditing={getData}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={getData}>
              <MaterialIcons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {loading && (
            <ActivityIndicator
              size="large"
              color="#fff"
              style={{ marginTop: 20 }}
            />
          )}

          {error && (
            <Text style={styles.error}>
              ⚠️ Error fetching data. Please check city name or enable location.
            </Text>
          )}

          {data && data.current && (
            <View style={styles.resultContainer}>
              <Text style={styles.city}>
                {data.location.name},{data.location.country}
              </Text>
              {/* <Text style={styles.country}>{data.location.country}</Text> */}
              <Text style={styles.localTime}>{data.location.localtime}</Text>
              <Image
                style={styles.icon}
                source={{ uri: `https:${data.current.condition.icon}` }}
              />
              <Text style={styles.temp}>{data.current.temp_c}°C</Text>
              <Text style={styles.condition}>
                {data.current.condition.text}
              </Text>

              <View style={styles.detailsContainer}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="opacity" size={20} color="#1E90FF" />
                  <Text style={styles.detailText}>
                    {data.current.humidity}%
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="air" size={20} color="#1E90FF" />
                  <Text style={styles.detailText}>
                    {data.current.wind_kph} kph
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="thermostat" size={20} color="#1E90FF" />
                  <Text style={styles.detailText}>
                    {data.current.feelslike_c}°C
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialIcons name="wb-sunny" size={20} color="#1E90FF" />
                  <Text style={styles.detailText}>{data.current.uv}</Text>
                </View>
              </View>
            </View>
          )}

          {/* 7 Day Forecast */}
          {data && data.forecast && (
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>Daily Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {data.forecast.forecastday.map((day, index) => (
                  <View key={index} style={styles.forecastCard}>
                    <Text style={styles.date}>
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </Text>
                    <Image
                      style={styles.cardIcon}
                      source={{ uri: `https:${day.day.condition.icon}` }}
                    />
                    <Text style={styles.cardTemp}>
                      {day.day.maxtemp_c}°/ {day.day.mintemp_c}°
                    </Text>
                    <Text style={styles.cardCondition}>
                      {day.day.condition.text}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
    paddingTop:50,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    backgroundColor: "darkgray",
    borderRadius: 40,
    padding: 12,
    paddingRight: 50,
    color: "#000",
    fontSize: 16,
  },
  searchButton: {
    position: "absolute",
    right: 2,
    backgroundColor: "#1E90FF",
    padding: 8,
    borderRadius: 20,
  },
  error: {
    color: "#ffcccc",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "bold",
    fontSize: 16,
  },
  resultContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  city: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  localTime: {
    fontSize: 14,
    color: "gray",
    marginTop: 10,
    marginBottom: 10,
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 8,
  },
  temp: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 5,
  },
  condition: {
    fontSize: 18,
    marginBottom: 15,
    color: "lightgray",
  },
  detailsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 40,
    marginTop: 10,
  },
  detailItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 30,
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginLeft: 5,
  },
  forecastContainer: {
    marginTop: 10,
  },
  forecastTitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "left",
    marginBottom: 15,
    backgroundColor: "gray",
    padding: 10,
    width: 140,
    borderRadius: 30,
  },
  forecastCard: {
    backgroundColor: "lightgray",
    padding: 12,
    borderRadius: 30,
    alignItems: "center",
    marginRight: 12,
    width: width * 0.3,
  },
  date: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  cardIcon: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  cardCondition: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    color: "#555",
  },
  cardTemp: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
});

export default Index;
