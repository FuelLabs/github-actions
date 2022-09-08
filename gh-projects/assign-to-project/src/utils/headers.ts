const TOKEN = process.env.TOKEN;

export const headers = {
    authorization: `token ${TOKEN}`,
};