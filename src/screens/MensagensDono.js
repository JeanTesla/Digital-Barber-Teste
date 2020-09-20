import React, { Component } from 'react'
import { View, StyleSheet, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView } from 'react-native'

import Icons2 from 'react-native-vector-icons/MaterialCommunityIcons/'

import ItemMessages from './ItemMessages'

import io from 'socket.io-client'
const server = require('../hostConfig').default
import Axios from 'axios'
import { SafeAreaView } from 'react-native-safe-area-context'

export default class MensagensDono extends Component {

    state = {
        data: [],
        mensagem: '',
    }

    constructor(props) {
        super(props);
        this.Socket = io(server.socketIp)
        this.userId = props.userId
        this.carregarMensagensAnteriores()
    }

    enviarMensagem() {
        const msg = this.state.mensagem
        const obj = {
            id_estabelecimento: this.userId,
            msg: msg
        }
        if (msg !== '') {
            this.Socket.emit('mensagem', obj)
            this.carregarMensagensAnteriores()
        }
        this.setState({mensagem: ''})
    }


    carregarMensagensAnteriores() {
        Axios.post(server.commonIp + 'carregarMensagens', { userId: this.userId })
            .then(response => {
                console.log(response.data)
                this.setState({ data: response.data })
            })
    }



    render() {
        return (
            <KeyboardAvoidingView  style={style.container}   behavior={'padding'} keyboardVerticalOffset={51}     >

                <SafeAreaView style={style.container}>
                    <View style={style.messageArea}>
                        <View style={style.viewHistoryMessage}>
                            <FlatList
                                inverted
                                data={this.state.data}
                                renderItem={({ item }) => <ItemMessages data={{ ...item }} />}
                                keyExtractor={() => `${Math.random()}`}>
                            </FlatList>
                        </View>
                        <View style={style.viewFieldSendMessage}>
                            <TextInput placeholder='Digite aqui' value={this.state.mensagem} onChangeText={text => this.setState({ mensagem: text })} style={style.textInput} />
                            <TouchableOpacity onPress={() => this.enviarMensagem()}>
                                <Icons2 name='send-circle' size={50} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </SafeAreaView>
            </KeyboardAvoidingView>

        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewTextTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: 'cursive',
        fontSize: 30,
        color: 'white',
    },
    messageArea: {
        flex: 1
    },
    viewHistoryMessage: {
        flex: 9,
    },
    viewFieldSendMessage: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F2F2F2'
    },
    textInput: {
        borderWidth: 1,
        width: '80%',
        borderRadius: 20,
        padding: 10,
        marginLeft: 10,
    },
})