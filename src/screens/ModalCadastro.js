import React, { Component } from 'react'
import {Modal, View, Text, StyleSheet, Dimensions,TouchableHighlight, TouchableWithoutFeedback, Alert, TextInput, Image, Picker} from 'react-native'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'
import noAvatar from '../imgs/noavatar.png'



export default class Cadastro extends Component{

    state = {
        usuario:null,
        senha:null,
        email:null,
        nascimento:null,
        imageURI:null,
        imageType:null,
        tipoConta:'dono',
            
        cnpj:null,
        senha:null,
        nomeEstabelecimento:null,
        bairro:null,
        rua:null,
        numero:null
    }

    options = {
        title: 'Escolha uma foto',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5
    };
    // componentDidUpdate(prevProps) {
    //     if (prevProps.date !== this.props.date) { 
    //         this.setState({nascimento: prevProps.date}); 
    //     } 
    // }
    // ----------------------------------------------------------------------------//
    // ------------------------SELECIONA OU TIRA UMA FOTO -------------------------//
    // ----------------------------------------------------------------------------//
    selectUserImage = () =>{
        ImagePicker.showImagePicker(this.options,(response)=>{
            this.setState({
                imageURI:response.uri,
                imageType:response.type
            })
        })
    }
      
    // ----------------------------------------------------------------------------//
    // -------------------- VERIFICA SE ALGUM VALOR DE STATE É NULO ---------------//
    // ----------------------------------------------------------------------------//

    getValues = ()=>{   
        let obj

        if(this.state.tipoConta == 'cliente'){
            obj = Object.assign({},{
                usuario:this.state.usuario,
                senha:this.state.senha,
                email:this.state.email,
                nascimento:this.state.nascimento,
                imageURI:this.state.imageURI,
                imageType:this.state.imageType,
                tipoConta:'cliente',
            })
        }else{
            obj = Object.assign({},{
                cnpj:this.state.cnpj,
                senha:this.state.senha,
                nomeEstabelecimento:this.state.nomeEstabelecimento,
                bairro:this.state.bairro,
                rua:this.state.rua,
                numero:this.state.numero,
                imageURI:this.state.imageURI,
                imageType:this.state.imageType,
                tipoConta:'dono',
            })
        }

        let sucess = true;
        Object.values(obj).map((item) =>{
            if(item == null){ sucess = false;} 
        })
        if(sucess) this.props.cadastrar(obj) // Se nenhum campo estiver vazio o usuário poderá ser cadastrado.
        else Alert.alert('Preencha todos os campos!')
    }

