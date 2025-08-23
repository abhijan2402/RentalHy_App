// src/hooks/useApi.js
import { useContext } from 'react';
import { AuthContext } from './AuthContent';
import { useToast } from '../Constants/ToastContext';

const BASE_URL = 'https://hotpink-rook-901841.hostingersite.com/';


export const IMAGEURL = 'http://82.112.236.195:3000/uploads/profiles/'

export const SERVICE_LIST_URL = "http://82.112.236.195:3000/uploads/"
export const useApi = () => {
  const { token } = useContext(AuthContext);
  const {showToast} = useToast();
  const postRequest = async (endpoint, data = {}, isMultipart = false) => {
    console.log(data, 'DATA');
    console.log(token, 'TOKEN');
    console.log(`${BASE_URL}${endpoint}`);
    const headers = {
      ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: isMultipart ? data : JSON.stringify(data),
      });

      const json = await response.json();
      // console.log(json, 'JSON');

      if (!response.ok) {
            let errorMessages = 'An unknown error occurred.';

        if (json.errors && typeof json.errors === 'object' && !Array.isArray(json.errors)) {
          errorMessages = Object.values(json.errors)
            .flat()
            .join('\n');
        } else if (json.msg) {
          errorMessages = json.msg;
}

          showToast(errorMessages, 'error');


        return {
          success: false,
          error: json.message || json.msg || json?.error || 'Something went wrong',
          status: response.status,
        };
      }

      return { success: true, data: json };
    } catch (error) {
      console.log(error, 'ERROR');

      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  };

  const getRequest = async endpoint => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await response.json();


      if (!response.ok) {
        return {
          success: false,
          error: json.message || 'Something went wrong',
          status: response.status,
        };
      }

      return { success: true, data: json };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  };

  const deleteRequest = async endpoint => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const json = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: json.message || 'Something went wrong',
          status: response.status,
        };
      }

      return { success: true, data: json };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  };


  const putRequest = async (endpoint, data = {}, isMultipart = false) => {
    console.log(data, 'DATA');
    console.log(token, 'TOKEN');
    console.log(`${BASE_URL}${endpoint}`);
    const headers = {
      ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers,
        body: isMultipart ? data : JSON.stringify(data),
      });

      const json = await response.json();
      // console.log(json, 'JSON');

      if (!response.ok) {
        return {
          success: false,
          error: json.message || json?.error || 'Something went wrong',
          status: response.status,
        };
      }

      return { success: true, data: json };
    } catch (error) {
      console.log(error, 'ERROR');

      return {
        success: false,
        error: error.message || 'Network error',
      };
    }
  };


  return { getRequest, postRequest, deleteRequest, putRequest };
};
