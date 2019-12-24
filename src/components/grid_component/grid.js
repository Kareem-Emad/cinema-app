import React, { Component } from "react";
export default class GraphicalRepresentation extends Component {

    index = 1; // global variable
    // create arrays columns and rows

    /* Sockets */
    //----- max number of rows and columns of screen-------//

    //------------socket 3 from db---(users seats)---------//


    //------ creating our matrix (grid of seats) ------//
    constructor(props) {

        super(props);
        this.AllSeats = [];
        this.cols = props.cols
        this.rows = props.rows
        this.screening_id = props.id
        this.seat_map =  JSON.parse(props.seat_map)
        this.SubmitReservation = this.SubmitReservation.bind(this);

        //--------------1.intializing our Array--------------//
        for( let i = 0 ;i<this.rows;i++){
            this.AllSeats.push( new  Array(this.cols).fill('btn-primary'));
        }

        console.log(props)
        this.reservedSeats = [];
        console.log(this.seat_map)
        //--------------2.setting our reserved seats-------------//
        for(let row = 0; row < this.rows; row++){
            for(let col = 0; col < this.cols; col++){
                let pos = row * this.cols + col
                console.log("at current post =" + pos + "and set to " + this.seat_map[pos] )
                if(this.seat_map[pos] === 1){
                    console.log(row, col)
                    this.AllSeats[row][col] ='btn-danger';
                }
            }
        }

        this.state = {
            AllSeats : this.AllSeats,
            // reserved seats recieved from db
            reservedSeats : this.reservedSeats,
            Myseats : []
        }

    }
    // when user clicks a button we take his col and row info and reserve it in database
    Reserve(e, colIndex, RowIndex) {

    //1.---------------Check Clicked seat validation----------------//
        this.index = 1;
        
        //1.1---------check if reserved before-------//
        if(this.state.reservedSeats.find(seat => (seat.row === RowIndex && seat.col === colIndex))){
            alert('It is reserved select anothe seact')
            return true;
        }


        //1.2---------check if seat exists in my reservation----if yes change color to primary 
        //--------------------and delete element from reservation--------------------//
        if(  this.state.Myseats.find(seat => (seat.row === RowIndex && seat.col === colIndex))){
            //console.log('alreaady exists so change color to primary');
            this.AllSeats[RowIndex-1][colIndex-1] = 'btn-primary';
            //----Note when you delete an object do this vars can not do the job :D-----//
            let indexOfSeat = this.state.Myseats.indexOf(this.state.Myseats.find(seat =>
                 (seat.row === RowIndex && seat.col === colIndex)));

            this.state.Myseats.splice(indexOfSeat,1);
            this.setState({
                AllSeats : this.AllSeats
            });
            return true;
        } else {
            //---------------- seat is new to be inserted ----------------//



            this.state.Myseats.push({col : colIndex, row : RowIndex});
            this.AllSeats[RowIndex-1][colIndex-1] = 'btn-dark';

            //--------Allow max 5 to be booked---------//
            //----We remove the first added element-------//
            if(this.state.Myseats.length > 1 ){
               let last = this.state.Myseats.splice(0,1);
                //console.log('last', last);
                this.AllSeats[last[0].row-1][last[0].col-1] = 'btn-primary';
                this.setState({
                    AllSeats : this.AllSeats
                });
                //console.log(this.state)
                return true;
            }
            this.setState({
                AllSeats : this.AllSeats,
                Myseats : this.state.Myseats
            });
            //console.log(colIndex, RowIndex)
            //console.log('MySeats', this.state.Myseats)
            return true;
        }

    }



    SubmitReservation(even){
        let seat = this.state.Myseats[0]
        console.log(seat)
        let col = seat.col - 1
        let row = seat.row - 1
    
        let pos = row * this.cols + col
        console.log(pos)
        let token = localStorage.getItem('user_token')
        fetch('http://localhost:3001/api/screenings/' + this.screening_id + '/reserve/' + pos,{
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
        })
        .then((resp)=>{
            if(resp.status === 201 || resp.status === 200){
                this.AllSeats[row][col] = 'btn-danger';
                this.reservedSeats.push({row: row, col: col})

                this.setState({
                    AllSeats : this.AllSeats,
                    reservedSeats: this.reservedSeats,
                    Myseats: []
                });
            }
        })
    }

    render() {

        return (
            <div className='container mt-5'>
                <div className='row'>
  

                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <table className="table">
                            <thead></thead>
                            {/* -----convert each array element into ------- */}
                            {/* ----------map throw each element in 2d array we created--------*/}
                            <tbody>
                                {this.state.AllSeats.map((row, RowIndex) => {
                                    return (<tr key={RowIndex}>
                                        {row.map((col, ColIndex) =>
                                            // storing our seatNumber With indxes I don not understand binding
                                            <td key={ColIndex}><button onClick={(e) =>
                                                this.Reserve(e, ColIndex + 1, RowIndex + 1)}
                                                /* ------check if our seat is reserved or not----- */
                                                /* ----------TODO convert bt-danger && btn-primary into variable string */
                                                className={"btn  btn-block " + this.state.AllSeats[RowIndex][ColIndex]} 
                                                 value={this.index}>
                                                {'|'}</button></td>
                                        )}
                                    </tr>);
                                }
                                )}
                            </tbody>

                        </table>
                        <div className='text-center mb-5'>
                            
                            <button disabled={this.state.Myseats.length < 1} className='btn btn-success btn-lg' onClick={ (e) => this.SubmitReservation(e)}>Get your ticket</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}