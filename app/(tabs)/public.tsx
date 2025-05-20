import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import tw from 'twrnc';

const Public = () => {
  const [articles, setArticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getNews = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/quotes");
      setArticles(response.data.quotes);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNews();
  }, []);

  const handleNext = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-black`}>
      {articles.length > 0 && (
        <View style={tw`p-4`}>
          <Text style={tw`text-lg font-bold text-white mb-2`}>
            "{articles[currentIndex].quote}"
          </Text>
          <Text style={tw`text-white text-right`}>
            — {articles[currentIndex].author}
          </Text>
        </View>
      )}

      <TouchableOpacity
        onPress={handleNext}
        style={tw`mt-6 px-4 py-2 bg-blue-500 rounded-xl`}
      >
        <Text style={tw`text-white font-bold`}>Generate</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Public;
