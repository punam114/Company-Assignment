import React from "react";
import { NavLink } from "react-router-dom";
import {Atom , Ghost , Scroll} from 'lucide-react'

export default function Navbar(){

    return(
        <nav>
            <NavLink to="/artifacts"
            style={({isActive}) =>({
                display : "flex",
                alignItems : "center",
                gap : '8px',
                 padding : '10px 16px',
                textDecoration :"none",
                border : '1px solid',
                borderRadius : "6px",
                backgroundColor : isActive ? 'blue' : 'white',
                color : isActive ? 'white' : 'green'
            })}
            >
            <Atom size ={18}/>
                Arrifacts
            </NavLink>
            
            <NavLink to='/creatures'
            style={({isActive}) =>({
                display : "flex",
                alignItems : "center",
                gap : '8px',
                padding : '10px 16px',
                textDecoration :"none",
                border : '1px solid',
                borderRadius : "6px",
                backgroundColor : isActive ? 'blue' : 'white',
                color : isActive ? 'white' : 'green'
            })}
            >
            <Ghost size={18}/>
            Creatures
            </NavLink>

<NavLink to='/logs'
            style={({isActive}) =>({
                display : "flex",
                alignItems : "center",
                gap : '8px',
                padding : '10px 16px',
                textDecoration :"none",
                border : '1px solid',
                borderRadius : "6px",
                backgroundColor : isActive ? 'blue' : 'white',
                color : isActive ? 'white' : 'green'
            })}
            >
            <Scroll size={18}/>
            Logs
            </NavLink>


        </nav>
    )
}