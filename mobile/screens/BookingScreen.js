import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, Button, TextInput, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

export default function BookingScreen({ route, navigation }) {
  const { ride } = route.params;
  const [seatsBooked, setSeatsBooked] = useState('1');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    const seats = parseInt(seatsBooked);

    if (isNaN(seats) || seats <= 0) {
      Alert.alert('Erreur', 'Le nombre de places doit être un nombre positif');
      return;
    }

    if (seats > ride.available_seats) {
      Alert.alert('Erreur', 'Nombre de places demandé supérieur aux places disponibles');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(
        `${API_BASE_URL}/bookings`,
        {
          rideId: ride.id,
          seatsBooked: seats,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Succès', 'Réservation effectuée avec succès!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Erreur', error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Réserver un trajet" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Détails du trajet</Title>

            <View style={styles.routeContainer}>
              <Paragraph style={styles.route}>
                {ride.departure} → {ride.destination}
              </Paragraph>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Paragraph style={styles.label}>Prix par passager:</Paragraph>
                <Chip style={styles.priceChip}>{ride.price} FCFA</Chip>
              </View>

              <View style={styles.detailRow}>
                <Paragraph style={styles.label}>Places disponibles:</Paragraph>
                <Paragraph style={styles.value}>{ride.available_seats}</Paragraph>
              </View>

              <View style={styles.detailRow}>
                <Paragraph style={styles.label}>Départ:</Paragraph>
                <Paragraph style={styles.value}>
                  {formatDateTime(ride.departure_time)}
                </Paragraph>
              </View>

              <View style={styles.detailRow}>
                <Paragraph style={styles.label}>Conducteur:</Paragraph>
                <Paragraph style={styles.value}>{ride.driver_name}</Paragraph>
              </View>
            </View>

            <View style={styles.bookingSection}>
              <Title style={styles.bookingTitle}>Votre réservation</Title>

              <TextInput
                label="Nombre de places"
                value={seatsBooked}
                onChangeText={setSeatsBooked}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />

              <View style={styles.totalContainer}>
                <Paragraph style={styles.totalLabel}>Total:</Paragraph>
                <Paragraph style={styles.totalValue}>
                  {parseInt(seatsBooked) * ride.price || 0} FCFA
                </Paragraph>
              </View>

              <Button
                mode="contained"
                onPress={handleBooking}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Confirmer la réservation
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    elevation: 4,
  },
  routeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  route: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  detailsContainer: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
  priceChip: {
    backgroundColor: '#4caf50',
  },
  bookingSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  bookingTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  button: {
    marginTop: 8,
  },
});
