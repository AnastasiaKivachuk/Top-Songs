import { useState, useEffect, useCallback } from 'react';
import { setUser } from '@redux/actions/actionCreator';
import { useDispatch } from 'react-redux';
import firebase from '../../Firebase';

const formatAuthUser = (user) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const authStateChanged = useCallback((authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const formattedUser = formatAuthUser(authState);
    dispatch(setUser(formattedUser));

    setLoading(false);

  }, []);

  const clear = useCallback(() => {
    dispatch(setUser(null));
    setLoading(true);
  }, []);

  const signInWithEmailAndPassword = useCallback((email: string, password: string) => (
    firebase.auth().signInWithEmailAndPassword(email, password)), []);

  const createUserWithEmailAndPassword = useCallback((email: string, password: string) => (
    firebase.auth().createUserWithEmailAndPassword(email, password)), []);

  const sendPasswordResetEmail = useCallback((email: string) => firebase.auth().sendPasswordResetEmail(email), []);

  const signOut = useCallback(() => firebase.auth().signOut().then(clear), []);

  useEffect(() => {
    // console.log(firebase.auth().currentUser, 'AAAAAAAAAAAa');
    // dispatch(setUser(firebase.auth().currentUser));
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    loading,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
  };
}
