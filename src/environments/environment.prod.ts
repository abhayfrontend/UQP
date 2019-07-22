// localhost
// 52324
// 8082
// http://192.61.99.197



// ----------- staging api ----------


// export const environment = {
//   production: true,
//     api_base: {
//     projectBase: "http://192.61.99.225:8093/",
//     apiBase: "http://192.61.99.225:8083",
//     apiPath: "api",
//     mailBase:"http://192.61.99.225:8083",
//     stagingprojectBase: "192.61.99.225:8093/"
//   },
//   content_api_base: {
//     api_base: "http://192.61.99.225:8085"
//   }
// };

// ----------- IQP api ----------


// export const environment = {
//   production: true,
//     api_base: {
//     projectBase: "http://192.61.99.225:8096/",
//     apiBase: "http://192.61.99.225:8097",
//     apiPath: "api",
//     mailBase:"http://192.61.99.225:8083",
//     stagingprojectBase: "192.61.99.225:8093/"
//   },
//   content_api_base: {
//     api_base: "http://192.61.99.225:8085"
//   }
// };




// ----------- local api -----

// export const environment = {
//   production: true,
//     api_base: {
//     projectBase: "http://192.61.99.225:8091/#",
//     apiBase: "http://localhost:52324",
//     apiPath: "api",
//     mailBase:"http://localhost:63116",
//     stagingprojectBase: "192.61.99.225:8091/#"
//   },
//   content_api_base: {
//     api_base: "http://localhost:8085/"
//   }
// };
// mailBase:"http://192.61.99.225:8083",

// -----------deployment-----


// export const environment = {
//   production: true,
//     api_base: {
//     projectBase: "https://uqp.mirrahealthcare.com/",
//     apiBase: "https://uqp.mirrahealthcare.com:8082",
//     apiPath: "api",
//     mailBase:"https://uqp.mirrahealthcare.com:8083",
//     stagingprojectBase: "https://uqp.mirrahealthcare.com/"
//   },
//   content_api_base: {
//     api_base: "https://uqp.mirrahealthcare.com:8085/"
//   }
// };



// ----------------- qaprima deployment --------------

export const environment = {
  production: true,
    api_base: {
    projectBase: "https://qaprima.com/",
    apiBase: "https://uqp.mirrahealthcare.com:8082",
    apiPath: "api",
    mailBase:"https://uqp.mirrahealthcare.com:8083",
    stagingprojectBase: "https://qaprima.com/"
  },
  content_api_base: {
    api_base: "https://uqp.mirrahealthcare.com:8085/"
  }
};
