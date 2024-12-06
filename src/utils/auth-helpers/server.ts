"use server";

import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getURL, getErrorRedirect, getStatusRedirect } from "../helpers";
import { getAuthTypes } from "./settings";
import { useServerTranslation } from "@/i18n/server";

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function redirectToPath(path: string) {
  return redirect(path);
}

export async function SignOut(pathName?: string, showError?: boolean) {
  const { t } = await useServerTranslation("auth");
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error && showError) {
    return getErrorRedirect(pathName || "/auth/signin", t("unexpectedError"), t("signout.couldNot"));
  }

  return pathName || "/auth/signin";
}

export async function signInWithEmail(email: string) {
  const { t } = await useServerTranslation("auth");
  const cookieStore = cookies();
  const callbackURL = getURL("/api/auth/callback");

  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect("/auth/email_signin", t("invalidEmail"), t("tryAgain"));
  }

  const supabase = createClient();
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/email_signin", t("signin.couldNot"), error.message);
  } else if (data) {
    cookieStore.set("preferredSignInView", "email_signin", { path: "/" });
    redirectPath = getStatusRedirect("/auth/email_signin", t("success"), t("signin.checkEmail"), true);
  } else {
    redirectPath = getErrorRedirect("/auth/email_signin", t("unexpectedError"), t("signin.couldNot"));
  }

  return redirectPath;
}

export async function requestPasswordUpdate(email: string) {
  const { t } = await useServerTranslation("auth");
  const callbackURL = getURL("/auth/reset_password");
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect("/auth/forgot_password", t("invalidEmail"), t("tryAgain"));
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackURL
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/forgot_password", error.message, t("tryAgain"));
  } else if (data) {
    redirectPath = getStatusRedirect("/auth/forgot_password", t("success"), t("updatePassword.checkEmail"), true);
  } else {
    redirectPath = getErrorRedirect(
      "/auth/forgot_password",
      t("unexpectedError"),
      t("updatePassword.couldNotSendEmail")
    );
  }

  return redirectPath;
}

export async function signInWithPassword(email: string, password: string) {
  const { t } = await useServerTranslation("auth");
  const cookieStore = cookies();
  let redirectPath: string;

  const supabase = createClient();
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect(
      "/auth/signin",
      t("signin.failed"),
      error.message === "Invalid login credentials"
        ? t("signin.invalidAccount")
        : error.message.includes("is not valid JSON")
          ? t("serverError")
          : error.message
    );
  } else if (data.user) {
    cookieStore.set("preferredSignInView", "signin", { path: "/" });
    redirectPath = getStatusRedirect("/", t("signin.success"), t("signin.signedIn"));
  } else {
    redirectPath = getErrorRedirect("/auth/signin", t("unexpectedError"), t("signin.couldNot"));
  }

  return redirectPath;
}

export async function signUp(email: string, password: string) {
  const { t } = await useServerTranslation("auth");
  const callbackURL = getURL("/api/auth/callback");

  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect("/auth/signup", t("invalidEmail"), t("tryAgain"));
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL
    }
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/signup", t("signup.failed"), error.message);
  } else if (data.session) {
    redirectPath = getStatusRedirect("/", t("success"), t("signup.signedIn"));
  } else if (data.user && data.user.identities && data.user.identities.length == 0) {
    redirectPath = getErrorRedirect("/auth/signup", t("signup.failed"), t("signup.existingAccount"));
  } else if (data.user) {
    redirectPath = getStatusRedirect("/", t("success"), t("signup.checkEmail"));
  } else {
    redirectPath = getErrorRedirect("/auth/signup", t("unexpectedError"), t("signup.couldNot"));
  }

  return redirectPath;
}

export async function updatePassword(password: string, passwordConfirm: string) {
  const { t } = await useServerTranslation("auth");
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect(
      "/auth/update_password",
      t("updatePassword.couldNot"),
      t("updatePassword.notMatch")
    );
  }

  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    password
  });

  if (error) {
    redirectPath = getErrorRedirect("/auth/update_password", t("updatePassword.couldNot"), error.message);
  } else if (data.user) {
    redirectPath = getStatusRedirect("/", t("success"), t("updatePassword.updated"));
  } else {
    redirectPath = getErrorRedirect("/auth/update_password", t("unexpectedError"), t("updatePassword.couldNot"));
  }

  return redirectPath;
}

export async function updateEmail(newEmail: string) {
  const { t } = await useServerTranslation("auth");

  // Check that the email is valid
  if (!isValidEmail(newEmail)) {
    return getErrorRedirect("/account", t("updateEmail.couldNot"), t("invalidEmail"));
  }

  const supabase = createClient();

  const callbackUrl = getURL(getStatusRedirect("/account", t("success"), t("updateEmail.updated")));

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    {
      emailRedirectTo: callbackUrl
    }
  );

  if (error) {
    return getErrorRedirect("/account", t("updateEmail.couldNot"), error.message);
  } else {
    return getStatusRedirect("/account", t("updateEmail.updateEmail"), t("updateEmail.checkEmail"));
  }
}

export async function updateName(fullName: string) {
  const { t } = await useServerTranslation("auth");
  const supabase = createClient();
  const { error, data } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return getErrorRedirect("/account", t("updateName.couldNot"), error.message);
  } else if (data.user) {
    return getStatusRedirect("/account", t("success"), t("updateName.updated"));
  } else {
    return getErrorRedirect("/account", t("unexpectedError"), t("updateName.couldNot"));
  }
}
