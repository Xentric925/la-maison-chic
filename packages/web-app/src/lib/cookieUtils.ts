import Cookies from 'js-cookie';

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const setCookie = (
  name: string,
  value: string,
  options?: Cookies.CookieAttributes,
) => {
  Cookies.set(name, value, {
    secure: true,
    sameSite: 'Strict',
    ...options,
  });
};

export const clearCookie = (name: string) => {
  Cookies.remove(name);
};
