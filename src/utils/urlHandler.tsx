export default function returnPersonUrl(url:string) {
   let idUrl = url.split('/').splice(4).join('/')
   return idUrl;
  }