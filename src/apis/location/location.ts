import networkAdapter from "../network";

export async function getLocation({latitude, longitude} : {latitude : number, longitude : number}) {
  const result = await networkAdapter.get(`/location/?latitude=${latitude}&longitude=${longitude}`);
  return result.data;
}

export async function searchLocation( search : string) {
  const result = await networkAdapter.get(`/location/search?location=${search}`);
  return result.data;
}

export async function getPlaceDetails(placeId : string) {
  const result = await networkAdapter.get(`/location/place?placeId=${placeId}`);
  return result.data;
}