import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
var server = require('./hostConfig').default





class ItemList extends Component {


    state = {
        horaprevista: this.props.obj.timestamphoraprevista,
        tempoRestante: null,
        interval: null,
        showNotification: true
    }
    componentDidMount() {
        this.tempoRestante()
        this.setState({ interval: setInterval(() => { requestAnimationFrame(this.tempoRestante) }, 1000) })
    }
    componentWillUnmount() {
        clearInterval(this.state.interval)
    }
    // ----------------------------------------------------------------------------//
    // ----------------------- VERIFICA TEMPO RESTANTE E RETORNA ------------------//
    // ----------------------------------------------------------------------------//
    tempoRestante = () => {
        const now = new Date()
        const horaprevista = new Date(this.state.horaprevista)
        var difference = horaprevista.getTime() - now.getTime();
        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        difference -= daysDifference * 1000 * 60 * 60 * 24
        var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        difference -= hoursDifference * 1000 * 60 * 60
        var minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60
        var secondsDifference = Math.floor(difference / 1000);
        if (hoursDifference < 10) hoursDifference = '0' + hoursDifference
        if (minutesDifference < 10) minutesDifference = '0' + minutesDifference
        if (secondsDifference < 10) secondsDifference = '0' + secondsDifference

        this.setState({ tempoRestante: hoursDifference + ':' + minutesDifference + ':' + secondsDifference })
    }


    render() {
        return (
            <View style={style.item}>
                <Image source={{ uri: server.commonIp + 'imgClientes/id_' + this.props.obj.id_usuarios + '.jpg' }} style={style.imgUser} />
                <View style={{ borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={style.description}>
                        <Text style={style.descriptionsName}>{this.props.obj.usuario}</Text>
                        <Text style={style.descriptionsAgendado}>{this.props.obj.dia} às {this.props.obj.horaprevista}</Text>
                    </View>
                </View>
                <View style={style.viewTempoRestante}>
                    <Text style={{ color: '#FFF', fontSize: 12 }}>Tempo restante: {this.state.tempoRestante} </Text>
                </View>
                    {
                        this.props.userId == this.props.obj.id_usuarios &&
                        <View style={style.indicator}>
                            <View style={{height:10,width:10,backgroundColor:'green',borderRadius:30}}></View>
                        </View>
                    }
                

            </View>
        )
    }
}

export default ItemList;

const style = StyleSheet.create({
    item: {
        flex:1,
        backgroundColor: 'grey',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    imgUser: {
        borderWidth: 1,
        borderRadius: 35,
        width: 55,
        height: 55,
        marginLeft: 10,
        backgroundColor: '#FFF'
    },
    description: {
        marginTop: -25,
        borderWidth: 1,

    },
    descriptionsName: {
        marginLeft: 20,
        borderWidth: 1,
        fontSize: 20,
        color: '#FFF'
    },
    descriptionsAgendado: {
        marginLeft: 20,
        fontSize: 10,
        color: '#FFA'
    },
    indicator: {
        flex:1,
        alignItems:'center',
        paddingLeft:52
    },
    viewTempoRestante: {
        position: 'absolute',
        paddingTop: 45,
        marginLeft: 70,
        marginLeft: 88
    }
})