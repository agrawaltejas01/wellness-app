import IUser from "../../types/user";
import networkAdapter from "../network";

export async function getUserByEmail(email: string) {
  let response = await networkAdapter.get(`/auth/user/email?email=${email}`);

  return response.data;

  // throw new Error("Testing user not found");
}

export async function getDetailsFromGoogleProfile(accessToken: string) {
  let response = await networkAdapter.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  return response.data;
}

export async function addUser(userDetails: IUser) {
  let response = await networkAdapter.post(`/users`, userDetails);
  return response.data;
}

export async function updateUser(userDetails: IUser) {
  let response = await networkAdapter.put(`/users`, userDetails);
  return response.data;
}

export async function checkUserPhoneAndSendOtplessMagicLink(phone: string) {
  let url = `/auth/user/otplessLink?phone=${phone}`;

  let response = await networkAdapter.get(url);
  return response.data;
}

export async function verifyOtplessMagicLink({
  code,
  phone,
}: {
  code: string;
  phone?: string;
}) {
  let url = `/auth/user/otplessCode`;
  if (phone) url += `?phone=${phone}`;

  console.log(url);

  let response = await networkAdapter.post(url, { code });
  return response.data;
}

export async function checkUserPhoneAndSendOtp({phone, name}: {phone: string, name?: string}) {
  let url = `/auth/user/otp?phone=${phone}&name=${name}`;

  let response = await networkAdapter.get(url);
  return response.data;
}

export async function checkUserPhoneAndResendOtp(orderId: string) {
  let url = `/auth/otpless/resend/otp?orderId=${orderId}`;

  let response = await networkAdapter.get(url);
  return response.data;
}

export async function verifyOtplessOtp(payload: {
  phone: string;
  otp: string;
  orderId: string;
}) {
  let url = `/auth/user/otp/verify`;

  let response = await networkAdapter.post(url, payload);
  return response.data;
}
