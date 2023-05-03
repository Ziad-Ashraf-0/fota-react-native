import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Stack, useSearchParams } from "expo-router";
import axios from "axios";
import LoadingIndicator from "../components/LoadingIndicator";
import ScreenHeaderBtn from "../components/ScreenHeaderBtn";
import Menu from "../assets/menu.png";
import Profile from "../assets/profile.png";
import Home from "../assets/home.png";

const dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { ip } = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`http://${ip}/data`, {
          data: "get-info",
        });
        console.log(response.data); // Do something with the response
        setData(response.data.param1);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (ip) {
      console.log(ip);
      fetchData();
    }
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Simulating a data fetch delay of 2 seconds
  //     setTimeout(() => {
  //       setData("Fetched data");
  //       setIsLoading(false);
  //     }, 2000);
  //   };
  //   fetchData();
  // }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Stack.Screen
            options={{
              headerTransparent: true,
              headerShadowVisible: false,
              headerTitle: "",
            }}
          />
          <LoadingIndicator />
        </>
      ) : (
        <SafeAreaView style={styles.container}>
          <Stack.Screen
            component={null}
            options={{
              headerShadowVisible: false,
              headerTitle: "",
              headerStyle: {
                backgroundColor: "#202326",
              },
              headerLeft: () => (
                <View style={styles.headerButtonWrapper}>
                  <ScreenHeaderBtn iconUrl={Menu} dimension="80%" />
                </View>
              ),
              headerRight: () => (
                <View style={styles.headerButtonWrapper}>
                  <ScreenHeaderBtn iconUrl={Profile} dimension="100%" />
                </View>
              ),
            }}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.text}>Avaliable Devices</Text>
            <Text style={styles.text}>{data}</Text>

            <View style={styles.footer}>
              <ScreenHeaderBtn iconUrl={Home} dimension="60%" />
              <ScreenHeaderBtn iconUrl={Menu} dimension="80%" />
              <ScreenHeaderBtn iconUrl={Menu} dimension="80%" />
              <ScreenHeaderBtn iconUrl={Menu} dimension="80%" />
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#202326",
  },
  contentContainer: {
    flex: 1,
    marginTop: 125,
    paddingHorizontal: 20,
    backgroundColor: "#202326",
  },
  footer: {
    position: "absolute",
    bottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    left: 40,
    right: 40,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  headerButtonWrapper: {
    marginVertical: 15,
  },
});

export default dashboard;
