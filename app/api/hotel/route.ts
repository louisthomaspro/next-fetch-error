import { headers } from 'next/headers';
import { HotelVariables } from './types';
import axios from "axios";
import https from "https";

const SIMPLEBOOKING_API = 'https://www.simplebooking.it/graphql/ibe2/graphql';

// Updated HTTPS agent with simplified TLS configuration
const httpsAgent = new https.Agent({
  secureProtocol: "TLS_method",
});

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

    const response = await axios.post(
      SIMPLEBOOKING_API,
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': userAgent,
          'X-Forwarded-For': clientIp,
          'Accept': 'application/json',
          'Accept-Language': languageCode,
        },
        timeout: 30000,
        httpsAgent, // Add the custom HTTPS agent
      }
    );

    return Response.json(response.data, {
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
    const status = axios.isAxiosError(error) && error.response ? error.response.status : 500;
    
    return Response.json(
      { error: 'Failed to fetch hotel data' },
      { 
        status,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
  }
} 