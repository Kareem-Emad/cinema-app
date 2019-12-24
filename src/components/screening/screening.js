import React, { useState, useEffect } from "react";
import {useParams} from "react-router"
import {Alert, Card, Button, CardGroup, Jumbotron, Container} from "react-bootstrap";
import moment from "moment";
import {
  Link
} from "react-router-dom";
import GraphicalRepresentation from '../grid_component/grid'

export default function Screening(props) {
  const [err_msg, setErr_msg] =  useState("");
  const [screening, setScreening] = useState("");
  const { id } = useParams();
  function getData() {
    let token = localStorage.getItem('user_token')
    fetch('http://localhost:3001/api/screenings/' + id,{
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
                  setScreening(resp_json)
                })
            }
            catch(excp){
                setErr_msg('we have problems communicating with our server right now, come back later')
            }
        }
    }
    })
  }

  useEffect(() => setInterval(getData, 5000), []);

  return (
      <div style={{padding: '60px'}}>
        <Alert variant='warning' hidden={!err_msg}>
            {err_msg}
        </Alert>
        {
            screening != "" && (
                <Jumbotron fluid>
                <Container>
                    <h1>{screening.movie_name}</h1>
                    <p>
                        Movie Duration: {screening.movie_duration}
                    </p>
                    <GraphicalRepresentation seat_map={screening.seat_map} rows={screening.screen_rows} cols={screening.screen_cols}  id={id}></GraphicalRepresentation>
                </Container>
                </Jumbotron>
            )

        }

      </div>
  )
}