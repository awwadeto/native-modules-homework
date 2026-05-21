import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  NativeModules,
  PermissionsAndroid,
  Platform,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  requireNativeComponent,
} from 'react-native';

import { colors } from '../colors';
import { Fab } from '../components/Fab.tsx';
import { Loader } from '../components/Loader.tsx';
import { LotteryList } from '../components/LotteryList.tsx';
import { useLotteries } from '../hooks/useLotteries.ts';
import type { AddLotteryNavigationProp } from '../types';

type NotificationNativeModule = {
  requestPermissions?: () => void;
  showNotification: (title: string, body: string) => void;
};

type CustomButtonNativeProps = {
  disabled?: boolean;
  title?: string;
  onPress?: () => void;
  style?: object;
};

const { Notification } = NativeModules as {
  Notification?: NotificationNativeModule;
};

const NATIVE_BUTTON_NAME = Platform.select({
  ios: 'RNCustomButtonViewManager',
  android: 'CustomButton',
  default: 'CustomButton',
});

const CustomButton = requireNativeComponent<CustomButtonNativeProps>(
  NATIVE_BUTTON_NAME,
);

export const Home = () => {
  const [selectedLotteries, setSelectedLotteries] = useState<Array<string>>([]);
  const navigation = useNavigation<AddLotteryNavigationProp>();
  const { data, isLoading, refetch } = useLotteries();

  const isFocused = useIsFocused();

  const handleSelect = (lotteryId: string) => {
    setSelectedLotteries((lotteries) => {
      if (lotteries.includes(lotteryId)) {
        const index = lotteries.indexOf(lotteryId);

        return [...lotteries.slice(0, index), ...lotteries.slice(index + 1)];
      } else {
        return [...lotteries, lotteryId];
      }
    });
  };

  useEffect(() => {
    if (isFocused) {
      refetch();
      setSelectedLotteries([]);
    }
  }, [isFocused, refetch]);

  const handleNativeNotification = async () => {
    if (!Notification?.showNotification) {
      console.warn('Notification native module is unavailable');
      return;
    }

    if (Platform.OS === 'ios') {
      Notification.requestPermissions?.();
    }

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }
    }

    Notification.showNotification(
      'Lottery Reminder',
      'Dont forget to submit your registration today!',
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        onPress={() => navigation.navigate('Register', { selectedLotteries })}
        style={[
          styles.button,
          {
            backgroundColor:
              selectedLotteries.length === 0 ? colors.grey : colors.secondary,
          },
        ]}
        disabled={selectedLotteries.length === 0}
      >
        <Text style={styles.text}>Register</Text>
      </TouchableOpacity>
      <View style={styles.title}>
        <Text style={styles.titleText}>Lotteries</Text>
        <FontAwesome6 name="dice" size={36} color="black" iconStyle={'solid'} />
      </View>
      <LotteryList
        lotteries={data ?? []}
        loading={isLoading}
        onPress={handleSelect}
        selectedLotteries={selectedLotteries}
      />
      <CustomButton
        disabled={false}
        title="Notify Me"
        onPress={handleNativeNotification}
        style={styles.nativeButton}
      />
      <Fab onPress={() => navigation.navigate('AddLottery')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    paddingTop: 64,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 36,
    marginRight: 16,
    marginTop: 16,
  },
  button: {
    position: 'absolute',
    right: 16,
    top: 8,
    borderRadius: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    color: colors.buttonSecondary,
  },
  nativeButton: {
    width: 140,
    height: 40,
    backgroundColor: '#1ce1ce',
    borderRadius: 8,
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
