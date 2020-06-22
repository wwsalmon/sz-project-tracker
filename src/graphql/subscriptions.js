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
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      public
      archived
      createdAt
      updatedAt
      owner
      publicProject {
        id
        name
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
        publicEvents {
          nextToken
        }
      }
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
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      public
      archived
      createdAt
      updatedAt
      owner
      publicProject {
        id
        name
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
        publicEvents {
          nextToken
        }
      }
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
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      public
      archived
      createdAt
      updatedAt
      owner
      publicProject {
        id
        name
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
        publicEvents {
          nextToken
        }
      }
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
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      time
      note
      hidden
      filenames
      createdAt
      updatedAt
      owner
      publicEvent {
        id
        event {
          id
          time
          note
          hidden
          filenames
          createdAt
          updatedAt
          owner
        }
        time
        note
        filenames
        createdAt
        updatedAt
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
        owner
      }
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
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      time
      note
      hidden
      filenames
      createdAt
      updatedAt
      owner
      publicEvent {
        id
        event {
          id
          time
          note
          hidden
          filenames
          createdAt
          updatedAt
          owner
        }
        time
        note
        filenames
        createdAt
        updatedAt
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
        owner
      }
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
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      time
      note
      hidden
      filenames
      createdAt
      updatedAt
      owner
      publicEvent {
        id
        event {
          id
          time
          note
          hidden
          filenames
          createdAt
          updatedAt
          owner
        }
        time
        note
        filenames
        createdAt
        updatedAt
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
        owner
      }
    }
  }
`;
export const onCreatePublicProject = /* GraphQL */ `
  subscription OnCreatePublicProject($owner: String!) {
    onCreatePublicProject(owner: $owner) {
      id
      name
      project {
        id
        name
        events {
          nextToken
        }
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      createdAt
      updatedAt
      owner
      publicEvents {
        items {
          id
          time
          note
          filenames
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onUpdatePublicProject = /* GraphQL */ `
  subscription OnUpdatePublicProject($owner: String!) {
    onUpdatePublicProject(owner: $owner) {
      id
      name
      project {
        id
        name
        events {
          nextToken
        }
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      createdAt
      updatedAt
      owner
      publicEvents {
        items {
          id
          time
          note
          filenames
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onDeletePublicProject = /* GraphQL */ `
  subscription OnDeletePublicProject($owner: String!) {
    onDeletePublicProject(owner: $owner) {
      id
      name
      project {
        id
        name
        events {
          nextToken
        }
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          createdAt
          updatedAt
          owner
        }
      }
      createdAt
      updatedAt
      owner
      publicEvents {
        items {
          id
          time
          note
          filenames
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
    }
  }
`;
export const onCreatePublicEvent = /* GraphQL */ `
  subscription OnCreatePublicEvent($owner: String!) {
    onCreatePublicEvent(owner: $owner) {
      id
      event {
        id
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        time
        note
        hidden
        filenames
        createdAt
        updatedAt
        owner
        publicEvent {
          id
          time
          note
          filenames
          createdAt
          updatedAt
          owner
        }
      }
      time
      note
      filenames
      createdAt
      updatedAt
      publicProject {
        id
        name
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
        publicEvents {
          nextToken
        }
      }
      owner
    }
  }
`;
export const onUpdatePublicEvent = /* GraphQL */ `
  subscription OnUpdatePublicEvent($owner: String!) {
    onUpdatePublicEvent(owner: $owner) {
      id
      event {
        id
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        time
        note
        hidden
        filenames
        createdAt
        updatedAt
        owner
        publicEvent {
          id
          time
          note
          filenames
          createdAt
          updatedAt
          owner
        }
      }
      time
      note
      filenames
      createdAt
      updatedAt
      publicProject {
        id
        name
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
        publicEvents {
          nextToken
        }
      }
      owner
    }
  }
`;
export const onDeletePublicEvent = /* GraphQL */ `
  subscription OnDeletePublicEvent($owner: String!) {
    onDeletePublicEvent(owner: $owner) {
      id
      event {
        id
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        time
        note
        hidden
        filenames
        createdAt
        updatedAt
        owner
        publicEvent {
          id
          time
          note
          filenames
          createdAt
          updatedAt
          owner
        }
      }
      time
      note
      filenames
      createdAt
      updatedAt
      publicProject {
        id
        name
        project {
          id
          name
          public
          archived
          createdAt
          updatedAt
          owner
        }
        createdAt
        updatedAt
        owner
        publicEvents {
          nextToken
        }
      }
      owner
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($owner: String!) {
    onCreateUser(owner: $owner) {
      username
      email
      profilePic
      realname
      twitter
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($owner: String!) {
    onUpdateUser(owner: $owner) {
      username
      email
      profilePic
      realname
      twitter
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($owner: String!) {
    onDeleteUser(owner: $owner) {
      username
      email
      profilePic
      realname
      twitter
      createdAt
      updatedAt
      owner
    }
  }
`;
