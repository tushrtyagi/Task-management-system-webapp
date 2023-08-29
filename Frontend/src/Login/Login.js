import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await fetch("http://localhost:3000/api/graph-api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                query{
                    loginUser(userInput:{email:"${email}",password:"${password}"}){
                      name
                      email
                    }
                  }
                `,
            }),
        });
        const user_id = await result.json();
        localStorage.setItem("user", JSON.stringify(user_id));
        setemail("");
        setpassword("");
        navigate("/");
    };

    return (
        <>
            <main>
                <form onSubmit={handleSubmit}>
                    <h2>
                        <strong>Login</strong>
                    </h2>
                    <div className="user-box">
                        <input
                            type="email"
                            autoComplete="off"
                            name="username"
                            onChange={(e) => {
                                setemail(e.target.value);
                            }}
                            value={email}
                            required
                        />
                        <label className="label-class">Email</label>
                    </div>
                    <div className="user-box">
                        <input
                            type="password"
                            autoComplete="off"
                            name="password"
                            onChange={(e) => {
                                setpassword(e.target.value);
                            }}
                            value={password}
                            required
                        />
                        <label className="label-class">Password</label>
                    </div>
                    <button className="login-signup-button" type="submit">
                        Login
                    </button>
                    <p className="signup-link">
                        Already Have  an Account?  <Link to="/signup">Sign up </Link>
                    </p>
                </form>
            </main>
        </>
    );
};

export default Login;
