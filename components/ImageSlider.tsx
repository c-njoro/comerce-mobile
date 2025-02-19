import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface ImageType {
  public_id: string;
  url: string;
  _id: string;
}

interface ImageSliderProps {
  images: ImageType[];
}

export default function ImageSlider({ images }: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<ImageType>>(null);

  const renderItem: ListRenderItem<ImageType> = ({ item }) => (
    <View
      style={styles.imageContainer}
      className="rounded-lg overflow-hidden mt-8"
    >
      <Image
        source={{ uri: item.url }}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setActiveIndex(Math.round(index));
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={renderItem}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    flex: 1,
  },
  image: {
    width: "95%",
    height: 410,
    marginLeft: 12,
    borderRadius: 10, // Adjust the height as needed
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "black",
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
});
