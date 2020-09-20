import React, {Component} from 'react'
import {View, Text, StyleSheet } from 'react-native'

export default class extends Component{
    render(){
        return(
            <View style={style.item}>
                <Text style={style.text}> {this.props.diferencaDias != 0?this.props.diferencaDias + ' dias atrás':'Hoje'}</Text>
                <Text style={style.text}> em {this.props.dataHistorico}</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    item:{
        height:40,
        flexDirection:'row',
        alignItems:'center',
        marginLeft:20
    },
    text:{
        color:'white'
    }
})