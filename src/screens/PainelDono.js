import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

import DraggableFlatList from 'react-native-draggable-flatlist'

import server from '../hostConfig'
import io from 'socket.io-client'


export default class PainelDono extends Component {


    state = {
        data: []
    };


    constructor(props) {
        super(props)
        this.Socket = io(server.socketIp)
        this.Socket.on('connect', () => {
            console.log('[SOCKET] -> Conectado ao Servidor.')
        })
    }


    componentDidMount() {
        this.Socket.on('listaAgendados', data => {
            if (Object.values(data).length > 0) {
                let objListaPendentes = [];
                data.map((r) => {
                    r.key = `item-${r.ordemLista}`
                    objListaPendentes.push(r)
                })
                this.setState({ data: objListaPendentes })
            }
        })
    }



    listaPendentes = ({ drag, item }) => {
        return (
            <TouchableOpacity onLongPress={drag}>
                <View style={style.itemClientes}>
                    <Image source={{ uri: server.commonIp + `imgClientes/id_${item.id_usuarios}.jpg` }} style={style.imgUser} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={style.description}>
                            <Text style={style.descriptionsName}>{item.usuario}</Text>
                            <Text style={style.descriptionsAgendado}>{item.dia} às {item.horaprevista}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    };

    ordenarListaPendentes(data) {
        this.Socket.emit('ordenarListaPendentes', data)
        this.setState({ data })
    }


    render() {
        return (

            <View style={style.container}>



                <View style={style.boxListaPendentes}>

                    {Object.values(this.state.data).length > 0 &&
                        <DraggableFlatList
                            data={this.state.data}
                            renderItem={this.listaPendentes}
                            keyExtractor={(item) => `draggable-item-${item.key}`}
                            onDragEnd={({ data }) => this.ordenarListaPendentes(data)}
                        />
                    }
                    {!Object.values(this.state.data).length > 0 &&
                        <View style={{alignItems:'center'}}>
                            <Text style={{fontSize:18}}> Ninguém na lista de espera </Text>
                        </View>
                    }


                </View>

                <View style={style.boxInformacoes}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 }}>
                        <View style={[style.secondaryBoxInformacoes, { backgroundColor: '#309397' }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={style.secondaryBoxInformacoes_value}>29</Text>
                                <Text style={style.secondaryBoxInformacoes_titulo}>Pendentes</Text>
                            </View>
                        </View>
                        <View style={[style.secondaryBoxInformacoes, { backgroundColor: '#e46472' }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={style.secondaryBoxInformacoes_value}>29</Text>
                                <Text style={style.secondaryBoxInformacoes_titulo}>Concluídos</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={[style.secondaryBoxInformacoes, { backgroundColor: '#f9be7c' }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={style.secondaryBoxInformacoes_value}>29</Text>
                                <Text style={style.secondaryBoxInformacoes_titulo}>Cadastrados</Text>
                            </View>
                        </View>
                        <View style={[style.secondaryBoxInformacoes, { backgroundColor: '#6488e3' }]}>
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={style.secondaryBoxInformacoes_value}>29</Text>
                                <Text style={style.secondaryBoxInformacoes_titulo}>Faturamento</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6E6E6'
    },
    boxListaPendentes: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: '#E6E6E6',
        paddingTop: 5,
        paddingBottom: 5
    },
    boxInformacoes: {
        flex: 1,
        borderRadius: 20,
        marginHorizontal: 15
    },
    secondaryBoxInformacoes: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        height: '90%',
        width: '40%',
        elevation: 5
    },
    secondaryBoxInformacoes_value: {
        fontSize: 35
    },

    // STYLE  ITEMS DA LISTA DE ESPERA 

    itemClientes: {
        flex: 1,
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        marginHorizontal: 10,
        marginBottom: 9,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 100, height: 80 },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
    imgUser: {
        borderRadius: 10,
        width: 55,
        height: 55,
        marginLeft: 10,
        backgroundColor: '#FFF'
    },
    description: {
        marginTop: -25,
    },
    descriptionsName: {
        marginLeft: 20,

        fontSize: 20,
        color: '#000'
    },
    descriptionsAgendado: {
        marginLeft: 22,
        fontSize: 10,
        color: '#000'
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        paddingLeft: 52
    },
    viewTempoRestante: {
        position: 'absolute',
        paddingTop: 45,
        marginLeft: 70,
        marginLeft: 88,
    }

})