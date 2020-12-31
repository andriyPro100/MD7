import React from 'react';
import {useState} from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  StatusBar,
  TouchableHighlight, Image, ScrollView, SafeAreaView, FlatList, ActivityIndicator,
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {launchImageLibrary} from 'react-native-image-picker';
import { VictoryChart, VictoryLine } from "victory-native";
import { PieChart } from 'react-native-svg-charts'
import { SearchBar } from 'react-native-elements';

class ItemFilm extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      title: props.title,
      year: props.year,
      type: props.type,
      poster: props.poster,
    }
  }

  render() {
    return (
      <View style={styles.item}>
        <Image style={styles.logoS} source={{uri: this.state.poster}}/>
        <View style={styles.information}>
          <Text style={{fontSize: 14}}>{this.state.title}</Text>
          <Text style={{marginVertical: 10, fontSize: 12}}>{this.state.year}</Text>
        </View>
      </View>
    )
  }
}

function DetailScreen({ route, navigation }) {
  const [detail, setDetail] = useState([])

  const {item} = route.params
  const imdb = item.imdbID
  const KEY = "725b4a4c"

  const listItems = [<Image style={styles.logoN} source={{uri: item.Poster}}/>]
  fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${imdb}`)
    .then((response) => response.json())
    .then((json) => {
      setDetail(json)
    })
    .catch((error) => {
      console.error(error);
    });

  for (const [k, v] of Object.entries(a)) {
    listItems.push(<Text>{k}: {v}</Text>)
  }


  // const HaveDetail = ({imdb}) => {
  //   getDetail(imdb)
  //   console.log(detail)
  //   const listItems = [<Image style={styles.logoN} source={{uri: item.Poster}}/>]
  //   for (let key in detail) {
  //
  //     // if ((key === "Poster") || (key === "imdbID")){
  //     //
  //     // }else {
  //       listItems.push(<Text style={styles.innerText}>{key}</Text>)
  //     // }
  //   }
  //   return listItems
  // }

  return (
    <View style={{ flex: 1}}>
      <ScrollView>
        {listItems}
      </ScrollView>
    </View>
  )
}

function AddNewFilmScreen({navigation}) {
  return (
    <View>
      <Text>add new film screen</Text>
    </View>
  )
}

function OptionsScreen({route, navigation}) {

  return (
    <View>
      <Text>option screen</Text>
    </View>
  )
}

function HomeScreen({navigation}) {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('')

  const SetSearch = (text) => {
    const KEY = "725b4a4c"
    const re = / /gi
    const ntext = text.replace(re, "+")
    setSearch(text)
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${ntext}&page=1`)
      .then((response) => response.json())
      .then((json) => {
        setResult(json.Search)
      })
      .catch((error) => {
        console.error(error);
      });
  }
  const renderItem = ({ item }) => (
    <View>
      <TouchableHighlight onPress={() => navigation.navigate('Detail', {item: item})}>
        <View>
          <ItemFilm title={item.Title} year={item.Year} type={item.Type} poster={item.Poster} imdbID={item.imdbID}/>
        </View>
      </TouchableHighlight>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={(text) => SetSearch(text)}
        value={search}
        lightTheme={true}/>
      <FlatList
        data={result}
        renderItem={renderItem}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>
  )
}

function GraphScreen({navigation}) {
  let renderScreen = []
  const [figure, setFigure] = useState(true)
  var x = [-6.28, -5.38, -4.48, -3.58, -2.68, -1.78, -0.88, 0.02, 0.92, 1.82, 2.72, 3.62, 4.52, 5.42];
  var y = x.map(Math.sin);

  const data = [{size:25, color:"yellow"},
                {size:20, color:"green"},
                {size:55, color:"blue"},]

  const randomColor = () => ('#' + ((Math.random() * 0xffffff) << 0).toString(16) + '000000').slice(0, 7)

  const pieData = data
    .map((value, index) => ({
      value:value.size,
      svg: {
        fill: value.color,
      }
    }))
  if (figure === true){
    renderScreen = [
      <View>
        <View style={styles.butFig}>
          <Button
            onPress={() => setFigure(!figure)}
            title="graph"
            color="#00aa00"
            style={styles.butFig}
          />
        </View>
        <View >
          <VictoryChart>
            <VictoryLine
              data={[-6.28, -5.88, -5.48, -5.08, -4.68, -4.28, -3.88, -3.48, -3.08, -2.68, -2.28, -1.88, -1.48, -1.08, -0.68, -0.28, 0.12, 0.52, 0.92, 1.32, 1.72, 2.12, 2.52, 2.92, 3.32, 3.72, 4.12, 4.52, 4.92, 5.32, 5.72, 6.12].map((t) => ({ t }))}
              sortKey="t"
              x = {(d) => d.t}
              y={(d) => Math.sin(d.t)}
            />
          </VictoryChart>
        </View>
      </View>
    ]
  }else {
    renderScreen = [
      <View>
        <View style={styles.butFig}>
          <Button
            onPress={() => setFigure(!figure)}
            title="diagram"
            color="#0000aa"
            style={styles.butFig}
          />
        </View>
        <View>
          <PieChart style={{ height: 200 }} data={pieData} />
        </View>
      </View>
    ]
  }
  return renderScreen
}

const GStack = createStackNavigator();

function GraphStackScreen({navigation}){
  return (
    <Stack.Navigator>
      <GStack.Screen name='Graph'
                     component={GraphScreen}
      />
    </Stack.Navigator>
  )
}

