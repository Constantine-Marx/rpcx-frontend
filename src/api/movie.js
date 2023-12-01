// src/api/movie.js
import axios from "axios";

const baseURL = "http://localhost:9981/MovieService"; // 根据您的网关地址进行修改

export async function getMovies(page) {
    try {
        const response = await axios.post(
            baseURL,
            {
                page,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RPCX-Version": "1.8.21",
                    "X-RPCX-MessageType": "0",
                    "X-RPCX-SerializeType": "1",
                    "X-RPCX-ServicePath": "MovieService",
                    "X-RPCX-ServiceMethod": "GetMoviesByPage",
                },
            }
        );
        if (response.data.error) {
            throw new Error(response.data.error.message);
        }
        // 确保返回的数据是一个数组
        return Array.isArray(response.data.result) ? response.data.result : [];
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}
