import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Alert} from "react-bootstrap";
import DateTimePicker from 'react-datetime-picker';

import {Redirect} from 'react-router';
import "./signin.css";


export default function AdminScreening(props) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [movieID, setMovieID] = useState("");
  const [screenID, setScreenID] = useState("");
  const [err_msg, setErr_msg] =  useState("");
  const [navigate, setNavigate] = useState("");


  function handleSubmit(event) {
    event.preventDefault();
    let token = localStorage.getItem('user_token')
    console.log(startTime)
    fetch('http://localhost:3001/api' + '/screenings/create ', {
        method: 'post',
        headers: {
            'Content-Type':'application/json', 
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
            "data":{
              "start_time": startTime,
              "end_time": endTime,
              "movie_id": movieID,
              "screen_id": screenID
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
        <FormLabel>Start Time</FormLabel>
        <DateTimePicker
          value={startTime}
          onChange={e => setStartTime(e)}
        />
        <FormGroup controlId="name" bsSize="large">
          <FormLabel>End Time</FormLabel>
          <DateTimePicker
          value={endTime}
          onChange={e => setEndTime(e)}
        />
        </FormGroup>

        <FormGroup controlId="name" bsSize="large">
          <FormLabel>movie ID</FormLabel>
          <FormControl
            autoFocus
            value={movieID}
            onChange={e => setMovieID(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="name" bsSize="large">
          <FormLabel>Screen ID</FormLabel>
          <FormControl
            autoFocus
            value={screenID}
            onChange={e => setScreenID(e.target.value)}
          />
        </FormGroup>
        <Button block bsSize="large"  type="submit">
          Create Movie
        </Button>
      </form>
    </div>
  );
}