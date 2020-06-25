import React from 'react';
import Routes from "./Routes";
import Navbar from "./components/Navbar";
import {ProvideAuth} from "./lib/authLib";
import "./App.css";

export default function App() {
  return (
  <ProvideAuth>
      <Navbar></Navbar>
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <Routes />
      </div>
  </ProvideAuth>
  )
}