
import React, { Component } from 'react'

import { View, Text, ImageBackground, StyleSheet, Alert, Switch, Image, TextInput, TouchableHighlight } from 'react-native'

import ModalLogin from './ModalLogin'
import Carregando from './Carregando'

import imageBackGround from '../imgs/backgroundAgendados.jpg'
import imageBarber from '../imgs/barber3.png'
import Icons from 'react-native-vector-icons/Fontisto'

import Axios from 'axios'
import CloudNotifications from '../CloudNotifications'
import { TouchableOpacity } from 'react-native-gesture-handler'


var server = require('../hostConfig').default



export default class Home extends Component {

  Navigation = this.props.navigation

  state = {
    showLogin: false,
    tokenFCM: null,
    showCarregando: false,
    inputFocus: 1,
    dono: false,
    email: '',
    senha: ''
  }

  componentDidMount() {
    const cloudNotifications = new CloudNotifications()
    cloudNotifications.init()
    cloudNotifications.getFcmToken().then(token => { this.setState({ tokenFCM: token }) })
  }

  // ----------------------------------------------------------------------------//
  // ------------------------- OBTEM VALOR DOS CAMPOS  --------------------------//
  // ----------------------------------------------------------------------------//
  getValues = () => {
    const obj = { ...this.state }
    if (obj.email != '' && obj.senha != '') {
      this.login(obj)
    } else {
      Alert.alert('Ops...', 'Preencha todos os campos.')
    }
  }

  // -------------------------------------------------------------------------------//
  // ----------------------------------- LOGIN -------------------------------------//
  // -------------------------------------------------------------------------------//
  login = (obj) => {
    console.log(obj)
    this.setState({ showCarregando: true })
    obj.tokenFCM = this.state.tokenFCM
    Axios.post(server.commonIp + 'login', obj)
      .then((response) => {
        if (response.data) {
          this.setState({ showCarregando: false })
          this.setState({ showLogin: false })
          if (response.data.tipoUsuario == 'cliente') { // retorna dois tipos possíveis: cliente ou dono
            this.Navigation.navigate('NavigatorAgendados', { userId: `${response.data.id}` })
          } else {
            this.Navigation.navigate('NavigatorDono', { userId: `${response.data.id}` })
          }
        } else {
          this.setState({ showCarregando: false })
          Alert.alert('Esse usuário não existe!', 'Você digitou corretamente?')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    return (
      <View style={style.container}>

        {this.state.showCarregando &&
          <Carregando />
        }
        {!this.state.showCarregando &&
          <ImageBackground resizeMode='cover' blurRadius={5} source={imageBackGround} style={style.container}>
            <View style={style.head}>
              <Image source={imageBarber} style={style.imageHead} />
            </View>
            <View style={style.body}>
              <View style={style.viewInput}>
                <Icons name='email' size={30} color='#9d9d9d'></Icons>
                <TextInput placeholder='E-mail' value={this.state.email} onChangeText={text => this.setState({ email: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
              </View>
              <View style={style.viewInput}>
                <Icons name='locked' size={30} color='#9d9d9d'></Icons>
                <TextInput placeholder='Senha' value={this.state.senha} onChangeText={text => this.setState({ senha: text })} placeholderTextColor='#9d9d9d' secureTextEntry={true} style={style.inputText}></TextInput>
              </View>
              <View style={style.viewSwitch}>
                <Text style={{ color: '#9d9d9d' }} >Dono: </Text>
                <Switch onValueChange={(value) => this.setState({ dono: value })}
                  value={this.state.dono}
                  trackColor={{ false: "#9d9d9d", true: "#000" }}
                  thumbColor={this.state.dono ? "#DF0101" : "#F2F2F2"}
                >
                </Switch>
              </View>


              <TouchableHighlight underlayColor={'#12A704'} style={style.button} onPress={() => this.getValues()}>
                <Text style={{ color: 'white' }}>Login</Text>
              </TouchableHighlight>

            </View>

            <View style={style.footer}>
              <TouchableOpacity onPress={() => this.Navigation.navigate('RecuperarSenha')}>
                <Text style={style.textFooter}> Esqueceu a senha? </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.Navigation.navigate('Cadastro', { tokenFCM: this.state.tokenFCM })}>
                <Text style={style.textFooter}> CADASTRE-SE </Text>
              </TouchableOpacity>
            </View>

          </ImageBackground>
        }

      </View>

    )
  }
}






//     )
//   }
// }

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  imageHead: {
    flex: 1,
    width: 170,
    height: 150,
  },
  body: {
    flex: 3,
    marginTop: 20,
    marginHorizontal: 20
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderColor: 'green',
    borderWidth: 1,
    height: 40,
    marginHorizontal: 20,
    marginTop: 20
  },
  footer: {
    flex: 2,
    alignItems: 'center',
  },
  textFooter: {
    color: 'white',
    marginBottom: 20,
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    color: 'white'
  },
  viewSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10
  }
})




