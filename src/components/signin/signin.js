import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Alert} from "react-bootstrap";
import {Redirect} from 'react-router';
import "./signin.css";


export default function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err_msg, setErr_msg] =  useState("");
  const [navigate, setNavigate] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:3001/api' + '/user_token', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "auth":{
                "email": email,
                "password": password
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
                        localStorage.setItem('user_token', resp_json['jwt'])
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
    <div className="Login">
      {
          navigate === true &&
          <Redirect to="/" />
      }

      <Alert variant='warning' hidden={!err_msg}>
            {err_msg}
      </Alert>
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
          <FormLabel>Email</FormLabel>
          <FormControl
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          <FormLabel>Password</FormLabel>
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </form>
    </div>
  );
}