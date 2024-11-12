import { headers } from 'next/headers';
import { HotelVariables } from './types';
import axios from "axios";
import https from "https";
// import { HttpsProxyAgent } from 'hpagent';
import { promises as fs } from 'fs';

const SIMPLEBOOKING_API = 'https://www.simplebooking.it/graphql/ibe2/graphql';

// Updated HTTPS agent with corrected TLS configuration


// const dataCenterProxyAgent = new HttpsProxyAgent({
//   proxy: process.env.BRIGHTDATA_ALIEXPRESS_SCRAPING_PROXY_URL!,
// })

export async function GET(request: Request) {
  const cert = `-----BEGIN CERTIFICATE-----
MIIG2TCCBcGgAwIBAgIQKbWf4wcgNyddFKRW3+NDdzANBgkqhkiG9w0BAQsFADCB
lTELMAkGA1UEBhMCR0IxGzAZBgNVBAgTEkdyZWF0ZXIgTWFuY2hlc3RlcjEQMA4G
A1UEBxMHU2FsZm9yZDEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMT0wOwYDVQQD
EzRTZWN0aWdvIFJTQSBPcmdhbml6YXRpb24gVmFsaWRhdGlvbiBTZWN1cmUgU2Vy
dmVyIENBMB4XDTI0MTEwNTAwMDAwMFoXDTI1MTIwNjIzNTk1OVowTjELMAkGA1UE
BhMCSVQxEDAOBgNVBAgTB0ZpcmVuemUxEDAOBgNVBAoTB1FOVCBTUkwxGzAZBgNV
BAMMEiouc2ltcGxlYm9va2luZy5pdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBANHYwn2Az8RNEp2LeGk5YQuox33BfKquNXe2bbIehiKXk+0j+XZWPkXs
Ua9AXSLWj3hioHxoqsl4ToK5tBAZjQqtWr0Zk296ZAN80oaeK14Tq7ZvFSa0MHDt
OkKgW6tTOBXZQEJpnp9EMN3/apPnqdfm7179X5KPSYUOKadTdnWLDxZ7vHy8PI8u
OGGmCt/NVoCfgM2VFKpstT5Qepb1Mk5UxYbskavGV6PaDEyV+WeDP7RPIH5tsq/l
9LxAp7ppYw0nqDgIdTEc+WYwee35W345GvXgt0N9xRvIwJ4gZglWPRbT2Rm+aeQS
MN43qz4VfD2dE75JCZZQoWkGUHf9vdsCAwEAAaOCA2kwggNlMB8GA1UdIwQYMBaA
FBfZ1iUnZ/kxwklD2TA2RIxsqU/rMB0GA1UdDgQWBBTTholwd7Y0fVvrkiDXD0t2
6WIHhjAOBgNVHQ8BAf8EBAMCBaAwDAYDVR0TAQH/BAIwADAdBgNVHSUEFjAUBggr
BgEFBQcDAQYIKwYBBQUHAwIwSgYDVR0gBEMwQTA1BgwrBgEEAbIxAQIBAwQwJTAj
BggrBgEFBQcCARYXaHR0cHM6Ly9zZWN0aWdvLmNvbS9DUFMwCAYGZ4EMAQICMFoG
A1UdHwRTMFEwT6BNoEuGSWh0dHA6Ly9jcmwuc2VjdGlnby5jb20vU2VjdGlnb1JT
QU9yZ2FuaXphdGlvblZhbGlkYXRpb25TZWN1cmVTZXJ2ZXJDQS5jcmwwgYoGCCsG
AQUFBwEBBH4wfDBVBggrBgEFBQcwAoZJaHR0cDovL2NydC5zZWN0aWdvLmNvbS9T
ZWN0aWdvUlNBT3JnYW5pemF0aW9uVmFsaWRhdGlvblNlY3VyZVNlcnZlckNBLmNy
dDAjBggrBgEFBQcwAYYXaHR0cDovL29jc3Auc2VjdGlnby5jb20wLwYDVR0RBCgw
JoISKi5zaW1wbGVib29raW5nLml0ghBzaW1wbGVib29raW5nLml0MIIBfgYKKwYB
BAHWeQIEAgSCAW4EggFqAWgAdgDd3Mo0ldfhFgXnlTL6x5/4PRxQ39sAOhQSdgos
rLvIKgAAAZL6XddpAAAEAwBHMEUCIF5iE2Wfq8LsI8PjLzPX8/odV+sWvvNkBMo8
GWYt7WakAiEAwe7HKkDAPeEV+fcrLOdnDnl9Xx3TNubb5Nq4RrF+McUAdwDM+w9q
hXEJZf6Vm1PO6bJ8IumFXA2XjbapflTA/kwNsAAAAZL6XdctAAAEAwBIMEYCIQCT
C9pY/rPJrOl3FR43CXg9FK5V64MAR3a/6Pcv+AySgQIhAIDRO1Kbtvg2nmLt0KRC
70CF9J1EQy05tcLi38tDek8SAHUAEvFONL1TckyEBhnDjz96E/jntWKHiJxtMAWE
6+WGJjoAAAGS+l3XAQAABAMARjBEAiBC7A7DH4Cj3AVv27ygxHZiFxif45M8qvXB
tQ8+C+UdRwIgdgbDmGsUzLDuGp29soKpxWFxHanE20GLXdFriYRUqXwwDQYJKoZI
hvcNAQELBQADggEBABmKR154O8XFuibSAlJUqKbm3notNNVDwu9xfrrzBqmGAdaw
AjGhJMIU8GNICeLR5ThF1DR0TQH8Uxopy5ylN+u0ko2F2Ctlyp/G/ANGPTwjiFcb
ddqwTkpnKqvYuGQyySAKpOEIUW+TZ2jbdQs8ZucQ8pNnbKDz1SjhMH3kaimGv578
gnCidGlWnRxCDkadws2wx4b/9DOWmUgLRpk7ksUEylPlmaDm1C5L4hM6YBfF53e/
s9XA4phmp+eOy+hmouDf/xJyYAjXB4t7vHolTLuwmTk/xkgR1SEnB2j3fkdazfaN
eo5eHjtuUjrm2ioJcfGfr31xW0NJO4+ASc3FkKc=
-----END CERTIFICATE-----
`

  const httpsAgent = new https.Agent({
    ca: cert,
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  });

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