import React, { useState } from 'react';
import { UserOutlined, EyeTwoTone, EyeInvisibleOutlined,MailOutlined } from '@ant-design/icons';
import { Button, Input, Form, Row, Col } from 'antd';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './../../config/firebase'

const initialState = { fullName: '', email: '', password: '', confirmPassword: '' }
export default function Register() {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))
  const handleRegister = (e) => {
    e.preventDefault();
    let { fullName, email, password, confirmPassword } = state
    fullName = fullName.trim();
    email = email.trim();

    if (fullName === '' || email === '' || password === '' || confirmPassword === '') { return window.toastify("All fields are must required", 'error') }
    if (fullName.length < 3) { return window.toastify("Enter your Full Name", 'error') }
    if (!window.isEmail(email)) { return window.toastify("Enter a valid email address", 'error') }
    if (password.length < 6) { return window.toastify("Password must contain 6 chars", 'error') }
    if (confirmPassword !== password) { return window.toastify("Password doesn't match", "error") }

    setIsProcessing(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // console.log("user", user)
        window.toastify("Successfully registered", "success")
        setIsProcessing(false);
        setState(initialState)
      })
      .catch((error) => {
        // console.log("error",error)
        switch (error.code) {
          case 'auth/email-already-in-use':
             window.toastify("Email address already is used",'error'); break;
          default:
            window.toastify("Something went wrong  while creating new user",'error');
        }
      });

  }
  return (
    <main className='d-flex align-items-center justify-content-center' style={{ background: ' linear-gradient(to right, #243B55, #141E30)' }}>
      <div className="card p-3 p-md-4 w-100 border-0" style={{ maxWidth: 450 }}>
        <h2 className='text-center mb-4'>Register</h2>
        <Form layout='vertical'>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input size='large' className='auth-input' placeholder="Full Name" prefix={<UserOutlined />} name='fullName' value={state.fullName} onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input size='large' className='auth-input' placeholder="Email" prefix={<MailOutlined />} name='email' value={state.email} onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' className='auth-input' placeholder="Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} name='password' value={state.password} onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Input.Password size='large' className='auth-input' placeholder="Confirm Password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} name='confirmPassword' value={state.confirmPassword} onChange={handleChange} />
            </Col>
            <Col span={24}>
              <Button type="primary" size='large' block loading={isProcessing} onClick={handleRegister}>Register</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </main>
  )
}
