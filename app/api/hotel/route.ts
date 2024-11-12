import { HotelResponse, HotelVariables } from './types';

const SIMPLEBOOKING_API = 'https://www.simplebooking.it/graphql/ibe2/graphql';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const languageCode = searchParams.get('languageCode') ?? 'en';

    if (!hotelId) {
      return Response.json(
        { error: 'Hotel ID is required' },
        { status: 400 }
      );
    }

    const query = `
      query HotelI18nDataIO($hotelId: ID!, $languageCode: ID!) {
        hotel(id: $hotelId) {
          id
          name(languageCode: $languageCode)
        }
      }
    `;

    const variables: HotelVariables = {
      hotelId,
      languageCode,
    };

    const response = await fetch(SIMPLEBOOKING_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotel data');
    }

    const data: HotelResponse = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error('Hotel API Error:', error);
    return Response.json(
      { error: 'Failed to fetch hotel data' },
      { status: 500 }
    );
  }
} 