# First step
npm install

# Running project
npx expo start

# Clear watchman and Metro cache, then restart
watchman watch-del-all
npx expo start --clear

## NGROK Command for other network can scan expo app
ngrok http 8081
npx expo start --host tunnel

# Else Try:
npx expo start --tunnel

rm -rf ios  
rm -rf android  

npx expo prebuild --clean
cd android && ./gradlew clean && ./gradlew :app:bundleRelease

# check real device
adb devices

# run real device android
npx expo run:android --device    

# run real device  ios
pod install --repo-update  
pod update FirebaseCore FirebaseCoreExtension Firebase/CoreOnly

npx expo start --dev-client


rm -rf .expo node_modules package-lock.json
rm -rf .expo node_modules package-lock.json

npm install @react-native-firebase/app @react-native-firebase/messaging

## Build white screen in react native need to add this in main layout

import 'react-native-reanimated';


## run debug with devices

npx expo run:android