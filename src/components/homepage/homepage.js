import React, { useState, useEffect } from "react";
import {Alert, Card, Button, CardGroup} from "react-bootstrap";
import moment from "moment";
import {
  Link
} from "react-router-dom";

export default function HomePage(props) {
  const [err_msg, setErr_msg] =  useState("");
  const [screenings, setScreenings] = useState("");

  function getData() {
    let token = localStorage.getItem('user_token')
    fetch('http://localhost:3001/api/screenings',{
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
    })
    .then((resp)=>{
      if(resp.status < 500 && resp.status >= 400){
        try{
            if(resp.status === 401){
              setErr_msg('Not enough permissions to view such content')
            }
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
            this.setState({
                error_msg:'something upnormal happend, please try again'
            })
        }
        else{
            try{
                resp.json()
                .then((resp_json) => {
                  setScreenings(resp_json)
                  console.log(resp_json[0])
                  console.log(screenings)
                })
            }
            catch(excp){
                setErr_msg('we have problems communicating with our server right now, come back later')
            }
        }
    }
    })
  }
  useEffect(() => getData(), []);

  return (
      <div style={{padding: '60px'}}>
        <Alert variant='warning' hidden={!err_msg}>
            {err_msg}
        </Alert>
        <CardGroup>

        {
          (screenings || []).map((sc, idx)=>{
            return (
              <Card style={{  }} key={idx}>
              <Card.Img variant="top" src="https://nofilmschool.com/sites/default/files/styles/article_wide/public/the_dark_knight.jpg?itok=C8V66m0O" />
              <Card.Body>
              <Card.Title>{sc.movie_name}</Card.Title>
                <Card.Text>
                  starts at {moment(sc.start_time).format("DD-MMM HH:mm")} and end at {moment(sc.end_time).format("DD-MMM HH:mm")}.
                </Card.Text>
                <Link to={"/screening/" + sc.id}>
                  <Button variant="primary" link_to="/sjlj">reserve a seat</Button>
                </Link>
              </Card.Body>
            </Card>
            )
          })
        }
      </CardGroup>

      </div>
  )
}