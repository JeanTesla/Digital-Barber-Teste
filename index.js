

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import Routes from './Routes'
import {StatusBar} from 'react-native'
StatusBar.setHidden(true)

AppRegistry.registerComponent(appName, () => Routes);
