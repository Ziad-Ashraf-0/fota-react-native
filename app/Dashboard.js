import axios from "axios";
import { Stack, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Home from "../assets/home.png";
import Menu from "../assets/menu.png";
import Profile from "../assets/profile.png";
import {
  LoadingIndicator,
  OptionMenu,
  ScreenHeaderBtn,
  FileList,
  DownloadLatestVER,
  SendFile,
} from "../components";

const dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetching, setIsFetching] = useState(false);
  const [selectedOption, setSelectedOption] = useState("default");
  const [data, setData] = useState("");
  const [files, setFiles] = useState([]);
  const { ip } = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`http://${ip}/data`, {
          data: "get-info",
        });
        console.log(response.data); // Do something with the response
        setData(response.data.response);
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

  const handleButtonPress = (buttonId) => {
    switch (buttonId) {
      case "1":
        axios
          .post(`http://${ip}/data`, { data: "list-files" })
          .then((response) => {
            setFiles(response.data.files);
            setSelectedOption("list-files");
          })
          .catch((error) => console.error(error));
        break;
      case "2":
        axios
          .post(`http://${ip}/data`, { data: "delete-files" })
          .then((response) => {
            console.log(response.data);
            setSelectedOption("delete-files");
            alert("Files Deleted");
          })
          .catch((error) => console.error(error));
        break;
      case "3":
        setIsFetching(true);
        setSelectedOption("download-file");
        axios
          .post(
            `http://${ip}/data`,
            { data: "download-file" },
            { timeout: 8000 }
          )
          .then((response) => {
            console.log(response.data);
            setIsFetching(false);
          })
          .catch((error) => console.error(error));
        break;
      case "4":
        setSelectedOption("send-binary");
        setIsFetching(true);
        axios
          .post(
            `http://${ip}/data`,
            { data: "send-binary" },
            { timeout: 30000 }
          )
          .then((response) => {
            setIsFetching(false);
            console.log(response.data);
          })
          .catch((error) => console.error(error));
        break;
      default:
        console.log(`Unknown button ID: ${buttonId}`);
    }
  };

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
            <Text style={styles.text}>Avaliable Devices :</Text>
            <Text style={styles.text}>
              STM32F429I <Text style={styles.data}>VER {data}</Text>
            </Text>
            <OptionMenu onPressButton={handleButtonPress} />

            {/* Render a component based on the selected option */}
            {selectedOption && (
              <>
                {selectedOption === "list-files" && <FileList files={files} />}
                {selectedOption === "download-file" && (
                  <DownloadLatestVER fetching={fetching}></DownloadLatestVER>
                )}
                {selectedOption === "delete-file" && <></>}
                {selectedOption === "send-binary" && <SendFile></SendFile>}
              </>
            )}

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
  data: {
    fontSize: 14,
    color: "#999999",
    fontStyle: "italic",
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
