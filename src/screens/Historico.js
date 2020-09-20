import React, { Component } from 'react'
import { View, Text, StyleSheet, ImageBackground, FlatList } from 'react-native'
import ItemHistory from './ItemHistory'

import Axios from 'axios'

const server = require('../hostConfig').default


export default class Historico extends Component {
  constructor(props) {
    super(props)
    this.userId = props.userId
  }

  state = {
    data: []
  }
  componentDidMount() {
    this.obterHistorico()
  }

  obterHistorico = () => {
    Axios.post(server.commonIp + 'historico', { userId: this.userId })
      .then(result => {
        this.setState({ data: result.data })
      })
      .catch(e => {
        console.log(e)
      })
  }




  render() {
    return (
      <View style={style.container}>

        <View style={style.head}>
          <View style={style.viewText}>
            <Text style={{ fontSize: 20, color: 'red' }}>Histórico</Text>
          </View>
        </View>

        <View style={style.body}>
          {
            //----------------------------------------------------------------------// 
            //------------------------ SE TIVER ALGUM HISTÓRICO --------------------// 
            //----------------------------------------------------------------------// 
            this.state.data.length != 0 &&
            <FlatList data={this.state.data}
              renderItem={
                ({ item }) => <ItemHistory dataHistorico={item.dataHistorico} diferencaDias={item.diferencaDias} />
              }
              keyExtractor={item => `${Math.random()}`} ></FlatList>
          }
          {
            //----------------------------------------------------------------------// 
            //------------------------ SE NÃO TIVER NENHUM HISTÓRICO----------------// 
            //----------------------------------------------------------------------//
            this.state.data.length == 0 &&
            <View style={style.msgList}>
              <Text style={{ color: 'white', fontSize: 20 }}>Nenhum dado encontrado!</Text>
            </View>
          }


        </View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    flex: 1,
    backgroundColor:'#000',
    alignItems:'flex-start',
    justifyContent:'center'
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
    height: '100%',
    marginLeft: '10%',
    justifyContent: 'center'
  },
  plusIcon: {
    position: 'absolute',
    marginTop: '98%',
    marginLeft: '75%'
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