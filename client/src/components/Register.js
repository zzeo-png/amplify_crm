import { useState } from 'react'
import './Register.css'

function Register() {

    function registerUser(){
        try{
            const username = document.querySelector('#username').value
            const name = document.querySelector('#name').value
            const password = document.querySelector('#password').value

            fetch('http://localhost:3001/api/user/register', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    name: name,
                    password: password
                })
            })
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <div className='register'>
            <h2>Create new user</h2>
            <form>
                <label htmlFor='username'>Username</label>
                <input type='text' name='username' id='username'></input>
                <label htmlFor='name'>Name</label>
                <input type='text' name='name' id='name'></input>
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' id='password'></input>
                <button onClick={registerUser}>Create User</button>
            </form>
        </div>
  )
}

export default Register