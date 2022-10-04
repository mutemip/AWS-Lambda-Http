const AWS = require('aws-sdk')
const axios = require('axios')

// Name of a service, any string
const serviceName = process.env.SERVICE_NAME
// URL of a service to test
const url = process.env.URL

// CloudWatch client
const cloudwatch = new AWS.CloudWatch();

exports.handler = async (event) => {
  // TODO: Use these variables to record metric values
  let endTime
  let requestWasSuccessful

  const startTime = timeInMs()
  try{
    await axios.get(url)
    requestWasSuccessful = true
  } catch (e) {
    requestWasSuccessful = false
  } finally {
    endTime = timeInMs()
  }

  const totalTime = endTime - startTime

  
  // TODO: Record if a response was successful or not

  // Success data point
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Success', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Count', // 'Count' 
        Value: requestWasSuccessful ? 1: 0 // Total value
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()


// TODO: Record time it took to get a response

    // latency data point
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Latency', // Use different metric names for different values, e.g. 'Latency' and 'Successful'
        Dimensions: [
          {
            Name: 'ServiceName',
            Value: serviceName
          }
        ],
        Unit: 'Milliseconds', // 'Count'
        Value: totalTime
      }
    ],
    Namespace: 'Udacity/Serveless'
  }).promise()


}

function timeInMs() {
  return new Date().getTime()
}
