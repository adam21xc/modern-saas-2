import { z } from "zod";
import type { Actions, PageServerLoad } from "./$types";
import { setError, superValidate } from "sveltekit-superforms/server";
import { fail } from "@sveltejs/kit";

const registerUserSchema = z.object({
  full_name: z.string().max(140, "Name must be 140 characters or less").nullish(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be 64 characters or less"),
  passwordConfirm: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(64, "Password must be 64 characters or less"),
});

export const load: PageServerLoad = async (event) => {
  return {
    form: superValidate(registerUserSchema),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, registerUserSchema);  
    console.log(form,'form')
    console.log("Incoming request URL:", event.url.toString());
    console.log("Request method:", event.request.method);
    console.log("Request headers:", event.request.headers);
    // console.log("Request body:", await event.request.json());  // Be cautious with logging sensitive data like passwords


    if (!form.valid) {
      return fail(400, {
        form,
      });
    }

    if (form.data.password !== form.data.passwordConfirm) {
      return setError(form, "passwordConfirm", "Passwords do not match");
    }

    const { error: authError } = await event.locals.supabase.auth.signUp({
      email: form.data.email,
      password: form.data.password,
      options: {
        data: {
          full_name: form.data.full_name ?? "",
        },
      },
    });

    if (authError) { 
      console.log(authError, 'auth error')
      return setError(form, null, "An error occurred while registering.");
    }

    return {
      form,
    };
  },
};