import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Alert} from "react-bootstrap";
import {Redirect} from 'react-router';
import "./signin.css";


export default function AdminMovie(props) {
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [err_msg, setErr_msg] =  useState("");
  const [navigate, setNavigate] = useState("");


  function handleSubmit(event) {
    event.preventDefault();
    let token = localStorage.getItem('user_token')

    fetch('http://localhost:3001/api' + '/movies/create ', {
        method: 'post',
        headers: {
            'Content-Type':'application/json', 
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "data":{
                "name": name,
                "genre": genre,
                "duration": duration
            }
        })
    })
    .then((resp)=>{
        if(resp.status < 500 && resp.status >= 400){
            if(resp.status === 404){
                setErr_msg('Invalid Credentials')
                return
            }
            try{
                resp.json().then((resp_json) => {
                    setErr_msg(resp_json['message'])
                },(err)=>{
                    setErr_msg('we have problems communicating with our server right now, come back later')
                })

            }
            catch(excp){
                setErr_msg('we have problems communicating with our server right now, come back later')
            }
        }
        else{
            if(resp.status >= 500){
                setErr_msg('something upnormal happend, please try again')
            }
            else{
                try{
                    resp.json()
                    .then((resp_json) => {
                        setNavigate(true)                    
                    })
                }
                catch(excp){
                    setErr_msg('we have problems communicating with our server right now, come back later')
                }
            }
        }

    })
  }

  return (
    <div className="Admin">
      {
          navigate === true &&
          <Redirect to="/" />
      }

      <Alert variant='warning' hidden={!err_msg}>
            {err_msg}
      </Alert>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="name" bsSize="large">
          <FormLabel>Name</FormLabel>
          <FormControl
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="name" bsSize="large">
          <FormLabel>Genre</FormLabel>
          <FormControl
            autoFocus
            value={genre}
            onChange={e => setGenre(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="name" bsSize="large">
          <FormLabel>Duration</FormLabel>
          <FormControl
            autoFocus
            value={duration}
            onChange={e => setDuration(e.target.value)}
          />
        </FormGroup>
        <Button block bsSize="large"  type="submit">
          Create Movie
        </Button>
      </form>
    </div>
  );
}