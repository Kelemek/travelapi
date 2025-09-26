import { getDataFromDB } from '../../database/db.js'
import { sendJSONResponse } from '../../utils/sendJSONResponse.js'
import { getDataByQueryParams } from '../../utils/getDataByQueryParams.js'

export const handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  }

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method not allowed",
        message: "Only GET requests are allowed"
      })
    }
  }

  try {
    // Get data from database
    const destinations = await getDataFromDB()
    
    // Parse query parameters
    const queryParams = event.queryStringParameters || {}
    
    // Filter data based on query parameters
    const filteredData = getDataByQueryParams(destinations, queryParams)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(filteredData)
    }
  } catch (error) {
    console.error('Error in API function:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: "Something went wrong while processing your request"
      })
    }
  }
}