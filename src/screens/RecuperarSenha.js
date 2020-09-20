import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Alert, TextInput, Image, ImageBackground, Switch, TouchableWithoutFeedback } from 'react-native'
import server from '../hostConfig'
import Axios from 'axios'

import imageBackGround from '../imgs/backgroundAgendados.jpg'
import Icons from 'react-native-vector-icons/Fontisto'


export default class RecuperarSenha extends Component {

    constructor(props) {
        super(props)
        this.navigation = props.navigation
        this.tokenFCM = props.navigation.getParam('tokenFCM')
    }


    state = {
        email: null
    }



    getValues = () => {
        if (this.state.email != null) {
            Axios.post(server.commonIp + 'recuperarSenha', { email: this.state.email })
                .then(res => {
                    if (res.data) {
                        Alert.alert('', 'Verifique sua caixa de e-mail.')
                    } else {
                        Alert.alert('Ops...', 'Esse e-mail não é cadastrado no App.')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }else{
            Alert.alert('', 'Preencha o campo de E-mail.')
        }
    }




    render() {
        return (

            <View style={style.container}>
                <ImageBackground resizeMode='cover' blurRadius={5} source={imageBackGround} style={style.container}>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <View style={style.viewInput}>
                            <Icons name='email' size={30} color='#9d9d9d'></Icons>
                            <TextInput placeholder='E-mail cadastrado no App' value={this.state.email} onChangeText={text => this.setState({ email: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                        </View>
                        <TouchableHighlight underlayColor={'#12A704'} style={style.button} onPress={() => this.getValues()}>
                            <Text style={{ color: 'white' }}>Confirmar</Text>
                        </TouchableHighlight>
                        <Text style={{ color: '#9d9d9d', textAlign: 'center', marginHorizontal: 30, paddingTop: 30 }}>Olhe sua caixa de e-mail, enviaremos sua senha.</Text>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1
    },
    viewInput: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20
    },

    inputText: {
        borderColor: '#9d9d9d',
        borderWidth: 1,
        borderRadius: 20,
        paddingLeft: 20,
        height: 40,
        width: '70%',
        fontSize: 15,
        color: 'white',
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: 'green',
        borderWidth: 1,
        height: 30,
        width: 100,
        marginLeft: '62%',
        marginTop: 20
    },
})
