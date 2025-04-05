import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

const API_URL ="http://localhost:8000/api"

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const usePost = () => {
  const authHeader = useAuthHeader()
  const { isPending, mutateAsync, isSuccess } = useMutation({
    mutationFn: async ({ postData, url }) => {
      try {
        //await wait(2000);
        console.log("sending post to", url, "with this data\n", postData)
        const res = await axios.post(`${API_URL}/${url}`, postData);
        return res;
      } catch (error) {
        return error.response;
      }
    },
  });
  return { isPending, mutateAsync, isSuccess };
};

export const usePostAuthenticated = () => {
  const authHeader = useAuthHeader()
  
  const { isPending, mutateAsync, isSuccess } = useMutation({
    mutationFn: async ({ postData, url }) => {
      try {
        console.log("Authenticated: sending post to", url, "with this data\n", postData)
        //await wait(2000);
        const res = await axios.post(`${API_URL}/${url}`, postData, {
          headers: {
            Authorization: authHeader, 
          },
        });

        return res;
      } catch (error) {
        return error.response;
      }
    },
  });
  return { isPending, mutateAsync, isSuccess };
};


