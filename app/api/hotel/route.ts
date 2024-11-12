import { headers } from 'next/headers';
import { HotelResponse, HotelVariables } from './types';

const SIMPLEBOOKING_API = 'https://www.simplebooking.it/graphql/ibe2/graphql';

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') ?? '';
    const forwardedFor = headersList.get('x-forwarded-for') ?? '';
    const clientIp = forwardedFor.split(',')[0].trim();

    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');
    const languageCode = searchParams.get('languageCode') ?? 'en';

    if (!hotelId) {
      return Response.json(
        { error: 'Hotel ID is required' },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          }
        }
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
        'User-Agent': userAgent,
        'X-Forwarded-For': clientIp,
        'Accept': 'application/json',
        'Accept-Language': languageCode,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: {
        revalidate: 3600 // Cache for 1 hour
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotel data');
    }

    const data: HotelResponse = await response.json();

    return Response.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      }
    });
  } catch (error) {
    console.error('Hotel API Error:', error);
    return Response.json(
      { error: 'Failed to fetch hotel data' },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
  }
} 