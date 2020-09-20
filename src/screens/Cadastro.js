import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableHighlight, Alert, TextInput, Image, ImageBackground, Switch, TouchableWithoutFeedback } from 'react-native'
import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-picker'
import noAvatar from '../imgs/noavatar.png'
import server from '../hostConfig'

import Axios from 'axios'

import Spinner from '../imgs/spinner.gif'


import imageBackGround from '../imgs/backgroundAgendados.jpg'
import Icons from 'react-native-vector-icons/Fontisto'
import Icons2 from 'react-native-vector-icons/FontAwesome'
import Icons3 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icons4 from 'react-native-vector-icons/Foundation'
import Icons5 from 'react-native-vector-icons/FontAwesome5'





export default class Cadastro extends Component {

    constructor(props) {
        super(props)
        this.navigation = props.navigation
        this.tokenFCM = props.navigation.getParam('tokenFCM')
    }


    state = {
        // ---- CLIENTE -----//
        usuario: null,
        nascimento: null,
        imageURI: null,
        imageType: null,

        // ---- DONO -----//    
        cnpj: null,
        nomeEstabelecimento: null,
        cep: null,
        cidade: null,
        rua: null,
        bairro: null,
        numero: null,

        // ---- AMBOS -----//
        email: null,
        senha: null,
        cpf: null,


        // ---- OUTROS -----//
        showSpinner: false,
        dono: false,
        etapaCadDono: 1
    }

    options = {
        title: 'Escolha uma foto',
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5
    };


