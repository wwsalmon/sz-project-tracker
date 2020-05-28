/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      name
      events {
        items {
          id
          time
          note
          hidden
          filenames
          audio
          video
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      archived
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listProjects = /* GraphQL */ `
  query ListProjects(
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        events {
          nextToken
        }
        archived
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      project {
        id
        name
        events {
          nextToken
        }
        archived
        createdAt
        updatedAt
        owner
      }
      time
      note
      hidden
      filenames
      audio
      video
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        project {
          id
          name
          archived
          createdAt
          updatedAt
          owner
        }
        time
        note
        hidden
        filenames
        audio
        video
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
