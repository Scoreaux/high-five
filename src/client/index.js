import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import gql from 'graphql-tag';

// Create Apollo client with support for file uploads
const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
          console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
        });
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    createUploadLink(),
  ]),
  cache: new InMemoryCache()
});

const uploadQuery = gql`
  mutation uploadFile($file: Upload!) {
    singleUpload(file: $file)
  }
`;

const input = document.getElementById('fileUpload');

input.addEventListener('change', ({ target: { validity, files: [file] } }) => {
  if (validity.valid && file.type === 'application/zip') {
    console.log(file);
    client.mutate({
      mutation: uploadQuery,
      variables: {
        file,
      }
    });
  } else {
    console.log('Invalid file type', file.type);
  }
});
