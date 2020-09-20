import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import Home from './src/screens/Home' 
import NavigatorAgendados from './src/screens/NavigatorAgendados'
import NavigatorDono from './src/screens/NavigatorDono'
import Cadastro from './src/screens/Cadastro'
import RecuperarSenha from './src/screens/RecuperarSenha'

const Routes = createStackNavigator({
  Home:{
    screen: Home,
    navigationOptions:{title:'', headerShown:false}
  },
  Cadastro:{
    screen: Cadastro,
    navigationOptions:{title:'', headerShown:false}
  },
  RecuperarSenha:{
    screen: RecuperarSenha,
    navigationOptions:{title:'', headerShown:false}
  },
  NavigatorAgendados:{
    screen: NavigatorAgendados,
    navigationOptions:{title:'Sair', headerTransparent:true, headerTintColor:'red', headerShown:false,},
  },
  NavigatorDono:{
    screen: NavigatorDono,
    navigationOptions:{title:'Sair', headerTransparent:true, headerTintColor:'red', headerShown:false },
  },
});

export default createAppContainer(Routes);