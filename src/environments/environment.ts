// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`. 
//52324
//8082
//localhost
// 192.61.99.96
// apiBase: "http://localhost:8082",
export const environment = {
  production: false,
    api_base: {
    projectBase: "http://localhost:4200/#",

    apiBase: "http://localhost:8097",

    mailBase:"http://192.61.99.225:8083",
    apiPath: "api",
    stagingprojectBase: "http://192.61.99.225:8093/#" 
  },
    content_api_base: {
    api_base: "http://192.61.99.225:8085/"
  }
};

/*export const environment = {
   production: false,
     api_base: {
     projectBase: "http://192.61.99.96:8091/#",
     apiBase: "http://localhost:52324",
    apiPath: "api",
    mailBase:"http://localhost:63116",
    stagingprojectBase: "192.61.99.96:8091/#"
  },
 content_api_base: {
   api_base: "http://localhost:8085"
   }
};*/