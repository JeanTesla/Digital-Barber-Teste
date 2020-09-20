import React, { Component } from "react";
import { Text, Alert, View, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ItemList from '../ItemList'
import Axios from 'axios'
import DateTimePicker from '@react-native-community/datetimepicker';



import io from 'socket.io-client'
const server = require('../hostConfig').default


import { YellowBox } from 'react-native'


YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
])

class Agendados extends Component {


  state = {
    userId: this.props.userId,
    data: [],
    horaPrevista: null,
    showDatePicker: false,
    agendado: false,
    rowIdAgendado: null,
    newMessage: null
  }

  constructor(props) {
    super(props);
    this.Socket = io(server.socketIp)
    this.Socket.on('connect', () => {
      console.log('[SOCKET] -> Conectado ao Servidor.')
    })
  }



  // ------------------------------------------------------------------------------------------------//
  // ------------ CARREGA LISTA DE AGENDADOS ASSIM QUE OS COMPONENTES ESTIVEREM MONTADOS ------------//
  // ------------------------------------------------------------------------------------------------//
  componentDidMount() {
    this.Socket.on('listaAgendados', data => {
      if (data.length == 0) {
        this.setState({ agendado: false })
        this.setState({ data: data })
      } else {
        for (let value of data) {
          if (value.id_usuarios == this.state.userId) {
            this.setState({ agendado: true, rowIdAgendado: value.id })
            break;
          } else {
            this.setState({ agendado: false })
          }
        }
        this.setState({ data: data })
      }
    })
    this.Socket.on('newMessage',data=>{
      console.log('-----------------------------------------------------',data)
    })
  }

  // -------------------------------------------------------------------//
  // --------------------ENCERRA CONEXÃO VIA SOCKET --------------------//
  // -------------------------------------------------------------------//
  componentWillUnmount() {
    this.Socket.close()
  }

  // -------------------------------------------------------------------//
  // -------------------- SAI DA LISTA DE AGENDADOS --------------------//
  // -------------------------------------------------------------------//
  confirm = () => {  //Atualiza ativo para 0 e sai da lista
    this.Socket.emit('confirm', this.state.rowIdAgendado)
  }

  // -------------------------------------------------------------------//
  // ------------- VERIFICA SE PODE SER AGENDADO NESSA HORA ------------//
  // -------------------------------------------------------------------//
  getValues = (data) => {
    this.setState({ horaPrevista: data })
    this.agendar({ ...this.state })
  }



  // -------------------------------------------------------------------------------//
  // ------------------------------ ENTRAR NA LISTA DE ESPERA ----------------------//
  // -------------------------------------------------------------------------------//
  agendar = (obj) => {
    Axios.post(server.commonIp + 'agendar', {
      horaprevista: obj.horaPrevista.nativeEvent.timestamp,
      idUsuario: obj.userId
    }).then(res => {
      if (res.data) {
        Alert.alert('', 'Agendado!')
        this.setState({ showDatePicker: false })
      } else {
        Alert.alert('Ops...', 'Você já está agendado.')
      }
    }).catch(res => {
      Alert.alert('Ops...', 'Não foi possível Agendar!')
    })
  }


  render() {
    return (
      <View style={style.container}>

        <View style={style.head}>
          <View style={style.itemsHead}>
            <View style={style.viewText}>
              <Text style={{ fontSize: 20, color: 'red' }}>Agendados</Text>
            </View>
            <View style={{ marginLeft: 120 }}>
              <TouchableOpacity onPress={()=>{ Alert.alert('','Oi') }}>
                <Icon name={this.state.newMessage == null ? 'bell-alert' : 'bell-outline'} color={'red'} size={35} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={style.body}>
          {
            //----------------------------------------------------------------------// 
            //------------------------ SE TIVER ALGUÉM AGENDADO --------------------// 
            //----------------------------------------------------------------------// 
            this.state.data.length != 0 &&
            <FlatList data={this.state.data}
              renderItem={
                ({ item }) => <ItemList obj={item}
                  userId={this.state.userId}
                  confirm={this.confirm} />
              }
              keyExtractor={item => `${Math.random()}`} ></FlatList>
          }
          {
            //----------------------------------------------------------------------// 
            //------------------------ SE NÃO TIVER ALGUÉM AGENDADO ----------------// 
            //----------------------------------------------------------------------//
            this.state.data.length == 0 &&
            <View style={style.msgList}>
              <Text style={{ color: 'white', fontSize: 20 }}>Seja o próximo!</Text>
            </View>
          }

          <View style={style.viewIcon}>
            {this.state.agendado &&
              <TouchableOpacity style={[style.icon, { borderColor: 'red' }]} onPress={() => this.confirm()} >
                <Text style={{ color: 'red' }}> Desistir </Text>
              </TouchableOpacity>
            }
            {
              !this.state.agendado &&
              <TouchableOpacity style={style.icon} onPress={() => this.setState({ showDatePicker: true })} >
                <Text style={{ color: 'green' }}> Agendar </Text>
              </TouchableOpacity>
            }

          </View>
        </View>

        {this.state.showDatePicker &&
          <DateTimePicker
            timeZoneOffsetInMinutes={0}
            value={new Date()}
            mode={'time'}
            is24Hour={true}
            display='spinner'
            minuteInterval={10}
            onChange={data => { this.getValues(data) }}
            onTouchCancel={this.setState({ showDatePicker: false })}
          >
          </DateTimePicker>
        }
      </View>
    )
  }
}


export default Agendados;

const style = StyleSheet.create({
  container: {
    flex: 1
  },
  head: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  itemsHead: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  body: {
    flex: 4,
    backgroundColor: '#000'
  },
  bell: {
    alignItems: 'flex-end',
    marginTop: 14,
    marginRight: 20,
  },
  viewText: {
    marginLeft: '10%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewIcon: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 30,
    paddingBottom: 30,
  },
  icon: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 20,
    backgroundColor: '#000'
  },
  picker: {
    color: 'white',
    width: 200,
  },
  msgList: {
    marginTop: 20,
    alignItems: 'center',
    fontSize: 20,
    color: 'white'
  },
  navigationContanier: {
    backgroundColor: 'black'
  }
})