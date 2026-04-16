"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Add industry to the interface
interface RegistrationData {
  firstName: string;
  email: string;
  role: string;
  frequency: string;
  industry: string;
}

export async function submitUserRegistration(formData: RegistrationData) {
  try {
    const { error } = await supabase.from("users").insert([
      {
        first_name: formData.firstName,
        email: formData.email,
        role: formData.role,
        frequency: formData.frequency,
        industry: formData.industry, // 2. Add it to the insert payload
      },
    ]);

    if (error) {
      console.error("Supabase Error:", error.message);
      if (error.code === "23505") {
        return {
          success: false,
          error: "Looks like this email is already signed up!",
        };
      }
      return { success: false, error: "Failed to register. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Server Action Error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}
