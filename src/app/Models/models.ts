//Posto radimo sa TS jezikom jedna od boljih primena je  koristi interface za deklarisanje atributa
//za sve moze da se koristi any i da se dobije nesto slicno radu JS-a medjutim za debagovanje je ovo mnogo bolji pristup

//Ovo je model eventa kakv je i u bazi njega cemo direktno kao takvog dobijati kroz api pozive
export interface Event {
  id: number;
  eventName: string;
}

//Ovo je model korisnika koji u bazi ima id, username, password, token je jwt token koji generiše server prilikom prijave korisnika  
export interface User {
  id: number;
  username: string;
  password: string;
  token: string; 
}