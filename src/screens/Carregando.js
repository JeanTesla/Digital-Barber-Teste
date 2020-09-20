import React, { Component } from 'react'
import {View, Text, StyleSheet, Image} from 'react-native'
import Spinner from "../imgs/gif7.gif";


export default class Carregando extends Component{
  

    render(){
        return(
            <View style={style.container}>
                <View style={style.viewGif}>
                    <Image source={Spinner} style={style.gif}></Image>
                    <Text style={style.text}>Coletando informações</Text>
                </View>
            </View> 
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1
    },
    viewGif:{
        marginTop:'60%',
        justifyContent:'center',
        alignItems:'center'
    },
    gif:{
        width:80,
        height:80
    },
    text:{
        marginTop:20,
        fontSize:15
    }
  });