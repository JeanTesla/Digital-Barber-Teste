import React, { Component} from 'react'
import { View, Text, StyleSheet} from 'react-native'

export default class ItemMessages extends Component{
    render(){
        return(
            <View style={style.boxMessage}>
                    <Text style={style.textMessage}>{this.props.data.mensagem}</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    boxMessage:{
        alignItems:'flex-end',
        marginHorizontal:10,
        marginVertical:5,
    },
    textMessage:{
        fontSize:20,
        borderWidth:1,
        borderRadius:20,
        padding:8,
        alignItems:'flex-end',
        backgroundColor:'#dcf8c6',
        elevation:10
    }
})