import React, { Component } from "react";
import { StyleSheet, View} from 'react-native'
import Icons from 'react-native-vector-icons/FontAwesome5'
import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons/'


import PainelDono from './PainelDono'
import MensagensDono from './MensagensDono'
import DefinicoesDono from './DefinicoesDono'

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import { NavigationContainer } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator()












export default class NavigatorDono extends Component{

  constructor(props){
    super(props)
    this.userId = this.props.navigation.getParam('userId')
  }

  painel = ()=>{
    return(
      <PainelDono userId={this.userId}/>
    )
  }
  mensagens = ()=>{
    return(
      <MensagensDono userId={this.userId}/>
    )
  }
  definicoes = ()=>{
    return(
      <DefinicoesDono userId={this.userId}/>
    )
  }

  render(){
      return (
        <View style={style.container}>
          <NavigationContainer>
            <Tab.Navigator tabBarPosition='top' 
              tabBarOptions={{
                activeTintColor: 'red',
                inactiveTintColor: '#F8F8F8',
                style: {
                  backgroundColor: '#000',
                  
                },
                iconStyle:{
                  flexDirection:'row',
                  justifyContent:'center',
                },
                labelStyle: {
                  textAlign: 'center',
                  fontSize:12
                },
                indicatorStyle: {
                  borderBottomColor: 'red',
                  borderBottomWidth: 2,
                }
              }}
              >
              <Tab.Screen name="Painel" component={this.painel} />
              <Tab.Screen name="Mensagens" component={this.mensagens} />
              <Tab.Screen name="Definicoes" component={this.definicoes} />
            </Tab.Navigator>
          </NavigationContainer>
        </View>
      );
  }
}




const style = StyleSheet.create({
  container:{
    flex:1,
  },
})





















// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// const Tab = createBottomTabNavigator()


// import { YellowBox } from 'react-native'
// YellowBox.ignoreWarnings([
//   'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
// ])




// export default class NavigatorDono extends Component{

//   constructor(props){
//     super(props)
//     this.userId = props.navigation.getParam('userId')
//   }


  

//   render(){
//     return(
//           <NavigationContainer>
//               <Tab.Navigator 
//                 tabBarOptions={{ activeTintColor: 'tomato',inactiveTintColor: 'gray'}}
//                 screenOptions={({ route }) => {
//                     if(route.name == 'Painel'){
//                         return {tabBarIcon: ()=> <Icons name='info-circle' size={20}/>}
//                     }else if(route.name == 'Mensagens'){
//                         return {tabBarIcon: ()=> <Icons2 name='message-text' size={20}/>}
//                     }else if(route.name == 'Definições'){
//                       return {tabBarIcon: ()=> <Icons name='chalkboard' size={20}/>}
//                     }
//                   }}
//                   tabBarOptions={{
//                     activeTintColor: 'red',
//                     inactiveTintColor: 'gray',
//                     style:style.tabBar
//                   }}
//               >
//               <Tab.Screen name={'Painel'}  component={this.painel}/>
//               <Tab.Screen name={'Mensagens'}  component={this.mensagens}/>
//               <Tab.Screen name={'Definições'}  component={this.definicoes}/>
//             </Tab.Navigator>
//           </NavigationContainer>
//     )
//   }
// }



