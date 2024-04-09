import {z} from 'zod';

export const boardCreationSchema  = z.object(
    {
        title : z.string({
            required_error: "Name is required",
            invalid_type_error: "Name must be a string",
          }).trim().regex(/^[a-zA-Z]+$/, {message : 'Invalid title'}).min(5,{message : 'Must be 5 or more characters long'}).max(20 , {message : 'Must be less than 20 characters'})
    }
);

export const titleSchema = z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).regex(/^[a-zA-Z]+$/, {message : 'Invalid title'}).min(5,{message : 'Must be 5 or more characters long'}).max(20 , {message : 'Must be less than 20 characters'})