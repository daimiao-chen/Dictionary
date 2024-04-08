import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import {triggerNotification, NotificationSlider, cancelNotifications, getNotificationStatus, convertTimeToSeconds} from '../../components/notifications/notifications';

export const Settings = () => {
  const [time, setTime] = React.useState(0);
  const [isNotification, setIsNotification] = React.useState(false);

  React.useEffect(() => {
    getNotificationStatus().then((status) => {
      setIsNotification(status);
    });

    wordDB.getNotificationTime().then((time) => {
      if (time === null) {
        time = 0;
      }
      setTime(time);
    });
  }, []);

  const triggerNotificationHandle = () => {
    let triggerTime = {
      seconds: convertTimeToSeconds(time),
      repeats: true,
    };

    triggerNotification(triggerTime);
    setIsNotification(true);
    wordDB.setNotificationTime(time);
  }

  const cancelNotificationHandle = () => {
    cancelNotifications();
    setIsNotification(false);
  }

  return (
    <View style={styles.container}>
      <NotificationSlider value={time} onValueChange={setTime} />
      <View style={styles.rowContainer}>
        <Button 
          style={styles.button}
          mode="contained"
          onPress={triggerNotificationHandle}
          labelStyle={styles.buttonText}>Trigger Notification</Button>
        <Button
          style={styles.button}
          mode="contained"
          disabled={!isNotification}
          onPress={cancelNotificationHandle}
          labelStyle={styles.buttonText}>Cancel Notifications</Button>
      </View>
      <Button 
        style={styles.deleteButton}
        onPress={() => wordDB.closeDBandDelete()}
        labelStyle={styles.buttonText}>Delete User Data</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  rowContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#525CEB',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    width: 350, 
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
  },
});
