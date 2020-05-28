import React from 'react';
import Routes from "./Routes";
import SimpleReactLightbox from "simple-react-lightbox";

export default function App() {
  return(
    <SimpleReactLightbox>
      <div className="max-w-6xl mx-auto px-4">
        <Routes />
      </div>
    </SimpleReactLightbox>
  )
}