import { View, Text, FlatList, Image, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import tw from "twrnc";
import Icon from "react-native-vector-icons/Feather";

export default function Explore() {
  const [articles, setArticles] = useState([]);

  const getNews = async () => {
    try {
      const response = await axios.get(
        "https://newsapi.org/v2/top-headlines?country=us&apiKey=b67226388eca4095844c27e34188bd4b"
      );
      setArticles(response.data.articles);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  return (
    <View style={tw`flex-1 bg-white p-4`}>
      <Text style={tw`text-xl font-bold mb-4`}>Berita Terbaru</Text>

      <FlatList
        data={articles}
        keyExtractor={(item) => item.url}
        renderItem={({ item }) => (
          <View style={tw`bg-white rounded-xl shadow-md mb-5 overflow-hidden`}>
            {item.urlToImage && (
              <Image
                source={{ uri: item.urlToImage }}
                style={tw`w-full h-40`}
                resizeMode="cover"
              />
            )}
            <View style={tw`p-4`}>
              <Text style={tw`text-lg font-bold text-black mb-1`}>
                {item.title}
              </Text>
              {item.author && (
                <Text style={tw`text-sm text-gray-600 mb-2`}>by {item.author}</Text>
              )}
              <Text style={tw`text-sm text-gray-700 mb-3`}>
                {item.description}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
                <View style={tw`flex-row items-center`}>
                  <Icon name="external-link" size={20} color="#1D4ED8" />
                  <Text style={tw`ml-2 text-blue-700`}>Buka Link</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
