
import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel, Alert} from "react-bootstrap";
import "./signup.css";
import {Redirect} from 'react-router';


export default function Register(props) {
  const [email, setEmail] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err_msg, setErr_msg] =  useState("");
  const [navigate, setNavigate] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    fetch('http://localhost:3001/api' + '/users/sign_up', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "data":{
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
                "username": username
            }
        })
    })
    .then((resp)=>{
        if(resp.status < 500 && resp.status >= 400){
            try{
                resp.json().then((resp_json) => {
                    console.log(resp_json)
                    setErr_msg(resp_json['message'])                       
                },(err)=>{
                    console.log(err)
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
                    console.log('navigating...')
                }
                catch(excp){
                    setErr_msg('we have problems communicating with our server right now, come back later')
                }
            }
        }

    })
  }

  return (
    <div className="Register">
      {
          navigate === true &&
          <Redirect to="/login" />
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
        <FormGroup controlId="first-name" bsSize="large">
          <FormLabel>First Name</FormLabel>
          <FormControl
            autoFocus
            value={first_name}
            onChange={e => setFirst_name(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="last-name" bsSize="large">
          <FormLabel>Last Name</FormLabel>
          <FormControl
            autoFocus
            value={last_name}
            onChange={e => setLast_name(e.target.value)}
          />
        </FormGroup>

        <FormGroup controlId="user-name" bsSize="large">
          <FormLabel>User name</FormLabel>
          <FormControl
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
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
          Register
        </Button>
      </form>
    </div>
  );
}