/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProject = /* GraphQL */ `
  mutation CreateProject(
    $input: CreateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    createProject(input: $input, condition: $condition) {
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
export const updateProject = /* GraphQL */ `
  mutation UpdateProject(
    $input: UpdateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    updateProject(input: $input, condition: $condition) {
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
export const deleteProject = /* GraphQL */ `
  mutation DeleteProject(
    $input: DeleteProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    deleteProject(input: $input, condition: $condition) {
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
export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
      id
      project {
        id
        name
        events {
          nextToken
        }
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
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
      id
      project {
        id
        name
        events {
          nextToken
        }
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
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
      id
      project {
        id
        name
        events {
          nextToken
        }
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
export const createPublicProject = /* GraphQL */ `
  mutation CreatePublicProject(
    $input: CreatePublicProjectInput!
    $condition: ModelPublicProjectConditionInput
  ) {
    createPublicProject(input: $input, condition: $condition) {
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
export const updatePublicProject = /* GraphQL */ `
  mutation UpdatePublicProject(
    $input: UpdatePublicProjectInput!
    $condition: ModelPublicProjectConditionInput
  ) {
    updatePublicProject(input: $input, condition: $condition) {
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
export const deletePublicProject = /* GraphQL */ `
  mutation DeletePublicProject(
    $input: DeletePublicProjectInput!
    $condition: ModelPublicProjectConditionInput
  ) {
    deletePublicProject(input: $input, condition: $condition) {
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
export const createPublicEvent = /* GraphQL */ `
  mutation CreatePublicEvent(
    $input: CreatePublicEventInput!
    $condition: ModelPublicEventConditionInput
  ) {
    createPublicEvent(input: $input, condition: $condition) {
      id
      event {
        id
        project {
          id
          name
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
export const updatePublicEvent = /* GraphQL */ `
  mutation UpdatePublicEvent(
    $input: UpdatePublicEventInput!
    $condition: ModelPublicEventConditionInput
  ) {
    updatePublicEvent(input: $input, condition: $condition) {
      id
      event {
        id
        project {
          id
          name
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
export const deletePublicEvent = /* GraphQL */ `
  mutation DeletePublicEvent(
    $input: DeletePublicEventInput!
    $condition: ModelPublicEventConditionInput
  ) {
    deletePublicEvent(input: $input, condition: $condition) {
      id
      event {
        id
        project {
          id
          name
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
