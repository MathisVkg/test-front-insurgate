export const apiService = {
  getInformationByTva
};

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      return Promise.reject(data);
    }
    return data;
  });
}

function getInformationByTva(tvaNumber) {
  // eslint-disable-next-line no-undef
  const url = `${process.env?.REACT_APP_API}?number=${tvaNumber}`;

  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // eslint-disable-next-line no-undef
      Authorization: `Basic ${process.env?.REACT_APP_AUTH}`
    }
  };

  return fetch(url, requestOptions)
    .then(handleResponse)
    .then((data) => {
      return data;
    });
}
