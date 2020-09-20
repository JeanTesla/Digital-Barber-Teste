import {Alert} from 'react-native'
import firebase from 'react-native-firebase'


export default class CloudNotifications{

    //tokenFCM = null //Retorna Token nulo se não for possível obter um

    init(){
        this.checkPermission();
        this.messageListener();
     }


    // ---------------------------------------------------------------------------------------//
    // --------VERIFICA SE ESSE DISPOSITIVO ESTÁ REGISTRADO NO FIREBASE CLOUD MESSAGING-------//
    // ---------------------------------------------------------------------------------------//
  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getFcmToken();
    } else {
        this.requestPermission();
    }
  }
    // ----------------------------------------------------------------------------//
    // --------------------------- OBTEM TOKEN DE REGISTRO ------------------------//
    // ----------------------------------------------------------------------------//
  getFcmToken = async () => {  
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log(fcmToken)
        return fcmToken
    }
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
        // User has rejected permissions
    }
  }

    
  messageListener = async () => {
    // ----------------------------------------------------------------------------//
    // ----------------------- CAPTURA EVENTO DE NOVA NOTIFICAÇÃO -----------------//
    // ----------------------------------------------------------------------------//
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        const { title, body, data } = notification;
        this.showAlert(title, body, JSON.stringify(data));
        console.log(data)
    });
    // ----------------------------------------------------------------------------//
    // ---------------------- CAPTURA EVENTO DE CLICK NA NOTIFICAÇÃO --------------//
    // ----------------------------------------------------------------------------//
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body , data} = notificationOpen.notification;
        this.showAlert(title, body);
    });
  
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body, data } = notificationOpen.notification;
        this.showAlert(title, body);
        console.log(data)
    }
  
    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log(JSON.stringify(message));
    });
  }

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  }
}