//Posto radimo sa TS jezikom jedna od boljih primena je  koristi interface za deklarisanje atributa
//za sve moze da se koristi any i da se dobije nesto slicno radu JS-a medjutim za debagovanje je ovo mnogo bolji pristup

//Ovo je model eventa kakv je i u bazi njega cemo direktno kao takvog dobijati kroz api pozive
export interface Event {
  id: number;
  eventName: string;
  description: string;
  artist: string;
  genre: string;
  eventDate: string;
  endDate: string;
  venue: string;
  city: string;
  country: string;
  organizer: string;
  ticketPrice: number;
  availableTickets: number;
  soldOut: boolean;
  ticketWebsiteUrl: string;
  minAge: number;
  eventImageUrl: string;
  eventVideoUrl: string;
}

//Ovo je model korisnika koji u bazi ima id, username, password, token je jwt token koji generiše server prilikom prijave korisnika  
export interface User {
  success: boolean; // Ovo je dodat atribut koji označava da li je operacija uspešna
  id: number;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  token: string;
}

export interface EventResponse {
  event: Event;
  events: Event[];
}

export interface MyResponse {
  message: string;
  success: boolean;
}
export interface EventData {
  eventId?: number; //? oznacava da ovo polje nije obavezno
  eventName: string;
  artist: string;
  eventImageUrl: string;
  eventVideoUrl: string | null;
  availableTickets: number;
  city: string;
  country: string;
  description: string;
  eventDate: string;  // ISO format
  endDate: string;    // ISO format
  genre: string;
  minAge: number;
  organizer: string;
  ticketPrice: number;
  venue: string;
  ticketWebsiteUrl: string;
  soldOut?:boolean | null;
}