const AWS = require('aws-sdk');
const s3 = new AWS.S3({signatureVersion: 'v4' });
exports.handler = function (event, context) {
  console.log(event);
  const bucket = event.bucket;
  if (!bucket) {
    console.log(event)
    context.done(new Error(`S3 bucket not set`))
  }
  const key = `my-location/${event.file}`
  if (!key) {
    console.log('key missing:')
    context.done(new Error('S3 object key missing'))
    return;
  }
  const params = {
    'Bucket': bucket,
    'Key': key,
    ContentType: event.extension
  };
  s3.getSignedUrl('putObject', params, (error, url) => {
    if (error) {
      console.log('error:', error)
      context.done(event)
    } else {
      context.done(null, {
        url: url,
        name: key,
        filetype: event.extension
      });
    }
})
}
