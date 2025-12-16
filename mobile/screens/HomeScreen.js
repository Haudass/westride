import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Appbar, Searchbar, FAB, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RideCard from '../components/RideCard';

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

export default function HomeScreen({ navigation }) {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
    fetchRides();
  }, []);

  useEffect(() => {
    filterRides();
  }, [searchQuery, rides]);

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const fetchRides = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/rides`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRides(response.data.rides);
    } catch (error) {
      console.error('Fetch rides error:', error);
      Alert.alert('Erreur', 'Impossible de charger les trajets');
    } finally {
      setLoading(false);
    }
  };

  const filterRides = () => {
    if (!searchQuery.trim()) {
      setFilteredRides(rides);
      return;
    }

    const filtered = rides.filter(ride =>
      ride.departure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRides(filtered);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderRide = ({ item }) => (
    <RideCard
      ride={item}
      onPress={() => navigation.navigate('Booking', { ride: item })}
    />
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="WestRide" />
        <Appbar.Action icon="account" onPress={() => navigation.navigate('Profile')} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>

      <Searchbar
        placeholder="Rechercher un trajet (départ ou destination)"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredRides}
        renderItem={renderRide}
        keyExtractor={(item) => item.id.toString()}
        refreshing={loading}
        onRefresh={fetchRides}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Paragraph style={styles.emptyText}>
              {loading ? 'Chargement...' : 'Aucun trajet disponible'}
            </Paragraph>
          </View>
        }
        contentContainerStyle={filteredRides.length === 0 && styles.emptyList}
      />

      {userData?.role === 'driver' && (
        <FAB
          icon="plus"
          onPress={() => navigation.navigate('CreateRide')}
          style={styles.fab}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  emptyList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
