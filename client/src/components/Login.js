import { useEffect } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login({ user }) {
    const navigate = useNavigate()

    useEffect(() => {
        if(user){
            navigate('/')
        }
    })

    async function loginUser(){
        try{
            const username = document.querySelector('#username').value
            const password = document.querySelector('#password').value

            const response = await fetch('http://localhost:3001/api/user/login', {
                method: 'POST',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })

            const result = await response.json()
            if(result.message === 'success'){
                navigate('/')
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <div className="login">
            <div className='login_container'>
                <h1>Amplify Scaling LMS</h1>
                <h3>Login</h3>
                <form>
                    <label htmlFor="username">Username</label>
                    <input name='username' type='text' id='username'></input>
                    <label htmlFor="password">Password</label>
                    <input name='password' type='password' id='password'></input>
                </form>
                <button onClick={loginUser}>Login</button>
            </div>
        </div>
    )
}

export default Login