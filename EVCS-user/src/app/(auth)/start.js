import { useState } from "react";
import {
  Dimensions,
  Image,
  PixelRatio,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../../components/Button";
import { router } from "expo-router";
import { routes } from "../../routes/routes";
import { colors } from "../../theme/colors";
import { sliderData } from "../../helpers/mockData";

const Start = () => {
  const { width, height } = Dimensions.get("window");
  const [activeSlide, setActiveSlide] = useState(0);

  const setSliderPage = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(contentOffsetX / width);
    setActiveSlide(currentIndex);
  };

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1,marginTop:20 }}
          horizontal={true}
          scrollEventThrottle={16}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setSliderPage(event);
          }}
        >
          {sliderData.map((slide, index) => (
            <View key={index} style={{ width, height,padding:20, alignItems:'center', justifyContent:'center' }}>
              {/* <Image style={styles.imageStyle} source={slide.imageSource} /> */}
              {slide.imageSource}
              <View style={styles.wrapper}>
                <Text style={styles.header}>{slide.header}</Text>
                <Text style={styles.paragraph}>{slide.paragraph}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {/* <View style={styles.paginationWrapper}>
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDots,
                {
                  backgroundColor:
                    index === activeSlide ? colors.primary : "#ccc",
                },
              ]}
            />
          ))}
        </View> */}
        <View style={styles.startButton}>
          <Button
            title="Get Started"
            onPress={() => router.push(routes.auth.login.path)}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    height: PixelRatio.getPixelSizeForLayoutSize(170),
    width: "100%",
    borderRadius:6
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop:30
  },
  header: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom:10
  },
  paragraph: {
    fontSize: 15,
    textAlign: "center",
    marginHorizontal: 40,
  },
  paginationWrapper: {
    bottom: 320,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  paginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: colors.primary,
    marginLeft: 10,
  },
  startButton: {
    bottom: 30,
    paddingHorizontal: 20,
  },
});

export default Start;
