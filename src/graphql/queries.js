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
          createdAt
          updatedAt
          owner
        }
        nextToken
      }
      sortNew
      description
      public
      archived
      createdAt
      updatedAt
      owner
      publicProject {
        id
        name
        description
        ownerIdentityId
        project {
          id
          name
          sortNew
          description
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
        sortNew
        description
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          description
          ownerIdentityId
          createdAt
          updatedAt
          owner
        }
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
        sortNew
        description
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          description
          ownerIdentityId
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
          description
          ownerIdentityId
          createdAt
          updatedAt
          owner
        }
        owner
      }
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
          sortNew
          description
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
      nextToken
    }
  }
`;
export const listPublicProjects = /* GraphQL */ `
  query ListPublicProjects(
    $filter: ModelPublicProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        ownerIdentityId
        project {
          id
          name
          sortNew
          description
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
      nextToken
    }
  }
`;
export const getPublicProject = /* GraphQL */ `
  query GetPublicProject($id: ID!) {
    getPublicProject(id: $id) {
      id
      name
      description
      ownerIdentityId
      project {
        id
        name
        events {
          nextToken
        }
        sortNew
        description
        public
        archived
        createdAt
        updatedAt
        owner
        publicProject {
          id
          name
          description
          ownerIdentityId
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
export const getPublicEvent = /* GraphQL */ `
  query GetPublicEvent($id: ID!) {
    getPublicEvent(id: $id) {
      id
      event {
        id
        project {
          id
          name
          sortNew
          description
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
        description
        ownerIdentityId
        project {
          id
          name
          sortNew
          description
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
export const listPublicEvents = /* GraphQL */ `
  query ListPublicEvents(
    $filter: ModelPublicEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPublicEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
          description
          ownerIdentityId
          createdAt
          updatedAt
          owner
        }
        owner
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($username: String!) {
    getUser(username: $username) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $username: String
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listUsers(
      username: $username
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        username
        email
        profilePic
        realname
        twitter
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
