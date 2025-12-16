import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Title, Paragraph, Chip, Button } from 'react-native-paper';

export default function RideCard({ ride, onPress }) {
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('fr-FR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Title style={styles.route}>
            {ride.departure} → {ride.destination}
          </Title>
          <Chip style={styles.priceChip}>{ride.price} FCFA</Chip>
        </View>

        <Paragraph style={styles.driver}>
          Conducteur: {ride.driver_name}
        </Paragraph>

        <View style={styles.details}>
          <Paragraph style={styles.detail}>
            📅 {formatDateTime(ride.departure_time)}
          </Paragraph>
          <Paragraph style={styles.detail}>
            👥 {ride.available_seats} places disponibles
          </Paragraph>
        </View>

        <Button
          mode="outlined"
          onPress={onPress}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Voir détails
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  route: {
    fontSize: 18,
    flex: 1,
  },
  priceChip: {
    backgroundColor: '#4caf50',
    marginLeft: 8,
  },
  driver: {
    color: '#666',
    marginBottom: 12,
  },
  details: {
    marginBottom: 16,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  button: {
    borderColor: '#1976d2',
  },
  buttonLabel: {
    color: '#1976d2',
  },
});
