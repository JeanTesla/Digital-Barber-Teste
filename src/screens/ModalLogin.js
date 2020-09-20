import React, { Component } from 'react'
import {Modal, View, Text, StyleSheet, Dimensions,TouchableHighlight, Alert, TextInput,Picker} from 'react-native'


export default class Login extends Component{
    state = {
        modalVisible:false,
        emailCnpj:null,
        senha:null,
        tipoConta:'cliente'
    }

    // ----------------------------------------------------------------------------//
    // --------------------- VERIFICA SE ALGUM VALOR DE STATE É NULO --------------//
    // ----------------------------------------------------------------------------//
    getValues = ()=>{
        const obj = {...this.state}
        let sucess = true;
        Object.values(obj).map((item) =>{
            if(item == null){ sucess = false;} 
        })
        if(sucess) this.props.login(obj) // Se nenhum campo estiver vazio o usuário poderá ser cadastrado.
        else Alert.alert('Preencha todos os campos!')
    }

    render(){
        return(
                <Modal  animationType="slide"
                        transparent={true}
                        visible={this.props.visible}>
                    <View style={style.container}>
                        <View style={style.modal}>
                            <View style={style.header}>
                                <Text>Login</Text>
                            </View>
                            <View style={style.body}>
                                <View style={style.tipoConta}>
                                    <Text>Tipo de conta:</Text>
                                    <Picker 
                                    mode='dialog'
                                    selectedValue={this.state.tipoConta}
                                    onValueChange={(itemValue) => this.setState({tipoConta:itemValue})}
                                    style={{ height: 50, width: 115 }}>
                                        <Picker.Item value='cliente' label='Cliente'></Picker.Item>
                                        <Picker.Item value='dono' label='Dono'></Picker.Item>
                                    </Picker>
                                </View>

                                <TextInput  onChangeText={text => this.setState({emailCnpj:text})} value={this.state.emailCnpj}  textAlign='center' placeholder={this.state.tipoConta == 'cliente'?'Informe seu E-mail':'Informe o CNPJ'} style={style.input}/>
                                <TextInput  onChangeText={text => this.setState({senha:text})} value={this.state.senha}  textAlign='center' placeholder={'Informe sua senha'} style={style.input}/>
                            </View>
                            <View style={style.footer}>
                                <TouchableHighlight underlayColor={'#FE2E64'} style={[style.button,{  borderColor:'#FE2E64'}]} onPress={this.props.close}>
                                    <Text style={style.textButton}>Cancelar</Text>
                                </TouchableHighlight>
                                <TouchableHighlight underlayColor={'#12A704'} style={[style.button,{  borderColor:'#12A704'}]} onPress={() => this.getValues()}>
                                    <Text style={style.textButton}>Entrar</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
        )
    }
}

const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.8)'
    },
    modal:{
        backgroundColor:'#E6E6E6',
        width: '80%',
        height: Dimensions.get('screen').height / 2.3, 
        borderRadius:20
    },
    header:{
        height:35,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FE2E64',
        borderRadius:10,
    },
    body:{
        flex:2,
        margin:20,
        justifyContent:'space-between',
    },
    footer:{
        flex:1,
        margin:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'flex-end'
    },
    input:{
        borderWidth:1,
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        borderTopColor:'transparent',
        borderLeftColor:'transparent',
        height:40,
    },
    button:{
        borderRadius:20,
        width: '40%',
        height: 45,
        alignItems:'center',
        justifyContent:'center',
        borderWidth:1,
      },
      textButton:{
        fontStyle:'italic',
        color:'#424242'
      },
      tipoConta:{
        flexDirection:'row',
        alignItems:'center'
      }
  });