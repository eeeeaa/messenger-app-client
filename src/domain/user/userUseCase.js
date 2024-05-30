const usersUri = `${import.meta.env.VITE_MESSENGER_API_URL}/v1/users`;

export const getMyProfile = async (token) => {
  let user = null;
  let error = null;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  await fetch(`${usersUri}/my-profile`, {
    method: "GET",
    mode: "cors",
    headers: headers,
  })
    .then(async (response) => {
      if (response.status >= 400) {
        console.log(response);
        const json = await response.json();
        throw new Error(json.message);
      }
      return response.json();
    })
    .then((response) => {
      user = response.user;
    })
    .catch((err) => (error = err));

  return { user, error };
};

export const updateProfile = async (
  { username = undefined, display_name = undefined, password = undefined },
  token,
  user_id
) => {
  let user = null;
  let error = null;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  await fetch(`${usersUri}/${user_id}`, {
    method: "PUT",
    mode: "cors",
    headers: headers,
    body: JSON.stringify({
      username: username,
      display_name: display_name,
      password: password,
      status: "Online",
    }),
  })
    .then(async (response) => {
      if (response.status >= 400) {
        console.log(response);
        const json = await response.json();
        throw new Error(json.message);
      }
      return response.json();
    })
    .then((response) => {
      user = response.updatedUser;
    })
    .catch((err) => (error = err));

  return { user, error };
};
