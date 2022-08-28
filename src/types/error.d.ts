interface responseError extends Error {
  status?: number;
}

export default responseError;
