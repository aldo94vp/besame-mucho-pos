import React from 'react'
import firebase from 'firebase';
import { useLocation } from 'wouter';

const Login = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  const [, setLocation] = useLocation();

  const signIn = () => firebase.auth().signInWithPopup(provider)
    .then(res => {
      setLocation('/home');
    })
    .catch( err => {
      return <div>Error</div>
    })


  return (
    <>
      <button onClick={signIn}>Iniciar sesión</button>
    </>
  )
}

export default Login;
