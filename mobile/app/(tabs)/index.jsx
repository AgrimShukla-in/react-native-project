import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import style from '../../assets/styles/home.styles';
import { useAuthStore } from '../../store/authStore';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import CustomAlert from '../../utils/CustomAlert';
import { formatPublishedAt } from '../../utils/utils';
import LoadingDots from '../../components/loding';

export default function HomeScreen() {
  const { token, uri } = useAuthStore();

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  

  // helper to merge newBooks into prevBooks without duplicates by _id
  const mergeUnique = (prevBooks, newBooks) => {
    const map = new Map(prevBooks.map(b => [b._id, b]));
    newBooks.forEach(b => {
      if (b._id) map.set(b._id, b);
    });
    return Array.from(map.values());
  };

  // Single fetch function—pageNum tells us which page
  const fetchPage = useCallback(
    async (pageNum) => {
      try {
        if (!token) return null;
        const qs = new URLSearchParams({ page: pageNum, limit: 3 }).toString();
        const res = await fetch(`${uri}/books?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || `Error ${res.status}`);

        return {
          books: json.books,
          currentPage: json.currentPage,
          totalPages: json.totalPages,
        };
      } catch (err) {
        console.error("FetchBooks error:", err);
        setAlertType("error");
        setAlertMessage(err.message);
        setAlertVisible(true);
        return null;
      }
    },
    [uri, token]
  );

  // 1️⃣ Initial load
  useEffect(() => {
    (async () => {
      const result = await fetchPage(1);
      if (result) {
        setBooks(prev => mergeUnique(prev, result.books));
        setHasMore(result.currentPage < result.totalPages);
      }
      setLoadingInitial(false);
    })();
  }, [fetchPage]);

  // 2️⃣ Pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchPage(1);
    if (result) {
      setBooks(prev => mergeUnique([], result.books));
      setHasMore(result.currentPage < result.totalPages);
      setPage(1);
    }
    setRefreshing(false);
  }, [fetchPage]);

  // 3️⃣ Infinite scroll
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || refreshing) return;

    setLoadingMore(true);
    const nextPage = page + 1;
    const result = await fetchPage(nextPage);

    if (result) {
      setBooks(prev => mergeUnique(prev, result.books));
      setHasMore(result.currentPage < result.totalPages);
      setPage(nextPage);
    }

    setLoadingMore(false);
  }, [fetchPage, hasMore, loadingMore, page, refreshing]);

  // rating stars helper
  const renderRatingStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={15}
        color={i < rating ? COLORS.primary : COLORS.textSecondary}
        style={{ marginRight: 2 }}
      />
    ));

  const renderItem = ({ item }) => (
    <View style={style.bookCard}>
      <View style={style.header}>
        <View style={style.userInfo}>
          <Image source={{ uri: item.user.profileImage }} style={style.avatar} />
          <Text style={style.username}>{item.user.username}</Text>
        </View>
      </View>
      <View style={style.bookImageContainer}>
        <Image source={{ uri: item.Image }} style={style.bookImage} contentFit="cover" />
      </View>
      <View style={style.bookDetails}>
        <Text style={style.bookTitle}>{item.title}</Text>
        <View style={style.ratingContainer}>{renderRatingStars(item.rating)}</View>
        <Text style={style.caption}>{item.caption}</Text>
        <Text style={style.bookTitle}>{item.category}</Text>
        <Text style={style.date}>Shared on: {formatPublishedAt(item.createdAt)}</Text>
      </View>
    </View>
  );

  return (
    <View style={style.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          (item._id && item._id.toString()) || index.toString()
        }
        contentContainerStyle={style.listContainer}
        showsVerticalScrollIndicator={false}

        refreshing={refreshing}
        onRefresh={onRefresh}

        onEndReached={loadMore}
        onEndReachedThreshold={0.5}

        ListHeaderComponent={() => (
          <>
            {refreshing && <LoadingDots />}
            <View style={style.header}>
              <Text style={style.headerTitle}>BOOKSFAV📙</Text>
              <Text style={style.headerSubtitle}>Find your life Partner book</Text>
            </View>
          </>
        )}

        ListFooterComponent={
          loadingMore && hasMore ? (
            <View style={style.loadingContainer}>
              <LoadingDots />
            </View>
          ) : null
        }

        ListEmptyComponent={
          <View style={style.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={style.emptyText}>No Recommends yet</Text>
            <Text style={style.emptySubtext}>Share your favorite book</Text>
          </View>
        }
      />

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        cancelText="OK"
        onCancel={() => setAlertVisible(false)}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
  );
}