const HStack = createStackNavigator();

function HomeStackScreen({navigation}){
  function LogoTitle({navigation}) {
    return (
      <View style={styles.addFilm}>
        <TouchableHighlight onPress={() => navigation.navigate("Add")}>
          <View>
            <Text style={{ fontSize: 30 }}>+</Text>
          </View>
        </TouchableHighlight>
      </View>

    );
  }

  return (

    <HStack.Navigator>
      <HStack.Screen name='Home'
                     component={HomeScreen}
                     options={{headerRight: props => LogoTitle({navigation})}}
      />
      <HStack.Screen name="Detail" component={DetailScreen}/>
      <HStack.Screen name="Add" component={AddNewFilmScreen}/>
      <HStack.Screen name="Options" component={OptionsScreen}/>
    </HStack.Navigator>
  )
}

const Stack = createStackNavigator();

function ImageStackScreen({navigation}) {
  const [ImageList, setImageList] = useState([])

  const REQUEST = 'yellow+flowers'
  const COUNT = 27
  const API_KEY = "19193969-87191e5db266905fe8936d565"

  function addImageBut({ navigation }) {
    return (
      <View style={styles.addFilm}>
        <TouchableHighlight onPress={AddImage}>
          <View>
            <Text style={{ fontSize: 30 }}>+</Text>
          </View>
        </TouchableHighlight>
      </View>

    );
  }

  function AddImage() {
    // launchImageLibrary({storageOptions: { skipBackup: true, path: 'images'}}, (response) => {
    //   if (response.didCancel) {
    //     console.log('User cancelled image picker');
    //   } else {
    //     setImageList(value => [...value, response.uri])
    //   }
    //   })
    fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${REQUEST}&image_type=photo&per_page=${COUNT}`)
      .then((response) => response.json())
      .then((json) => {
        setImageList(json.hits)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function getStyle(index) {
    const sizeBig = {height:260, width: 260}
    const sizeSm = {height:130, width: 130}
    const row = Math.trunc(index /12)
    const row2 = Math.trunc(index /6)
    index = index % 12

    let ret = {}
    if (index === 0){ // ok
      Object.assign(ret, sizeBig)
    }else if(index===1){
      Object.assign(ret, sizeSm, {position:'absolute', right:0, top:(0 + 780*row)})
    }else if(index===2){
      Object.assign(ret, sizeSm, {position:'absolute', right:0, top:(130 + 780*row)})
    }else if(index===3 || index ===6 || index===7 || index===9){
      Object.assign(ret, sizeSm, )
    }else if(index===4 || index===10){
      Object.assign(ret, sizeSm, {position: 'absolute', top:(260 + 390*row2), right:130})
    }else if(index===5 || index===11){
      Object.assign(ret, sizeSm, {position: 'absolute', top:(260 + 390*row2), right:0})
    }else if(index===8 ){
      Object.assign(ret, sizeBig, {position: 'absolute', top:390+780*row, left:130})
    }
    console.log(ImageList, ret)
    return ret
  }

  function ImageScreen() {
    return (
      <View>
        <ScrollView>
          {ImageList.map((value, index) =>
            <Image key={index}
              source={{ uri: value.largeImageURL}}
              style={getStyle(index)}
            />)}
        </ScrollView>
      </View>
    )
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Image"
                    component={ImageScreen}
                    options={{ headerRight: props => addImageBut({ navigation }) }}
      />
      <Stack.Screen name='Home'
                    component={HomeScreen}
      />
    </Stack.Navigator>
  )
}

const Tab = createBottomTabNavigator()

function App() {
  return (
    <NavigationContainer initialRouteName="Home" >
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeStackScreen}/>
        <Tab.Screen name='Image' component={ImageStackScreen} />
        <Tab.Screen name='Graph' component={GraphStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  imageC:{
    height: 100, width: '50%'
  },
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  addFilm: {
    marginRight: 12 ,
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: .5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5 ,
    marginHorizontal: 20,
    marginTop: 0,
  },
  ImageStyle: {
    padding: 0,
    margin: 10,
    height: 25,
    width: 25,
    resizeMode : 'stretch',
    alignItems: 'center'
  },
  containerStyle: {
    height: 25,
    width: 25,
    backgroundColor: "#000000"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  butFig:{
    marginHorizontal: 15,
    marginVertical: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  logo: {
    height: 100,
    width: "66%",
    borderRadius: 1,
  },
  baseText: {
    fontWeight: 'bold',
    fontSize: 20
  },
  innerText: {
    fontWeight: 'normal',
    marginHorizontal: 120
  },
  twoButton: {
    fontSize: 20,
    margin:20,
    flexDirection: 'column',
    justifyContent: "space-between"
  },
  button1: {
    borderRadius: 20,
    height: 100,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#00ff00",
    padding: 10,
    margin: 20
  },
  button2: {
    borderRadius: 20,
    height: 100,
    justifyContent: 'center',
    alignItems: "center",
    backgroundColor: "#ff0000",
    padding: 10,
    margin: 20
  },
  addImage: {
    borderRadius: 20,
  },
  image1:{
    height:266,
    width:266,
  },
  item: {
    borderRadius: 20,
    backgroundColor: '#ccfcf6',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: "6%",
    flexDirection: "row",
    borderColor: 'gray',
    borderWidth: 1,
  },
  logoS: {
    borderRadius: 10,
    width: 150,
    height: 233,
  },
  information: {
    margin: "3%",
    width: "50%",
  },
  logoN: {
    flex:1,
    height:466,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default App;
