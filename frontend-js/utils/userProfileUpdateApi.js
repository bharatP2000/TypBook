// userProfileAPI.js
import { GRAPHQL_URL } from '../utils/config';

export async function updateUserProfileFields(fieldsToUpdate, token) {
  const {
    nativePlace = null,
    address = null,
    mobileNumber = null,
    profilePicture = null,
    coverPicture = null,
  } = fieldsToUpdate;
//   console.log(token);
  console.log("Inside userProfile update");

  const query = `
    mutation UpdateUserProfile(
      $nativePlace: String
      $address: String
      $mobileNumber: String
      $profilePicture: String
      $coverPicture: String
    ) {
      updateUserProfile(
        nativePlace: $nativePlace,
        address: $address,
        mobileNumber: $mobileNumber,
        profilePicture: $profilePicture,
        coverPicture: $coverPicture
      ) {
        nativePlace
        address
        mobileNumber
        profilePicture
        coverPicture
      }
    }
  `;

  const variables = {
    nativePlace,
    address,
    mobileNumber,
    profilePicture,
    coverPicture,
  };

  // Remove null keys so only provided fields are sent
  Object.keys(variables).forEach(
    (key) => variables[key] === null && delete variables[key]
  );

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ query, variables }),
    });
    // console.log(variables);

    const json = await res.json();
    console.log(json);
    if (json.errors) {
      console.error('GraphQL update error:', json.errors);
      return null;
    }

    return json.data.updateUserProfile;
  } catch (error) {
    console.error('Network or fetch error:', error);
    return null;
  }
}
