import FirebaseService from '../../services/firebase';

export const FETCH_ALL_DATA = 'FETCH_ALL_DATA';


export async function fetchAllData() {
  const request = await FirebaseService.getAllData()  

  return {
    type: FETCH_ALL_DATA,
    payload: request,
  };
}