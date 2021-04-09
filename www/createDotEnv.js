const fs = require('fs');

const main = (
  projectID = '',
  firebaseWebApiKey = '',
  algoliaAppId = '',
  firebaseAppId = '',
  measurementId = ''
) => {
  return fs.writeFileSync(
    '.env',
    `REACT_APP_FIREBASE_PROJECT_ID = ${projectID}
REACT_APP_FIREBASE_PROJECT_WEB_API_KEY = ${firebaseWebApiKey}
REACT_APP_ALGOLIA_APP_ID = ${algoliaAppId}
REACT_APP_FIREBASE_APP_ID = ${firebaseAppId}
REACT_APP_FIREBASE_MEASUREMENT_ID = ${measurementId}`
  );
};

main(
  process.argv[2],
  process.argv[3],
  process.argv[4],
  process.argv[5],
  process.argv[6]
);
