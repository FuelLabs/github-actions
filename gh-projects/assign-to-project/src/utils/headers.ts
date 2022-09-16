export const TOKEN_CONFIG = {
  token: '',
};

export const headers = () => ({
  authorization: `token ${TOKEN_CONFIG.token}`,
});
