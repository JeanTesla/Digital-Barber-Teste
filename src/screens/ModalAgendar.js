import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, TouchableHighlight, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'
import DateTimePicker from '@react-native-community/datetimepicker';


class ModalAgendar extends Component {


    state = {
        showDatePicker: false,
        horaPrevista: null
    }

    initialState = this.state;

    // ----------------------------------------------------------------------------//
    // ------------------------- VERIFICA OS VALORES DE STATE ---------------------//
    // ----------------------------------------------------------------------------//
    getValues = () => {
        let sucess = true
        Object.values({ ...this.state }).map(item => {
            if (item === null) sucess = false
        })
        if (!sucess) {
            console.log(this.state)
            Alert.alert('Informe a hora prevista.')
        } else {
            this.props.agendar({ ...this.state })
            this.setState(this.initialState)
        }
    }

    render() {
        return (
            
                <View style={style.container}>
                    <View style={style.modal}>

                        <View style={style.header}>
                            <Text>Agendar</Text>
                        </View>

                        <View style={style.body}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ marginTop: 15 }}>Agendar para:</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <Text style={{ marginTop: 10 }}>Hora prevista:</Text>
                                <TouchableOpacity onPress={() => { this.setState({ showDatePicker: true }) }}>
                                    <Icon name='clock-o' size={40}> </Icon>
                                </TouchableOpacity>

                                {
                                    this.state.showDatePicker &&
                                    <DateTimePicker testID="dateTimePicker"
                                        timeZoneOffsetInMinutes={0}
                                        value={new Date()}
                                        mode={'time'}
                                        is24Hour={true}
                                        display='clock'
                                        onChange={data => { this.setState({ horaPrevista: data }) }}
                                        onTouchCancel={this.setState({ showDatePicker: false })}>
                                    </DateTimePicker>
                                }

                            </View>

                        </View>

                        <View style={style.footer}>
                            <TouchableHighlight style={style.button} onPress={this.props.close}>
                                <Text style={style.textButton}>Cancelar</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={style.button} onPress={() => { this.getValues() }}>
                                <Text style={style.textButton}>Confirmar</Text>
                            </TouchableHighlight>
                        </View>

                    </View>
                </View>
        )
    }
}

export default ModalAgendar

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    modal: {
        backgroundColor: '#E6E6E6',
        width: Dimensions.get('screen').width / 1.3,
        height: Dimensions.get('screen').height / 3,
        borderRadius: 20,
    },
    header: {
        height: 35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FE2E64',
        borderRadius: 10,
    },
    body: {
        flex: 3,
        margin: 20,
        marginTop: 10,
        justifyContent: 'space-between',

    },
    footer: {
        flex: 1,
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    button: {
        borderRadius: 34,
        width: Dimensions.get('screen').width / 3.5,
        height: 45,
        backgroundColor: '#81BEF7',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textButton: {
        fontStyle: 'italic',
        color: '#424242'
    },
    picker: {
        width: 120,
    }
});