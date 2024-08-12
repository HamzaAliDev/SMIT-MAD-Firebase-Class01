import React, { useState } from 'react';
import {  EyeTwoTone, EyeInvisibleOutlined,MailOutlined } from '@ant-design/icons';
import { Button, Input, Form, Row, Col } from 'antd';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './../../config/firebase';
import { useAuthContext } from '../../context/AuthContext';

const initialState = {  email: '', password: '' }
export default function Login() {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const {dispatch} = useAuthContext();

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
  const handleLogin = (e) => {
    e.preventDefault();
    let {  email, password,  } = state
    email = email.trim();

    if ( email === '' || password === '' ) { return window.toastify("All fields are must required", 'error') }
    if (password.length < 6) { return window.toastify("Password must contain 6 chars", 'error') }

    setIsProcessing(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // console.log("user", user)
        window.toastify("Successfully login", "success")
        setIsProcessing(false);
        dispatch({type:'SET_LOGGED_IN', payload:{user}})
        setState(initialState)
      })
      .catch((error) => {
        console.log("error",error)
        switch (error.code) {
          case 'auth/invalid-credential':
             window.toastify("Invalid email and password",'error'); break;
          default:
            window.toastify("Something went wrong  while creating new user",'error');
        }
        setIsProcessing(false);
      });

  }
  return (
    <main className='d-flex align-items-center justify-content-center' style={{ background: ' linear-gradient(to right, #243B55, #141E30)' }}>
      <div className="card p-3 p-md-4 w-100 border-0" style={{ maxWidth: 450 }}>
        <h2 className='text-center mb-4'>Login</h2>
        <Form layout='vertical'>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input size='large' className='auth-input' placeholder="Email" prefix={<MailOutlined />} name='email' value={state.email} onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' className='auth-input' placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} name='password' value={state.password} onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type="primary" size='large' block loading={isProcessing} onClick={handleLogin}>Login</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  )
}
