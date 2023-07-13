import React, { useState } from 'react'
import logo from '../Assets/Netflix_Logo_PMS.png'
import background from '../Assets/background.jpg'
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    let navigate = useNavigate()
    const [user, setUser] = useState({
        email: "",
        password: ""
    })
    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (user.email === "") {
            alert("Email required")
            return
        }
        if (user.password === "") {
            alert("password required")
            return
        }
        const res = await axios.post("http://localhost:8000/login", user)
        if (res.data.status === 1) {
            localStorage.setItem("myapptoken", res.data.token)
            navigate("/dashboard")
        }
        if (res.data.status === 0) {

        }
    }
    return (
        <>
            <div className="login_container">

                <img className="logo" src={logo} alt="logo" />

                <div>
                    <img
                        className="background_image"
                        src={background}
                        alt="backgroung image"
                    />

                </div>

                <div className="card_1">
                    <h1 className="sign_in_header">Sign In</h1>
                    <form className="form">
                        <input
                            placeholder="Email address"
                            name="email"
                            className="email_login"
                            type="email"
                            onChange={(e) => handleChange(e)}
                        />
                        <input
                            placeholder="Password"
                            name="password"
                            className="email_login"
                            type="password"
                            onChange={(e) => handleChange(e)}
                        />
                        <div className="help_feature">
                            <input type="checkbox" />
                            <label>Remember me</label>
                            <a>Need Help??</a>
                        </div>
                        <button className="btn_login" onClick={(e) => handleSubmit(e)}>
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
            <Toaster />
        </>

    )
}

export default Login