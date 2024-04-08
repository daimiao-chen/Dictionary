import React from 'react';
import { View, Text} from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import {triggerNotification, NotificationSlider, cancelNotifications, getNotificationStatus, convertTimeToSeconds} from '../../components/notifications/notifications';
import { normalStyles, darkStyles } from '../../utils/style';

export const Settings = () => {
  const [time, setTime] = React.useState(0);
  const [isNotification, setIsNotification] = React.useState(false);

  let styles = normalStyles;

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
      <Button 
        style={styles.redButton}
        onPress={() => wordDB.closeDBandDelete()}
        labelStyle={styles.buttonText}>Delete User Data</Button>
    </View>
  );
}
