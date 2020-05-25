import React from 'react';

import { API, graphqlOperation, Auth } from 'aws-amplify';

import Routes from "./Routes";

const query = `
  query {
    listProjects{
      items{
        id
        name      
      }
    }
  }
`

export default function App() {
  return(
    <div className="max-w-6xl mw-auto px-2">
      <Routes />
    </div>
  )
}