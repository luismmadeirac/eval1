import axios, { type AxiosInstance } from 'axios';

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

interface GitHubUser {
    login: string;
    id: number;
    avatar_url: string;
}

interface FetchUsersParams {
    since: number;
    per_page: number;
}

const githubApi: AxiosInstance = axios.create({
    baseURL: 'https://api.github.com',
    headers: GITHUB_TOKEN
        ? {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
        }
        : undefined,
    timeout: 5000,
});


export const fetchGitHubUsers = async (params: FetchUsersParams): Promise<GitHubUser[]> => {
    try {
        const response = await githubApi.get<GitHubUser[]>('/users', {
            params,
        });
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message || 'Failed to fetch GitHub users.';
        throw new Error(message);
    }
};

export const fetchGitHubUserDetails = async (username: string): Promise<GitHubUser> => {
    try {
        const response = await githubApi.get<GitHubUser>(`/users/${username}`);
        return response.data;
    } catch (error: any) {
        const message =
            error.response?.data?.message ||
            `Failed to fetch details for user "${username}".`;
        throw new Error(message);
    }
};

