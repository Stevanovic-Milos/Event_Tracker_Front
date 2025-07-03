//Posto radimo sa TS jezikom jedna od boljih primena je  koristi interface za deklarisanje atributa
//za sve moze da se koristi any i da se dobije nesto slicno radu JS-a medjutim za debagovanje je ovo mnogo bolji pristup
export interface Event {
  id: number;
  eventName: string;
}