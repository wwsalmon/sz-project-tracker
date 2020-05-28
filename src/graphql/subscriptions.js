/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProject = /* GraphQL */ `
  subscription OnCreateProject($owner: String!) {
    onCreateProject(owner: $owner) {
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
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject($owner: String!) {
    onUpdateProject(owner: $owner) {
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
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject($owner: String!) {
    onDeleteProject(owner: $owner) {
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
export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent($owner: String!) {
    onCreateEvent(owner: $owner) {
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
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent($owner: String!) {
    onUpdateEvent(owner: $owner) {
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
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent($owner: String!) {
    onDeleteEvent(owner: $owner) {
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
