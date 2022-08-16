import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import useLocalStorage from 'react-use-localstorage';

import { useImmer } from 'use-immer';
import { useOnlineStatus } from '@withvoid/melting-pot';


function App() {

  const [data, setData] = useLocalStorage('storage_id', default_value);
  const [room, setRoom] = useLocalStorage('room','');
 const [id, setId] = useLocalStorage('id','');

//check if user is online


const [onlineList, setOnline] = useImmer([]);
const { online } = useOnlineStatus();



  return (

    
    <div className="App">
 
 <ul id="messages"><Messages data={messages} /></ul>
<ul id="online"> {online ? '❤️ You are Online' : '💛 You are Offline'} <hr/><Online data={onlineList} /> </ul>



    </div>
  );
}

export default App;
