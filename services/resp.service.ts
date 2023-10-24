interface ResponseData<T> {
  data: T;
  error: Error | null;
}

type Error = {
  message: string;
};

const getResponse = <T>(data: T, error: Error | null): ResponseData<T> => {
  return { data, error };
};

export { getResponse };