    // ----------------------------------------------------------------------------//
    // --------------------BUSCA INFORMAÇOES DE LOCALIZAÇÃO PELO CEP --------------//
    // ----------------------------------------------------------------------------//
    buscarCnpj(data) {
        if (data.toString().length == 14) {
            Axios.get(server.apiCnpj + data)
                .then(res => {
                    const obj = res.data
                    this.setState({
                        nomeEstabelecimento: obj.nome,
                        numero: obj.numero
                    })
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => { this.setState({ showSpinner: false }) })
        }
        this.setState({ cnpj: data })
    }

    // ----------------------------------------------------------------------------//
    // --------------------BUSCA INFORMAÇOES DE LOCALIZAÇÃO PELO CEP --------------//
    // ----------------------------------------------------------------------------//
    buscarCep(data) {
        if (data.toString().length == 8) {
            this.setState({ showSpinner: true })
            Axios.get(server.apiCep + data + '/json/')
                .then(res => {
                    const obj = res.data
                    this.setState({
                        bairro: obj.bairro,
                        rua: obj.logradouro,
                        cidade: obj.localidade
                    })
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => { this.setState({ showSpinner: false }) })
        }
        this.setState({ cep: data })
    }


    // ----------------------------------------------------------------------------//
    // ------------------------SELECIONA OU TIRA UMA FOTO -------------------------//
    // ----------------------------------------------------------------------------//
    selectUserImage = () => {
        ImagePicker.showImagePicker(this.options, (response) => {
            this.setState({
                imageURI: response.uri,
                imageType: response.type
            })
        })
    }

    // -------------------------------------------------------------------------------//
    // ------------------- UPLOAD IMAGEM NOVO USUARIO/ESTBELECIMENTO -----------------//
    // -------------------------------------------------------------------------------//
    uploadUserImage = (obj, lastInsertedId, sucess) => {
        const Url = server.commonIp + 'upload'
        var RNFS = require('react-native-fs')
        RNFS.readFile(obj.imageURI, 'base64').then(data => {

            let compressedImg = data.split('').reduce((o, c) => {
                if (o[o.length - 2] === c && o[o.length - 1] < 35) o[o.length - 1]++;
                else o.push(c, 0);
                return o;
            }, []).map(_ => typeof _ === 'number' ? _.toString(36) : _).join('');

            console.log(compressedImg)
            Axios.post(Url, {
                string64: compressedImg,
                imageId: lastInsertedId,
                tipoConta: obj.tipoConta
            })
                .then(sucess)
                .catch(res => {
                    console.log('Falhou')
                })
        })
    }

    // ----------------------------------------------------------------------------//
    // -------------------- VERIFICA SE ALGUM VALOR DE STATE É NULO ---------------//
    // ----------------------------------------------------------------------------//
    getValues = () => {
        let obj
        if (this.state.dono) {
            obj = Object.assign({}, {
                cnpj: this.state.cnpj,
                cpf: this.state.cpf,
                senha: this.state.senha,
                nomeEstabelecimento: this.state.nomeEstabelecimento,
                email:this.state.email,
                cep: this.state.cep,
                cidade: this.state.cidade,
                rua: this.state.rua,
                bairro: this.state.bairro,
                numero: this.state.numero,
                imageURI: this.state.imageURI,
                imageType: this.state.imageType,
                dono: true,
            })
        } else {
            obj = Object.assign({}, {
                usuario: this.state.usuario,
                senha: this.state.senha,
                email: this.state.email,
                cpf:this.state.cpf,
                nascimento: this.state.nascimento,
                imageURI: this.state.imageURI,
                imageType: this.state.imageType,
                dono: false,
            })
        }

        let sucess = true;
        Object.values(obj).map((item) => {
            if (item == null) { sucess = false; }
            console.log(item)
        })
        if (sucess) this.cadastrar(obj) // Se nenhum campo estiver vazio o usuário poderá ser cadastrado.
        else Alert.alert('Preencha todos os campos!');
    }

    // -------------------------------------------------------------------------------//
    // ------------------------------ CADASTRAR NOVO USUARIO--------------------------//
    // -------------------------------------------------------------------------------//
    cadastrar = (obj) => {
        obj.tokenFCM = this.tokenFCM

        console.log(obj)
        Axios.post(server.commonIp + 'cadastro', obj)
            .then((response) => {
                if (response.data) {
                    this.setState({ showCadastro: false })
                    let sucess = (res) => { if (res) { Alert.alert('Cadastrado com sucesso!') } }
                    this.uploadUserImage(obj, response.data, sucess)
                    this.navigation.navigate('Home')
                } else {
                    console.log(response)
                    Alert.alert('Houve algum erro durante o cadastro.')
                }
            }).catch((error) => {
                console.log(error)
            })
    }


    render() {
        return (

            <View style={style.container}>
                <ImageBackground resizeMode='cover' blurRadius={5} source={imageBackGround} style={style.container}>

                    <View style={style.head}>
                        <TouchableWithoutFeedback onPress={() => this.selectUserImage()}  >
                            <Image source={this.state.imageURI == null ? noAvatar : { uri: this.state.imageURI }} style={style.image}></Image>
                        </TouchableWithoutFeedback>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ color: '#9d9d9d' }}>{this.state.dono ? 'Foto do estabelecimento': 'Escolha uma foto sua' }</Text>
                            <Text style={{ fontSize: 10, color: '#9d9d9d' }}>Toque no Avatar para selecionar!</Text>
                        </View>
                        <View style={style.viewSwitch}>
                            <Text style={{ color: '#9d9d9d' }} >Dono: </Text>
                            <Switch onValueChange={(value) => this.setState({ dono: value, etapaCadDono: 1 })}
                                value={this.state.dono}
                                trackColor={{ false: "#9d9d9d", true: "#9d9d9d" }}
                                thumbColor={this.state.dono ? "#DF0101" : "#F2F2F2"}
                            >
                            </Switch>
                        </View>
                    </View>

                    {this.state.dono &&
                        <View style={style.body}>
                            {this.state.etapaCadDono == 1 &&
                                <View>
                                    <View style={style.viewInputDono}>
                                        <Icons2 name='building' size={30} color='#9d9d9d'></Icons2>
                                        <TextInput placeholder='Nome Comercial' value={this.state.nomeEstabelecimento} onChangeText={text => this.setState({ nomeEstabelecimento: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons name='email' size={30} color='#9d9d9d'></Icons>
                                        <TextInput placeholder='E-mail acessível' value={this.state.email} onChangeText={text => this.setState({ email: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons name='locked' size={30} color='#9d9d9d'></Icons>
                                        <TextInput placeholder='Senha' value={this.state.senha} onChangeText={text => this.setState({ senha: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                </View>
                            }
                            {this.state.etapaCadDono == 2 &&
                                <View>
                                    <View style={style.viewInputDono}>
                                        <Icons4 name='arrows-in' size={30} color='#9d9d9d'></Icons4>
                                        <TextInput placeholder='CEP' value={this.state.cep} onChangeText={text => this.setState({ cep: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons2 name='street-view' size={30} color='#9d9d9d'></Icons2>
                                        <TextInput placeholder='Rua' value={this.state.rua} onChangeText={text => this.setState({ rua: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons3 name='city' size={30} color='#9d9d9d'></Icons3>
                                        <TextInput placeholder='Cidade' value={this.state.cidade} onChangeText={text => this.setState({ cidade: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons5 name='map-marker-alt' size={30} color='#9d9d9d'></Icons5>
                                        <TextInput placeholder='Bairro' value={this.state.bairro} onChangeText={text => this.setState({ bairro: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons5 name='map-marker-alt' size={30} color='#9d9d9d'></Icons5>
                                        <TextInput placeholder='Nº' value={this.state.numero} onChangeText={text => this.setState({ numero: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                </View>
                            }
                            {this.state.etapaCadDono == 3 &&
                                <View>
                                    <View style={style.viewInputDono}>
                                        <Icons5 name='search-location' size={30} color='#9d9d9d'></Icons5>
                                        <TextInput placeholder='CNPJ' value={this.state.cnpj} onChangeText={text => this.setState({ cnpj: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                    <View style={style.viewInputDono}>
                                        <Icons name='asterisk' size={30} color='#9d9d9d'></Icons>
                                        <TextInput placeholder='Seu CPF' value={this.state.cpf} onChangeText={text => this.setState({ cpf: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                                    </View>
                                </View>
                            }

                            <View style={style.viewPassadores}>
                                <View style={{ flex: 1, alignItems: 'flex-start' }}>
                                    {this.state.etapaCadDono > 1 &&
                                        <TouchableHighlight style={style.passadores} underlayColor='green' onPress={() => { (this.state.etapaCadDono > 1 ? this.setState({ etapaCadDono: this.state.etapaCadDono - 1 }) : null) }}>
                                            <Icons name='angle-left' size={20} color='green' />
                                        </TouchableHighlight>
                                    }
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    {this.state.etapaCadDono < 3 &&
                                        <TouchableHighlight style={style.passadores} underlayColor='green' onPress={() => { (this.state.etapaCadDono < 3 ? this.setState({ etapaCadDono: this.state.etapaCadDono + 1 }) : null) }}>
                                            <Icons name='angle-right' size={20} color='green' />
                                        </TouchableHighlight>
                                    }
                                </View>



                            </View>


                        </View>
                    }
                    {!this.state.dono &&
                        <View style={style.body}>
                            <View style={style.viewInputCliente}>
                                <Icons name='person' size={30} color='#9d9d9d'></Icons>
                                <TextInput placeholder='Nome' value={this.state.usuario} onChangeText={text => this.setState({ usuario: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                            </View>
                            <View style={style.viewInputCliente}>
                                <Icons name='asterisk' size={30} color='#9d9d9d'></Icons>
                                <TextInput placeholder='CPF' value={this.state.cpf} onChangeText={text => this.setState({ cpf: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                            </View>
                            <View style={style.viewInputCliente}>
                                <Icons name='email' size={30} color='#9d9d9d'></Icons>
                                <TextInput placeholder='E-mail acessível' value={this.state.email} onChangeText={text => this.setState({ email: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                            </View>
                            <View style={style.viewInputCliente}>
                                <Icons name='locked' size={30} color='#9d9d9d'></Icons>
                                <TextInput placeholder='Senha' value={this.state.senha} onChangeText={text => this.setState({ senha: text })} placeholderTextColor='#9d9d9d' style={style.inputText}></TextInput>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 15 }}>
                                <Text style={{ color: '#9d9d9d' }}>Nascimento:</Text>
                                <DatePicker mode='date' date={this.state.nascimento} onDateChange={date => this.setState({ nascimento: date })} format={'DD-MM-YYYY'} customStyles={{ dateInput: { borderWidth: 0, }, dateText: { color: '#9d9d9d' } }} />
                            </View>
                        </View>
                    }

                    <View style={style.footer}>
                        {(!this.state.dono || this.state.etapaCadDono == 3) &&
                            <TouchableHighlight underlayColor={'#12A704'} style={style.button} onPress={() => this.getValues()}>
                                <Text style={{ color: 'white' }}>Cadastrar</Text>
                            </TouchableHighlight>
                        }

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
    head: {
        flex:1,
        minHeight:100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bodyCliente: {
        flex: 2,
        justifyContent: 'center'
    },
    bodyDono: {
        flex: 2,
        justifyContent: 'center',
    },
    footer: {
        flex: 1,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 30,
        borderWidth: 1,
        backgroundColor: '#BDBDBD'
    },
    viewInputDono: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20
    },
    viewInputCliente: {
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
        color: 'white',
    },
    viewSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 20
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderColor: 'green',
        borderWidth: 1,
        height: 40,
        marginHorizontal: 40,
        marginTop: 20
    },
    viewPassadores: {
        flexDirection: 'row',

        marginHorizontal: 20,
    },
    passadores: {
        borderWidth: 1,
        borderColor: 'green',
        borderRadius: 10,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})






















    // render(){
    //     return(

    //         <View style={style.container}>

    //                 <View style={style.header}>
    //                     <Text style={{fontSize:20}}>Cadastro</Text>
    //                 </View>

    //                 <View style={style.body}>
    //                             <View style={style.selectImage}>
    //                                 <TouchableWithoutFeedback onPress={()=> this.selectUserImage()}  >
    //                                     <Image source={ this.state.imageURI == null ? noAvatar :{uri:this.state.imageURI}} style={style.image}></Image>
    //                                 </TouchableWithoutFeedback>
    //                                 <View style={{alignItems:'center'}}>
    //                                     <Text>{this.state.tipoConta == 'cliente'? 'Escolha uma foto sua':'Foto do estabelecimento'}</Text>  
    //                                     <Text style={{fontSize:10}}>Toque no Avatar para selecionar!</Text>
    //                                 </View>
    //                             </View>
    //                     {
    //                         this.state.tipoConta == 'cliente' &&
    //                             <View style={{flex:2}}>
    //                                 <View style={style.viewInputs}>
    //                                     <TextInput  onChangeText={text => this.setState({usuario:text})}  value={this.state.usuario} textAlign='center' placeholder={'Informe seu nome'}  style={style.input}/>
    //                                     <TextInput  onChangeText={text => this.setState({senha:text})}    value={this.state.senha}   textAlign='center' placeholder={'Informe uma senha'} style={style.input}/>
    //                                     <TextInput  onChangeText={text => this.setState({email:text})}    value={this.state.email}   textAlign='center' placeholder={'Informe um E-mail'} style={style.input}/>
    //                                 </View>
    //                                 <View style={{flexDirection:'row', alignItems:'center'}}>
    //                                     <Text>Nascimento:</Text>
    //                                     <DatePicker  mode='date' date={this.state.nascimento} onDateChange={date => this.setState({nascimento:date})} format={'DD-MM-YYYY'} customStyles={{dateInput:{borderWidth:0}}}/>
    //                                 </View> 
    //                             </View>
    //                     }

    //                     <View style={style.tipoConta}>
    //                         <Text>Tipo de conta:</Text>
    //                         <Picker 
    //                         mode='dialog'
    //                         selectedValue={this.state.tipoConta}
    //                         onValueChange={(itemValue) => this.setState({tipoConta:itemValue})}
    //                         style={{ height: 50, width: 115 }}>
    //                             <Picker.Item value='cliente' label='Cliente'></Picker.Item>
    //                             <Picker.Item value='dono' label='Dono'></Picker.Item>
    //                         </Picker>
    //                     </View>
    //                     { 
    //                         this.state.tipoConta == 'dono' &&
    //                         <View style={{flex:4}}>
    //                             <TextInput  onChangeText={text => this.buscarCnpj(text)}  value={this.state.cnpj} textAlign='center' placeholder={'CNPJ'}  style={style.input}/>
    //                             <TextInput  onChangeText={text => this.setState({nomeEstabelecimento:text})}  value={this.state.nomeEstabelecimento}   textAlign='center' placeholder={'Nome comercial'} style={[style.input]}/>
    //                             <TextInput  onChangeText={text => this.setState({senha:text})}  value={this.state.senha} textAlign='center' placeholder={'Senha de acesso'}  style={style.input}/>
    //                             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
    //                                 <View style={{width:'40%'}}>
    //                                     <TextInput  onChangeText={text => { this.buscarCep(text) }}  value={this.state.cep} textAlign='center' placeholder={'CEP'}  style={[style.input,{}]}/>
    //                                     {this.state.showSpinner && 
    //                                         <Image source={Spinner} style={{height:20,width:20}}/>
    //                                     }
    //                                 </View>
    //                                 <View style={{justifyContent:'center',alignItems:'center',width:'10%'}}>
    //                                     {this.state.showSpinner && 
    //                                         <Image source={Spinner} style={{height:20,width:20}}/>
    //                                     }
    //                                 </View>
    //                                 <View style={{width:'40%'}}>
    //                                     <TextInput  onChangeText={text => this.setState({cidade:text})}  value={this.state.cidade} textAlign='center' placeholder={'Cidade'}  style={[style.input,{}]}/>
    //                                 </View>
    //                             </View>
    //                             <TextInput  onChangeText={text => this.setState({rua:text})}  value={this.state.rua}   textAlign='center' placeholder={'Rua'} style={[style.input]}/>
    //                             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
    //                                 <View style={{width:'60%'}}>
    //                                     <TextInput  onChangeText={text => this.setState({bairro:text})}  value={this.state.bairro} textAlign='center' placeholder={'Bairro'}  style={[style.input,{}]}/>
    //                                 </View>
    //                                 <View style={{width:'30%'}}>
    //                                     <TextInput  onChangeText={text => this.setState({numero:text})}  value={this.state.numero} textAlign='center' placeholder={'N°'}  style={[style.input,{}]}/>
    //                                 </View>
    //                             </View>
    //                         </View>

    //                     }
    //                 </View>

    //                 <View style={style.footer}>
    //                     <TouchableHighlight underlayColor={'#12A704'} style={style.button} onPress={() =>{this.getValues()}}>
    //                         <Text style={style.textButton}>Confirmar</Text>
    //                     </TouchableHighlight>
    //                 </View>
    //         </View>
    //     )
    // }


// const style = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     header: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#FE2E64',
//         width: '100%'
//     },
//     body: {
//         flex: 8,
//         marginTop: 10,
//         justifyContent: 'space-between',
//     },
//     footer: {
//         flex: 1,
//         margin: 20,
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'flex-end',
//     },
//     input: {
//         borderWidth: 1,
//         borderLeftColor: 'transparent',
//         borderRightColor: 'transparent',
//         borderTopColor: 'transparent',
//         borderLeftColor: 'transparent',
//         height: 40,
//         marginBottom: 5
//     },
//     viewInputs: {
//         marginTop: 20,
//         justifyContent: 'space-evenly'
//     },
//     button: {
//         borderRadius: 20,
//         borderColor: '#12A704',
//         width: '100%',
//         height: 45,
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//     },
//     textButton: {
//         fontStyle: 'italic',
//         color: '#424242'
//     },
//     image: {
//         width: 50,
//         height: 50,
//         borderRadius: 30,
//         borderWidth: 1,
//         backgroundColor: '#BDBDBD'
//     },
//     selectImage: {
//         flex: 1,
//         alignItems: 'center'
//     },
//     tipoConta: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center'
//     }
// });