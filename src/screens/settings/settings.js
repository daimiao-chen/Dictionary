import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import * as wordDB from '../../utils/word';
import {triggerNotification} from '../../components/notifications/notifications';
import {NotificationSlider} from '../../components/notifications/notifications';
import { convertTimeToSeconds } from '../../components/notifications/notifications';
import { cancelNotifications } from '../../components/notifications/notifications';
import { getNotificationStatus } from '../../components/notifications/notifications';

export const Settings = () => {
  const [time, setTime] = React.useState(0);
  const [isNotification, setIsNotification] = React.useState(false);

  React.useEffect(() => {
    getNotificationStatus().then((status) => {
      setIsNotification(status);
    });
  }, []);


  const triggerNotificationHandle = () => {
    let triggerTime = {
      seconds: convertTimeToSeconds(time),
      repeats: true,
    };

    triggerNotification(triggerTime);
    setIsNotification(true);
  }

  const cancelNotificationHandle = () => {
    cancelNotifications();
    setIsNotification(false);
  }

  return (
    <View>
      <NotificationSlider value={time} onValueChange={setTime} />
      <View style={styles.RowContainer}>
        <Button 
          mode="contained"
          onPress={triggerNotificationHandle} >Trigger Notification</Button>
        <Button
          mode="contained"
          disabled={!isNotification}
          onPress={cancelNotificationHandle}
          > Cancel Notifications</Button>
      </View>
        <Button onPress={()=>wordDB.closeDBandDelete()} >Delete Database</Button>

        
    </View>
  );
}

const styles = StyleSheet.create({
  RowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
