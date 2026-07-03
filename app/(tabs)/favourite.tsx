/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { IconFavorite } from '@/components/Icons';
import Colors from '@/constants/colors';
import { images } from '@/constants/images';
import { getListFavoriteParkingSpots } from '@/service/api';
import { useAuth } from '../context/AuthContext';
import NoUserLogin from '@/components/NoUserLogin';

const Favourite = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (user) fetchFavorites();
    }, [user]),
  );

  if (!user) return <NoUserLogin />;

  const typeLabel: Record<'parking hub' | 'on street parking', string> = {
    'parking hub': 'Bãi đỗ xe tập trung',
    'on street parking': 'Đỗ xe ven đường',
  };

  const fetchFavorites = async (showMainLoading = true) => {
    try {
      if (showMainLoading) setLoading(true);
      const data = await getListFavoriteParkingSpots();
      setFavorites(data);
    } catch (error) {
      console.error(error);
    } finally {
      if (showMainLoading) setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFavorites(false);
  };

  const renderItem = ({ item }: any) => {
    const spotId = item.parking_spot_id ?? item.id ?? item.spot_id;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('index', {
            screen: 'Tabs',
            params: {
              screen: 'ParkingSpot',
              params: { openSpotId: spotId },
            },
          })
        }
        className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
      >
        {/* Header */}
        <View className="flex-row justify-between items-start">
          <Text className="text-lg font-semibold text-gray-900 flex-1 pr-2">
            {item.name}
          </Text>

          <View className="bg-red-50 p-2 rounded-full">
            <IconFavorite size={16} color={Colors.heart} />
          </View>
        </View>

        {/* Address */}
        <Text className="text-sm text-gray-600 mt-2">📍 {item.address}</Text>

        {/* Type */}
        <View className="mt-2 self-start bg-gray-100 px-3 py-1 rounded-full">
          <Text className="text-xs text-gray-600">
            {typeLabel[item.type as keyof typeof typeLabel] ?? 'Không xác định'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-4">
      {/* Title */}
      <Text className="text-2xl font-bold text-gray-900 mt-4 mb-4">
        ❤️ Yêu thích
      </Text>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.favorite_id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: favorites.length === 0 ? 1 : 0,
          }}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center">
              <Image
                source={images.noData}
                style={{ width: 160, height: 160 }}
              />
              <Text className="mt-4 text-base text-gray-500">
                Chưa có bãi đỗ yêu thích
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Favourite;
