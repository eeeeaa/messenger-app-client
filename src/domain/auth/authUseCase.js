const loginUri = `${import.meta.env.VITE_MESSENGER_API_URL}/v1/auth/login`;
const signupUri = `${import.meta.env.VITE_MESSENGER_API_URL}/v1/auth/signup`;

export const loginUseCase = async (username, password) => {
  const response = await fetch(loginUri, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.status >= 400) {
    throw new Error("server error");
  }

  const jsonResponse = await response.json();
  return { username: jsonResponse.username, token: jsonResponse.token };
};

export const signupUseCase = async (username, password, password_confirm) => {
  const response = await fetch(signupUri, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, password_confirm }),
  });
  if (response.status >= 400) {
    throw new Error("server error");
  }

  const jsonResponse = await response.json();
  return { user: jsonResponse.user };
};