    render(){
        return(
        <Modal  animationType="slide"
                transparent={true}
                visible={this.props.visible}>
            <View style={style.container}>
                <View style={
                        {
                            backgroundColor:'#E6E6E6',
                            width: '100%',
                            height: this.state.tipoConta == 'cliente'? '80%' : '90%', 
                            borderRadius:20,
                        }
                    }>
                    <View style={style.header}>
                        <Text>Cadastro</Text>
                    </View>

                    <View style={style.body}>
                                <View style={style.selectImage}>
                                    <TouchableWithoutFeedback onPress={()=> this.selectUserImage()}  >
                                        <Image source={ this.state.imageURI == null ? noAvatar :{uri:this.state.imageURI}} style={style.image}></Image>
                                    </TouchableWithoutFeedback>
                                    <View style={{alignItems:'center'}}>
                                        <Text>{this.state.tipoConta == 'cliente'? 'Escolha uma foto sua':'Foto do estabelecimento'}</Text>  
                                        <Text style={{fontSize:10}}>Toque no Avatar para selecionar!</Text>
                                    </View>
                                </View>
                        {
                            this.state.tipoConta == 'cliente' &&
                                <View>
                                    <View style={style.viewInputs}>
                                        <TextInput  onChangeText={text => this.setState({usuario:text})}  value={this.state.usuario} textAlign='center' placeholder={'Informe seu nome'}  style={style.input}/>
                                        <TextInput  onChangeText={text => this.setState({senha:text})}    value={this.state.senha}   textAlign='center' placeholder={'Informe uma senha'} style={style.input}/>
                                        <TextInput  onChangeText={text => this.setState({email:text})}    value={this.state.email}   textAlign='center' placeholder={'Informe um E-mail'} style={style.input}/>
                                    </View>
                                    <View style={{flexDirection:'row', alignItems:'center'}}>
                                        <Text>Nascimento:</Text>
                                        <DatePicker  mode='date' date={this.state.nascimento} onDateChange={date => this.setState({nascimento:date})} format={'DD-MM-YYYY'} customStyles={{dateInput:{borderWidth:0}}}/>
                                    </View> 
                                </View>
                        }
                        
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
                        { 
                            this.state.tipoConta == 'dono' &&
                            <View>
                                <TextInput  onChangeText={text => this.setState({cnpj:text})}  value={this.state.cnpj} textAlign='center' placeholder={'CNPJ'}  style={style.input}/>
                                <TextInput  onChangeText={text => this.setState({senha:text})}  value={this.state.senha} textAlign='center' placeholder={'Senha de acesso'}  style={style.input}/>
                                <TextInput  onChangeText={text => this.setState({nomeEstabelecimento:text})}  value={this.state.nomeEstabelecimento}   textAlign='center' placeholder={'Nome comercial'} style={[style.input]}/>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{width:'40%'}}>
                                        <TextInput  onChangeText={text => this.setState({senha:text})}  value={this.state.senha} textAlign='center' placeholder={'CEP'}  style={[style.input,{}]}/>
                                    </View>
                                    <View style={{width:'45%'}}>
                                        <TextInput  onChangeText={text => this.setState({senha:text})}  value={this.state.senha} textAlign='center' placeholder={'Cidade'}  style={[style.input,{}]}/>
                                    </View>
                                </View>
                                <TextInput  onChangeText={text => this.setState({nomeEstabelecimento:text})}  value={this.state.nomeEstabelecimento}   textAlign='center' placeholder={'Rua'} style={[style.input]}/>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <View style={{width:'50%'}}>
                                        <TextInput  onChangeText={text => this.setState({senha:text})}  value={this.state.senha} textAlign='center' placeholder={'Bairro'}  style={[style.input,{}]}/>
                                    </View>
                                    <View style={{width:'30%'}}>
                                        <TextInput  onChangeText={text => this.setState({senha:text})}  value={this.state.senha} textAlign='center' placeholder={'N°'}  style={[style.input,{}]}/>
                                    </View>
                                </View>
                            </View>
                            
                        }
                    </View>

                    <View style={style.footer}>
                        <TouchableHighlight style={style.button} onPress={this.props.close}>
                            <Text style={style.textButton}>Cancelar</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={style.button} onPress={() =>{this.getValues()}}>
                            <Text style={style.textButton}>Confirmar</Text>
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
    header:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#FE2E64',
        borderRadius:10,
    },
    body:{
        flex:6,
        margin:20,
        marginTop:10,
        justifyContent:'space-between',
    },
    footer:{
        flex:1,
        margin:20,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-end',
        backgroundColor:'#AAA'
    },
    input:{
        borderWidth:1,
        borderLeftColor:'transparent',
        borderRightColor:'transparent',
        borderTopColor:'transparent',
        borderLeftColor:'transparent',
        height:40,
    },
    viewInputs:{
        marginTop:20,
        justifyContent:'space-evenly'
    },
    button:{
        borderRadius:34,
        width: '40%',
        height: 45,
        backgroundColor:'#81BEF7',
        margin:10,
        alignItems:'center',
        justifyContent:'center'
      },
      textButton:{
        fontStyle:'italic',
        color:'#424242'
      },
      image:{
          width:50,
          height:50,
          borderRadius:30,
          borderWidth:1,
          backgroundColor:'#BDBDBD'
      },
      selectImage:{
          alignItems:'center'
      },
      tipoConta:{
        flexDirection:'row',
        alignItems:'center'
      }
  });