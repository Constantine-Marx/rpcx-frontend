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

        console.log("API response data:", response.data); // 添加此行以查看 API 返回的数据
        // 确保返回的数据是一个数组
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching movies:", error);
        throw error;
    }
}

// src/api/movie.js
export async function getMovieById(movieId) {
    const response = await fetch(`http://localhost:9981/MovieService`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-RPCX-Version": "1.8.21",
            "X-RPCX-MessageType": "0",
            "X-RPCX-SerializeType": "1",
            "X-RPCX-ServicePath": "MovieService",
            "X-RPCX-ServiceMethod": "GetMovieByID",
        },
        body: JSON.stringify({ ID: movieId }),
    });

    if (!response.ok) {
        throw new Error("Failed to fetch movie.");
    }

    return await response.json();
}

export async function getMovieSchedule(movieId, cinemaName, scheduleTime) {
    try {
        const response = await axios.post(
            "http://localhost:9981/MovieScheduleService",
            {
                movie_id: movieId,
                cinema_name: cinemaName,   // 添加这个字段
                schedule_time: scheduleTime // 添加这个字段
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-RPCX-Version": "1.8.21",
                    "X-RPCX-MessageType": "0",
                    "X-RPCX-SerializeType": "1",
                    "X-RPCX-ServicePath": "MovieScheduleService",
                    "X-RPCX-ServiceMethod": "GetMovieSchedule",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching movie schedule:", error);
        throw error;
    }
}

