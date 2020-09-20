import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator()

import Agendados from './Agendados'
import Historico from './Historico'

import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])



export default class NavigatorAgendados extends Component {

  constructor(props) {
    super(props)
    this.userId = props.navigation.getParam('userId')
  }

  agendados = () => {
    return (
      <Agendados userId={this.userId} />
    )
  }
  historico = () => {
    return (
      <Historico userId={this.userId} />
    )
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          tabBarPosition={'bottom'}
          tabBarOptions={{ activeTintColor: 'tomato', inactiveTintColor: 'gray', }}
          screenOptions={({ route }) => {
            if (route.name == 'Agendados') {
              return { tabBarIcon: () => <Icon name='clock-o' color='#9D9D9D' size={20} /> }
            } else if (route.name == 'Histórico') {
              return { tabBarIcon: () => <Icon name='list' color='white' size={20} /> }
            }
          }}
          tabBarOptions={{
            indicatorContainerStyle:{
              marginBottom:'100%'
            },
            activeTintColor: 'red',
            inactiveTintColor: 'gray',
            indicatorStyle: {
              borderBottomColor: '#FF0000',
              borderBottomWidth: 2,
            },
            style: style.tabBar
          }}
        >
          <Tab.Screen name={'Agendados'} component={this.agendados} />
          <Tab.Screen name={'Histórico'} component={this.historico} />
        </Tab.Navigator>
      </NavigationContainer>
    )
  }
}



const style = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    backgroundColor: '#000',
  }
})


