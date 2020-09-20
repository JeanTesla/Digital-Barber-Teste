import React, { Component} from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image, TextInput, Alert} from 'react-native'

import Icons from 'react-native-vector-icons/FontAwesome5'

import Imagem from '../imgs/noavatar.png'
import Spinner from '../imgs/spinner.gif'

import server from '../hostConfig'
import Axios from 'axios'

export default class DefinicoesDono extends Component{

    state = {
        nomeEstabelecimento:'1',
        clientesPorDia:'2',
        multFaturamento:'3',
        cnpj:'08540403000135',
        cep:'5',
        cidade:'6',
        rua:'7',
        bairro:'8',
        numero:'9',
        showSpinner:false
    }

    saveSettings(){

    }

    /*
    Consulta de CNPJ
    https://www.receitaws.com.br/v1/cnpj/08540403000135

    
    */

   buscarCnpj(data){
    if(data.toString().length == 14){
        Axios.get(server.apiCnpj + data)
        .then(res=>{
            const obj = res.data  
            Alert.alert('',JSON.stringify(obj.nome))
        })
        .catch(error=>{
            console.log(error)
        })
        .finally(()=> {this.setState({showSpinner:false})})
    }
    this.setState({cnpj:data})
}


    buscarCep(data){
        if(data.toString().length == 8){
            this.setState({showSpinner:true})
            Axios.get(server.apiCep + data +'/json/')
            .then(res=>{
                const obj = res.data
                this.setState({
                    bairro: obj.bairro,
                    rua:obj.logradouro,
                    cidade:obj.localidade
                })
            })
            .catch(error=>{
                console.log(error)
            })
            .finally(()=> {this.setState({showSpinner:false})})
        }
        this.setState({cep:data})
    }


    render(){
        return(
            <View style={style.container}>
                    <View style={style.body}>
                        <View style={style.selectImage}>
                            <TouchableWithoutFeedback onPress={()=> this.selectUserImage()}  >
                                <Image  source={ Imagem }  style={style.image}></Image>
                            </TouchableWithoutFeedback>
                            <View style={{alignItems:'center'}}>
                                <Text>Alterar foto</Text>  
                                <Text style={{fontSize:10}}>Toque no Avatar para selecionar!</Text>
                            </View>
                        </View>

                        <Text style={style.titleTextInput}>Nome Comercial</Text>
                        <TextInput style={style.textInput} onChangeText={(text)=> this.setState({nomeEstabelecimento:text})} value={this.state.nomeEstabelecimento}></TextInput>

                        <View style={style.textInputCustom}>
                            <View style={{alignItems:'center',width:'45%'}}>
                                <Text style={style.titleTextInput}>Clientes por Dia</Text>
                                <TextInput style={[style.textInput,{width:'100%'}]} onChangeText={(text)=> this.setState({clientesPorDia:text})} value={this.state.clientesPorDia}></TextInput>
                            </View>
                            <View style={{alignItems:'center',width:'45%'}}>
                                <Text style={style.titleTextInput}>Mult. Faturamento</Text>
                                <TextInput style={[style.textInput,{width:'100%'}]} onChangeText={(text)=> this.setState({multFaturamento:text})} value={this.state.multFaturamento}></TextInput>
                            </View>
                        </View>

                        <Text style={style.titleTextInput}>CNPJ</Text>
                        <TextInput onChangeText={(text)=> this.buscarCnpj(text)} value={this.state.cnpj} style={style.textInput}></TextInput>
                        

                        <View style={style.textInputCustom}>
                            <View style={{alignItems:'center',width:'40%'}}>
                                <View style={{flexDirection:'row',marginVertical:3,alignItems:'center',justifyContent:'space-between'}}>
                                    <Text>CEP</Text>
                                    {this.state.showSpinner && 
                                        <Image source={Spinner} style={{height:20,width:20}}/>
                                    }
                                </View>
                                <TextInput style={[style.textInput,{width:'100%'}]} value={this.state.cep} onChangeText={data=> this.buscarCep(data) }></TextInput>
                            </View>
                            <View style={{alignItems:'center',width:'55%'}}>
                                <Text style={style.titleTextInput}>Cidade</Text>
                                <TextInput style={[style.textInput,{width:'100%'}]} value={this.state.cidade} onChangeText={data=> this.setState({cidade:data})}></TextInput>
                            </View>
                        </View>

                        <Text style={style.titleTextInput}>Rua</Text>
                        <TextInput value={this.state.rua} onChangeText={data=> this.setState({rua:data})} style={style.textInput}></TextInput>

                        <View style={style.textInputCustom}>
                            <View style={{alignItems:'center',width:'60%'}}>
                                <Text style={style.titleTextInput}>Bairro</Text>
                                <TextInput style={[style.textInput,{width:'100%'}]} value={this.state.bairro} onChangeText={data=> this.setState({bairro:data})}></TextInput>
                            </View>
                            <View style={{alignItems:'center',width:'30%'}}>
                                <Text style={style.titleTextInput}>N°</Text>
                                <TextInput style={[style.textInput,{width:'100%'}]} onChangeText={(text)=> this.setState({numero:text})} value={this.state.numero}></TextInput>
                            </View>
                        </View>
                       
                    </View>

            </View>
        )
    }
}


const style = StyleSheet.create({

    container:{
        flex:1
    },
    body:{
        flex:12
    },
    viewTitle:{
        backgroundColor:'#0404B4',
        flex:1
    },
    viewTextTitle:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    title:{
        fontFamily: 'cursive',
        fontSize:30,
        color:'white',
    },
    selectImage:{
        alignItems:'center',
        marginTop:20
    },
    image:{
        width:50,
        height:50,
        borderRadius:30,
        borderWidth:1,
        backgroundColor:'#BDBDBD'
    },
    titleTextInput:{
        marginHorizontal:25,
        marginVertical:3,
        textAlign:'center'
    },
    textInput:{
        marginHorizontal:20,
        paddingVertical:1,
        borderWidth:1,
        borderRadius:20,
        backgroundColor:'#E6E6E6',
        fontSize:15,
        paddingHorizontal:20,
        height:30,
        textAlign:'center'
    },
    textInputCustom:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginHorizontal:20
    },
  })
  