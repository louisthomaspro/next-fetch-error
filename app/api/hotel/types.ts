interface HotelResponse {
  data: {
    hotel: {
      id: string;
      name: string;
    };
  };
}

interface HotelVariables {
  hotelId: string;
  languageCode: string;
}

export type { HotelResponse, HotelVariables }; 