import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import CustomAlert from '../../utils/CustomAlert';
import { formatPublishedAt } from '../../utils/utils';
import LoadingDots from '../../components/loding';
import style from '../../assets/styles/profile.styles';
import ProfileHeader from '../../components/profileHeader';
import LogoutButton from '../../components/LogoutButton';

export default function Profile() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const { token, uri } = useAuthStore();
  const router = useRouter();

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${uri}/books/yourbooks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server ${response.status}: ${text}`);
      }
      const ct = response.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON, got: ${text.slice(0, 200)}`);
      }
      const { books: dataBooks } = await response.json();
      if (Array.isArray(dataBooks)) {
        const unique = Array.from(
          new Map(dataBooks.map(b => [b._id, b])).values()
        );
        setBooks(unique);
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [uri, token]);

  // runs on initial mount AND every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const confirmDelete = id => {
    setDeletingId(id);
    setShowAlert(true);
  };

  const deleteBook = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`${uri}/books/${deletingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Delete failed');
      await fetchData();    // refresh after delete
    } catch (err) {
      console.error('Delete error:', err.message);
    } finally {
      setShowAlert(false);
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingDots />;

  const renderStars = rating =>
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
    <View style={style.bookItem}>
      <Image source={{ uri: item.Image }} style={style.bookImage} contentFit="cover" />
      <View style={style.bookInfo}>
        <Text style={style.bookTitle}>{item.title}</Text>
        <View style={style.ratingContainer}>{renderStars(item.rating)}</View>
        <Text style={style.bookCaption}>{item.caption}</Text>
        <Text style={style.bookDate}>Shared on: {formatPublishedAt(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        style={style.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={style.container}>
      <ProfileHeader />
      <LogoutButton />
      <View style={style.booksHeader}>
        <Text style={style.booksTitle}>Your Books</Text>
        <Text style={style.booksCount}>{books.length} Books</Text>
      </View>

      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item, i) => (item._id ? item._id : i.toString())}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.booksList}
        refreshing={refreshing}
        onRefresh={fetchData}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={style.emptyContainer}>
            <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
            <Text style={style.emptyText}>No books found</Text>
            <TouchableOpacity
              style={style.addButton}
              onPress={() => router.push('/create')}
            >
              <Text style={style.addButtonText}>Create a book</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <CustomAlert
        visible={showAlert}
        title="Delete Book"
        message="Are you sure you want to delete this book?"
        showCancel
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteBook}
        onCancel={() => setShowAlert(false)}
        destructive
      />
    </View>
  );
}
