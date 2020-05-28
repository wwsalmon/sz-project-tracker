import React from 'react';
import Routes from "./Routes";
import SimpleReactLightbox from "simple-react-lightbox";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <SimpleReactLightbox>
      <Navbar></Navbar>
      <div className="max-w-6xl mx-auto px-4 pt-24">
        <Routes />
      </div>
    </SimpleReactLightbox>
  )
}