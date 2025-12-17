import * as Device from 'expo-device';
import Constants from 'expo-constants';

export function isExpoGo() {
  return Constants.appOwnership === 'expo';
}

export function isRealDevice() {
  return Device.isDevice;
}
