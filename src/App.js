import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import useLocalStorage from 'react-use-localstorage';

import { useImmer } from 'use-immer';
import { useOnlineStatus } from '@withvoid/melting-pot';

import useClippy from 'use-clippy';


const Messages = props => { 
  const [ clipboard, setClipboard ] = useClippy();

  return props.data.map(m => m[0] !== '' ? 
(<li><strong>{m[0]}</strong> :<a onClick={()=>{setClipboard(`${m[1]}`)}} href="#"><i style={{float:'right',color:'black'}} class=" material-icons">content_copy</i></a> <div className="innermsg">{m[1]}</div></li>) 
: (<li className="update">{m[1]}</li>) ); 
}

const Online = props => props.data.map(m => <li id={m[0]}>{m[1]}</li>)


export default App() => {

  const [data, setData] = useLocalStorage('storage_id', default_value);
  const [room, setRoom] = useLocalStorage('room','');
 const [id, setId] = useLocalStorage('id','');

 const [socket] = useSocket('https://open-chat-naostsaecf.now.sh');

  const [messages, setMessages] = useImmer([]);

  const [onlineList, setOnline] = useImmer([]);

//check if user is online

  const { online } = useOnlineStatus();
  const { width } = useWindowSize();



  useEffect(()=>{
    socket.connect();

    if(id){
      socket.emit('join',id,room);
    }

    socket.on('message que',(nick,message) => {
      setMessages(draft => {
        draft.push([nick,message])
      })
    });

    socket.on('update',message => setMessages(draft => {
      draft.push(['',message]);
    }))

    socket.on('people-list',people => {
      let newState = [];
      for(let person in people){
        newState.push([people[person].id,people[person].nick]);
      }
      setOnline(draft=>{draft.push(...newState)});
    });

    socket.on('add-person',(nick,id)=>{
      setOnline(draft => {
        draft.push([id,nick])
      })
    })

    socket.on('add-person',(nick,id)=>{
      setOnline(draft => {
        draft.push([id,nick])
      })
    })


    const handleSubmit = e => {
      e.preventDefault();
      const name = document.querySelector('#name').value.trim();
      const room_value = document.querySelector('#room').value.trim();
      console.log(name);
      if (!name) {
        return alert("User name can't be empty");
      }
      setId(name);
      setRoom(room_value);
      socket.emit("join room", name,room_value);
    };

    const handleSend = e => {
      e.preventDefault();
      const input = document.querySelector('#m');
      if(input.value.trim() !== ''){
        socket.emit('chat message',input.value,room);
        input.value = '';
      }
    }

    const logOut = () => {
      socket.disconnect();
      setOnline(draft=>[]);
      setMessages(draft=>[]);
      setId('');
      socket.connect();
    }



  return (

    
    <div className="App">
 
 <ul id="messages">
  <Messages data={messages} />
  </ul>
<ul id="online"> {online ? '❤️ You are Online' : '💛 You are Offline'} 
<hr/><Online data={onlineList} /> </ul>

<form onSubmit={e => handleSend(e)} style={{display: 'flex'}}>
    <input id="m" />
    {width > 1000 ? <button style={{width:'100px'}} type="submit">Send Message</button> :
  <button style={{width:'50px'}}><i style={{fontSize:'15px'}} class="material-icons">send</i></button>}
</form>




    </div>



  );
}

export default App;
